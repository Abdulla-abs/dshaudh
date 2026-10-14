"""Decompilation engine – walks ops and produces JavaScript text."""

from parser.opcodes import IMAGE_OPS, NOOP_NAMES
from .stack import StackItem

_OBJECT_LITERAL_SKIP = object()

import re as _re

# Ops with no side effects usable inside a ternary branch (then/else value),
# grouped by stack effect.  Anything outside these sets disqualifies the
# branch from ternary conversion.
_TERNARY_PUSH_OPS = frozenset(
    [
        "string",
        "double",
        "int8",
        "int32",
        "uint16",
        "uint24",
        "zero",
        "one",
        "null",
        "true",
        "false",
        "undefined",
        "this",
        "hole",
        "regexp",
        "getlocal",
        "calllocal",
        "getarg",
        "callarg",
        "getaliasedvar",
        "callaliasedvar",
        "name",
        "bindname",
        "getgname",
        "callintrinsic",
        "lambda",
        "lambda_arrow",
    ]
)
_TERNARY_UNARY_OPS = frozenset(
    [
        "getprop",
        "callprop",
        "length",
        "not",
        "bitnot",
        "neg",
        "pos",
        "tostring",
        "typeof",
        "typeofexpr",
    ]
)
_TERNARY_BINARY_OPS = frozenset(
    [
        "add",
        "sub",
        "mul",
        "div",
        "mod",
        "bitand",
        "bitor",
        "bitxor",
        "lsh",
        "rsh",
        "ursh",
        "eq",
        "ne",
        "lt",
        "le",
        "gt",
        "ge",
        "stricteq",
        "strictne",
        "in",
        "instanceof",
        "getelem",
        "callelem",
    ]
)


def _is_numeric(s):
    return bool(_re.match(r"^-?\d+(\.\d+)?$", s))


def _is_ident_only(s):
    return bool(_re.match(r"^[A-Za-z_$][A-Za-z0-9_$]*$", s))


def _has_bare_assignment(s):
    return bool(_re.search(r"(?<!=)=(?!=)", s))


def _js_str(s):
    import json

    if not s:
        return '""'
    return json.dumps(s, ensure_ascii=True)


def _infer_var_name(val, slot, var_slot_names, nargs=0):
    idx = nargs + slot
    if idx < len(var_slot_names):
        vsn = var_slot_names[idx]
        if vsn:
            return vsn
    return f"_var_{slot}"


def _camel_from_dotted(dotted):
    """Convert dotted name to camelCase: ty._TCPConnection → tyTcpConnection."""
    parts = dotted.split(".")
    result = []
    for i, part in enumerate(parts):
        if not part:
            continue
        if part.startswith("_"):
            part = part[1:]
        if i == 0:
            result.append(part[0].lower() + part[1:] if part else part)
        else:
            result.append(part[0].upper() + part[1:] if part else part)
    return "".join(result) or "v"


class DecompileEngine:
    def __init__(self, func, parent_func=None, dump_bytecode=False):
        self.d = func
        self.atoms = func.atoms
        self.consts = func.consts
        self._parent_func = parent_func
        self._dump_bytecode = dump_bytecode
        self._local_vars = {}
        self._assigned_local_slots = set()
        self._stack = []
        self._rval = None
        self.script = {}
        self.branch_map = {}
        self.loop_entries = set()
        self._sub_level = 0
        self._open_ifs = []  # stack of (ifeq_offset, target_offset)
        self._block_depth = 0  # track switch/try/block opens that need }
        self._try_depth = 0  # track try block nesting
        self._try_if_base = []  # stack: len(open_ifs) at each try entry
        self._in_catch = (
            False  # inside catch block (between exception and finally/leaveblock)
        )
        self._catch_closed = False  # catch block's } already emitted by leaveblock
        self._just_closed_switch = False  # True right after default: closes a switch
        self._skip_next_pop = (
            False  # True to suppress synthetic pop after skipped inc/dec
        )
        self._skip_ops_count = (
            0  # number of ops to skip (Cocos expanded inc/dec sequences)
        )
        self._pending_logic = (
            None  # pending and/or condition to combine with next ifeq/ifne or value use
        )
        self._switch_labels = {}  # target_offset → 'case val:' / 'default:'
        self._switch_stack = (
            []
        )  # stack of (in_switch, switch_labels, switch_default_target, switch_ifs_start, block_depth_at_switch) for nested switches
        self._in_switch = False
        self._switch_default_target = 0
        self._switch_ifs_start = 0

        self._nargs = (
            func.nargs
            if hasattr(func, "nargs")
            else len(func.argvs) if hasattr(func, "argvs") else 0
        )

        # Pre-populate local_vars from var_slot_names
        # localno indexes into local vars only, NOT args
        # var_slot_names = [arg0, arg1, ..., local0, local1, ...]
        # so localno=N maps to var_slot_names[nargs + N]
        # We store _local_vars keyed by the var_slot_names index
        # so that getlocal localno=N looks up _local_vars[nargs+N]
        for vsi, vsname in enumerate(func.var_slot_names):
            if vsname:
                self._local_vars[vsi] = StackItem(name=vsname)

        # Iterator loop tracking
        self._iter_loops = (
            {}
        )  # iternext_offset → {iter_offset, obj_value, flags, loop_var, loop_end}
        self._iter_suppress_setlocal = (
            None  # localno to suppress (from iternext+setlocal pattern)
        )
        self._iter_suppress_setarg = (
            None  # argno to suppress (from iternext+setarg pattern)
        )
        self._iter_destruct = False  # True after iternext in destructuring for-in
        self._iter_gotos = set()  # offsets of gotos that are part of iter loops
        self._iter_ifnes = set()  # offsets of ifnes that are part of iter loops
        self._iter_moreiters = set()  # offsets of moreiters in iter loops
        self._iter_pops = set()  # offsets of pops between moreiter and enditer
        self._iter_loopentries = set()  # offsets of loopentry in iter loops
        self._iter_enditers = set()  # offsets of enditer ops (loop end) in iter loops
        self._deffun_names = set()  # names declared by deffun
        self._while_loops = (
            {}
        )  # goto_offset → {loophead_offset, loopentry_offset, ifne_offset, ifne_target, condition_ops}
        self._while_loop_gotos = set()  # offsets of gotos that start while loops
        self._while_loop_ifnes = set()  # offsets of ifnes that close while loops
        self._while_loop_exits = set()  # offsets of gotos after ifne (loop exit)
        self._while_loop_heads = set()  # offsets of loophead ops in while loops
        self._while_loop_entries = set()  # offsets of loopentry ops in while loops
        self._while_loop_cond_range = (
            set()
        )  # (off) offsets of ops in while loop condition (between loopentry and ifne)
        self._while_open = (
            []
        )  # stack of open while loops: [(loophead_off, ifne_off, exit_goto_off)]
        self._ternary_ifs = (
            {}
        )  # ifeq_offset → {else_off, after_off, cond, then_idx, else_idx, skip_count}
        self._build_iter_loop_map()
        self._build_while_loop_map()
        self._build_ternary_map()
        self._prescan_deffun_names()

    def _build_iter_loop_map(self):
        """Pre-scan ops to identify for-in/for-of iterator loops."""
        ops = self.d.ops
        n = len(ops)
        for i in range(n):
            if ops[i]["nm"] != "iter":
                continue
            iter_off = ops[i]["off"]
            flags = ops[i]["params"].get("flags", 0)
            iternext_off = None
            moreiter_off = None
            loop_end_off = None
            goto_off = None
            ifne_off = None
            for j in range(i + 1, n):
                nm_j = ops[j]["nm"]
                if nm_j == "goto" and goto_off is None and iternext_off is None:
                    goto_off = ops[j]["off"]
                elif nm_j == "iternext" and iternext_off is None:
                    iternext_off = ops[j]["off"]
                elif nm_j == "moreiter":
                    moreiter_off = ops[j]["off"]
                elif nm_j == "ifne" and moreiter_off is not None and ifne_off is None:
                    ifne_off = ops[j]["off"]
                    for k in range(j + 1, n):
                        if ops[k]["nm"] == "enditer":
                            loop_end_off = ops[k]["off"]
                            break
                    break
                elif nm_j == "iter":
                    break
            if iternext_off is not None:
                self._iter_loops[iternext_off] = {
                    "iter_off": iter_off,
                    "flags": flags,
                    "moreiter_off": moreiter_off,
                    "loop_end_off": loop_end_off,
                    "obj_value": None,
                    "loop_var": None,
                }
                if goto_off is not None:
                    self._iter_gotos.add(goto_off)
                if ifne_off is not None:
                    self._iter_ifnes.add(ifne_off)
                if moreiter_off is not None:
                    self._iter_moreiters.add(moreiter_off)
                if loop_end_off is not None:
                    self._iter_enditers.add(loop_end_off)
                if moreiter_off is not None and loop_end_off is not None:
                    for k in range(n):
                        if (
                            ops[k]["off"] >= moreiter_off
                            and ops[k]["off"] <= loop_end_off
                        ):
                            if ops[k]["nm"] == "pop":
                                self._iter_pops.add(ops[k]["off"])
                            elif ops[k]["nm"] == "loopentry":
                                self._iter_loopentries.add(ops[k]["off"])

    def _build_while_loop_map(self):
        """Pre-scan ops to identify while loops (goto->loopentry pattern)."""
        ops = self.d.ops
        n = len(ops)
        # Build iter_gotos set first (needed to exclude iterator loops)
        iter_gotos = set()
        for i in range(n):
            if ops[i]["nm"] != "iter":
                continue
            for j in range(i + 1, n):
                if ops[j]["nm"] == "goto" and ops[j]["params"].get("offset", 0) > 0:
                    iter_gotos.add(ops[j]["off"])
                    break
                if ops[j]["nm"] == "iternext":
                    break
                if ops[j]["nm"] == "iter":
                    break
        for i in range(n):
            if ops[i]["nm"] != "goto":
                continue
            offset = ops[i]["params"].get("offset", 0)
            if offset <= 0:
                continue
            # Skip gotos that are part of iterator loops
            if ops[i]["off"] in iter_gotos:
                continue
            tgt = ops[i]["off"] + offset
            goto_off = ops[i]["off"]
            loophead_off = None
            loopentry_idx = None
            for j in range(i + 1, n):
                if ops[j]["nm"] == "loophead" and loophead_off is None:
                    loophead_off = ops[j]["off"]
                if ops[j]["off"] == tgt and ops[j]["nm"] == "loopentry":
                    loopentry_idx = j
                    break
                if ops[j]["off"] > tgt:
                    break
            if loopentry_idx is None or loophead_off is None:
                continue
            for k in range(loopentry_idx + 1, min(loopentry_idx + 20, n)):
                if ops[k]["nm"] == "ifne" and ops[k]["params"].get("offset", 0) < 0:
                    ifne_tgt = ops[k]["off"] + ops[k]["params"]["offset"]
                    if ifne_tgt == loophead_off:
                        self._while_loops[goto_off] = {
                            "loophead_off": loophead_off,
                            "loopentry_off": tgt,
                            "ifne_off": ops[k]["off"],
                            "ifne_idx": k,
                            "loopentry_idx": loopentry_idx,
                        }
                        self._while_loop_gotos.add(goto_off)
                        self._while_loop_ifnes.add(ops[k]["off"])
                        self._while_loop_heads.add(loophead_off)
                        self._while_loop_entries.add(tgt)
                        for ci in range(loopentry_idx, k + 1):
                            self._while_loop_cond_range.add(ops[ci]["off"])
                        if (
                            k + 1 < n
                            and ops[k + 1]["nm"] == "goto"
                            and ops[k + 1]["params"].get("offset", 0) > 0
                        ):
                            self._while_loop_exits.add(ops[k + 1]["off"])
                    break

    def _branch_stack_effect(self, start, end):
        """Net stack effect of ops[start:end] if all are expression-value ops
        (no statement-level side effects like stores/pops/branches); None if
        any op is disallowed or would consume values pushed before ``start``.
        Calls are allowed: in value position the ternary keeps the original
        evaluate-only-taken-branch semantics."""
        depth = 0
        j = start
        while j < end:
            op = self.d.ops[j]
            nm_j = op["nm"]
            if nm_j == "ifeq" and op["off"] in self._ternary_ifs:
                # Nested ternary already mapped (built innermost-first):
                # consumes the condition, pushes one value, spans to after_idx
                if depth < 1:
                    return None
                j += self._ternary_ifs[op["off"]]["skip_count"] + 1
                continue
            j += 1
            if nm_j == "implicitthis":
                if not self.d.is_cocos:
                    depth += 1
                continue
            if nm_j in NOOP_NAMES:
                continue
            if nm_j in _TERNARY_PUSH_OPS:
                depth += 1
            elif nm_j in ("callname", "callgname"):
                depth += 2  # callee + implicit this
            elif nm_j in _TERNARY_UNARY_OPS:
                if depth < 1:
                    return None
            elif nm_j in _TERNARY_BINARY_OPS:
                if depth < 2:
                    return None
                depth -= 1
            elif nm_j == "dup":
                if depth < 1:
                    return None
                depth += 1
            elif nm_j == "swap":
                if depth < 2:
                    return None
            elif nm_j in ("newinit", "newobject", "newarray", "newarray_copyonwrite"):
                depth += 1
            elif nm_j in ("setlocal", "setarg", "setaliasedvar"):
                if depth < 1:
                    return None
            elif nm_j in (
                "setprop",
                "setname",
                "setgname",
                "setconst",
                "initprop",
                "initprop_getter",
                "initprop_setter",
                "initelem_array",
                "arraypush",
            ):
                if depth < 2:
                    return None
                depth -= 1
            elif nm_j in ("setelem", "initelem", "initelem_getter", "initelem_setter"):
                if depth < 3:
                    return None
                depth -= 2
            elif nm_j in ("call", "funcall", "eval", "funapply", "new"):
                argc = op["params"].get("argc", 0)
                if depth < argc + 2:
                    return None
                depth -= argc + 1
            else:
                return None
        return depth

    def _build_ternary_map(self):
        """Pre-scan ops for ternary diamonds: ifeq → <pure then-value> →
        goto after → <pure else-value> → after.  Both branches must push
        exactly one value with no side effects.  Emitting these as if/else
        statements loses the value (empty blocks) and breaks method-call
        frames like obj.m(cond ? a : b) (dup+callprop+swap spanning the if)."""
        ops = self.d.ops
        n = len(ops)
        # Innermost-first so nested diamonds are already mapped when the
        # enclosing branch is validated
        for i in range(n - 1, -1, -1):
            if ops[i]["nm"] != "ifeq":
                continue
            offset = ops[i]["params"].get("offset", 0)
            if offset <= 0:
                continue
            else_off = ops[i]["off"] + offset
            else_idx = None
            for j in range(i + 1, n):
                if ops[j]["off"] >= else_off:
                    if ops[j]["off"] == else_off:
                        else_idx = j
                    break
            # Need at least one then-op plus the goto before the else branch
            if else_idx is None or else_idx < i + 3:
                continue
            goto_idx = else_idx - 1
            if ops[goto_idx]["nm"] != "goto":
                continue
            g_offset = ops[goto_idx]["params"].get("offset", 0)
            if g_offset <= 0:
                continue
            after_off = ops[goto_idx]["off"] + g_offset
            if after_off <= else_off:
                continue
            after_idx = None
            for j in range(else_idx + 1, n):
                if ops[j]["off"] >= after_off:
                    if ops[j]["off"] == after_off:
                        after_idx = j
                    break
            if after_idx is None:
                continue
            if self._branch_stack_effect(i + 1, goto_idx) != 1:
                continue
            if self._branch_stack_effect(else_idx, after_idx) != 1:
                continue
            self._ternary_ifs[ops[i]["off"]] = {
                "then_rng": (i + 1, goto_idx),
                "else_rng": (else_idx, after_idx),
                "skip_count": after_idx - i - 1,
            }

    def _prescan_deffun_names(self):
        """Pre-scan ops to find all deffun names, so defvar can skip them."""
        for op in self.d.ops:
            if op["nm"] == "deffun":
                idx = op["params"].get("idx", 0)
                fname = self._atom(idx) if idx < len(self.atoms) else f"f{idx}"
                if fname and self._is_ident(fname):
                    self._deffun_names.add(fname)

    def run(self):
        for op in self.d.ops:
            if self._skip_ops_count > 0:
                self._skip_ops_count -= 1
                continue
            try:
                self._dispatch(op)
            except Exception as e:
                nm = op.get("nm", "?")
                off = op.get("off", 0)
                self._w(off, f"/* unhandled opcode: {nm} at 0x{off:04x} — {e} */")
        # Close any remaining open blocks at function end
        close_count = len(self._open_ifs) + self._block_depth
        if close_count > 0:
            last_off = self.d.ops[-1]["off"] if self.d.ops else 0
            self._open_ifs.clear()
            self._block_depth = 0
            self._w(last_off, "}" * close_count)

    def _push(self, **kw):
        self._stack.append(StackItem(**kw))

    def _pop(self):
        return self._stack.pop() if self._stack else StackItem()

    def _eval_range(self, start, end):
        """Dispatch pure value ops ops[start:end] and return the single value
        they push.  Used to materialize the branches of a ternary diamond.
        Honors _skip_ops_count so nested ternary diamonds work."""
        base = len(self._stack)
        j = start
        while j < end:
            if self._skip_ops_count > 0:
                self._skip_ops_count -= 1
                j += 1
                continue
            self._dispatch(self.d.ops[j])
            j += 1
        val = self._pop().get_value() if self._stack else "undefined"
        del self._stack[base:]  # discard any residue, keep pre-branch stack
        return val

    def _next_is_cond(self, offset, nm):
        for si in range(len(self.d.ops)):
            if self.d.ops[si]["off"] == offset and self.d.ops[si]["nm"] == nm:
                return si + 1 < len(self.d.ops) and self.d.ops[si + 1]["nm"] in (
                    "ifeq",
                    "ifne",
                )
        return False

    def _resolve_aliased_var(self, hops, slot):
        """Resolve an aliased var (hops, slot) to a variable name.

        Aliased vars are bindings captured by inner closures.  At runtime they
        live in a scope object (CallObject) that a function materializes iff it
        has any aliased binding.  ``hops`` counts those scope objects up the
        static scope chain; functions without captured bindings are transparent
        and skipped.  ``slot`` indexes the CallObject's dynamic slots, which
        begin after RESERVED_SLOTS (2: callee + enclosingScope) in MozJS34,
        so the aliased binding index is ``slot - 2``, which counts only bindings
        whose aliased_flags bit is set.
        """
        chain = []
        f = self.d
        while f is not None:
            flags = getattr(f, "aliased_flags", None)
            if flags and any(flags):
                chain.append(f)
            f = getattr(f, "parent", None)

        if hops < len(chain):
            target = chain[hops]
        elif chain:
            target = chain[-1]
        else:
            target = self.d

        offset = getattr(target, "aliased_slot_offset", 2)
        aliased_idx = slot - offset

        if aliased_idx >= 0:
            aliased_flags = getattr(target, "aliased_flags", [])
            count = 0
            for i in range(len(target.var_slot_names)):
                if i < len(aliased_flags) and aliased_flags[i]:
                    if count == aliased_idx:
                        nm = target.var_slot_names[i]
                        if nm:
                            return nm
                        break
                    count += 1

        var_idx = slot - offset
        if target is self.d and var_idx >= 0:
            lv = self._local_vars.get(var_idx)
            if lv and lv.name:
                return lv.name

        if 0 <= var_idx < len(target.var_slot_names):
            nm = target.var_slot_names[var_idx]
            if nm:
                return nm

        parent = getattr(target, "parent", None)
        while parent is not None:
            p_offset = getattr(parent, "aliased_slot_offset", 2)
            p_idx = slot - p_offset
            if 0 <= p_idx < len(parent.var_slot_names):
                return parent.var_slot_names[p_idx]
            parent = getattr(parent, "parent", None)
        return f"_var_{slot}"

    def _negate_condition(self, cond):
        """Negate a condition for ifeq (which jumps when true, so we need the negated form).

        For comparisons: negate the operator (=== -> !==, < -> >=, etc.)
        For !expr: double negation simplifies to expr
        For other expressions: wrap in !()
        """
        _NEGATE_OPS = {
            "===": "!==",
            "!==": "===",
            "==": "!=",
            "!=": "==",
            "<": ">=",
            ">=": "<",
            ">": "<=",
            "<=": ">",
            "in": " not in ",
        }
        import re

        # Try to match (l OP r) patterns
        m = re.match(r"^\((.+?) (===|!==|==|!=|<=|>=|<|>) (.+?)\)$", cond)
        if m:
            l, op, r = m.group(1), m.group(2), m.group(3)
            neg_op = _NEGATE_OPS.get(op)
            if neg_op:
                return f"({l} {neg_op} {r})"
        # Try (l in r) pattern
        m = re.match(r"^\((.+?) in (.+?)\)$", cond)
        if m:
            l, r = m.group(1), m.group(2)
            return f"(!({l} in {r}))"
        # Try (!expr) pattern – double negation simplifies
        m = re.match(r"^\(!(.+)\)$", cond)
        if m:
            return f"({m.group(1)})"
        # Fallback: wrap in !()
        return f"(!({cond}))"

    def _atom(self, idx):
        if 0 <= idx < len(self.atoms):
            return self.atoms[idx]
        parent = self._parent_func
        while parent is not None:
            if 0 <= idx < len(parent.atoms):
                return parent.atoms[idx]
            parent = getattr(parent, "_parent_func", None)
        return ""

    _JS_RESERVED = frozenset(
        {
            "break",
            "case",
            "catch",
            "class",
            "const",
            "continue",
            "debugger",
            "default",
            "delete",
            "do",
            "else",
            "export",
            "extends",
            "finally",
            "for",
            "function",
            "if",
            "import",
            "in",
            "instanceof",
            "new",
            "return",
            "super",
            "switch",
            "this",
            "throw",
            "try",
            "typeof",
            "var",
            "void",
            "while",
            "with",
            "yield",
            "enum",
            "implements",
            "interface",
            "let",
            "package",
            "private",
            "protected",
            "public",
            "static",
            "await",
            "null",
            "true",
            "false",
            "set",
            "get",
        }
    )

    @staticmethod
    def _is_ident(s):
        if not s:
            return False
        if s[0] not in "_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ":
            return False
        return all(
            c in "_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            for c in s
        )

    def _prop(self, idx):
        name = self._atom(idx)
        if self._is_ident(name) and name not in self._JS_RESERVED:
            return "." + name
        return "[" + _js_str(name) + "]"

    def _push_name(self, idx):
        name = self._atom(idx)
        if name and self._is_ident(name):
            return name
        return f"_v{idx}"

    def _w(self, idx, text):
        if idx in self.script:
            self.script[idx] += text
        else:
            self.script[idx] = text

    # ────────────────────────────────────────────────────
    def _dispatch(self, op):
        nm = op["nm"]
        p = op["params"]
        o = op["off"]

        if nm != "goto":
            self._just_closed_switch = False

        # Check for pending switch case/default labels at this offset first
        # (before closing if-blocks, so default: comes before })
        if o in self._switch_labels:
            labels = self._switch_labels[o]
            has_default = any(lb == "default:" for lb in labels)
            if has_default:
                switch_bd = self._switch_stack[-1][4] if self._switch_stack else 0
                if not self._in_switch or self._block_depth < switch_bd:
                    self._switch_labels.pop(o, None)
                else:
                    # Close if-blocks from previous case before default
                    new_ifs = len(self._open_ifs) - self._switch_ifs_start
                    if new_ifs > 0:
                        self._w(o, "}" * new_ifs)
                        self._open_ifs = self._open_ifs[: self._switch_ifs_start]
                    self._w(o, "default:\nbreak;\n}")
                    self._just_closed_switch = True
                    if self._block_depth > 0:
                        self._block_depth -= 1
                    if self._switch_stack:
                        prev = self._switch_stack.pop()
                        self._in_switch = prev[0]
                        self._switch_labels = prev[1]
                        self._switch_default_target = prev[2]
                        self._switch_ifs_start = prev[3]
                    else:
                        self._in_switch = False
            else:
                # Close if-blocks from previous case before writing new case label
                new_ifs = len(self._open_ifs) - self._switch_ifs_start
                if new_ifs > 0:
                    prefix = "\n".join("}" for _ in range(new_ifs)) + "\n"
                    self._open_ifs = self._open_ifs[: self._switch_ifs_start]
                else:
                    prefix = ""
                self._w(o, prefix + "\n".join(labels))
            self._switch_labels.pop(o, None)

        # Close any if-blocks whose target matches this offset
        while self._open_ifs and self._open_ifs[-1][1] == o:
            self._open_ifs.pop()
            self._w(o, "}")

        if nm == "implicitthis" and self.d.is_cocos:
            return
        if nm in NOOP_NAMES and nm != "retrval":
            return

        is_retrval = nm == "retrval"
        if is_retrval:
            if self._rval is not None:
                self._push(**self._rval.copy())
            else:
                self._push(tp="undefined", value="undefined")
            nm = "return"

        # return / value discard
        if nm == "return":
            if self._stack:
                rv = self._pop()
                val = rv.get_value()
                if self._pending_logic is not None and val:
                    op, lhs = self._pending_logic
                    self._pending_logic = None
                    rhs = f"({val})" if _has_bare_assignment(val) else val
                    val = f"({lhs} {op} {rhs})"
                if val and val != "undefined":
                    self._w(o, "return " + val + ";")
                else:
                    self._w(o, "return;")
            else:
                self._w(o, "return;")
            if not is_retrval:
                # Ordinary returns terminate the source-level branch.  RETRVAL
                # is different: iterator cleanup runs before it and its branch
                # must remain open until the bytecode target is reached.
                if self._while_open:
                    wh = self._while_open[-1][0]
                    close_count = 0
                    while self._open_ifs and self._open_ifs[-1][0] > wh:
                        self._open_ifs.pop()
                        close_count += 1
                    if close_count > 0:
                        self._w(o, "}" * close_count)
                elif self._open_ifs:
                    close_count = len(self._open_ifs)
                    self._open_ifs.clear()
                    self._w(o, "}" * close_count)
        elif nm == "setrval":
            self._rval = self._pop()
        elif nm in ("pop", "popv"):
            if self._skip_next_pop:
                self._skip_next_pop = False
                return
            rv = self._pop()
            if rv.type == "logic":
                return
            s = rv.get_value()
            if self._pending_logic is not None and s:
                op, lhs = self._pending_logic
                self._pending_logic = None
                rhs = f"({s})" if _has_bare_assignment(s) else s
                s = f"({lhs} {op} {rhs})"
            if o in self._iter_pops:
                pass
            elif (
                s
                and s != "undefined"
                and s != "void"
                and not s.startswith("(+")
                and not _is_ident_only(s)
            ):
                self._w(o, s + ";")
        elif nm == "popn":
            for _ in range(p.get("n", 0)):
                self._pop()

        # stack manipulation
        elif nm == "dup":
            v = self._pop()
            self._push(**v.copy())
            self._push(**v.copy())
        elif nm == "dup2":
            v1 = self._pop()
            v2 = self._pop()
            self._push(**v2.copy())
            self._push(**v1.copy())
            self._push(**v2.copy())
            self._push(**v1.copy())
        elif nm == "dupat":
            idx = p.get("n", 0)
            if idx < len(self._stack):
                self._push(**self._stack[-(idx + 1)].copy())
            else:
                self._push(tp="script", script=f"_dupat_{idx}")
        elif nm == "swap":
            v1 = self._pop()
            v2 = self._pop()
            self._push(**v1.copy())
            self._push(**v2.copy())
        elif nm == "pick":
            n = p.get("n", 0)
            temp = [self._pop() for _ in range(n)]
            nth = self._pop()
            for i in range(n - 1, -1, -1):
                self._push(**temp[i].copy())
            self._push(**nth.copy())

        # branching
        elif nm == "ifeq":
            v = self._pop()
            tgt = o + p.get("offset", 0)
            cond = v.get_value()
            if self._pending_logic is not None:
                logic_op, lhs = self._pending_logic
                self._pending_logic = None
                if self._stack and self._stack[-1].type == "logic":
                    self._pop()
                cond = f"({lhs} {logic_op} {cond})"
            if o in self._ternary_ifs:
                info = self._ternary_ifs[o]
                then_val = self._eval_range(*info["then_rng"])
                else_val = self._eval_range(*info["else_rng"])
                # Factor a common assignment target: cond ? a=x : a=y → a = (cond ? x : y)
                asn = _re.compile(r"^([A-Za-z_$][\w$.]*)=(?!=)(.*)$", _re.S)
                mt, me = asn.match(then_val), asn.match(else_val)
                if mt and me and mt.group(1) == me.group(1):
                    self._push(
                        tp="script",
                        script=f"{mt.group(1)}=({cond} ? {mt.group(2)} : {me.group(2)})",
                    )
                else:
                    self._push(
                        tp="script", script=f"({cond} ? {then_val} : {else_val})"
                    )
                self._skip_ops_count = info["skip_count"]
            elif p.get("offset", 0) > 0:
                self._w(o, f"if ({cond}) {{")
                self._open_ifs.append((o, tgt))
                self.branch_map[o] = {"goto": tgt, "type": "if"}
            else:
                self.loop_entries.add(tgt)
                self.branch_map[tgt] = {"goto": o, "type": "loop_head", "cond": cond}

        elif nm == "ifne":
            v = self._pop()
            tgt = o + p.get("offset", 0)
            cond = v.get_value()
            if self._pending_logic is not None:
                logic_op, lhs = self._pending_logic
                self._pending_logic = None
                if self._stack and self._stack[-1].type == "logic":
                    self._pop()
                cond = f"({lhs} {logic_op} {cond})"
            if o in self._iter_ifnes:
                pass
            elif o in self._while_loop_ifnes:
                self._w(o, f"if (!({cond})) break;")
                if self._while_open:
                    self._while_open.pop()
                self._w(o, "}")
                if self._block_depth > 0:
                    self._block_depth -= 1
            elif p.get("offset", 0) > 0:
                self._w(o, f"if ({cond}) {{")
                self._open_ifs.append((o, tgt))
                self.branch_map[o] = {"goto": tgt, "type": "if"}
            else:
                self.loop_entries.add(tgt)
                self.branch_map[tgt] = {
                    "goto": o,
                    "type": "loop_head",
                    "cond": cond,
                }

        elif nm == "loophead":
            if o in self._while_loop_heads:
                pass

        elif nm == "loopentry":
            # Skip loopentry in iterator loops (already handled by for-in/for-of structure)
            if o in self._iter_loopentries:
                pass
            # Skip loopentry in while loops (condition is handled at ifne)
            elif o in self._while_loop_entries:
                pass

        elif nm == "goto":
            tgt = o + p.get("offset", 0)
            # Skip gotos that are part of iterator loop control flow
            if o in self._iter_gotos:
                pass
            # While loop: goto -> loopentry
            elif o in self._while_loop_gotos:
                wl = self._while_loops[o]
                loophead_off = wl["loophead_off"]
                ifne_off = wl["ifne_off"]
                loopentry_off = wl["loopentry_off"]
                exit_goto_off = None
                ops = self.d.ops
                ifne_idx = wl["ifne_idx"]
                if (
                    ifne_idx + 1 < len(ops)
                    and ops[ifne_idx + 1]["nm"] == "goto"
                    and ops[ifne_idx + 1]["params"].get("offset", 0) > 0
                ):
                    exit_goto_off = ops[ifne_idx + 1]["off"]
                self._while_open.append((loophead_off, ifne_off, exit_goto_off))
                self._w(o, "while (true) {")
                self._block_depth += 1
            elif p.get("offset", 0) < 0:
                if tgt in self.loop_entries:
                    self._w(o, "continue;")
                else:
                    pass
            elif p.get("offset", 0) > 0:
                # Check if this goto is inside a while loop and jumps out
                in_while = False
                wl_head = 0
                for wh, wi, we in reversed(self._while_open):
                    if o > wh and o < wi:
                        if tgt > wi or (we is not None and tgt == we):
                            in_while = True
                            wl_head = wh
                            break
                # Check if this goto jumps to an enditer (break out of for-in loop)
                is_iter_break = tgt in self._iter_enditers
                if self._in_switch:
                    if tgt == self._switch_default_target:
                        self._w(o, "break;")
                    elif any(t == tgt for _, t in self._open_ifs):
                        while self._open_ifs and self._open_ifs[-1][1] == tgt:
                            self._open_ifs.pop()
                        self._w(o, "")
                        self._w(tgt, "}")
                    else:
                        self._w(o, "break;")
                elif in_while:
                    self._w(o, "break;")
                elif is_iter_break:
                    close_count = 0
                    while self._open_ifs:
                        if_off, if_tgt = self._open_ifs[-1]
                        inside_iter = False
                        for iternext_off, info in self._iter_loops.items():
                            iter_off = info["iter_off"]
                            end_off = info["loop_end_off"]
                            if end_off is not None and iter_off < if_off < end_off:
                                inside_iter = True
                                break
                        if inside_iter:
                            close_count += 1
                            self._open_ifs.pop()
                        else:
                            break
                    if close_count > 0:
                        self._w(o, "}" * close_count)
                    self._w(o, "break;")
                    # Skip the dead goto that often follows a break in for-in loops
                    idx = None
                    for si in range(len(self.d.ops)):
                        if (
                            self.d.ops[si]["off"] == o
                            and self.d.ops[si]["nm"] == "goto"
                        ):
                            idx = si
                            break
                    if idx is not None and idx + 1 < len(self.d.ops):
                        next_op = self.d.ops[idx + 1]
                        if (
                            next_op["nm"] == "goto"
                            and next_op.get("params", {}).get("offset", 0) > 0
                        ):
                            self._skip_ops_count = 1
                elif self._just_closed_switch:
                    self._just_closed_switch = False
                    pass
                elif self._try_depth > 0:
                    pass
                elif self._open_ifs:
                    if_off, if_tgt = self._open_ifs[-1]
                    if tgt == if_tgt:
                        pass
                    elif self._while_open and tgt < self._while_open[-1][1]:
                        pass
                    else:
                        self._open_ifs.pop()
                        self._w(o, "} else {")
                        self._open_ifs.append((if_tgt, tgt))
                    # Check if next op is a dead goto (from and/or short-circuit)
                    # These are unreachable gotos that appear right after the
                    # if/else goto and should be skipped
                    idx = None
                    for si in range(len(self.d.ops)):
                        if (
                            self.d.ops[si]["off"] == o
                            and self.d.ops[si]["nm"] == "goto"
                        ):
                            idx = si
                            break
                    if idx is not None and idx + 1 < len(self.d.ops):
                        next_op = self.d.ops[idx + 1]
                        if (
                            next_op["nm"] == "goto"
                            and next_op.get("params", {}).get("offset", 0) > 0
                        ):
                            self._skip_ops_count = 1
                elif tgt >= (self.d.ops[-1]["off"] if self.d.ops else 0) - 8:
                    close_count = len(self._open_ifs)
                    self._open_ifs.clear()
                    self._w(o, "")
                    self._w(tgt, "}" * close_count)
        elif nm == "or":
            v = self._pop()
            rhs = v.get_value()
            if self._pending_logic is not None and rhs:
                op0, lhs = self._pending_logic
                self._pending_logic = (op0, f"({lhs} {op0} {rhs})")
            else:
                self._pending_logic = ("||", rhs)
            self._push(tp="logic")
        elif nm == "and":
            v = self._pop()
            rhs = v.get_value()
            if self._pending_logic is not None and rhs:
                op0, lhs = self._pending_logic
                self._pending_logic = (op0, f"({lhs} {op0} {rhs})")
            else:
                self._pending_logic = ("&&", rhs)
            self._push(tp="logic")

        # function calls
        elif nm in ("call", "new", "funcall", "eval", "funapply"):
            argc = p.get("argc", 0)
            argv = [self._pop() for _ in range(argc)]
            this_ = self._pop()
            callee = self._pop()
            fn = callee.name if callee.name is not None else callee.get_value()
            this_val = this_.get_value()
            callee_val = callee.get_value()
            if nm != "new" and this_val and callee_val.startswith(this_val + "."):
                fn = callee_val
            args = ",".join(a.get_value() for a in reversed(argv))
            pre = "new " if nm == "new" else ""
            call_str = pre + fn + "(" + args + ")"
            self._push(tp="script", script=call_str)
        elif nm in ("spreadcall", "spreadnew", "spreadeval"):
            argc = p.get("argc", 0)
            argv = [self._pop() for _ in range(argc)]
            this_ = self._pop()
            callee = self._pop()
            fn = callee.name if callee.name is not None else callee.get_value()
            this_val = this_.get_value()
            callee_val = callee.get_value()
            if nm not in ("spreadnew",) and this_val.startswith(callee_val + "."):
                fn = this_val
            args = ",".join(a.get_value() for a in reversed(argv))
            pre = "new " if nm == "spreadnew" else ""
            call_str = pre + fn + "(" + args + ")"
            self._push(tp="script", script=call_str)

        # property access
        elif nm in ("getprop", "callprop"):
            obj = self._pop()
            ov = obj.get_value()
            if _is_numeric(ov):
                ov = "(" + ov + ")"
            self._push(name=ov + self._prop(p.get("idx", 0)))
        elif nm == "setprop":
            val = self._pop()
            obj = self._pop()
            aname_expr = self._prop(p.get("idx", 0))
            ov = obj.get_value()
            if _is_numeric(ov):
                ov = "(" + ov + ")"
            val_str = val.get_value()
            if val.type == "function":
                fv = str(val.value) if val.value is not None else ""
                if not fv.startswith("__L_"):
                    val_str = "function(){ " + val_str + " }"
            next_is_cond = self._next_is_cond(o, "setprop")
            if next_is_cond:
                self._push(tp="script", script=f"({ov}{aname_expr}=== {val_str})")
            else:
                self._push(tp="script", script=f"{ov}{aname_expr}={val_str}")
        elif nm == "delprop":
            obj = self._pop()
            ov = obj.get_value()
            if _is_numeric(ov):
                ov = "(" + ov + ")"
            self._push(tp="script", script=f'delete {ov}{self._prop(p.get("idx",0))}')
        elif nm in ("getelem", "callelem", "enumelem"):
            idx = self._pop()
            obj = self._pop()
            ov = obj.get_value()
            if _is_numeric(ov):
                ov = "(" + ov + ")"
            self._push(name=f"{ov}[{idx.get_value()}]")
        elif nm == "setelem":
            val = self._pop()
            idx = self._pop()
            obj = self._pop()
            ov = obj.get_value()
            if _is_numeric(ov):
                ov = "(" + ov + ")"
            self._push(tp="script", script=f"{ov}[{idx.get_value()}]={val.get_value()}")
        elif nm == "delelem":
            idx = self._pop()
            obj = self._pop()
            ov = obj.get_value()
            if _is_numeric(ov):
                ov = "(" + ov + ")"
            self._push(tp="script", script=f"delete {ov}[{idx.get_value()}]")
        elif nm == "mutateproto":
            proto = self._pop()
            obj = self._pop()
            ov = obj.get_value()
            if _is_numeric(ov):
                ov = "(" + ov + ")"
            self._push(tp="script", script=f"{ov}.__proto__={proto.get_value()}")
        elif nm == "length":
            obj = self._pop()
            ov = obj.get_value()
            if _is_numeric(ov):
                ov = "(" + ov + ")"
            self._push(tp="script", script=ov + ".length")

        # name resolution
        elif nm in ("callname", "callgname"):
            idx = p.get("idx", 0)
            name_val = self._push_name(idx)
            self._push(name=name_val)
            self._push(tp="void", name=None, value=None)

        elif nm in ("name", "bindname", "implicitthis", "getgname", "callintrinsic"):
            self._push(name=self._push_name(p.get("idx", 0)))

        elif nm in ("setname", "setgname", "setconst"):
            val = self._pop()
            s = self._pop()
            name = s.name if s.name else self._push_name(p.get("idx", 0))
            fn_body = ""
            if val.type == "function":
                fv = str(val.value) if val.value is not None else ""
                if fv.startswith("__L_"):
                    fn_body = fv
                else:
                    fn_body = f"function(){{ {fv} }}"
            else:
                fn_body = val.get_value()
            self._push(tp="script", name=name, script=f"{name}={fn_body}")

        elif nm == "delname":
            self._push(tp="script", script=f'delete {self._push_name(p.get("idx",0))}')

        # variable declarations
        elif nm == "defvar":
            name = self._push_name(p.get("idx", 0))
            if name not in self._deffun_names:
                self._w(o, "var " + name + ";")
        elif nm == "defconst":
            name = self._push_name(p.get("idx", 0))
            if name not in self._deffun_names:
                self._w(o, "var " + name + ";")
        elif nm == "deffun":
            idx = p.get("idx", 0)
            fname = self._atom(idx) if idx < len(self.atoms) else f"f{idx}"
            if not fname or not self._is_ident(fname):
                fname = f"f{idx}"
            is_gen = idx < len(self.d.children) and (
                bool(self.d.children[idx].sbits & (1 << 8))
                or any(op["nm"] == "yield" for op in self.d.children[idx].ops)
            )
            fn_kw = "function*" if is_gen else "function"
            self._w(o, f"{fn_kw} {fname}(__A_{idx}__) {{ __F_{idx}__ }}")
            self._deffun_names.add(fname)
        elif nm == "lambda":
            idx = p.get("idx", 0)
            self._push(tp="function", value=f"__L_{idx}__")
        elif nm == "lambda_arrow":
            idx = p.get("idx", 0)
            self._push(tp="function", value=f"__L_{idx}__")
        elif nm == "getfunns":
            self._push(tp="function", value=p.get("idx", 0))

        # args / locals
        elif nm == "getarg" or nm == "callarg":
            an = p.get("argno", 0)
            name = self.d.argvs[an] if an < len(self.d.argvs) else f"a{an}"
            self._push(name=name)
        elif nm == "setarg":
            val = self._pop()
            an = p.get("argno", 0)
            name = self.d.argvs[an] if an < len(self.d.argvs) else f"a{an}"
            # Suppress setarg right after iternext (it's the loop variable assignment)
            if (
                self._iter_suppress_setarg is not None
                and self._iter_suppress_setarg == an
            ):
                self._iter_suppress_setarg = None
                item = StackItem(tp="script", name=name, script=name)
                self._push(**item.copy())
                return
            if self._next_is_cond(o, "setarg"):
                self._push(
                    tp="script", name=name, script=f"({name}=== {val.get_value()})"
                )
            else:
                self._push(tp="script", name=name, script=f"{name}={val.get_value()}")
        elif nm == "getlocal" or nm == "calllocal":
            ln = p.get("localno", 0)
            vln = self._nargs + ln
            lv = self._local_vars.get(vln)
            if lv:
                self._push(name=lv.name)
            else:
                name = (
                    self.d.var_slot_names[vln]
                    if vln < len(self.d.var_slot_names) and self.d.var_slot_names[vln]
                    else f"_var_{ln}"
                )
                self._push(name=name)
        elif nm == "setlocal":
            val = self._pop()
            ln = p.get("localno", 0)
            vln = self._nargs + ln
            self._assigned_local_slots.add(ln)
            if (
                self._iter_suppress_setlocal is not None
                and self._iter_suppress_setlocal == ln
            ):
                self._iter_suppress_setlocal = None
                name = _infer_var_name(val, ln, self.d.var_slot_names, self._nargs)
                item = StackItem(tp="script", name=name, script=name)
                self._local_vars[vln] = item
                self._push(**item.copy())
                return
            name = _infer_var_name(val, ln, self.d.var_slot_names, self._nargs)
            if name == "arguments" and val.get_value() == "arguments":
                item = StackItem(tp="script", name=name, script=name)
                self._local_vars[vln] = item
                self._push(**item.copy())
                return
            if self._next_is_cond(o, "setlocal"):
                item = StackItem(
                    tp="script", name=name, script=f"({name}=== {val.get_value()})"
                )
            else:
                item = StackItem(
                    tp="script", name=name, script=f"{name}={val.get_value()}"
                )
            self._local_vars[vln] = item
            self._push(**item.copy())

        # inc/dec arg/local/prop/elem shortcuts
        # Prefix: incX, decX (e.g. incarg, declocal, incprop, incelem, incaliasedvar, decaiasedvar)
        # Postfix: Xinc, Xdec (e.g. arginc, localdec, propinc, eleminc, aliasedvarinc, aliasedvardec)
        elif nm in (
            "incarg",
            "decarg",
            "arginc",
            "argdec",
            "inclocal",
            "declocal",
            "localinc",
            "localdec",
            "incaliasedvar",
            "decaiasedvar",
            "aliasedvarinc",
            "aliasedvardec",
            "incprop",
            "decprop",
            "propinc",
            "propdec",
            "incelem",
            "decelem",
            "eleminc",
            "elemdec",
            "incname",
            "decname",
            "nameinc",
            "namedec",
            "incgname",
            "decgname",
            "gnameinc",
            "gnamedec",
        ):
            is_prefix = nm.startswith("inc") or nm.startswith("dec")
            is_inc = "inc" in nm and "dec" not in nm
            op = "++" if is_inc else "--"

            if nm in ("incarg", "decarg", "arginc", "argdec"):
                an = p.get("argno", 0)
                name = self.d.argvs[an] if an < len(self.d.argvs) else f"a{an}"
                if is_prefix:
                    self._push(tp="script", script=f"{op}{name}")
                else:
                    self._push(tp="script", script=f"({name}{op})")
            elif nm in ("inclocal", "declocal", "localinc", "localdec"):
                ln = p.get("localno", 0)
                is_cocos = getattr(self.d, "is_cocos", False)
                if is_cocos:
                    skip = False
                    skip_count = 0
                    ops = self.d.ops
                    for si in range(len(ops)):
                        if ops[si]["off"] == o and ops[si]["nm"] == nm:
                            if si + 9 < len(ops):
                                seq = [ops[si + k]["nm"] for k in range(1, 10)]
                                slocals = [
                                    ops[si + k].get("params", {}).get("localno", -1)
                                    for k in range(1, 10)
                                ]
                                arith = "add" if is_inc else "sub"
                                if (
                                    seq[0] == "pop"
                                    and seq[1] == "getlocal"
                                    and seq[2] == "pos"
                                    and seq[3] == "dup"
                                    and seq[4] == "one"
                                    and seq[5] == arith
                                    and seq[6] == "setlocal"
                                    and slocals[6] == slocals[1]
                                    and seq[7] == "pop"
                                    and seq[8] == "pop"
                                ):
                                    skip = True
                                    skip_count = 8
                                    ln = slocals[1]
                                elif (
                                    si + 7 < len(ops)
                                    and seq[0] == "pop"
                                    and seq[1] == "getlocal"
                                    and seq[2] == "pos"
                                    and seq[3] == "one"
                                    and seq[4] == arith
                                    and seq[5] == "setlocal"
                                    and slocals[5] == slocals[1]
                                    and seq[6] == "pop"
                                ):
                                    skip = True
                                    skip_count = 6
                                    ln = slocals[1]
                            break
                    if skip:
                        self._assigned_local_slots.add(ln)
                        vln = self._nargs + ln
                        lv = self._local_vars.get(vln)
                        name = (
                            lv.name
                            if lv
                            else (
                                self.d.var_slot_names[vln]
                                if vln < len(self.d.var_slot_names)
                                and self.d.var_slot_names[vln]
                                else f"_var_{ln}"
                            )
                        )
                        self._push(tp="script", script=f"({name}{op})")
                        self._skip_ops_count = skip_count
                        return
                self._assigned_local_slots.add(ln)
                vln = self._nargs + ln
                lv = self._local_vars.get(vln)
                name = (
                    lv.name
                    if lv
                    else (
                        self.d.var_slot_names[vln]
                        if vln < len(self.d.var_slot_names)
                        and self.d.var_slot_names[vln]
                        else f"_var_{ln}"
                    )
                )
                if is_prefix:
                    self._push(tp="script", script=f"{op}{name}")
                else:
                    self._push(tp="script", script=f"({name}{op})")
            elif nm in (
                "incaliasedvar",
                "decaiasedvar",
                "aliasedvarinc",
                "aliasedvardec",
            ):
                var_name = self._resolve_aliased_var(p.get("hops", 0), p.get("slot", 0))
                slot = p.get("slot", 0)
                hops = p.get("hops", 0)
                is_cocos = getattr(self.d, "is_cocos", False)
                if is_cocos and not is_prefix:
                    skip = False
                    skip_count = 0
                    ops = self.d.ops
                    for si in range(len(ops)):
                        if ops[si]["off"] == o and ops[si]["nm"] == nm:
                            if si + 9 < len(ops):
                                seq = [ops[si + k]["nm"] for k in range(1, 10)]
                                sslots = [
                                    ops[si + k].get("params", {}).get("slot", -1)
                                    for k in range(1, 10)
                                ]
                                arith = "add" if is_inc else "sub"
                                if (
                                    seq[0] == "pop"
                                    and seq[1] == "getaliasedvar"
                                    and sslots[1] == slot
                                    and seq[2] == "pos"
                                    and seq[3] == "dup"
                                    and seq[4] == "one"
                                    and seq[5] == arith
                                    and seq[6] == "setaliasedvar"
                                    and sslots[6] == slot
                                    and seq[7] == "pop"
                                    and seq[8] == "pop"
                                ):
                                    skip = True
                                    skip_count = 8
                                elif (
                                    seq[0] == "pop"
                                    and seq[1] == "getaliasedvar"
                                    and sslots[1] == slot
                                    and seq[2] == "pos"
                                    and seq[3] == "dup"
                                    and seq[4] == "one"
                                    and seq[5] == arith
                                    and seq[6] == "setaliasedvar"
                                    and sslots[6] == slot
                                    and seq[7] == "pop"
                                ):
                                    skip = True
                                    skip_count = 8
                            break
                    if skip:
                        self._push(tp="script", script=f"({var_name}{op})")
                        self._skip_ops_count = skip_count
                        return
                if is_prefix:
                    self._push(tp="script", script=f"{op}{var_name}")
                else:
                    self._push(tp="script", script=f"({var_name}{op})")
            elif nm in (
                "incname",
                "decname",
                "nameinc",
                "namedec",
                "incgname",
                "decgname",
                "gnameinc",
                "gnamedec",
            ):
                name = self._push_name(p.get("idx", 0))
                is_cocos_name = getattr(self.d, "is_cocos", False)
                if is_cocos_name:
                    skip = False
                    skip_count = 0
                    ops = self.d.ops
                    for si in range(len(ops)):
                        if ops[si]["off"] == o and ops[si]["nm"] == nm:
                            if si + 11 < len(ops):
                                seq = [ops[si + k]["nm"] for k in range(1, 12)]
                                sidxs = [
                                    ops[si + k].get("params", {}).get("idx", -1)
                                    for k in range(1, 12)
                                ]
                                arith = "add" if is_inc else "sub"
                                # Cocos emits both the compact inc/dec opcode and
                                # its expanded implementation.  The compact opcode
                                # already has the correct prefix/postfix value, so
                                # consume the duplicate expansion.
                                if is_prefix and (
                                    seq[0] == "pop"
                                    and seq[1] in ("bindname", "name")
                                    and seq[2] == "name"
                                    and seq[3] in ("pos", "dup")
                                    and seq[4] == "one"
                                    and seq[5] == arith
                                    and seq[6] == "setname"
                                    and sidxs[1] == p.get("idx", 0)
                                    and sidxs[2] == p.get("idx", 0)
                                    and sidxs[6] == sidxs[1]
                                ):
                                    skip = True
                                    skip_count = 7
                                elif not is_prefix and (
                                    seq[0] == "pop"
                                    and seq[1] == "bindname"
                                    and seq[2] == "name"
                                    and seq[3] == "pos"
                                    and seq[4] == "dup"
                                    and seq[5] == "one"
                                    and seq[6] == arith
                                    and seq[7] == "pick"
                                    and seq[8] == "swap"
                                    and seq[9] == "setname"
                                    and seq[10] == "pop"
                                    and sidxs[1] == p.get("idx", 0)
                                    and sidxs[2] == p.get("idx", 0)
                                    and sidxs[9] == p.get("idx", 0)
                                ):
                                    skip = True
                                    skip_count = 11
                            break
                    if skip:
                        if is_prefix:
                            self._push(tp="script", script=f"{op}{name}")
                        else:
                            self._push(tp="script", script=f"({name}{op})")
                        self._skip_ops_count = skip_count
                        return
                if is_prefix:
                    self._push(tp="script", script=f"{op}{name}")
                else:
                    self._push(tp="script", script=f"({name}{op})")
            elif nm in ("incprop", "decprop", "propinc", "propdec"):
                aname_expr = self._prop(p.get("idx", 0))
                is_cocos = getattr(self.d, "is_cocos", False)
                if is_cocos and not is_prefix:
                    obj = self._pop()
                    ov = obj.get_value()
                    if _is_numeric(ov):
                        ov = "(" + ov + ")"
                    self._push(**obj.copy())
                    self._push(tp="script", script=f"({ov}{aname_expr}{op})")
                    skip = False
                    skip_return = False
                    ops = self.d.ops
                    idx_val = p.get("idx", 0)
                    for si in range(len(ops)):
                        if ops[si]["off"] == o and ops[si]["nm"] == nm:
                            if si + 12 < len(ops):
                                seq = [ops[si + k]["nm"] for k in range(1, 13)]
                                sidxs = [
                                    ops[si + k].get("params", {}).get("idx", -1)
                                    for k in range(1, 13)
                                ]
                                arith = "add" if is_inc else "sub"
                                if (
                                    seq[0] == "pop"
                                    and seq[1] == "dup"
                                    and seq[2] == "getprop"
                                    and sidxs[2] == idx_val
                                    and seq[3] == "pos"
                                    and seq[4] == "dup"
                                    and seq[5] == "one"
                                    and seq[6] == arith
                                    and seq[7] == "pick"
                                    and seq[8] == "swap"
                                    and seq[9] == "setprop"
                                    and sidxs[9] == idx_val
                                    and seq[10] == "pop"
                                    and seq[11] == "pop"
                                ):
                                    skip = True
                                elif (
                                    seq[0] == "pop"
                                    and seq[1] == "dup"
                                    and seq[2] == "getprop"
                                    and sidxs[2] == idx_val
                                    and seq[3] == "pos"
                                    and seq[4] == "dup"
                                    and seq[5] == "one"
                                    and seq[6] == arith
                                    and seq[7] == "pick"
                                    and seq[8] == "swap"
                                    and seq[9] == "setprop"
                                    and sidxs[9] == idx_val
                                    and seq[10] == "pop"
                                    and seq[11] == "return"
                                ):
                                    skip = True
                                    skip_return = True
                            break
                    if skip:
                        self._pop()
                        self._pop()
                        if skip_return:
                            self._w(o, f"return ({ov}{aname_expr}{op});")
                            self._skip_ops_count = 11
                        else:
                            self._skip_ops_count = 11
                        return
                else:
                    obj = self._pop()
                    ov = obj.get_value()
                    if _is_numeric(ov):
                        ov = "(" + ov + ")"
                    if is_prefix:
                        self._push(tp="script", script=f"{op}{ov}{aname_expr}")
                    else:
                        self._push(tp="script", script=f"({ov}{aname_expr}{op})")
            elif nm in ("incelem", "decelem", "eleminc", "elemdec"):
                idx = self._pop()
                obj = self._pop()
                ov = obj.get_value()
                if _is_numeric(ov):
                    ov = "(" + ov + ")"
                if is_prefix:
                    self._push(tp="script", script=f"{op}{ov}[{idx.get_value()}]")
                else:
                    self._push(tp="script", script=f"({ov}[{idx.get_value()}]{op})")

        elif nm == "arguments":
            self._push(name="arguments")
        elif nm == "rest":
            self._push(name="...rest")

        # aliased vars
        # Note: in standard MozJS34 bytecode, JSOP_CALLALIASEDVAR (0x89) has
        # the same stack effect as SETALIASEDVAR (use=1, push=1): it pops the
        # top of stack and assigns it to the aliased variable slot. The CALL
        # prefix is a type-inference hint only. Cocos51 never emits this opcode
        # (it uses SETALIASEDVAR directly), so treating CALLALIASEDVAR as
        # SETALIASEDVAR is safe for both formats.
        elif nm == "callaliasedvar":
            var_name = self._resolve_aliased_var(p.get("hops", 0), p.get("slot", 0))
            if not var_name:
                var_name = f'_av{p.get("slot", 0)}'
            self._push(name=var_name)
        elif nm == "getaliasedvar":
            var_name = self._resolve_aliased_var(p.get("hops", 0), p.get("slot", 0))
            if not var_name:
                var_name = f'_av{p.get("slot", 0)}'
            self._push(name=var_name)
        elif nm == "setaliasedvar":
            val = self._pop()
            var_name = self._resolve_aliased_var(p.get("hops", 0), p.get("slot", 0))
            if not var_name:
                var_name = f'_av{p.get("slot", 0)}'
            if var_name == "arguments" and val.get_value() == "arguments":
                self._push(tp="script", name=var_name, script=var_name)
            else:
                self._push(
                    tp="script", name=var_name, script=f"{var_name}={val.get_value()}"
                )

        # literals
        elif nm == "string":
            idx = p.get("atomIndex", p.get("idx", 0))
            self._push(tp="string", value=self._atom(idx))
        elif nm == "double":
            idx = p.get("constIndex", p.get("idx", 0))
            if 0 <= idx < len(self.consts):
                self._push(tp="number", value=self.consts[idx][1])
            else:
                self._push(tp="number", value=0)
        elif nm == "int8":
            self._push(tp="number", value=p.get("val", 0))
        elif nm in ("uint16", "uint24"):
            self._push(tp="number", value=p.get("val", 0))
        elif nm == "int32":
            self._push(tp="number", value=p.get("val", 0))
        elif nm == "zero":
            self._push(tp="number", value=0)
        elif nm == "one":
            self._push(tp="number", value=1)
        elif nm == "null":
            self._push(tp="null", value="null")
        elif nm == "true":
            self._push(tp="boolean", value=True)
        elif nm == "false":
            self._push(tp="boolean", value=False)
        elif nm == "undefined":
            self._push(tp="undefined", value="undefined")
        elif nm == "void":
            self._pop()
            self._push(tp="undefined", value="undefined")
        elif nm == "this":
            self._push(name="this")
        elif nm == "hole":
            self._push(tp="void", value=None)
        elif nm == "regexp":
            idx = p.get("idx", 0)
            regexps = getattr(self.d, "regexps", None)
            if regexps and idx < len(regexps):
                self._push(tp="regexp", value=regexps[idx])
            else:
                self._push(tp="regexp", value="/re/")

        # arithmetic / comparisons
        elif nm in IMAGE_OPS:
            r = self._pop()
            l = self._pop()
            lv = l.get_value()
            rv = r.get_value()
            if nm in ("stricteq", "eq") and rv == "NaN":
                self._push(tp="script", script=f"isNaN({lv})")
            elif nm in ("strictne", "ne") and rv == "NaN":
                self._push(tp="script", script=f"(!isNaN({lv}))")
            elif nm in ("stricteq", "eq") and lv == "NaN":
                self._push(tp="script", script=f"isNaN({rv})")
            elif nm in ("strictne", "ne") and lv == "NaN":
                self._push(tp="script", script=f"(!isNaN({rv}))")
            else:
                sym = IMAGE_OPS.get(nm, "?")
                self._push(tp="script", script=f"({lv} {sym} {rv})")
        elif nm in (
            "eq",
            "ne",
            "lt",
            "le",
            "gt",
            "ge",
            "stricteq",
            "strictne",
            "in",
            "instanceof",
        ):
            r = self._pop()
            l = self._pop()
            sym_map = {
                "eq": "==",
                "ne": "!=",
                "lt": "<",
                "le": "<=",
                "gt": ">",
                "ge": ">=",
                "stricteq": "===",
                "strictne": "!==",
                "in": "in",
                "instanceof": "instanceof",
            }
            lv = l.get_value()
            rv = r.get_value()
            if nm in ("stricteq", "eq") and rv == "NaN":
                self._push(tp="script", script=f"isNaN({lv})")
            elif nm in ("strictne", "ne") and rv == "NaN":
                self._push(tp="script", script=f"(!isNaN({lv}))")
            elif nm in ("stricteq", "eq") and lv == "NaN":
                self._push(tp="script", script=f"isNaN({rv})")
            elif nm in ("strictne", "ne") and lv == "NaN":
                self._push(tp="script", script=f"(!isNaN({rv}))")
            else:
                self._push(tp="script", script=f"({lv} {sym_map[nm]} {rv})")
        elif nm in (
            "add",
            "sub",
            "mul",
            "div",
            "mod",
            "bitand",
            "bitor",
            "bitxor",
            "lsh",
            "rsh",
            "ursh",
        ):
            r = self._pop()
            l = self._pop()
            sym_map = {
                "add": "+",
                "sub": "-",
                "mul": "*",
                "div": "/",
                "mod": "%",
                "bitand": "&",
                "bitor": "|",
                "bitxor": "^",
                "lsh": "<<",
                "rsh": ">>",
                "ursh": ">>>",
            }
            self._push(
                tp="script", script=f"({l.get_value()} {sym_map[nm]} {r.get_value()})"
            )
        elif nm == "not":
            v = self._pop()
            self._push(tp="script", script=f"(!{v.get_value()})")
        elif nm == "bitnot":
            v = self._pop()
            self._push(tp="script", script=f"(~{v.get_value()})")
        elif nm == "neg":
            v = self._pop()
            self._push(tp="script", script=f"(-{v.get_value()})")
        elif nm == "pos":
            v = self._pop()
            self._push(tp="script", script=f"(+{v.get_value()})")
        elif nm == "tostring":
            v = self._pop()
            self._push(tp="script", script=f"String({v.get_value()})")
        elif nm in ("typeof", "typeofexpr"):
            self._push(tp="script", script="typeof " + self._pop().get_value())

        # objects / arrays
        elif nm == "newinit":
            kind = p.get("kind", 0)
            self._push(tp="object", value={} if kind == 0 else {})
        elif nm == "newarray":
            self._push(tp="array", value=[])
        elif nm == "newarray_copyonwrite":
            self._push(tp="array", value=[])
        elif nm in ("newobject", "object"):
            self._push(tp="object", value={})
        elif nm == "initprop":
            val = self._pop()
            obj = self._pop()
            aname = self._atom(p.get("idx", 0))
            if self._is_ident(aname):
                key_str = aname
            else:
                key_str = _js_str(aname)
            if isinstance(obj.value, dict):
                obj.value[key_str] = val
            self._push(
                tp="object", value=obj.value if isinstance(obj.value, dict) else {}
            )
        elif nm in ("initprop_getter", "initprop_setter"):
            val = self._pop()
            obj = self._pop()
            aname = self._atom(p.get("idx", 0))
            if self._is_ident(aname):
                key_str = aname
            else:
                key_str = _js_str(aname)
            accessor = "get" if "getter" in nm else "set"
            if isinstance(obj.value, dict):
                obj.value[key_str] = val
            self._push(
                tp="object", value=obj.value if isinstance(obj.value, dict) else {}
            )
        elif nm in ("initelem", "initelem_inc"):
            val = self._pop()
            name = self._pop()
            obj = self._pop()
            if isinstance(obj.value, dict):
                obj.value[name.get_value()] = val
            self._push(
                tp="object", value=obj.value if isinstance(obj.value, dict) else {}
            )
        elif nm in ("initelem_getter", "initelem_setter"):
            val = self._pop()
            name = self._pop()
            obj = self._pop()
            if isinstance(obj.value, dict):
                obj.value[name.get_value()] = val
            self._push(
                tp="object", value=obj.value if isinstance(obj.value, dict) else {}
            )
        elif nm == "initelem_array":
            val = self._pop()
            arr = self._pop()
            if isinstance(arr.value, list):
                arr.value.append(val)
            self._push(
                tp="array", value=arr.value if isinstance(arr.value, list) else []
            )
        elif nm == "arraypush":
            val = self._pop()
            arr = self._pop()
            self._push(
                tp="array", value=arr.value if isinstance(arr.value, list) else []
            )

        # try / catch
        elif nm == "try":
            self._w(o, "try {")
            self._block_depth += 1
            self._try_depth += 1
            self._try_if_base.append(len(self._open_ifs))
            self._catch_closed = False
        elif nm == "throw":
            self._w(o, "throw " + self._pop().get_value() + ";")
        elif nm == "throwing":
            self._pop()
        elif nm == "exception":
            if self._try_if_base:
                base = self._try_if_base[-1]
                close_ifs = len(self._open_ifs) - base
            else:
                base = 0
                close_ifs = len(self._open_ifs)
            if close_ifs > 0:
                self._w(o, "}" * close_ifs)
                self._open_ifs = self._open_ifs[:base]
            self._w(o, "} catch(e) {")
            self._push(name="e")
            self._in_catch = True
        elif nm == "finally":
            if self._in_catch:
                self._w(o, "} finally {")
                self._in_catch = False
            else:
                self._w(o, "} finally {")
            self._push(tp="void", value=None)
            self._push(tp="void", value=None)
        elif nm == "retsub":
            self._w(o, "}")
            if self._block_depth > 0:
                self._block_depth -= 1
            if self._try_depth > 0:
                self._try_depth -= 1
            if self._try_if_base:
                self._try_if_base.pop()
            self._pop()
            self._pop()
        elif nm in ("leaveblock", "leaveblockexpr"):
            has_finally_after = False
            if self._in_catch:
                for si in range(len(self.d.ops)):
                    if self.d.ops[si]["off"] == o:
                        for sj in range(si + 1, min(si + 5, len(self.d.ops))):
                            if self.d.ops[sj]["nm"] == "finally":
                                has_finally_after = True
                                break
                        break
            if self._in_catch and has_finally_after:
                self._in_catch = False
                self._catch_closed = True
            elif self._catch_closed:
                self._catch_closed = False
            elif self._in_catch:
                self._w(o, "}")
                self._in_catch = False
                self._catch_closed = True
            elif self._block_depth > 0:
                self._w(o, "}")
            if self._block_depth > 0:
                self._block_depth -= 1
            if self._try_depth > 0:
                self._try_depth -= 1
            if self._try_if_base:
                self._try_if_base.pop()
            if self._in_switch and self._switch_stack:
                prev = self._switch_stack.pop()
                self._in_switch = prev[0]
                self._switch_labels = prev[1]
                self._switch_default_target = prev[2]
                self._switch_ifs_start = prev[3]
            else:
                self._in_switch = False
                self._switch_labels = {}
        elif nm == "debugleaveblock":
            pass
        elif nm == "pushblockscope":
            pass
        elif nm == "popblockscope":
            pass

        # switch
        elif nm == "condswitch":
            # Save current switch state before starting new one
            self._switch_stack.append(
                (
                    self._in_switch,
                    dict(self._switch_labels),
                    self._switch_default_target,
                    self._switch_ifs_start,
                    self._block_depth,
                )
            )
            v = self._stack[-1] if self._stack else StackItem()
            self._w(o, "switch(" + v.get_value() + "){")
            self._block_depth += 1
            self._in_switch = True
            self._switch_labels = {}
            self._switch_ifs_start = len(self._open_ifs)
        elif nm == "case":
            val = self._pop()  # pop case value; switch value stays on stack
            tgt = o + p.get("offset", 0)
            label_text = "case " + val.get_value() + ":"
            if tgt not in self._switch_labels:
                self._switch_labels[tgt] = []
            self._switch_labels[tgt].append(label_text)
        elif nm == "default":
            if self._stack:
                self._pop()
            tgt = o + p.get("offset", 0)
            self._switch_default_target = tgt
            if tgt not in self._switch_labels:
                self._switch_labels[tgt] = []
            self._switch_labels[tgt].append("default:")

        # misc
        elif nm in (
            "spread",
            "getxprop",
            "getter",
            "setter",
            "enumconstelem",
            "setintrinsic",
            "bindgname",
            "setcall",
            "proxy",
            "tableswitch",
            "getintrinsic",
            "bindintrinsic",
        ):
            pass
        elif nm == "iter":
            obj = self._pop()
            obj_val = obj.get_value()
            # Store the iterated object for later for-in/for-of header generation
            self._current_iter_obj = obj_val
            self._current_iter_flags = p.get("flags", 0)
            # Push a marker that we're in an iterator context
            self._push(tp="iter", value=obj_val)
        elif nm == "moreiter":
            # Skip moreiters that are part of iterator loop control flow
            if o in self._iter_moreiters:
                v = self._pop()
                self._push(tp="void", value=None)
                self._push(tp="script", script=v.get_value() if v else "")
            else:
                v = self._pop()
                self._push(tp="void", value=None)
                self._push(tp="script", script=v.get_value())
        elif nm == "iternext":
            # Check if the next opcode is setlocal/setaliasedvar/setname/setarg
            # — that's our loop variable.
            # Also detect dup+getelem+setlocal destructuring pattern where
            # the iterator yields [key, value] pairs.
            loop_var = "_it"
            ops = self.d.ops
            for si in range(len(ops)):
                if ops[si]["off"] == o:
                    if si + 1 < len(ops):
                        next_op = ops[si + 1]
                        if next_op["nm"] == "setlocal":
                            ln = next_op["params"].get("localno", 0)
                            vln = self._nargs + ln
                            lv = self._local_vars.get(vln)
                            loop_var = (
                                lv.name
                                if lv
                                else (
                                    self.d.var_slot_names[vln]
                                    if vln < len(self.d.var_slot_names)
                                    and self.d.var_slot_names[vln]
                                    else f"_var_{ln}"
                                )
                            )
                            # Suppress the redundant setlocal after iternext
                            self._iter_suppress_setlocal = ln
                        elif next_op["nm"] == "setaliasedvar":
                            loop_var = self._resolve_aliased_var(
                                next_op["params"].get("hops", 0),
                                next_op["params"].get("slot", 0),
                            )
                        elif next_op["nm"] in ("bindname", "setname", "setgname"):
                            # iternext + setname: loop var is the atom name
                            idx = next_op["params"].get("idx", 0)
                            loop_var = self._atom(idx)
                        elif next_op["nm"] == "setarg":
                            # iternext + setarg: loop var is the argument name
                            an = next_op["params"].get("argno", 0)
                            loop_var = (
                                self.d.argvs[an]
                                if an < len(self.d.argvs)
                                else "a%d" % an
                            )
                            # Suppress the redundant setarg after iternext
                            self._iter_suppress_setarg = an
                        elif next_op["nm"] == "dup":
                            # iternext + dup + getelem[N] + setlocal:
                            # Destructuring for-in where iterator yields [key, value].
                            # The loop variable is the first getelem target.
                            if si + 4 < len(ops):
                                op2 = ops[si + 2]  # zero or one
                                op3 = ops[si + 3]  # getelem
                                op4 = ops[si + 4]  # setlocal
                                if op3["nm"] == "getelem" and op4["nm"] == "setlocal":
                                    ln = op4["params"].get("localno", 0)
                                    vln = self._nargs + ln
                                    lv = self._local_vars.get(vln)
                                    loop_var = (
                                        lv.name
                                        if lv
                                        else (
                                            self.d.var_slot_names[vln]
                                            if vln < len(self.d.var_slot_names)
                                            and self.d.var_slot_names[vln]
                                            else f"_var_{ln}"
                                        )
                                    )
                                    # Suppress the setlocal for key extraction
                                    self._iter_suppress_setlocal = ln
                                    # Also mark the subsequent dup+getelem+setlocal
                                    # for value extraction as iter-related so they
                                    # produce clean output
                                    self._iter_destruct = True
                    break
            # Store loop_var in iter_loops map
            if o in self._iter_loops:
                self._iter_loops[o]["loop_var"] = loop_var
                self._iter_loops[o]["obj_value"] = getattr(
                    self, "_current_iter_obj", ""
                )
                self._iter_loops[o]["flags"] = getattr(self, "_current_iter_flags", 0)
            self._push(name=loop_var)
        elif nm == "enditer":
            v = self._pop()
            # Find and close the iterator loop
            for iternext_off, info in self._iter_loops.items():
                if info.get("loop_end_off") == o:
                    iter_off = info["iter_off"]
                    obj_val = info.get("obj_value", "")
                    loop_var = info.get("loop_var", "_it")
                    flags = info.get("flags", 0)
                    keyword = "of" if flags == 2 else "in"
                    header = "for (%s %s %s) {" % (loop_var, keyword, obj_val)
                    self._w(iter_off, header)
                    self._w(o, "}")
                    break
        elif nm == "yield":
            self._push(tp="script", script="yield " + self._pop().get_value())
        elif nm == "callsiteobj":
            self._push(tp="script", script="_callsite")
        elif nm == "runonce":
            pass
        elif nm in ("enterlet0", "enterlet1"):
            pass

    # ────────────────────────────────────────────────────
    def emit(self):
        lines = []
        if self.d.source_path:
            lines.append("// source: " + self.d.source_path)
        for k, v in sorted(self.script.items()):
            if v:
                lines.append(v)
        if self._dump_bytecode:
            lines.append("")
            lines.append("/* bytecode disassembly")
            for op in self.d.ops[:500]:
                nm = op["nm"]
                p = op["params"]
                detail = ""
                if "idx" in p:
                    detail = f" idx={p['idx']} '{self._atom(p['idx'])}'"
                elif "atomIndex" in p:
                    detail = f" atom[{p['atomIndex']}]='{self._atom(p['atomIndex'])}'"
                elif p:
                    detail = " " + " ".join(f"{k}={v}" for k, v in p.items())
                lines.append(f"  {op['off']:06x}: {nm}{detail}")
            if len(self.d.ops) > 500:
                lines.append(f"  ... {len(self.d.ops) - 500} more ops")
            lines.append("*/")

        result = "\n".join(lines)

        # Post-pass: resolve remaining _av{slot} placeholders using local_vars
        # which may have been populated after the aliasedvar opcode was dispatched
        import re as _re

        def _av_replace(m):
            slot = int(m.group(1))
            lv = self._local_vars.get(slot)
            if lv:
                return lv.name
            if slot < len(self.d.var_slot_names):
                return self.d.var_slot_names[slot]
            return m.group(0)  # keep original if can't resolve

        result = _re.sub(r"\b_av(\d+)\b", _av_replace, result)

        var_names = self._collect_var_decl_names(result)
        if var_names:
            var_line = "var " + ", ".join(var_names) + ";"
            if result.startswith("// source:"):
                nl = result.index("\n")
                result = result[: nl + 1] + var_line + "\n" + result[nl + 1 :]
            else:
                result = var_line + "\n" + result

        return result

    def _collect_var_decl_names(self, result):
        import re as _re

        names = set()
        for slot, item in self._local_vars.items():
            nm = item.name if hasattr(item, "name") else str(item)
            if nm and _re.match(r"^(_var_\d+|[lv]\d+)$", nm):
                if slot in self._assigned_local_slots:
                    names.add(nm)
        for m in _re.finditer(r"\b(_var_\d+)\b", result):
            nm = m.group(1)
            slot_match = _re.match(r"^_var_(\d+)$", nm)
            if slot_match:
                slot = int(slot_match.group(1))
                if slot in self._assigned_local_slots:
                    names.add(nm)
            else:
                names.add(nm)
        if not names:
            return []
        return sorted(names, key=lambda s: (len(s), s))

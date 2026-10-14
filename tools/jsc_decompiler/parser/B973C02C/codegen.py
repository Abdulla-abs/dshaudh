"""Standard MozJS34 (0xB973C02C) bytecode stream decoder.

Branch target calculation: target = offset + offset_value
(NOT offset + opcode_length + offset_value like Cocos51).

Aliased var encoding: hops=1byte + slot=3bytes (big-endian), length=5.

getlocal/setlocal: localno is 3 bytes big-endian (opcode length = 4).
"""

import struct
from .opcodes import get_op_info

_JUMP_NAMES = frozenset(
    {
        "goto",
        "ifeq",
        "ifne",
        "or",
        "and",
        "label",
        "case",
        "default",
        "gosub",
        "backpatch",
    }
)
_CALL_NAMES = frozenset({"call", "new", "funcall", "eval", "funapply"})
_IDX_NAMES = frozenset(
    {
        "name",
        "bindname",
        "setname",
        "getprop",
        "setprop",
        "callprop",
        "string",
        "implicitthis",
        "initprop",
        "initprop_getter",
        "initprop_setter",
        "defvar",
        "defconst",
        "delname",
        "delprop",
        "getgname",
        "setgname",
        "bindgname",
        "deffun",
        "lambda",
        "lambda_arrow",
        "newobject",
        "object",
        "regexp",
        "setconst",
        "double",
        "getter",
        "setter",
        "getxprop",
        "length",
        "getintrinsic",
        "setintrinsic",
        "bindintrinsic",
        "pushblockscope",
        "callsiteobj",
        "newarray_copyonwrite",
    }
)
_ALIASED_NAMES = frozenset({"getaliasedvar", "setaliasedvar"})
_ARG_NAMES = frozenset({"getarg", "setarg"})
_LOCAL_NAMES = frozenset({"getlocal", "setlocal"})


def parse_code(data, code_start, code_end):
    ops = []
    o = code_start
    end = min(code_end, len(data))
    max_ops = 5000000
    op_count = 0
    while o < end and op_count < max_ops:
        op_byte = data[o]
        info = get_op_info(op_byte)
        nm = info["name"]
        ol = info["length"]
        params = _extract_params(data, o, nm, ol)
        ol = params.get("_real_len", ol)
        if ol <= 0:
            ol = 1
        ops.append({"off": o, "nm": nm, "params": params, "len": ol})
        o += ol
        op_count += 1
    return ops


def _extract_params(d, o, nm, ol):
    p = o + 1
    params = {}
    try:
        if nm in _JUMP_NAMES and p + 4 <= len(d):
            params["offset"] = _s32(_r_be(d, p, 4))
        elif nm in _CALL_NAMES and p + 2 <= len(d):
            params["argc"] = _r_be(d, p, 2)
        elif nm in _ARG_NAMES and p + 2 <= len(d):
            params["argno"] = _r_be(d, p, 2)
        elif nm in _LOCAL_NAMES and p + 3 <= len(d):
            params["localno"] = _r_be(d, p, 3)
        elif nm in _IDX_NAMES and p + 4 <= len(d):
            params["idx"] = _r_be(d, p, 4)
        elif nm in _ALIASED_NAMES and p + 4 <= len(d):
            params["hops"] = d[p]
            params["slot"] = (d[p + 1] << 16) | (d[p + 2] << 8) | d[p + 3]
        elif nm == "tableswitch" and p + 12 <= len(d):
            params["len"] = _s32(_r_be(d, p, 4))
            params["low"] = _s32(_r_be(d, p + 4, 4))
            params["high"] = _s32(_r_be(d, p + 8, 4))
            span = params["high"] - params["low"] + 1
            if 0 <= span <= 0x10000:
                ol = max(1, 1 + 12 + span * 4)
            params["_real_len"] = ol
        elif nm == "int8" and ol > 1 and p < len(d):
            params["val"] = _s8(d[p])
        elif nm == "uint16" and ol > 2 and p + 2 <= len(d):
            params["val"] = _r_be(d, p, 2)
        elif nm == "uint24" and ol > 3 and p + 3 <= len(d):
            params["val"] = _r_be(d, p, 3)
        elif nm == "int32" and ol > 4 and p + 4 <= len(d):
            params["val"] = _s32(_r_be(d, p, 4))
        elif nm == "popn" and ol > 2 and p + 2 <= len(d):
            params["n"] = _r_be(d, p, 2)
        elif nm == "pick" and ol > 1 and p < len(d):
            params["n"] = d[p]
        elif nm == "dupat" and ol > 3 and p + 3 <= len(d):
            params["n"] = _r_be(d, p, 3)
        elif nm == "newinit" and ol > 4 and p + 4 <= len(d):
            params["kind"] = d[p]
            params["extra"] = _r_be(d, p + 1, 3)
        elif nm == "newarray" and ol > 3 and p + 3 <= len(d):
            params["length"] = _r_be(d, p, 3)
        elif nm == "initelem_array" and ol > 3 and p + 3 <= len(d):
            params["index"] = _r_be(d, p, 3)
        elif nm == "lineno" and ol > 2 and p + 2 <= len(d):
            params["lineno"] = _r_be(d, p, 2)
        elif nm == "iter" and ol > 1 and p < len(d):
            params["flags"] = d[p]
        elif nm == "loopentry" and ol > 1 and p < len(d):
            params["depth"] = d[p] - 128
    except (IndexError, struct.error):
        pass
    return params


def _r_be(d, off, n):
    v = 0
    for i in range(n):
        v = (v << 8) | d[off + i]
    return v


def _s32(v):
    if v >= 0x80000000:
        v -= 0x100000000
    return v


def _s8(v):
    if v >= 0x80:
        v -= 0x100
    return v

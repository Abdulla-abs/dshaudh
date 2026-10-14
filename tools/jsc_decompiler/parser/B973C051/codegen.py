"""Cocos51 (0xB973C051) bytecode stream decoder.

Aliased var encoding: hops=2bytes + slot=2bytes (big-endian), length=9.
"""

import struct
from .opcodes import get_op_info
from ..opcodes import (
    _JUMP_NAMES,
    _CALL_NAMES,
    _IDX_NAMES,
    _ALIASED_NAMES,
    _ARG_NAMES,
    _LOCAL_NAMES,
)
from ..utils import r_be, s32, s8

_INC_DEC_NAMES = frozenset(
    {
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
        "incname",
        "decname",
        "nameinc",
        "namedec",
        "incgname",
        "decgname",
        "gnameinc",
        "gnamedec",
        "incprop",
        "decprop",
        "propinc",
        "propdec",
        "incelem",
        "decelem",
        "eleminc",
        "elemdec",
    }
)


def parse_code(data, code_start, code_end):
    ops = []
    o = code_start
    end = min(code_end, len(data))
    max_ops = 5000000
    op_count = 0
    max_target = o
    while o < end and op_count < max_ops:
        op_byte = data[o]
        info = get_op_info(op_byte)
        nm = info["name"]
        ol = info["length"]
        params = _extract_params(data, o, nm, ol)
        ol = params.get("_real_len", ol)
        if ol <= 0:
            ol = 1
        if "offset" in params:
            tgt = o + ol + params["offset"]
            max_target = max(max_target, tgt)
        ops.append({"off": o, "nm": nm, "params": params, "len": ol})
        if nm in _INC_DEC_NAMES:
            ops.append({"off": o, "nm": "pop", "params": {}, "len": 0})
        o += ol
        op_count += 1
    if max_target > code_end and max_target < len(data):
        while o < max_target and op_count < max_ops:
            op_byte = data[o]
            info = get_op_info(op_byte)
            nm = info["name"]
            ol = info["length"]
            if ol == 255 or ol <= 0:
                ol = 1
            ops.append({"off": o, "nm": nm, "params": {}, "len": ol})
            o += ol
            op_count += 1
    return ops


def _extract_params(d, o, nm, ol):
    p = o + 1
    params = {}
    try:
        if nm in _JUMP_NAMES and p + 4 <= len(d):
            params["offset"] = s32(r_be(d, p, 4)[0])
        elif nm in _CALL_NAMES and p + 2 <= len(d):
            params["argc"] = r_be(d, p, 2)[0]
        elif nm in _ARG_NAMES and p + 2 <= len(d):
            params["argno"] = r_be(d, p, 2)[0]
        elif nm in _LOCAL_NAMES and p + 2 <= len(d):
            params["localno"] = r_be(d, p, 2)[0]
        elif nm in _IDX_NAMES and p + 4 <= len(d):
            params["idx"] = r_be(d, p, 4)[0]
        elif nm in _ALIASED_NAMES and p + 4 <= len(d):
            # Cocos51: hops=2bytes + slot=2bytes (big-endian)
            params["hops"] = (d[p] << 8) | d[p + 1]
            params["slot"] = (d[p + 2] << 8) | d[p + 3]
        elif nm == "tableswitch" and p + 12 <= len(d):
            params["len"] = s32(r_be(d, p, 4)[0])
            params["low"] = s32(r_be(d, p + 4, 4)[0])
            params["high"] = s32(r_be(d, p + 8, 4)[0])
            span = params["high"] - params["low"] + 1
            if 0 <= span <= 0x10000:
                ol = max(1, 1 + 12 + span * 4)
            params["_real_len"] = ol
        elif nm == "int8" and ol > 1 and p < len(d):
            params["val"] = s8(d[p])
        elif nm == "uint16" and ol > 2 and p + 2 <= len(d):
            params["val"] = r_be(d, p, 2)[0]
        elif nm == "uint24" and ol > 3 and p + 3 <= len(d):
            params["val"] = r_be(d, p, 3)[0]
        elif nm == "int32" and ol > 4 and p + 4 <= len(d):
            params["val"] = s32(r_be(d, p, 4)[0])
        elif nm == "popn" and ol > 2 and p + 2 <= len(d):
            params["n"] = r_be(d, p, 2)[0]
        elif nm == "pick" and ol > 1 and p < len(d):
            params["n"] = d[p]
        elif nm == "dup" and ol > 3 and p + 3 <= len(d):
            params["n"] = r_be(d, p, 3)[0]
        elif nm == "newinit" and ol > 4 and p + 4 <= len(d):
            params["kind"] = d[p]
            params["extra"] = r_be(d, p + 1, 3)[0]
        elif nm == "newarray" and ol > 3 and p + 3 <= len(d):
            params["length"] = r_be(d, p, 3)[0]
        elif nm == "initelem_array" and ol > 3 and p + 3 <= len(d):
            params["index"] = r_be(d, p, 3)[0]
        elif nm == "enumconstelem" and ol > 3 and p + 3 <= len(d):
            params["index"] = r_be(d, p, 3)[0]
        elif nm == "lineno" and ol > 2 and p + 2 <= len(d):
            params["lineno"] = r_be(d, p, 2)[0]
        elif nm == "iter" and ol > 1 and p < len(d):
            params["flags"] = d[p]
    except (IndexError, struct.error):
        pass
    return params

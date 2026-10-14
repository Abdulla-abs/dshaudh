"""Cocos51 (0xB973C051) opcode table.

Extracted from libCakeMania.so binary (Cocos2d-x custom MozJS build).
Aliased var ops use 4+4 encoding: hops(2B big-endian) + slot(2B big-endian),
total operand length 8 bytes (opcode length = 9).
"""

from ..opcodes import _BINARY_NAME, _IDX_NAMES, _ALIASED_NAMES
from .._codespec import CODESPEC

# Build the Cocos51 opcode table from CODESPEC (extracted from libCakeMania.so)
JSOP_COCOS = {}

for oc in range(0xE6):
    name = _BINARY_NAME.get(oc, f"unused{oc}")
    if oc in CODESPEC:
        ln, use, push, prec, fmt = CODESPEC[oc]
    else:
        ln, use, push = 1, 0, 0
    JSOP_COCOS[oc] = {
        "name": name,
        "image": None,
        "length": ln,
        "use": use,
        "push": push,
    }


def get_op_info(op_byte):
    info = JSOP_COCOS.get(op_byte)
    if info:
        return info
    return {
        "name": f"unk_{op_byte:02x}",
        "image": None,
        "length": 1,
        "use": 0,
        "push": 0,
    }

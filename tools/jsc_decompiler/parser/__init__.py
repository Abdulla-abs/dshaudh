"""Bytecode parsers for JSC/JSCZ files.

Dispatches to version-specific parser based on the magic number:
  0xB973C051 → parser.B973C051  (Cocos2d-x custom MozJS34 variant)
  0xB973C02C → parser.B973C02C  (standard MozJS34)
  0x00000009 → not yet supported

All parsers return a DisasmFunc object — no decompiler dependency.
"""

import struct
from .B973C051 import parse as parse_cocos51
from .B973C02C import parse as parse_mozjs34

MAGIC_COCOS51 = 0xB973C051
MAGIC_MOZJS34 = 0xB973C02C
MAGIC_XDR9 = 0x00000009


def detect_version(data):
    return struct.unpack_from("<I", data, 0)[0]


def parse(data):
    ver = detect_version(data)
    if ver == MAGIC_COCOS51:
        return parse_cocos51(data)
    elif ver == MAGIC_MOZJS34:
        return parse_mozjs34(data)
    else:
        raise ValueError(
            f"Unsupported JSC version 0x{ver:08X} "
            f"(supported: 0xB973C051, 0xB973C02C)"
        )

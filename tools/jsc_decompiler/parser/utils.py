"""Shared binary I/O helpers."""

import struct


def r_le(d, o, s):
    v = 0
    for i in range(s):
        v |= d[o + i] << (8 * i)
    return v, o + s


def r_be(d, o, s):
    v = 0
    for i in range(s):
        v = (v << 8) | d[o + i]
    return v, o + s


def u32le(d, o):
    return struct.unpack_from("<I", d, o)[0]


def s32(v):
    return struct.unpack("<i", struct.pack("<I", v & 0xFFFFFFFF))[0]


def s8(v):
    return v - 256 if v > 127 else v

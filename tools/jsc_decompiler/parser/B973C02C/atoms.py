"""Shared atom parsing helpers for MozJS34 (0xB973C02C) format.

Atom encoding: [u32LE: bit0=isLatin1, bits1-31=char_count] [data]
  isLatin1=1: char_count bytes of Latin-1
  isLatin1=0: char_count*2 bytes of UTF-16LE
"""

import struct


def parse_atom(data, offset):
    """Parse one atom at offset. Returns (string, new_offset)."""
    if offset + 4 > len(data):
        return "", offset
    raw = struct.unpack_from("<I", data, offset)[0]
    offset += 4
    is_lat = raw & 1
    length = raw >> 1
    if is_lat:
        if offset + length <= len(data):
            s = data[offset : offset + length].decode("latin-1", errors="replace")
        else:
            s = ""
        offset += length
    else:
        sz = length * 2
        if offset + sz <= len(data):
            s = data[offset : offset + sz].decode("utf-16le", errors="replace")
        else:
            s = ""
        offset += sz
    return s, offset


def parse_atoms_seq(data, offset, count):
    """Parse count atoms sequentially. Returns (list_of_strings, new_offset)."""
    atoms = []
    for _ in range(count):
        if offset + 4 > len(data):
            break
        s, offset = parse_atom(data, offset)
        atoms.append(s)
    return atoms, offset

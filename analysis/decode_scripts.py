"""Decode this APK's CCZp scripts; preserves the original APK."""
import io
import pathlib
import struct
import zipfile
import zlib
from elftools.elf.elffile import ELFFile

ROOT = pathlib.Path(__file__).resolve().parent.parent

def read_virtual(elf, binary, address, length):
    for segment in elf.iter_segments():
        if segment['p_type'] == 'PT_LOAD' and segment['p_vaddr'] <= address < segment['p_vaddr'] + segment['p_filesz']:
            offset = address - segment['p_vaddr'] + segment['p_offset']
            return binary[offset:offset + length]
    raise ValueError(hex(address))

def make_key(parts, delta):
    mask = 0xffffffff
    key = [0] * 1024
    total = last = 0
    for _ in range(6):
        total = (total + delta) & mask
        e = (total >> 2) & 3
        for p in range(1024):
            y = key[(p + 1) % 1024]
            mx = (((last >> 5) ^ (y << 2)) + ((y >> 3) ^ (last << 4))) ^ ((total ^ y) + (parts[(p & 3) ^ e] ^ last))
            last = key[p] = (key[p] + mx) & mask
    return key

def decode(data, key, secure_length=400):
    buffer = bytearray(data)
    count = (len(buffer) - 12) // 4
    indices = list(range(min(secure_length, count))) + list(range(secure_length, count, 64))
    for k, i in enumerate(indices):
        value = struct.unpack_from('<I', buffer, 12 + i * 4)[0] ^ key[k % 1024]
        struct.pack_into('<I', buffer, 12 + i * 4, value)
    result = zlib.decompress(buffer[16:])
    assert len(result) == struct.unpack_from('>I', buffer, 12)[0]
    return result

if __name__ == '__main__':
    with zipfile.ZipFile(ROOT / 'koudaizhuluoji.apk') as archive:
        binary = archive.read('lib/armeabi/libcocos2djs.so')
        elf = ELFFile(io.BytesIO(binary))
        addresses = [0x294ea8, 0x27842c, 0x278694, 0x295fd8]
        parts = [struct.unpack('<I', read_virtual(elf, binary, a, 4))[0] for a in addresses]
        delta = struct.unpack('<I', read_virtual(elf, binary, 0x2a9f44, 4))[0]
        print('Key parts:', [hex(p) for p in parts], 'delta:', hex(delta))
        key = make_key(parts, delta)
        total = 0
        for name in archive.namelist():
            if not name.endswith('.jscz'):
                continue
            decoded = decode(archive.read(name), key)
            destination = ROOT / 'analysis' / 'decoded' / name.removeprefix('assets/res_ref/')
            destination = destination.with_suffix('.jsc')
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(decoded)
            total += 1
        print('Successfully decoded', total, 'scripts')

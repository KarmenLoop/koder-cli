// Feishu/Lark long-connection frame (pbbp2.Frame in larksuite/node-sdk, MIT):
// 1 SeqID uint64, 2 LogID uint64, 3 service int32, 4 method int32,
// 5 headers repeated {1 key, 2 value}, 6 payloadEncoding, 7 payloadType,
// 8 payload bytes, 9 LogIDNew. uint64 fields stay BigInt so echoes are exact.
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function varint(value) {
  let v = BigInt.asUintN(64, BigInt(value));
  const out = [];
  do {
    let byte = Number(v & 0x7fn);
    v >>= 7n;
    if (v) byte |= 0x80;
    out.push(byte);
  } while (v);
  return out;
}

function tag(field, wire) {
  return varint((field << 3) | wire);
}

function lengthDelimited(field, bytes) {
  return [...tag(field, 2), ...varint(bytes.length), ...bytes];
}

function encodeHeader({ key, value }) {
  return [...lengthDelimited(1, encoder.encode(String(key))), ...lengthDelimited(2, encoder.encode(String(value)))];
}

export function encodeFrame(frame) {
  const out = [];
  out.push(...tag(1, 0), ...varint(frame.SeqID ?? 0n));
  out.push(...tag(2, 0), ...varint(frame.LogID ?? 0n));
  out.push(...tag(3, 0), ...varint(frame.service ?? 0));
  out.push(...tag(4, 0), ...varint(frame.method ?? 0));
  for (const header of frame.headers || []) out.push(...lengthDelimited(5, encodeHeader(header)));
  if (frame.payloadEncoding) out.push(...lengthDelimited(6, encoder.encode(frame.payloadEncoding)));
  if (frame.payloadType) out.push(...lengthDelimited(7, encoder.encode(frame.payloadType)));
  if (frame.payload?.length) out.push(...lengthDelimited(8, frame.payload));
  if (frame.LogIDNew) out.push(...lengthDelimited(9, encoder.encode(frame.LogIDNew)));
  return Uint8Array.from(out);
}

function reader(bytes) {
  let pos = 0;
  const readVarint = () => {
    let result = 0n;
    let shift = 0n;
    for (;;) {
      if (pos >= bytes.length) throw new Error("protobuf: truncated varint");
      const byte = bytes[pos++];
      result |= BigInt(byte & 0x7f) << shift;
      if (!(byte & 0x80)) return result;
      shift += 7n;
      if (shift > 70n) throw new Error("protobuf: varint too long");
    }
  };
  return {
    done: () => pos >= bytes.length,
    varint: readVarint,
    bytes() {
      const length = Number(readVarint());
      if (pos + length > bytes.length) throw new Error("protobuf: truncated field");
      const slice = bytes.subarray(pos, pos + length);
      pos += length;
      return slice;
    },
    skip(wire) {
      if (wire === 0) readVarint();
      else if (wire === 2) this.bytes();
      else if (wire === 1) pos += 8;
      else if (wire === 5) pos += 4;
      else throw new Error(`protobuf: wire type ${wire}`);
    },
  };
}

function decodeHeader(bytes) {
  const r = reader(bytes);
  const header = { key: "", value: "" };
  while (!r.done()) {
    const key = Number(r.varint());
    const field = key >> 3;
    const wire = key & 7;
    if (field === 1 && wire === 2) header.key = decoder.decode(r.bytes());
    else if (field === 2 && wire === 2) header.value = decoder.decode(r.bytes());
    else r.skip(wire);
  }
  return header;
}

export function decodeFrame(bytes) {
  const r = reader(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes));
  const frame = { SeqID: 0n, LogID: 0n, service: 0, method: 0, headers: [], payloadEncoding: "", payloadType: "", payload: new Uint8Array(0), LogIDNew: "" };
  while (!r.done()) {
    const key = Number(r.varint());
    const field = key >> 3;
    const wire = key & 7;
    if (field === 1 && wire === 0) frame.SeqID = r.varint();
    else if (field === 2 && wire === 0) frame.LogID = r.varint();
    else if (field === 3 && wire === 0) frame.service = Number(BigInt.asIntN(32, r.varint()));
    else if (field === 4 && wire === 0) frame.method = Number(BigInt.asIntN(32, r.varint()));
    else if (field === 5 && wire === 2) frame.headers.push(decodeHeader(r.bytes()));
    else if (field === 6 && wire === 2) frame.payloadEncoding = decoder.decode(r.bytes());
    else if (field === 7 && wire === 2) frame.payloadType = decoder.decode(r.bytes());
    else if (field === 8 && wire === 2) frame.payload = Uint8Array.from(r.bytes());
    else if (field === 9 && wire === 2) frame.LogIDNew = decoder.decode(r.bytes());
    else r.skip(wire);
  }
  return frame;
}

export function header(frame, key) {
  return frame.headers.find((item) => item.key === key)?.value;
}

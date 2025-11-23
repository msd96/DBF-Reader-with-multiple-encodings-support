import { Dbf } from 'dbf-reader';

// Access underlying DbfReader class
const DbfReader = (Dbf as any).prototype.__proto__.constructor;

// Patch static function getFieldValue
// Make it return RAW BYTES instead of UTF8 strings
DbfReader.getFieldValue = function (
  valueBuffer: Uint8Array,
  fieldType: string,
  decimalCount: number,
  fieldLength: number
) {
  const bytes = valueBuffer.subarray(0, fieldLength);

  // numeric
  if (fieldType.toLowerCase() === 'n') {
    return String.fromCharCode(...bytes).trim();
  }

  // date
  if (fieldType.toLowerCase() === 'd') {
    const s = String.fromCharCode(...bytes);
    return `${s.substring(0,4)}-${s.substring(4,6)}-${s.substring(6,8)}`;
  }

  // everything else: return raw bytes
  return bytes;
};

export const PatchedDbfReader = Dbf;

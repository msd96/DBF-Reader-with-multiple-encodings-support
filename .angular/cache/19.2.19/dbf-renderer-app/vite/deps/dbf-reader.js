import {
  __commonJS
} from "./chunk-3OV72XIM.js";

// node_modules/dbf-reader/models/dbf-file.js
var require_dbf_file = __commonJS({
  "node_modules/dbf-reader/models/dbf-file.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var DataTable = class {
      constructor() {
        this.columns = new Array();
        this.rows = new Array();
      }
    };
    exports.DataTable = DataTable;
    var Column = class {
    };
    exports.Column = Column;
  }
});

// node_modules/dbf-reader/dbf-reader.js
var require_dbf_reader = __commonJS({
  "node_modules/dbf-reader/dbf-reader.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var dbf_file_1 = require_dbf_file();
    var DbfReader = class _DbfReader {
      static readFieldsInfo(dbaseFile) {
        try {
          let byteRead;
          let fields = new Array();
          let i = 0;
          do {
            byteRead = _DbfReader.fileHeaderSize + i * _DbfReader.fieldDescriptorSize + 1;
            let fieldNameLength = 0;
            while (Buffer.from(dbaseFile.subarray(byteRead + fieldNameLength, byteRead + fieldNameLength + 1)).toString("utf8") != "\0" && fieldNameLength < 11) {
              fieldNameLength += 1;
            }
            let fieldName = Buffer.from(dbaseFile.subarray(byteRead, byteRead + fieldNameLength)).toString("utf8");
            byteRead = byteRead + 11;
            let fieldType = Buffer.from(dbaseFile.subarray(byteRead, byteRead + 1)).toString("utf8");
            byteRead = byteRead + 1;
            byteRead = byteRead + 4;
            let fieldLength = dbaseFile.readIntLE(byteRead, 1);
            byteRead = byteRead + 1;
            let decimalCount = dbaseFile.readIntLE(byteRead, 1);
            byteRead = byteRead + 1;
            fields.push(new _DbfReader.FieldDescriptor(fieldName, fieldType, fieldLength, decimalCount));
            byteRead = byteRead + 14;
            i += 1;
          } while (Buffer.from(dbaseFile.subarray(byteRead, byteRead + 1)).toString("utf8") != "\r");
          return fields;
        } catch (error) {
          throw error;
        }
      }
      static getDateValue(value) {
        try {
          if (value.length == 8) {
            let year = value.substr(0, 4);
            let month = value.substr(4, 2);
            let date = value.substr(6, 2);
            return new Date(+year, +month, +date);
          }
        } catch (error) {
          console.log(error);
        }
        return null;
      }
      static getFieldValue(valueBuffer, type, decimalCount, fieldlength) {
        let value = valueBuffer.toString("utf8").trim();
        let byteRead = 0;
        let valueLength = 0;
        try {
          switch (type.trim().toLowerCase()) {
            case "q":
              value = value;
              break;
            case "v":
              while (Buffer.from(valueBuffer.subarray(byteRead + valueLength, byteRead + valueLength + 1)).toString("utf8") != "\0" && valueLength < fieldlength) {
                valueLength += 1;
              }
              value = Buffer.from(valueBuffer.subarray(byteRead, byteRead + valueLength)).toString("utf8").trim();
              break;
            case "c":
              value = value;
              break;
            case "d":
              value = _DbfReader.getDateValue(value);
              break;
            case "f":
            case "n":
              value = +value;
              break;
            case "l":
              if (value.toLowerCase() == "y" || value.toLowerCase() == "t") {
                value = true;
              } else {
                value = false;
              }
              break;
            case "g":
            case "i":
              value = valueBuffer.readIntLE(0, valueBuffer.byteLength);
              break;
            case "y":
              let currency = valueBuffer.readIntLE(0, valueBuffer.byteLength).toString();
              currency = currency.substr(0, currency.length - decimalCount) + "." + currency.substr(currency.length - decimalCount, currency.length - 4);
              value = +currency;
              break;
            case "b":
              value = valueBuffer.readDoubleLE(0);
              break;
            case "t":
              let dateWord = valueBuffer.readInt32LE(0);
              let duration = valueBuffer.readInt32LE(4);
              let seconds = Math.floor(duration / 1e3 % 60);
              let minutes = Math.floor(duration / (1e3 * 60) % 60);
              let hours = Math.floor(duration / (1e3 * 60 * 60) % 24);
              let date = _DbfReader.julianIntToDate(dateWord);
              value = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, seconds);
          }
        } catch (error) {
          console.log(error);
        }
        return value;
      }
      static julianIntToDate(jd) {
        var year, month, day, l, n, i, j, k;
        l = jd + 68569;
        n = Math.floor(Math.floor(4 * l) / 146097);
        l = l - Math.floor((146097 * n + 3) / 4);
        i = Math.floor(4e3 * (l + 1) / 1461001);
        l = l - Math.floor(1461 * i / 4) + 31;
        j = Math.floor(80 * l / 2447);
        k = l - Math.floor(2447 * j / 80);
        l = Math.floor(j / 11);
        j = j + 2 - 12 * l;
        i = 100 * (n - 49) + i + l;
        year = i;
        month = j;
        day = k;
        let date = new Date(year, month, day);
        date.setMonth(date.getMonth() - 1);
        return date;
      }
      static getTypeName(type) {
        let typeName = "string";
        try {
          switch (type.trim().toLowerCase()) {
            case "v":
            case "c":
              typeName = "string";
              break;
            case "d":
              typeName = "date";
              break;
            case "y":
            case "i":
            case "g":
            case "b":
            case "f":
            case "n":
              typeName = "numeric";
              break;
            case "l":
              typeName = "boolean";
              break;
            case "t":
              typeName = "datetime";
              break;
            // case "q": typeName = "binary";
            //     break;
            default:
              typeName = "notsupported";
          }
        } catch (error) {
          console.log(error);
        }
        return typeName;
      }
      /**
       * read Dbase DB File
       */
      static read(dbaseFile) {
        let dt = new dbf_file_1.DataTable();
        try {
          let byteRead = 0;
          byteRead = byteRead + 1;
          byteRead = byteRead + 1;
          byteRead = byteRead + 1;
          byteRead = byteRead + 1;
          let recordCount = dbaseFile.readInt32LE(byteRead);
          byteRead = byteRead + 4;
          let recordDataStartOffset = dbaseFile.readInt16LE(byteRead);
          byteRead = byteRead + 8;
          byteRead = byteRead + 8;
          let fields = _DbfReader.readFieldsInfo(dbaseFile);
          byteRead = recordDataStartOffset + 1;
          fields.forEach((f) => {
            let dataColumn = new dbf_file_1.Column();
            dataColumn.name = f.fieldName;
            dataColumn.type = _DbfReader.getTypeName(f.fieldType);
            if (dataColumn.type != "notsupported") {
              dt.columns.push(dataColumn);
            }
          });
          byteRead = recordDataStartOffset;
          for (var i = 0; i < recordCount; i++) {
            let row = {};
            if (Buffer.from(dbaseFile.subarray(byteRead, byteRead + 1)).toString("utf8") == " ") {
              byteRead = byteRead + 1;
              fields.forEach((col) => {
                let type = _DbfReader.getTypeName(col.fieldType);
                if (col.fieldLength < 0) {
                  col.fieldLength = 256 + col.fieldLength;
                }
                if (col.fieldLength > 0) {
                  let value = _DbfReader.getFieldValue(Buffer.from(dbaseFile.subarray(byteRead, byteRead + col.fieldLength)), col.fieldType, col.fieldDecimalCount, col.fieldLength);
                  if (type != "notsupported") {
                    row[col.fieldName] = value;
                  }
                  byteRead = byteRead + col.fieldLength;
                } else {
                  throw new SyntaxError("Unsupported Dbase (.dbf) file");
                }
              });
              dt.rows.push(row);
            } else {
              byteRead = byteRead + 1;
              fields.forEach((col) => {
                byteRead = byteRead + col.fieldLength;
              });
            }
          }
          return dt;
        } catch (error) {
          throw error;
        }
      }
    };
    DbfReader.fileHeaderSize = 31;
    DbfReader.fieldDescriptorSize = 32;
    DbfReader.FieldDescriptor = class {
      constructor(fieldName, fieldType, fieldLength, fieldDecimalCount) {
        this.fieldName = fieldName;
        this.fieldType = fieldType;
        this.fieldLength = fieldLength;
        this.fieldDecimalCount = fieldDecimalCount;
      }
    };
    exports.DbfReader = DbfReader;
  }
});

// node_modules/dbf-reader/dbf.js
var require_dbf = __commonJS({
  "node_modules/dbf-reader/dbf.js"(exports) {
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var dbf_reader_1 = require_dbf_reader();
    var Dbf = class extends dbf_reader_1.DbfReader {
      /**
       * @Method: Read DBase DB (.dbf file)
       * @Param {Buffer}
       * @Return {DataTable}
       */
      static read(dbaseFile) {
        try {
          if (!dbaseFile || dbaseFile.byteLength == 0) {
            throw new SyntaxError("Dbase DB File can't be null or empty.");
          } else {
            return dbf_reader_1.DbfReader.read(dbaseFile);
          }
        } catch (error) {
          throw error;
        }
      }
    };
    exports.Dbf = Dbf;
  }
});
export default require_dbf();
//# sourceMappingURL=dbf-reader.js.map

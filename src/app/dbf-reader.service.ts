import { Injectable } from '@angular/core';
import { PatchedDbfReader } from '../dbf-reader-patch';
import * as jschardet from 'jschardet';
import * as iconv from '@vscode/iconv-lite-umd';

@Injectable({
  providedIn: 'root'
})
export class DbfReaderService {

  detectEncoding(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);

    // DBF header code page byte at offset 29
    const codepageId = bytes[29];

    const codepageMap: any = {
      0x65: 'cp866',          // Cyrillic DOS
      0xC9: 'windows-1251',   // Cyrillic Windows
      0x57: 'mac',
      0x26: 'windows-1250',
      0x03: 'utf-8',
      0x00: null
    };

    if (codepageMap[codepageId]) {
      return codepageMap[codepageId];
    }

    // Fallback to jschardet
    const uint8 = new Uint8Array(buffer);
    let bin = "";
    for (let i = 0; i < uint8.length; i++) {
      bin += String.fromCharCode(uint8[i]);
    }

    const detected = jschardet.detect(bin);
    return detected?.encoding?.toLowerCase() || 'utf-8';
  }

  async readDbf(file: File, encoding: string) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = (window as any).Buffer.from(arrayBuffer);

    const datatable = PatchedDbfReader.read(buffer);

    const fields = datatable.columns.map((c: any) => c.name);

    const rows = datatable.rows.map((row: any) => {
      const decoded: any = {};

      fields.forEach((name: string) => {
        const raw = row[name];

        if (raw instanceof Uint8Array) {
          decoded[name] = iconv.decode(raw, encoding).trim();
        } else {
          decoded[name] = raw;
        }
      });

      return decoded;
    });

    return { fields, rows };
  }
}

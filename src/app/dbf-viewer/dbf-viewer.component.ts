import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbfReaderService } from '../dbf-reader.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-dbf-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dbf-viewer.component.html',
  styleUrls: ['./dbf-viewer.component.css']
})
export class DbfViewerComponent {

  fields: string[] = [];
  rows: any[] = [];
  loading = false;
  error: string | null = null;

  encoding = 'utf-8';
  detectedEncoding: string | null = null;
  currentFile: File | null = null;

  theme = 'light';

  encodingList = [
    'utf-8',
    'windows-1251',
    'cp866',
    'latin1',
    'utf-16',
    'iso-8859-1',
    'koi8-r'
  ];

  constructor(
    private dbfService: DbfReaderService,
    private themeService: ThemeService
  ) {
    this.theme = this.themeService.current;
  }

  toggleTheme() {
    this.themeService.toggle();
    this.theme = this.themeService.current;
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.currentFile = file;
    this.error = null;

    const buf = await file.arrayBuffer();
    this.detectedEncoding = this.dbfService.detectEncoding(buf);

    if (this.encodingList.includes(this.detectedEncoding)) {
      this.encoding = this.detectedEncoding;
    }

    await this.loadWithEncoding();
  }

  async onEncodingChanged() {
    if (this.currentFile) {
      await this.loadWithEncoding();
    }
  }

  async loadWithEncoding() {
    if (!this.currentFile) return;

    this.loading = true;
    this.fields = [];
    this.rows = [];

    try {
      const result = await this.dbfService.readDbf(this.currentFile, this.encoding);
      this.fields = result.fields;
      this.rows = result.rows;
    } catch (err: any) {
      this.error = err?.message || 'Failed to decode DBF.';
    }

    this.loading = false;
  }

  exportCSV() {
    if (!this.rows.length) return;

    const separator = ",";
    const newline = "\r\n";

    const escape = (value: any) => {
      if (value == null) return "";
      let str = String(value).replace(/"/g, '""');

      if (str.includes(",") || str.includes('"') || str.includes("\n"))
        str = `"${str}"`;

      return str;
    };

    const header = this.fields.map(escape).join(separator);
    const rows = this.rows
      .map(row => this.fields.map(f => escape(row[f])).join(separator))
      .join(newline);

    const csv = "\uFEFF" + header + newline + rows;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "dbf_export.csv";
    link.click();

    URL.revokeObjectURL(url);
  }
}

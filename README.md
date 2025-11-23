# DBF Viewer (Angular + Patched DBF Reader)

A clean, fast, and lightweight DBF viewer built with Angular and TailwindCSS.  
Includes automatic encoding detection, manual override, CSV export, and a patched DBF parser supporting nearly all legacy DBF formats.

## ⚡ Demo
A live demo can be added here (GitHub Pages):  
**https://msd96.github.io/DBF-Reader-with-multiple-encodings-support**

## 🔍 Features
- Automatic DBF encoding detection (jschardet)
- Manual encoding selector (cp866, win-1251, utf-8, latin1, koi8-r, etc.)
- CSV export with Excel‑safe UTF‑8 BOM
- Patched DBF parser supporting multiple DBF dialects
- Modern UI with dark/light theme switcher
- 100% client‑side — no backend required

## 🧩 Patched DBF Reader
The project includes a custom monkey‑patch applied over the original DBF reader library:

🔗 Original library:  
https://github.com/shubhgupta4u/dbf-reader

### Patch Improvements
- Proper handling of raw byte buffers
- Multi‑byte character decoding using iconv
- Stable and predictable column → value mapping
- Extended format compatibility across older DBF dialects

## 📂 Supported DBF Formats
- dBase III / dBase IV
- FoxPro / Visual FoxPro
- Clipper DBF
- xBase DBF
- OEM‑encoded DBFs (cp866, ibm855, ibm866)
- Windows‑encoded DBFs (win‑1251, win‑1250, win‑1252)
- Banking & financial DBFs
- COBOL‑style / legacy ERP DBFs
- Government / archival DBF systems

*Memo (.dbt) files are not parsed, but DBF records remain readable.*

## 🖼 Tech Stack
- Angular  
- TailwindCSS v3.4.x  
- TypeScript  
- jschardet  
- iconv-lite-umd  

## 📦 Installation
```
npm install
ng serve
```

## 📄 License
MIT License

## 🙏 Credits
- DBF parsing foundation: **shubhgupta4u/dbf-reader**  
- Patch, UI, multi‑encoding enhancements: **Muhammad (msd96)**  

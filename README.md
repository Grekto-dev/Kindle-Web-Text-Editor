# Kindle Text Editor

A lightweight, web-based text editor optimized for the Kindle experimental browser and modern desktop/mobile browsers.  
Save, load and share documents via a simple 6-character code—no user accounts, no local files required.

---

## 🚀 Project Overview

**Kindle Text Editor** lets you write and edit plain or rich text directly in your browser and store it on a central server. You don’t need to install anything or create an account:

- **Document Code**: Each document is identified by a unique 6-character code (e.g. `AB12CD`).
- **Cross-Device Sync**: Write on your PC, continue on your Kindle, then download back to your desktop.
- **No Files Locally**: All content lives on the server—just keep your code safe.

---

## 🔧 Current Stage

- **Alpha (v0.0.1)** — core editing, save/load, theming, i18n, and basic upload/download.
- **Disclaimer**: Documents are **not encrypted**; anyone with your code can view or overwrite your text. Use at your own risk. Security enhancements are planned for future releases.

---

## 📦 What’s in this Repo

```
/
├── backend/
│   └── index.js             # Express server (POST/GET/PUT/DELETE)
├── frontend/
│   └── index.html           # Editor UI with theming, i18n, code-based save/load
├── Dockerfile               # Builds a self-contained Docker image
├── package.json             # Node.js dependencies and start script
├── package-lock.json        # Locked dependency versions
├── .gitignore               # Excludes node_modules, backend/data/, etc.
└── README.md                # You are here
```

> **Note**: Do **not** commit `backend/data/`—it’s created at runtime inside the container.

---

## 🛠 Installation & Docker

1. **Clone the repo**  
   ```bash
   git clone https://github.com/Grekto-dev/Kindle-Web-Text-Editor.git
   cd Kindle-Web-Text-Editor
   ```

2. **Build the Docker image**  
   ```bash
   docker build -t kindle-editor .
   ```

3. **Run the container** (exposes container port 3000 on host port 3636)  
   ```bash
   docker run -d -p 3636:3000 --name kindle-editor kindle-editor
   ```

4. **Open the editor**  
   In any browser (desktop, mobile or Kindle), navigate to:  
   ```
   http://<YOUR-HOST-IP>:3636/
   ```
   On a local PC you can use `http://localhost:3636/`.

---

## ⚙️ Usage Highlights

- **New**: Clear the editor and start fresh.
- **Save**: Stores your text on the server—first save generates your document code.
- **Load**: Retrieve a saved document by entering its code.
- **Clear**: Delete all text in the editor (with confirmation).
- **Download**: Export the text as `.txt` or `.html` (best on PC).
- **Upload**: Import a `.txt` or `.html` file into the editor (modern browsers only).
- **Delete Document**: Permanently remove a saved document from the server.
- **Theme**: Toggle between light and dark modes.
- **Language**: Switch UI labels between Portuguese and English.

> **TIP:** On the Kindle browser, rely on the “Document Code” to sync—file upload/download may not work.

---

## 🔄 Port Configuration

By default, the Express server listens on port `3000` inside the container. We map it to **host port 3636** in the `docker run` command.  
If you need a different host port, just change the `-p` flag:
```bash
docker run -d -p YOUR_PORT:3000 --name kindle-editor kindle-editor
```

---

## 🧭 Next Steps
Planned improvements for upcoming versions include:

🔒 End-to-end encryption of saved documents

🗑️ Auto-expiration of unused or abandoned documents

🧩 Custom document titles and optional metadata

---

## ⚠️ Disclaimer

This is an alpha-stage open source project, intended for lightweight use only.
Use at your own risk. By default:

Documents are stored unencrypted on the server.

Anyone with your document code can view, edit, overwrite or delete your content.

There is no login, ownership system or recovery mechanism.

Please keep your document code secure and do not use this editor to store sensitive or private information. Security features will be introduced in future versions.

---

## 📜 License & Credits

Created by **Pedro Nogueira**
Feel free to fork, improve and contribute!

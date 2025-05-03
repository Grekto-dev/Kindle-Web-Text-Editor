const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function createDocumentFile() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateRandomCode();
    const txtPath = path.join(DATA_DIR, `${code}.txt`);
    try {
      const fd = fs.openSync(txtPath, 'wx');
      fs.closeSync(fd);
      return code;
    } catch (err) {
      if (err.code === 'EEXIST') {
        continue;
      }
      throw err;
    }
  }
  throw new Error('Unable to generate unique code after multiple attempts.');
}

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/documents', (req, res) => {
  try {
    const code = createDocumentFile();
    res.json({ code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/documents/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const filePathTxt = path.join(DATA_DIR, `${code}.txt`);
  if (!fs.existsSync(filePathTxt)) {
    return res.status(404).json({ error: 'Document not found' });
  }
  const content = fs.readFileSync(filePathTxt, 'utf-8');
  res.json({ content });
});

app.put('/documents/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const { content } = req.body;
  const filePathTxt = path.join(DATA_DIR, `${code}.txt`);
  if (!fs.existsSync(filePathTxt)) {
    return res.status(404).json({ error: 'Document not found' });
  }
  fs.writeFileSync(filePathTxt, content, 'utf-8');
  res.json({ success: true });
});

app.delete('/documents/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const filePathTxt = path.join(DATA_DIR, `${code}.txt`);
  if (!fs.existsSync(filePathTxt)) {
    return res.status(404).json({ error: 'Document not found' });
  }
  try {
    fs.unlinkSync(filePathTxt);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting file' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

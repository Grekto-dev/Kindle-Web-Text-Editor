// backend/index.js
// Servidor Express para armazenar documentos de texto via código de 6 caracteres

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

// Garante que a pasta data/ exista
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Gera código aleatório de 6 caracteres A-Z0-9
function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Cria um novo documento com código único
function createDocumentFile() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateRandomCode();
    const txtPath = path.join(DATA_DIR, `${code}.txt`);
    try {
      // 'wx' = write + exclusive: falha se existir
      const fd = fs.openSync(txtPath, 'wx');
      fs.closeSync(fd);
      return code;
    } catch (err) {
      if (err.code === 'EEXIST') {
        // colisão, tenta novamente
        continue;
      }
      // outro erro
      throw err;
    }
  }
  throw new Error('Não foi possível gerar código único após várias tentativas.');
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
// Serve arquivos estáticos do frontend (assumindo pasta ../frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Criar novo documento
app.post('/documents', (req, res) => {
  try {
    const code = createDocumentFile();
    res.json({ code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Ler conteúdo de um documento existente
app.get('/documents/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const filePathTxt = path.join(DATA_DIR, `${code}.txt`);
  if (!fs.existsSync(filePathTxt)) {
    return res.status(404).json({ error: 'Documento não encontrado' });
  }
  const content = fs.readFileSync(filePathTxt, 'utf-8');
  res.json({ content });
});

// Atualizar conteúdo de um documento
app.put('/documents/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const { content } = req.body;
  const filePathTxt = path.join(DATA_DIR, `${code}.txt`);
  if (!fs.existsSync(filePathTxt)) {
    return res.status(404).json({ error: 'Documento não encontrado' });
  }
  fs.writeFileSync(filePathTxt, content, 'utf-8');
  res.json({ success: true });
});

// Deletar documento
app.delete('/documents/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const filePathTxt = path.join(DATA_DIR, `${code}.txt`);
  if (!fs.existsSync(filePathTxt)) {
    return res.status(404).json({ error: 'Documento não encontrado' });
  }
  try {
    fs.unlinkSync(filePathTxt);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar o arquivo' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});

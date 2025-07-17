require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const pool = require('./db');
const convertToXML = require('./utils/xmlBuilder');
const validateXML = require('./validators/xmlValidator');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 3001;

app.post('/api/participant', async (req, res) => {
  const { fullName, birthDate, role, email, phone, source } = req.body;

  if (!fullName || !birthDate || !role || !email || !phone) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  const xml = convertToXML({ fullName, birthDate, role, email, phone });
  const validation = validateXML(xml);
  if (!validation.valid) {
    return res.status(400).json({
      error: 'XML не соответствует XSD-схеме',
      details: validation.errors.map(err => err.message)
    });
  }

  try {
    await pool.query(
      `INSERT INTO participants (full_name, birth_date, role, email, phone)
       VALUES ($1, $2, $3, $4, $5)`,
      [fullName, birthDate, role, email, phone]
    );
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email уже существует' });
    }
    return res.status(500).json({ error: 'Ошибка при сохранении в базу' });
  }

  const fileName = `participant_${Date.now()}.xml`;
  const xmlPath = path.join(__dirname, 'storage', fileName);
  fs.writeFileSync(xmlPath, xml);

  const forwardLogPath = path.join(__dirname, 'logs', 'forwarded.json');
  let forwarded = [];
  if (fs.existsSync(forwardLogPath)) {
    const content = fs.readFileSync(forwardLogPath, 'utf-8').trim();
    if (content) {
      forwarded = JSON.parse(content);
    }
  }

  if (source !== 'xml') {
    if (!forwarded.find(entry => entry.file === fileName)) {
      try {
        const savedXml = fs.readFileSync(xmlPath, 'utf-8');
        await axios.post('http://localhost:4001/api/xml', savedXml, {
          headers: { 'Content-Type': 'application/xml' }
        });
        forwarded.push({ file: fileName, sentAt: new Date().toISOString() });
        fs.writeFileSync(forwardLogPath, JSON.stringify(forwarded, null, 2));
        console.log(`✅ XML-файл ${fileName} переслан в XML-сервис`);
      } catch (err) {
        console.error('❌ Ошибка при пересылке XML в XML-сервис:', err.message);
      }
    }
  } else {
    console.log('📨 Участник пришёл из XML. Не пересылаем обратно.');
  }

  const journalPath = path.join(__dirname, 'logs', 'journal.json');
  let logs = [];
  if (fs.existsSync(journalPath)) {
    const content = fs.readFileSync(journalPath, 'utf-8').trim();
    if (content) logs = JSON.parse(content);
  }

  logs.push({
    timestamp: new Date().toISOString(),
    file: fileName,
    participant: { fullName, birthDate, role, email, phone }
  });
  fs.writeFileSync(journalPath, JSON.stringify(logs, null, 2));

  res.status(201).json({
    message: 'Участник создан, XML валиден',
    xmlPreview: xml,
    savedFile: fileName
  });
});

app.get('/api/journal', (req, res) => {
  const journalPath = path.join(__dirname, 'logs', 'journal.json');
  if (!fs.existsSync(journalPath)) return res.json([]);
  const raw = fs.readFileSync(journalPath, 'utf-8').trim();
  return res.json(raw ? JSON.parse(raw) : []);
});

app.get('/api/xml/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'storage', req.params.filename);
  if (fs.existsSync(filePath)) res.download(filePath);
  else res.status(404).json({ error: 'XML-файл не найден' });
});

app.listen(PORT, () => {
  console.log(`✅ JSON API запущен: http://localhost:${PORT}`);
});

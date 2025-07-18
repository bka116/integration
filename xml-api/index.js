require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const libxmljs = require('libxmljs2');
const { parseStringPromise } = require('xml2js');
const axios = require('axios');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 4001;
app.use(cors());
app.use(bodyParser.text({ type: 'application/xml' }));

const xsdPath = path.join(__dirname, 'participant.xsd');
const logsPath = path.join(__dirname, 'logs', 'journal.json');
const receivedDir = path.join(__dirname, 'received');

if (!fs.existsSync('logs')) fs.mkdirSync('logs');
if (!fs.existsSync('received')) fs.mkdirSync('received');

function validateXML(xmlString) {
  const xsd = fs.readFileSync(xsdPath, 'utf-8');
  const xsdDoc = libxmljs.parseXml(xsd);
  const xmlDoc = libxmljs.parseXml(xmlString);
  return {
    valid: xmlDoc.validate(xsdDoc),
    errors: xmlDoc.validationErrors
  };
}

// POST /api/xml
app.post('/api/xml', async (req, res) => {
  const xml = req.body;
  const result = validateXML(xml);
  if (!result.valid) {
    return res.status(400).json({
      error: 'XML не прошёл валидацию',
      details: result.errors.map(e => e.message)
    });
  }

  const fileName = `received_${Date.now()}.xml`;
  const filePath = path.join(receivedDir, fileName);
  fs.writeFileSync(filePath, xml);

  let participant;
  try {
    const json = await parseStringPromise(xml, { explicitArray: false });
    participant = json.Participant;
  } catch {
    return res.status(400).json({ error: 'Не удалось разобрать XML' });
  }

  try {
    await pool.query(
      `INSERT INTO xml_participants (full_name, birth_date, role, email, phone, xml_file_name)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        participant.FullName,
        participant.BirthDate,
        participant.Role,
        participant.Email,
        participant.Phone,
        fileName
      ]
    );
  } catch (e) {
    console.error('❌ Ошибка при сохранении в БД XML-сервиса:', e.message);
    return res.status(500).json({
      error: 'Ошибка при сохранении в БД XML-сервиса',
      details: e.message
    });
  }

  let logs = [];
  if (fs.existsSync(logsPath)) {
    const content = fs.readFileSync(logsPath, 'utf-8').trim();
    if (content) logs = JSON.parse(content);
  }

  logs.push({
    timestamp: new Date().toISOString(),
    file: fileName,
    participant
  });
  fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2));

  // Пересылаем в JSON-сервис (если источник не json)
  if (participant.Source !== 'json') {
    try {
      const jsonPayload = {
        fullName: participant.FullName,
        birthDate: participant.BirthDate,
        role: participant.Role,
        email: participant.Email,
        phone: participant.Phone,
        source: 'xml'
      };

      const forwardRes = await axios.post(
        'http://localhost:3001/api/participant',
        jsonPayload
      );

      return res.status(201).json({
        message: 'XML принят и переслан в JSON',
        responseFromPusk: forwardRes.data
      });

    } catch (err) {
      return res.status(500).json({
        error: 'XML сохранён, но не удалось переслать в JSON-сервис',
        details: err.message
      });
    }
  } else {
    console.log('📨 Участник пришёл из JSON, не пересылаем обратно.');
    return res.status(201).json({
      message: 'XML принят и сохранён (source: json)'
    });
  }
});

// GET /api/participants
app.get('/api/participants', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT full_name, birth_date, role, email, phone, xml_file_name, created_at
       FROM xml_participants ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении участников' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ XML API слушает на http://localhost:${PORT}`);
});

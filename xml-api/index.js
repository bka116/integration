require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const libxmljs = require('libxmljs2');
const { parseStringPromise } = require('xml2js');
const axios = require('axios');

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
  const isValid = xmlDoc.validate(xsdDoc);
  return {
    valid: isValid,
    errors: xmlDoc.validationErrors
  };
}

// POST /api/xml — принимает XML от другой системы
app.post('/api/xml', async (req, res) => {
  const xml = req.body;

  // 1. Валидация по XSD
  const result = validateXML(xml);
  if (!result.valid) {
    return res.status(400).json({
      error: 'XML не прошёл валидацию',
      details: result.errors.map(e => e.message)
    });
  }

  // 2. Сохраняем XML
  const fileName = `received_${Date.now()}.xml`;
  const filePath = path.join(receivedDir, fileName);
  fs.writeFileSync(filePath, xml);

  // 3. Парсим XML в JSON
  let participant;
  try {
    const json = await parseStringPromise(xml, { explicitArray: false });
    participant = json.Participant;
    console.log('📦 Данные из XML:', participant);

  } catch (e) {
    return res.status(400).json({ error: 'Не удалось разобрать XML' });
  }

  // 4. Логируем
  let logs = [];
try {
  if (fs.existsSync(logsPath)) {
    const raw = fs.readFileSync(logsPath, 'utf-8').trim();
    logs = raw ? JSON.parse(raw) : [];
  }
} catch (e) {
  console.warn('⚠️ journal.json повреждён, создаю заново.');
  logs = [];
}

// добавляем новую запись
logs.push({
  timestamp: new Date().toISOString(),
  file: fileName,
  participant
});

// сохраняем журнал
fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2));


  // 5. [опционально] — Отправляем в JSON-сервис (ПУСК)
  try {
    const jsonPayload = {
      fullName: participant.FullName,
      birthDate: participant.BirthDate,
      role: participant.Role,
      email: participant.Email,
      phone: participant.Phone
    };

    const forwardRes = await axios.post(
      'http://localhost:3001/api/participant',
      jsonPayload
    );

    return res.status(201).json({
      message: 'XML принят, провалидирован и переслан в JSON-сервис',
      responseFromPusk: forwardRes.data
    });

  } catch (err) {
    return res.status(500).json({
      error: 'XML принят, но не удалось переслать в JSON-сервис',
      details: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ XML API слушает на http://localhost:${PORT}`);
});

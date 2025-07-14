require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const pool = require('./db');
const convertToXML = require('./utils/xmlBuilder');
const validateXML = require('./validators/xmlValidator');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

/**
 * API: создание участника
 */
app.post('/api/participant', async (req, res) => {
  const { fullName, birthDate, role, email, phone } = req.body;

  // Примитивная проверка
  if (!fullName || !birthDate || !role || !email || !phone) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  // 1. Генерация XML
  const xml = convertToXML({ fullName, birthDate, role, email, phone });

  // 2. Валидация по XSD
  const validation = validateXML(xml);

  if (!validation.valid) {
    return res.status(400).json({
      error: 'XML не соответствует XSD-схеме',
      details: validation.errors.map(err => err.message)
    });
  }

  try {
    // 3. Сохраняем в БД
    await pool.query(
      `INSERT INTO participants (full_name, birth_date, role, email, phone)
       VALUES ($1, $2, $3, $4, $5)`,
      [fullName, birthDate, role, email, phone]
    );

    // 4. Сохраняем XML в файл
    const fileName = `participant_${Date.now()}.xml`;
    const xmlPath = path.join(__dirname, 'storage', fileName);
    fs.writeFileSync(xmlPath, xml);

    // 5. Добавляем запись в журнал
    const logPath = path.join(__dirname, 'logs', 'journal.json');
    const logs = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath)) : [];

    logs.push({
      timestamp: new Date().toISOString(),
      file: fileName,
      participant: { fullName, birthDate, role, email, phone }
    });

    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

    // 6. Ответ
    return res.status(201).json({
      message: 'Участник создан, XML валиден',
      xmlPreview: xml,
      savedFile: fileName
    });

  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ error: 'Ошибка при сохранении в базу' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
});

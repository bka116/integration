require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');
const convertToXML = require('./utils/xmlBuilder');
const validateXML = require('./validators/xmlValidator');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

app.post('/api/participant', async (req, res) => {
  const { fullName, birthDate, role, email, phone } = req.body;

  if (!fullName || !birthDate || !role || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const xml = convertToXML({ fullName, birthDate, role, email, phone });
  const validation = validateXML(xml);

  if (!validation.valid) {
    return res.status(400).json({
      error: 'XML validation failed',
      details: validation.errors.map(e => e.message)
    });
  }

  try {
    await pool.query(
      `INSERT INTO participants (full_name, birth_date, role, email, phone)
       VALUES ($1, $2, $3, $4, $5)`,
      [fullName, birthDate, role, email, phone]
    );

    res.status(201).json({
      message: 'Участник создан и прошёл XSD-валидацию',
      xmlPreview: xml
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при сохранении в БД' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ JSON API слушает на http://localhost:${PORT}`);
});

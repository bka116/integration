import React, { useState } from 'react';
import { sendXml } from '../services/api';

export default function XmlFormEditor() {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    role: '',
    email: '',
    phone: ''
  });

  const [status, setStatus] = useState('');
  const [xmlPreview, setXmlPreview] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const buildXml = () => {
    return `
<Participant>
  <FullName>${formData.fullName}</FullName>
  <BirthDate>${formData.birthDate}</BirthDate>
  <Role>${formData.role}</Role>
  <Email>${formData.email}</Email>
  <Phone>${formData.phone}</Phone>
</Participant>`.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const xml = buildXml();
    setXmlPreview(xml);
    setStatus('⏳ Отправка...');

    try {
      const res = await sendXml(xml);
      setStatus('✅ XML принят и обработан');
    } catch (err) {
      const msg = err.response?.data?.error || 'Ошибка';
      setStatus(`❌ ${msg}`);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Создание участника (XML)</h2>
      <form onSubmit={handleSubmit}>
        {[
          ['fullName', 'ФИО'],
          ['birthDate', 'Дата рождения'],
          ['role', 'Роль'],
          ['email', 'Email'],
          ['phone', 'Телефон']
        ].map(([name, label]) => (
          <div key={name} style={{ marginBottom: '1rem' }}>
            <label>{label}</label>
            <input
              name={name}
              type={name === 'birthDate' ? 'date' : 'text'}
              value={formData[name]}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8 }}
            />
          </div>
        ))}
        <button type="submit">Отправить</button>
      </form>

      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}

      {xmlPreview && (
        <pre style={{
          marginTop: 16, padding: 10, background: '#f4f4f4',
          border: '1px solid #ccc', whiteSpace: 'pre-wrap'
        }}>{xmlPreview}</pre>
      )}
    </div>
  );
}

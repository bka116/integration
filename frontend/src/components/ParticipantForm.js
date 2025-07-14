import React, { useState } from 'react';
import axios from 'axios';

export default function ParticipantForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    role: '',
    email: '',
    phone: ''
  });

  const [status, setStatus] = useState('');
  const [xml, setXml] = useState('');

  // отображаемые подписи для каждого поля
  const fieldLabels = {
    fullName: 'ФИО',
    birthDate: 'Дата рождения',
    role: 'Роль',
    email: 'Email',
    phone: 'Телефон'
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('⏳ Отправка...');
    try {
      const res = await axios.post('http://localhost:3001/api/participant', formData);
      setStatus('✅ Участник успешно создан!');
      setXml(res.data.xmlPreview);
    } catch (err) {
      const errorText = err.response?.data?.error || 'Ошибка отправки';
      setStatus('❌ ' + errorText);
      setXml('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Создание участника</h2>

      {Object.keys(fieldLabels).map((field) => (
        <div key={field} style={{ marginBottom: '1rem' }}>
          <label htmlFor={field} style={{ display: 'block', marginBottom: 4 }}>
            {fieldLabels[field]}
          </label>
          <input
            type={field === 'birthDate' ? 'date' : 'text'}
            name={field}
            id={field}
            value={formData[field]}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, fontSize: 14 }}
          />
        </div>
      ))}

      <button type="submit" style={{
        padding: '10px 20px',
        background: '#2566E8',
        color: 'white',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer'
      }}>
        Отправить
      </button>

      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}

      {xml && (
        <pre style={{
          marginTop: 16, padding: 12,
          background: '#f4f4f4',
          border: '1px solid #ccc',
          fontSize: 13,
          whiteSpace: 'pre-wrap'
        }}>{xml}</pre>
      )}
    </form>
  );
}

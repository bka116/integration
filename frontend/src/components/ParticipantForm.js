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

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('⏳ Отправка...');
    try {
      const res = await axios.post('http://localhost:3001/api/participant', formData);
      setStatus('✅ Участник создан!');
      setXml(res.data.xmlPreview);
    } catch (err) {
      const errorText = err.response?.data?.error || 'Ошибка отправки';
      setStatus('❌ ' + errorText);
      setXml('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
      {['fullName', 'birthDate', 'role', 'email', 'phone'].map((field) => (
        <div key={field} style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: 4 }}>{field}:</label>
          <input
            type={field === 'birthDate' ? 'date' : 'text'}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
      ))}
      <button type="submit" style={{ padding: '8px 16px' }}>Создать</button>

      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
      {xml && (
        <pre style={{
          marginTop: 16, padding: 10,
          background: '#f4f4f4', border: '1px solid #ccc',
          whiteSpace: 'pre-wrap'
        }}>{xml}</pre>
      )}
    </form>
  );
}

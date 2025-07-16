import React, { useState } from 'react';
import { sendXml } from '../services/api';

export default function XmlUploader() {
  const [status, setStatus] = useState('');
  const [xmlText, setXmlText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('⏳ Отправка...');
    try {
      const res = await sendXml(xmlText);
      setStatus('✅ XML принят и обработан');
      console.log(res.data);
    } catch (err) {
      const msg = err.response?.data?.error || 'Ошибка отправки';
      setStatus(`❌ ${msg}`);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Загрузка XML участника</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={12}
          value={xmlText}
          onChange={(e) => setXmlText(e.target.value)}
          placeholder="<Participant>...</Participant>"
          style={{ width: '100%', fontFamily: 'monospace' }}
        />
        <button type="submit" style={{ marginTop: '1rem' }}>
          Отправить XML
        </button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ParticipantTable() {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchJournal = async () => {
      const res = await axios.get('http://localhost:3001/api/journal');
      setParticipants(res.data);
    };
    fetchJournal();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h2>Добавленные участники</h2>
      {participants.length === 0 ? (
        <p>Нет записей</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>XML</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((entry, index) => (
              <tr key={index}>
                <td>{entry.participant.fullName}</td>
                <td>{entry.participant.email}</td>
                <td>{entry.participant.phone}</td>
                <td>
                  {entry.file ? (
                    <a href={`http://localhost:3001/api/xml/${entry.file}`} download>
                      Скачать XML
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

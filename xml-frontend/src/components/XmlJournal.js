import React, { useEffect, useState } from 'react';
import { fetchJournal } from '../services/api';

export default function XmlJournal() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetchJournal();
      setEntries(res.data);
    };
    load();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h2>Журнал принятых участников</h2>
      {entries.length === 0 ? (
        <p>Нет записей</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>XML</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={i}>
                <td>{entry.participant?.FullName}</td>
                <td>{entry.participant?.Email}</td>
                <td>{entry.participant?.Phone}</td>
                <td>
                  <a
                    href={`http://localhost:4001/received/${entry.file}`}
                    download
                  >
                    Скачать
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

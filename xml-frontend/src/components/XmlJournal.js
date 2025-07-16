import React, { useEffect, useState } from 'react';
import { fetchParticipants } from '../services/api';

export default function XmlJournal() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetchParticipants();
      setEntries(res.data);
    };
    load();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h2>Участники, сохранённые в БД</h2>
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
              <th>Создан</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={i}>
                <td>{entry.full_name}</td>
                <td>{entry.email}</td>
                <td>{entry.phone}</td>
                <td>
                  {entry.xml_file_name ? (
                    <a
                      href={`http://localhost:4001/received/${entry.xml_file_name}`}
                      download
                    >
                      Скачать
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td>{new Date(entry.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

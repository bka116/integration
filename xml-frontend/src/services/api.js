import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4001/api',
});

export const sendXml = (xmlString) =>
  API.post('/xml', xmlString, {
    headers: { 'Content-Type': 'application/xml' },
  });

export const fetchJournal = () => API.get('/journal');

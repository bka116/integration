import React from 'react';
import ParticipantForm from './components/ParticipantForm';
import ParticipantTable from './components/ParticipantTable';

function App() {
  return (
    <div style={{ padding: 32 }}>
      <ParticipantForm />
      <hr style={{ margin: '2rem 0' }} />
      <ParticipantTable />
    </div>
  );
}

export default App;

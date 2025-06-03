import React from 'react';
import Container from '@mui/material/Container';
import CharacterTable from './components/CharacterTable/CharacterTable';

const App: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <h1>Rick and Morty Karakter Tablosu</h1>
      <CharacterTable />
    </Container>
  );
};

export default App; 
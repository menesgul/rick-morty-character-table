// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import CharacterTable from './components/CharacterTable/CharacterTable';
import { useAppDispatch } from './store/hooks';
import { setFilters, setPage } from './features/characters/characterSlice';

// URL yönetimi için özel bir komponent
const CharacterTableWithUrl: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL'den filtreleri ve sayfa numarasını al
  React.useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    const filters = {
      name: searchParams.get('name') || '',
      status: searchParams.get('status') || '',
      species: searchParams.get('species') || '',
      gender: searchParams.get('gender') || '',
    };

    dispatch(setPage(page));
    dispatch(setFilters(filters));
  }, [searchParams, dispatch]);

  return <CharacterTable />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <h1>🧬 Interdimensional Character Archive</h1>
        <Routes>
          <Route path="/" element={<CharacterTableWithUrl />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCharacters, setSelectedCharacter, setPage, setSort } from '../../features/characters/characterSlice';
import FilterPanel from '../FilterPanel/FilterPanel';
import Pagination from '../Pagination/Pagination';
import CharacterDetail from '../CharacterDetail/CharacterDetail';
import { Character } from '../../types/character';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'İsim' },
  { key: 'status', label: 'Durum' },
  { key: 'species', label: 'Tür' },
  { key: 'gender', label: 'Cinsiyet' },
  { key: 'location', label: 'Lokasyon' },
];

const CharacterTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { characters, loading, error, filters, page, totalPages, selectedCharacter, sort } = useAppSelector((state) => state.characters);

  useEffect(() => {
    dispatch(fetchCharacters());
  }, [dispatch, filters, page]);

  const handleSort = (field: string) => {
    const typedField = field as keyof Character | '';
    if (sort.field === typedField) {
      dispatch(setSort({ field: typedField, direction: sort.direction === 'asc' ? 'desc' : 'asc' }));
    } else {
      dispatch(setSort({ field: typedField, direction: 'asc' }));
    }
  };

  // Sıralama sadece client-side (API sıralama desteği yok)
  const sortedCharacters = React.useMemo(() => {
    if (!sort.field) return characters;
    return [...characters].sort((a, b) => {
      let aValue = a[sort.field as keyof typeof a];
      let bValue = b[sort.field as keyof typeof b];
      if (sort.field === 'location') {
        aValue = (a.location as any).name;
        bValue = (b.location as any).name;
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [characters, sort]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div>
      <h2>Karakter Tablosu</h2>
      <FilterPanel />
      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => dispatch(setPage(p))} />
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                {sort.field === col.key && (sort.direction === 'asc' ? ' ▲' : ' ▼')}
              </th>
            ))}
            <th>Görsel</th>
          </tr>
        </thead>
        <tbody>
          {sortedCharacters.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: 24 }}>
                Filtreye uygun veri bulunamadı.
              </td>
            </tr>
          ) : (
            sortedCharacters.map((char) => (
              <tr key={char.id} onClick={() => dispatch(setSelectedCharacter(char))} style={{ cursor: 'pointer' }}>
                <td>{char.id}</td>
                <td>{char.name}</td>
                <td>{char.status}</td>
                <td>{char.species}</td>
                <td>{char.gender}</td>
                <td>{char.location.name}</td>
                <td><img src={char.image} alt={char.name} width={40} height={40} /></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => dispatch(setPage(p))} />
      <CharacterDetail character={selectedCharacter} />
    </div>
  );
};

export default CharacterTable; 
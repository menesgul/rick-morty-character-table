import React, { useEffect, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCharacters, setSelectedCharacter, setPage, setSort } from '../../features/characters/characterSlice';
import FilterPanel from '../FilterPanel/FilterPanel';
import Pagination from '../Pagination/Pagination';
import CharacterDetail from '../CharacterDetail/CharacterDetail';
import { Character } from '../../types/character';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// Define table columns with their labels and sort indicators
const columns = [
  { key: 'id', label: 'ID ⬍' },
  { key: 'name', label: 'Name ⬍' },
  { key: 'status', label: 'Status ⬍' },
  { key: 'species', label: 'Species ⬍' },
  { key: 'gender', label: 'Gender ⬍' },
  { key: 'location', label: 'Location ⬍' },
];

// Memoized table row component for better performance
// Handles individual character row display with hover effects on image
const TableRow = React.memo(({ char, onSelect }: { char: Character; onSelect: (char: Character) => void }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <tr onClick={() => onSelect(char)} style={{ cursor: 'pointer' }}>
      <td>{char.id}</td>
      <td>{char.name}</td>
      <td>{char.status === 'unknown' ? 'Unknown' : char.status}</td>
      <td>{char.species === 'unknown' ? 'Unknown' : char.species}</td>
      <td>{char.gender === 'unknown' ? 'Unknown' : char.gender}</td>
      <td>{char.location.name}</td>
      <td>
        <img
          src={char.image}
          alt={char.name}
          style={{
            width: isHovered ? '90px' : '50px',
            height: isHovered ? '90px' : '50px',
            transition: 'width 0.3s ease-in-out, height 0.3s ease-in-out', // Yumuşak geçiş için
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          loading="lazy"
        />
      </td>
    </tr>
  );
});

// Main CharacterTable component
const CharacterTable: React.FC = () => {
  // Get state and dispatch from Redux store
  const dispatch = useAppDispatch();
  const { characters, loading, filters, page, totalPages, selectedCharacter, sort } = useAppSelector((state) => state.characters);

  // Fetch characters when page or filters change
  useEffect(() => {
    dispatch(fetchCharacters());
  }, [dispatch, filters, page]);

  // Handle column sorting logic
  const handleSort = useCallback((field: string) => {
    const typedField = field as keyof Character | '';
    if (sort.field === typedField) {
      dispatch(setSort({ field: typedField, direction: sort.direction === 'asc' ? 'desc' : 'asc' }));
    } else {
      dispatch(setSort({ field: typedField, direction: 'asc' }));
    }
  }, [dispatch, sort]);

  // Client-side sorting implementation
  // Sorts characters based on selected field and direction
  const sortedCharacters = useMemo(() => {
    let list = [...characters];
    if (sort.field) {
      list.sort((a, b) => {
        let aValue = a[sort.field as keyof typeof a];
        let bValue = b[sort.field as keyof typeof b];
        if (sort.field === 'location') {
          aValue = a.location.name;
          bValue = b.location.name;
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sort.direction === 'asc'
            ? aValue.localeCompare(bValue, 'tr')
            : bValue.localeCompare(aValue, 'tr');
        }
        return 0;
      });
    }
    return list;
  }, [characters, sort]);

  // Close character detail dialog
  const handleCloseDetail = useCallback(() => {
    dispatch(setSelectedCharacter(null));
  }, [dispatch]);

  // Handle pagination
  const handlePageChange = useCallback((newPage: number) => {
    dispatch(setPage(newPage));
  }, [dispatch]);

  return (
    <div className="character-table-container">
      {/* Filter panel for character filtering */}
      <FilterPanel />
      {/* Top pagination controls */}
      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />

      {/* Main table container with responsive design */}
      <div className="table-responsive" style={{ display: 'flex', justifyContent: 'center' }}>
        <table>
          {/* Table header with sortable columns */}
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                onClick={() => handleSort(col.key)}
                className={`sortable-header ${sort.field === col.key ? 'active' : ''}`}
                title="Click to sort"
                >
                  {col.label}
                  {(sort.field === col.key || col.key === 'id') && (
                     <span className="sort-indicator">
                     {sort.field === col.key ? (sort.direction === 'asc' ? '▲' : '▼') : ''}
                   </span>
                  )}
                </th>
              ))}
              <th>Icon</th>
            </tr>
          </thead>
          <tbody>
            {/* Loading state display */}
            {loading ? (
              <tr>
                <td colSpan={7} className="no-data">
                  Yükleniyor...
                </td>
              </tr>
            ) : sortedCharacters.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-data">
                  Filtreye uygun veri bulunamadı.
                </td>
              </tr>
            ) : (
              sortedCharacters.map((char) => (
                <TableRow
                  key={char.id}
                  char={char}
                  onSelect={(char) => dispatch(setSelectedCharacter(char))}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom pagination controls */}
      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />

      {/* Character detail dialog */}
      <Dialog open={!!selectedCharacter} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
        <IconButton
          aria-label="close"
          onClick={handleCloseDetail}
          sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
        >
          <CloseIcon />
        </IconButton>
        <div className="dialog-content"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
        >
          <CharacterDetail character={selectedCharacter} />
        </div>
      </Dialog>
    </div>
  );
};

// Memoize the entire component for performance optimization
export default React.memo(CharacterTable);
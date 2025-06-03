import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setFilters } from '../../features/characters/characterSlice';

const statusOptions = ['', 'Alive', 'Dead', 'Unknown'];
const genderOptions = ['', 'Female', 'Male', 'Genderless', 'Unknown'];

const FilterPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.characters.filters);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLocalFilters({ ...localFilters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    dispatch(setFilters(localFilters));
  };

  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
      <input
        type="text"
        name="name"
        placeholder="İsim"
        value={localFilters.name}
        onChange={handleChange}
      />
      <select name="status" value={localFilters.status} onChange={handleChange}>
        {statusOptions.map((opt) => (
          <option key={opt} value={opt}>{opt || 'Tümü (Durum)'}</option>
        ))}
      </select>
      <input
        type="text"
        name="species"
        placeholder="Tür"
        value={localFilters.species}
        onChange={handleChange}
      />
      <select name="gender" value={localFilters.gender} onChange={handleChange}>
        {genderOptions.map((opt) => (
          <option key={opt} value={opt}>{opt || 'Tümü (Cinsiyet)'}</option>
        ))}
      </select>
      <button onClick={handleApply}>Filtrele</button>
    </div>
  );
};

export default FilterPanel; 
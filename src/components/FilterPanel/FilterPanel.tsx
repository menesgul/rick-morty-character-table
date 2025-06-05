import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setFilters, setPage, setPageSize } from '../../features/characters/characterSlice';
import './FilterPanel.css';

// Define filter options as constants
const statusOptions = ['', 'Alive', 'Dead', 'Unknown'];
const genderOptions = ['', 'Female', 'Male', 'Genderless', 'Unknown'];
const pageSizeOptions = [10, 15, 20];

// FilterPanel component for handling character filtering and pagination
const FilterPanel: React.FC = () => {
  // Get dispatch and state from Redux store
  const dispatch = useAppDispatch();
  const { filters, pageSize } = useAppSelector((state) => state.characters);

  // Local state for managing filter inputs before applying
  const [localFilters, setLocalFilters] = useState({
    name: filters.name || '',
    status: filters.status || '',
    species: filters.species || '',
    gender: filters.gender || '',
  });

  // Handle input changes for all filter fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'pageSize') {
      // Update page size directly in Redux
      dispatch(setPageSize(Number(value)));
    } else {
      // Update local filter state
      setLocalFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Apply filters and reset to first page
  const handleApply = () => {
    dispatch(setPage(1)); // Reset to first page
    dispatch(setFilters(localFilters)); // Apply filters to Redux store
  };

  // Clear all filters and reset to initial state
  const handleClear = () => {
    const empty = { name: '', status: '', species: '', gender: '' };
    setLocalFilters(empty);
    dispatch(setPage(1)); // Reset to first page
    dispatch(setFilters(empty)); // Clear filters in Redux store
  };

  return (
    <div className="filter-panel">
      <div className="filter-grid">
        {/* Name search input */}
        <input
          type="text"
          name="name"
          placeholder="Search name..."
          value={localFilters.name}
          onChange={handleChange}
          className="filter-input"
        />
        {/* Status filter dropdown */}
        <select
          name="status"
          value={localFilters.status}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          {statusOptions.slice(1).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {/* Species search input */}
        <input
          type="text"
          name="species"
          placeholder="Search Species..."
          value={localFilters.species}
          onChange={handleChange}
          className="filter-input"
        />
        {/* Gender filter dropdown */}
        <select
          name="gender"
          value={localFilters.gender}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">All Genders</option>
          {genderOptions.slice(1).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {/* Page size selector */}
        <select
          name="pageSize"
          value={pageSize}
          onChange={handleChange}
          className="filter-select"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} output
            </option>
          ))}
        </select>
        {/* Filter action buttons */}
        <div className="filter-button-group">
          <button onClick={handleApply} className="filter-button">Filter</button>
          <button onClick={handleClear} className="clear-button">Clear</button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
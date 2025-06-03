import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
      <button onClick={handlePrev} disabled={page === 1}>Önceki</button>
      <span>Sayfa {page} / {totalPages}</span>
      <button onClick={handleNext} disabled={page === totalPages}>Sonraki</button>
    </div>
  );
};

export default Pagination; 
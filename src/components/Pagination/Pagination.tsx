// Import React for component creation
import React from 'react';

// Define props interface for the Pagination component
// Props include current page, total pages, and page change handler
interface PaginationProps {
  page: number;          // Current page number
  totalPages: number;    // Total number of pages
  onPageChange: (page: number) => void;  // Callback function for page changes
}

// Pagination component for navigating between pages
// Renders previous/next buttons and current page indicator
const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) return null;

  // Handler for previous page navigation
  // Only allows navigation if not on first page
  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  // Handler for next page navigation
  // Only allows navigation if not on last page
  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  // Render pagination controls with flex layout
  return (
    <div style={{ display: 'flex', gap: 8, margin: '16px 0', alignItems: 'center' }}>
      {/* Previous page button - disabled when on first page */}
      <button onClick={handlePrev} disabled={page === 1}>Previous</button>
      
      {/* Current page indicator showing page numbers */}
      <span>Page {page} / {totalPages}</span>
      
      {/* Next page button - disabled when on last page */}
      <button onClick={handleNext} disabled={page === totalPages}>Next</button>
    </div>
  );
};

// Export the Pagination component
export default Pagination; 
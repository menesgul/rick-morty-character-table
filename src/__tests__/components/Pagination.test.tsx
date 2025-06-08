import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../utils/testUtils';
import Pagination from '../../components/Pagination/Pagination';

describe('Pagination Component', () => {
  const mockOnPageChange = jest.fn();
  
  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('sayfa numaralarını doğru gösterir', () => {
    renderWithProviders(
      <Pagination page={2} totalPages={5} onPageChange={mockOnPageChange} />
    );
    
    expect(screen.getByText('Page 2 / 5')).toBeInTheDocument();
  });

  it('tek sayfa durumunda render olmaz', () => {
    const { container } = renderWithProviders(
      <Pagination page={1} totalPages={1} onPageChange={mockOnPageChange} />
    );
    
    expect(container).toBeEmptyDOMElement();
  });

  it('önceki sayfa butonunu doğru şekilde yönetir', () => {
    renderWithProviders(
      <Pagination page={2} totalPages={5} onPageChange={mockOnPageChange} />
    );
    
    const prevButton = screen.getByText('Previous');
    expect(prevButton).not.toBeDisabled();
    
    fireEvent.click(prevButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('sonraki sayfa butonunu doğru şekilde yönetir', () => {
    renderWithProviders(
      <Pagination page={2} totalPages={5} onPageChange={mockOnPageChange} />
    );
    
    const nextButton = screen.getByText('Next');
    expect(nextButton).not.toBeDisabled();
    
    fireEvent.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('ilk sayfada önceki buton devre dışıdır', () => {
    renderWithProviders(
      <Pagination page={1} totalPages={5} onPageChange={mockOnPageChange} />
    );
    
    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
    expect(prevButton).toHaveStyle({ opacity: '0.5' });
  });

  it('son sayfada sonraki buton devre dışıdır', () => {
    renderWithProviders(
      <Pagination page={5} totalPages={5} onPageChange={mockOnPageChange} />
    );
    
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
    expect(nextButton).toHaveStyle({ opacity: '0.5' });
  });

  it('stil özelliklerini doğru uygular', () => {
    renderWithProviders(
      <Pagination page={2} totalPages={5} onPageChange={mockOnPageChange} />
    );
    
    const container = screen.getByText('Page 2 / 5').parentElement;
    expect(container).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '16px',
      margin: '24px 0'
    });
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveStyle({
        minWidth: '100px'
      });
    });
  });
}); 
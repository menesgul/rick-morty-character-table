import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders, mockFilters } from '../utils/testUtils';
import FilterPanel from '../../components/FilterPanel/FilterPanel';

describe('FilterPanel Component', () => {
  it('tüm filtre alanlarını render eder', () => {
    renderWithProviders(<FilterPanel />);
    
    // Filtre alanlarının varlığını kontrol et
    expect(screen.getByPlaceholderText('Search name...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Species...')).toBeInTheDocument();
    expect(screen.getByText('All Statuses')).toBeInTheDocument();
    expect(screen.getByText('All Genders')).toBeInTheDocument();
  });

  it('filtre değişikliklerini işler', () => {
    const { store } = renderWithProviders(<FilterPanel />);
    
    // İsim filtresini değiştir
    const nameInput = screen.getByPlaceholderText('Search name...');
    fireEvent.change(nameInput, { target: { value: 'Rick' } });
    
    // Status filtresini değiştir
    const statusSelect = screen.getByText('All Statuses');
    fireEvent.change(statusSelect, { target: { value: 'Alive' } });
    
    // Filter butonuna tıkla
    const filterButton = screen.getByText('Filter');
    fireEvent.click(filterButton);
    
    // Store'daki filtre durumunu kontrol et
    expect(store.getState().characters.filters).toEqual({
      ...mockFilters,
      name: 'Rick',
      status: 'Alive'
    });
  });

  it('filtreleri temizler', () => {
    const { store } = renderWithProviders(<FilterPanel />, {
      preloadedState: {
        characters: {
          filters: {
            name: 'Rick',
            status: 'Alive',
            species: 'Human',
            gender: 'Male'
          }
        }
      }
    });
    
    // Clear butonuna tıkla
    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);
    
    // Store'daki filtrelerin temizlendiğini kontrol et
    expect(store.getState().characters.filters).toEqual(mockFilters);
  });

  it('sayfa boyutunu değiştirir', () => {
    const { store } = renderWithProviders(<FilterPanel />);
    
    // Sayfa boyutu seçicisini bul ve değiştir
    const pageSizeSelect = screen.getByRole('combobox', { name: /output/i });
    fireEvent.change(pageSizeSelect, { target: { value: '15' } });
    
    // Store'daki sayfa boyutunun değiştiğini kontrol et
    expect(store.getState().characters.pageSize).toBe(15);
  });

  it('responsive tasarımı test eder', () => {
    // Viewport'u küçült
    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));
    
    renderWithProviders(<FilterPanel />);
    
    // Mobil görünümde butonların dikey sıralandığını kontrol et
    const filterButton = screen.getByText('Filter');
    const clearButton = screen.getByText('Clear');
    
    expect(filterButton.parentElement).toHaveStyle({
      flexDirection: 'column'
    });
  });
}); 
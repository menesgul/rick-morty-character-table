import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, mockCharacter, mockApiResponse, mockFilters } from '../utils/testUtils';
import CharacterTable from '../../components/CharacterTable/CharacterTable';
import { setFilters, setSort, setPage } from '../../features/characters/characterSlice';
import axios from 'axios';

// Axios mock
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CharacterTable Component', () => {
  beforeEach(() => {
    // Her test öncesi mock'ları sıfırla
    jest.clearAllMocks();
    // API yanıtını mock'la
    mockedAxios.get.mockResolvedValue({ data: mockApiResponse });
  });

  it('karakter tablosunu başarıyla render eder', async () => {
    const { store } = renderWithProviders(<CharacterTable />);
    
    // Loading durumunu kontrol et
    expect(screen.getByText('Yükleniyor...')).toBeInTheDocument();
    
    // Verilerin yüklenmesini bekle
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });
  });

  it('filtreleme işlevini test eder', async () => {
    const { store } = renderWithProviders(<CharacterTable />);
    
    // Filtreleme işlemini tetikle
    store.dispatch(setFilters({ ...mockFilters, name: 'Rick' }));
    
    // API çağrısının doğru parametrelerle yapıldığını kontrol et
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('name=Rick')
      );
    });
  });

  it('sıralama işlevini test eder', async () => {
    const { store } = renderWithProviders(<CharacterTable />);
    
    // Sıralama başlığına tıkla
    const nameHeader = screen.getByText('Name ⬍');
    fireEvent.click(nameHeader);
    
    // Store'daki sıralama durumunu kontrol et
    expect(store.getState().characters.sort).toEqual({
      field: 'name',
      direction: 'asc'
    });
  });

  it('sayfalama işlevini test eder', async () => {
    const { store } = renderWithProviders(<CharacterTable />);
    
    // Sayfa değiştirme işlemini tetikle
    store.dispatch(setPage(2));
    
    // API çağrısının doğru sayfa ile yapıldığını kontrol et
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('page=2')
      );
    });
  });

  it('karakter detay modalını açar', async () => {
    const { store } = renderWithProviders(<CharacterTable />);
    
    // Verilerin yüklenmesini bekle
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });
    
    // Karakter satırına tıkla
    fireEvent.click(screen.getByText('Rick Sanchez'));
    
    // Modal içeriğini kontrol et
    expect(screen.getByText('Character Detail')).toBeInTheDocument();
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('Species:')).toBeInTheDocument();
  });

  it('hata durumunu gösterir', async () => {
    // API hatasını mock'la
    mockedAxios.get.mockRejectedValue(new Error('API Error'));
    
    renderWithProviders(<CharacterTable />);
    
    // Hata mesajının gösterildiğini kontrol et
    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });

    // Hata durumunda tablo içeriğinin boş olduğunu kontrol et
    expect(screen.queryByText('Rick Sanchez')).not.toBeInTheDocument();
  });

  it('sıralama işlevini doğru şekilde yönetir', async () => {
    // Mock API yanıtını ayarla
    const mockCharacters = [
      { ...mockCharacter, id: 1, name: 'Zebra' },
      { ...mockCharacter, id: 2, name: 'Alpha' },
      { ...mockCharacter, id: 3, name: 'Beta' }
    ];

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        info: { count: 3, pages: 1 },
        results: mockCharacters
      }
    });

    renderWithProviders(<CharacterTable />);

    // Karakterlerin yüklenmesini bekle
    await waitFor(() => {
      expect(screen.getByText('Zebra')).toBeInTheDocument();
    });

    // İsim sütununa tıkla (ilk tıklama - artan sıralama)
    const nameHeader = screen.getByText('Name ⬍');
    fireEvent.click(nameHeader);

    // Artan sıralama kontrolü
    await waitFor(() => {
      const rows = screen.getAllByRole('row').slice(1); // Header'ı hariç tut
      const names = rows.map(row => row.querySelector('td:nth-child(2)')?.textContent);
      expect(names).toEqual(['Alpha', 'Beta', 'Zebra']);
    });

    // İsim sütununa tekrar tıkla (ikinci tıklama - azalan sıralama)
    fireEvent.click(nameHeader);

    // Azalan sıralama kontrolü
    await waitFor(() => {
      const rows = screen.getAllByRole('row').slice(1);
      const names = rows.map(row => row.querySelector('td:nth-child(2)')?.textContent);
      expect(names).toEqual(['Zebra', 'Beta', 'Alpha']);
    });

    // ID sütununa tıkla (farklı sütun - artan sıralama)
    const idHeader = screen.getByText('ID ⬍');
    fireEvent.click(idHeader);

    // ID'ye göre artan sıralama kontrolü
    await waitFor(() => {
      const rows = screen.getAllByRole('row').slice(1);
      const ids = rows.map(row => row.querySelector('td:first-child')?.textContent);
      expect(ids).toEqual(['1', '2', '3']);
    });
  });

  it('karakter detay dialogunu doğru şekilde yönetir', async () => {
    renderWithProviders(<CharacterTable />);
    
    // İlk sayfa yüklendiğinde karakterlerin geldiğini bekle
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    // Karakter satırına tıkla
    const characterRow = screen.getByText('Rick Sanchez').closest('tr');
    fireEvent.click(characterRow!);

    // Dialog'un açıldığını ve karakter detaylarının gösterildiğini kontrol et
    await waitFor(() => {
      const dialog = screen.getByTestId('character-detail-dialog');
      expect(dialog).toBeInTheDocument();
      expect(screen.getByText('Character Detail')).toBeInTheDocument();
    });

    // Kapatma butonuna tıkla
    const closeButton = screen.getByLabelText('close');
    fireEvent.click(closeButton);

    // Dialog'un kapandığını kontrol et
    await waitFor(() => {
      expect(screen.queryByTestId('character-detail-dialog')).not.toBeInTheDocument();
    });
  });

  it('sayfalama işlevini doğru şekilde yönetir', async () => {
    // İlk sayfa için mock veri
    const firstPageData = {
      info: { count: 40, pages: 2 },
      results: [
        { ...mockCharacter, id: 1, name: 'Rick Sanchez' },
        { ...mockCharacter, id: 2, name: 'Morty Smith' }
      ]
    };

    // İkinci sayfa için mock veri
    const secondPageData = {
      info: { count: 40, pages: 2 },
      results: [
        { ...mockCharacter, id: 3, name: 'Summer Smith' },
        { ...mockCharacter, id: 4, name: 'Beth Smith' }
      ]
    };

    // API çağrılarını mock'la ve sadece gerekli sayfaları yanıtla
    mockedAxios.get.mockImplementation((url) => {
      // URL'den sayfa numarasını çıkar
      const pageMatch = url.match(/page=(\d+)/);
      const page = pageMatch ? parseInt(pageMatch[1]) : 1;

      // Sadece test için gerekli sayfaları yanıtla
      if (page === 1) {
        return Promise.resolve({ data: firstPageData });
      }
      if (page === 2) {
        return Promise.resolve({ data: secondPageData });
      }
      // Diğer tüm sayfalar için boş veri döndür
      return Promise.resolve({
        data: {
          info: { count: 40, pages: 2 },
          results: []
        }
      });
    });

    const { store } = renderWithProviders(<CharacterTable />);

    // İlk sayfanın yüklendiğini kontrol et
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    });

    // Sayfalama kontrollerinin görünür olduğunu kontrol et
    const nextButtons = screen.getAllByTestId('pagination-next-button');
    const nextButton = nextButtons[0];
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).not.toBeDisabled();

    // Sayfa bilgisini kontrol et
    const pageInfos = screen.getAllByTestId('pagination-page-info');
    const pageInfo = pageInfos[0];
    expect(pageInfo).toHaveTextContent('Page 1 / 2');

    // Sonraki sayfaya geç
    fireEvent.click(nextButton);

    // İkinci sayfanın yüklendiğini kontrol et
    await waitFor(() => {
      expect(screen.getByText('Summer Smith')).toBeInTheDocument();
      expect(screen.getByText('Beth Smith')).toBeInTheDocument();
      // İlk sayfadaki karakterlerin artık görünmediğini kontrol et
      expect(screen.queryByText('Rick Sanchez')).not.toBeInTheDocument();
    });

    // Sayfa bilgisinin güncellendiğini kontrol et
    const updatedPageInfos = screen.getAllByTestId('pagination-page-info');
    const updatedPageInfo = updatedPageInfos[0];
    expect(updatedPageInfo).toHaveTextContent('Page 2 / 2');

    // Önceki sayfa butonunun görünür olduğunu kontrol et
    const prevButtons = screen.getAllByTestId('pagination-prev-button');
    const prevButton = prevButtons[0];
    expect(prevButton).toBeInTheDocument();
    expect(prevButton).not.toBeDisabled();

    // Önceki sayfaya dön
    fireEvent.click(prevButton);

    // İlk sayfanın tekrar yüklendiğini kontrol et
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
      // İkinci sayfadaki karakterlerin artık görünmediğini kontrol et
      expect(screen.queryByText('Summer Smith')).not.toBeInTheDocument();
    });

    // Sayfa bilgisinin tekrar güncellendiğini kontrol et
    const finalPageInfos = screen.getAllByTestId('pagination-page-info');
    const finalPageInfo = finalPageInfos[0];
    expect(finalPageInfo).toHaveTextContent('Page 1 / 2');

    // API çağrılarının doğru yapıldığını kontrol et
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('page=1'));
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
  });

  it('karakter resmi hover efektlerini doğru şekilde yönetir', async () => {
    renderWithProviders(<CharacterTable />);
    
    // İlk sayfa yüklendiğinde karakterlerin geldiğini bekle
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    // Karakter resmini bul
    const characterImage = screen.getByAltText('Rick Sanchez');
    
    // Hover öncesi boyutu kontrol et
    expect(characterImage).toHaveStyle({
      width: '50px',
      height: '50px'
    });

    // Hover efekti uygula
    fireEvent.mouseEnter(characterImage);

    // Hover sonrası boyutu kontrol et
    expect(characterImage).toHaveStyle({
      width: '90px',
      height: '90px'
    });

    // Hover'ı kaldır
    fireEvent.mouseLeave(characterImage);

    // Orijinal boyuta döndüğünü kontrol et
    expect(characterImage).toHaveStyle({
      width: '50px',
      height: '50px'
    });
  });

  it('karakterleri doğru şekilde sıralar', async () => {
    // Mock API yanıtını ayarla - farklı isimlerle karakterler
    const characters = [
      { ...mockCharacter, id: 1, name: 'Rick Sanchez' },
      { ...mockCharacter, id: 2, name: 'Morty Smith' },
      { ...mockCharacter, id: 3, name: 'Summer Smith' }
    ];

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        info: { count: 3, pages: 1 },
        results: characters
      }
    });

    renderWithProviders(<CharacterTable />);
    
    // Karakterlerin yüklendiğini bekle
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    // İsim sütununa tıkla ve artan sıralamayı kontrol et
    const nameHeader = screen.getByText('Name ⬍').closest('th');
    fireEvent.click(nameHeader!);

    // Karakterlerin artan sırada olduğunu kontrol et
    const rows = screen.getAllByRole('row').slice(1); // Header'ı atla
    const characterNames = rows.map(row => row.querySelector('td:nth-child(2)')?.textContent);
    expect(characterNames).toEqual(['Morty Smith', 'Rick Sanchez', 'Summer Smith']);

    // Tekrar tıkla ve azalan sıralamayı kontrol et
    fireEvent.click(nameHeader!);

    // Karakterlerin azalan sırada olduğunu kontrol et
    const rowsDesc = screen.getAllByRole('row').slice(1);
    const characterNamesDesc = rowsDesc.map(row => row.querySelector('td:nth-child(2)')?.textContent);
    expect(characterNamesDesc).toEqual(['Summer Smith', 'Rick Sanchez', 'Morty Smith']);
  });
}); 
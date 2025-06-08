import charactersReducer, {
  setFilters,
  setSort,
  setPage,
  setSelectedCharacter,
  setPageSize,
  fetchCharacters
} from '../../../features/characters/characterSlice';
import { mockCharacter, mockFilters, mockSort } from '../../utils/testUtils';

describe('Character Slice', () => {
  const initialState = {
    characters: [],
    totalCount: 0,
    totalPages: 0,
    loading: false,
    error: null,
    filters: mockFilters,
    sort: mockSort,
    page: 1,
    pageSize: 20,
    selectedCharacter: null
  };

  it('başlangıç durumunu doğru şekilde ayarlar', () => {
    expect(charactersReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('filtreleri günceller', () => {
    const newFilters = { ...mockFilters, name: 'Rick' };
    const nextState = charactersReducer(initialState, setFilters(newFilters));
    
    expect(nextState.filters).toEqual(newFilters);
    expect(nextState.page).toBe(1); // Sayfa sıfırlanmalı
  });

  it('sıralama ayarlarını günceller', () => {
    const newSort = { field: 'name' as keyof typeof mockCharacter, direction: 'desc' as const };
    const nextState = charactersReducer(initialState, setSort(newSort));
    
    expect(nextState.sort).toEqual(newSort);
  });

  it('sayfa numarasını günceller', () => {
    const nextState = charactersReducer(initialState, setPage(2));
    expect(nextState.page).toBe(2);
  });

  it('seçili karakteri günceller', () => {
    const nextState = charactersReducer(
      initialState,
      setSelectedCharacter(mockCharacter)
    );
    expect(nextState.selectedCharacter).toEqual(mockCharacter);
  });

  it('sayfa boyutunu günceller', () => {
    const nextState = charactersReducer(initialState, setPageSize(15));
    expect(nextState.pageSize).toBe(15);
    expect(nextState.page).toBe(1); // Sayfa sıfırlanmalı
  });

  it('fetchCharacters.pending durumunu işler', () => {
    const nextState = charactersReducer(initialState, { type: fetchCharacters.pending.type });
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('fetchCharacters.fulfilled durumunu işler', () => {
    const mockResponse = {
      info: { count: 826, pages: 42 },
      results: [mockCharacter]
    };
    
    const nextState = charactersReducer(
      initialState,
      { 
        type: fetchCharacters.fulfilled.type,
        payload: mockResponse,
        meta: { requestId: 'requestId', arg: undefined }
      }
    );
    
    expect(nextState.loading).toBe(false);
    expect(nextState.characters).toEqual([mockCharacter]);
    expect(nextState.totalCount).toBe(826);
    expect(nextState.totalPages).toBe(42);
  });

  it('fetchCharacters.rejected durumunu işler', () => {
    const error = 'API Error';
    const nextState = charactersReducer(
      initialState,
      { 
        type: fetchCharacters.rejected.type,
        error: new Error(error),
        meta: { requestId: 'requestId', arg: undefined },
        payload: error
      }
    );
    
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(error);
    expect(nextState.characters).toEqual([]);
    expect(nextState.totalCount).toBe(0);
    expect(nextState.totalPages).toBe(0);
  });
}); 
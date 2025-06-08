import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from '../../features/characters/characterSlice';
import { ReactElement, ReactNode } from 'react';

// Test için mock karakter verisi
export const mockCharacter = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
  location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/20' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z'
};

// Test için mock store oluşturma
export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      characters: charactersReducer
    },
    preloadedState
  });
};

interface WrapperProps {
  children: ReactNode;
}

// Test için wrapper component
export const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }: WrapperProps) => (
    <Provider store={store}>{children}</Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

// Test için mock API yanıtı
export const mockApiResponse = {
  info: {
    count: 826,
    pages: 42,
    next: 'https://rickandmortyapi.com/api/character?page=2',
    prev: null
  },
  results: [mockCharacter]
};

// Test için mock filtreler
export const mockFilters = {
  name: '',
  status: '',
  species: '',
  gender: ''
};

// Test için mock sıralama
export const mockSort = {
  field: '' as keyof typeof mockCharacter | '',
  direction: 'asc' as 'asc' | 'desc'
}; 
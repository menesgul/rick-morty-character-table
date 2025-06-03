import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharactersState {
  characters: Character[];
  totalCount: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: {
    name: string;
    status: string;
    species: string;
    gender: string;
  };
  sort: {
    field: keyof Character | '';
    direction: 'asc' | 'desc';
  };
  page: number;
  pageSize: number;
  selectedCharacter: Character | null;
}

const initialState: CharactersState = {
  characters: [],
  totalCount: 0,
  totalPages: 0,
  loading: false,
  error: null,
  filters: {
    name: '',
    status: '',
    species: '',
    gender: '',
  },
  sort: {
    field: '',
    direction: 'asc',
  },
  page: 1,
  pageSize: 20,
  selectedCharacter: null,
};

export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { characters: CharactersState };
    const { filters, page } = state.characters;
    let query = `?page=${page}`;
    if (filters.name) query += `&name=${filters.name}`;
    if (filters.status) query += `&status=${filters.status}`;
    if (filters.species) query += `&species=${filters.species}`;
    if (filters.gender) query += `&gender=${filters.gender}`;
    try {
      const response = await axios.get(`https://rickandmortyapi.com/api/character${query}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Bir hata oluştu');
    }
  }
);

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<CharactersState['filters']>) {
      state.filters = action.payload;
      state.page = 1;
    },
    setSort(state, action: PayloadAction<CharactersState['sort']>) {
      state.sort = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    },
    setSelectedCharacter(state, action: PayloadAction<Character | null>) {
      state.selectedCharacter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false;
        state.characters = action.payload.results;
        state.totalCount = action.payload.info.count;
        state.totalPages = action.payload.info.pages;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.characters = [];
      });
  },
});

export const { setFilters, setSort, setPage, setPageSize, setSelectedCharacter } = charactersSlice.actions;
export default charactersSlice.reducer; 
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define Character interface for type safety
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

// Define the shape of our characters state
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

// Initial state for the characters slice
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

// Async thunk for fetching characters with pagination and filtering
export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { characters: CharactersState };
    const { filters, page, pageSize, sort } = state.characters;

    try {
      // Calculate global index range for required characters
      const startGlobalIndex = (page - 1) * pageSize;
      const endGlobalIndex = startGlobalIndex + pageSize;

      // Calculate corresponding API pages
      const firstApiPage = Math.floor(startGlobalIndex / 20) + 1;
      const lastGlobalIndexNeeded = (page * pageSize) - 1;
      const lastApiPage = Math.floor(lastGlobalIndexNeeded / 20) + 1;

      // Initialize variables for data collection
      let fetchedCharacters: Character[] = [];
      let totalCount = 0;
      let totalPagesFromApi = 0;
      let charactersFetchedSoFar = 0;

      // Fetch required API pages
      let currentApiPageToFetch = firstApiPage;

      // Fetch characters from API with pagination and filtering
      while (charactersFetchedSoFar < pageSize && (currentApiPageToFetch - 1) * 20 < (totalCount || Infinity)) {
          // Build query string with filters
          let currentQuery = `?page=${currentApiPageToFetch}`;
          if (filters.name) currentQuery += `&name=${encodeURIComponent(filters.name)}`;
          if (filters.status) currentQuery += `&status=${filters.status}`;
          if (filters.species) currentQuery += `&species=${encodeURIComponent(filters.species)}`;
          if (filters.gender) currentQuery += `&gender=${encodeURIComponent(filters.gender)}`;

          console.log(`Fetching API Page ${currentApiPageToFetch} with query: ${currentQuery}`);

          // Make API request
          const pageResponse = await axios.get(`https://rickandmortyapi.com/api/character${currentQuery}`);
          const pageData = pageResponse.data;

          if (pageData?.results) {
            const apiPageResults = pageData.results;

            // Get total count and pages from first API call
            if (currentApiPageToFetch === firstApiPage) {
                totalCount = pageData.info?.count || 0;
                totalPagesFromApi = pageData.info?.pages || 0;
                if (totalCount === 0) break; // Break if no characters match filters
            }

            // Calculate slice indices for current page
            const apiPageIndexStartGlobal = (currentApiPageToFetch - 1) * 20;
            const apiPageIndexEndGlobal = apiPageIndexStartGlobal + apiPageResults.length;

            // Calculate intersection of needed range and current page
            const sliceStart = Math.max(0, startGlobalIndex - apiPageIndexStartGlobal);
            const sliceEnd = Math.min(apiPageResults.length, endGlobalIndex - apiPageIndexStartGlobal);

            // Add characters from current page to results
            if (sliceStart < sliceEnd) {
                const charactersToTake = apiPageResults.slice(sliceStart, sliceEnd);
                fetchedCharacters = [...fetchedCharacters, ...charactersToTake];
                charactersFetchedSoFar += charactersToTake.length;
            }
          } else {
              // Handle no results or error from API
              if (currentApiPageToFetch === firstApiPage) {
                  totalCount = 0;
              }
              break;
          }

          // Break if we have enough characters or reached last page
          if (charactersFetchedSoFar >= pageSize || currentApiPageToFetch >= totalPagesFromApi) {
               break;
          }

          currentApiPageToFetch++;
      }

      // Calculate total pages based on client page size
      const totalPages = Math.ceil(totalCount / pageSize);

      // Apply sorting if sort field is specified
      if (sort.field) {
          fetchedCharacters.sort((a, b) => {
            let aValue = a[sort.field as keyof typeof a];
            let bValue = b[sort.field as keyof typeof b];

            // Handle nested object sorting
            if (sort.field === 'location') {
              aValue = a.location.name;
              bValue = b.location.name;
            }
            if (sort.field === 'origin') {
              aValue = a.origin.name;
              bValue = b.origin.name;
            }

            // String comparison with locale support
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return sort.direction === 'asc'
                ? aValue.localeCompare(bValue, 'tr')
                : bValue.localeCompare(aValue, 'tr');
            }
            return 0;
          });
      }

      // Log debugging information
      console.log('API Response Info:', { count: totalCount, pages: totalPages });
      console.log('Fetched Characters Count:', fetchedCharacters.length);
      console.log('Start Global Index:', startGlobalIndex);
      console.log('End Global Index (Needed):', endGlobalIndex);
      console.log('First API Page To Fetch:', firstApiPage);
      console.log('Last API Page Determined:', lastApiPage);
      console.log('Total Count from API:', totalCount);
      console.log('Total Pages from API:', totalPagesFromApi);

      return {
        info: { count: totalCount, pages: totalPages },
        results: fetchedCharacters,
      };
    } catch (error: any) {
      console.error('API Error:', error);
      return rejectWithValue(error.response?.data?.error || 'An error occurred');
    }
  }
);

// Create the characters slice with reducers
const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    // Update filters and reset to first page
    setFilters(state, action: PayloadAction<CharactersState['filters']>) {
      state.filters = action.payload;
      state.page = 1;
    },
    // Update sort configuration
    setSort(state, action: PayloadAction<CharactersState['sort']>) {
      state.sort = action.payload;
    },
    // Update current page
    setPage(state, action: PayloadAction<number>) {
      console.log('Setting page to:', action.payload);
      state.page = action.payload;
    },
    // Update selected character for detail view
    setSelectedCharacter(state, action: PayloadAction<Character | null>) {
      state.selectedCharacter = action.payload;
    },
    // Update page size and reset to first page
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 1;
    },
  },
  // Handle async thunk states
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        console.log("FETCH FULFILLED PAYLOAD:", action.payload);
        state.loading = false;
        state.characters = action.payload.results;
        state.totalCount = action.payload.info.count;
        state.totalPages = action.payload.info.pages;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.characters = [];
        state.totalCount = 0;
        state.totalPages = 0;
      });
  },
});

// Export actions and reducer
export const { setFilters, setSort, setPage, setSelectedCharacter, setPageSize } = charactersSlice.actions;
export default charactersSlice.reducer;
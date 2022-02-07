import { createSlice } from '@reduxjs/toolkit';

export const sortCoursesSlice = createSlice({
    name: 'sortCourses',
    initialState: {
        sortBy: 'New',
        filterBy: 'Published',
    },
    reducers: {
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },
        setFilterBy: (state, action) => {
            state.filterBy = action.payload;
        }
    },
});

export const { setSortBy, setFilterBy } = sortCoursesSlice.actions;

export default sortCoursesSlice.reducer;
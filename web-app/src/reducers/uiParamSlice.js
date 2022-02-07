import { createSlice } from '@reduxjs/toolkit';

export const uiParamSlice = createSlice({
    name: 'uiParam',
    initialState: {
        sideNavClosed: false,
    },
    reducers: {
        setSideNavClosed: (state, action) => {
            state.sideNavClosed = action.payload;
        },
    },
});

export const { setSideNavClosed } = uiParamSlice.actions;
export default uiParamSlice.reducer;
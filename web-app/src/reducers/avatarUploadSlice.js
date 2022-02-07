import { createSlice } from '@reduxjs/toolkit';

export const avatarUploadSlice = createSlice({
    name: 'avatarUpload',
    initialState: {
        defaultAvatarID: null,
        avatarPictureFormData: null,
    },
    reducers: {
        defaultAvatarSelected: (state, action) => {
            state.defaultAvatarID = action.payload;
            state.avatarPictureFormData = null;
        },
        avatarPictureSelected: (state, action) => {
            state.defaultAvatarID = null;
            state.avatarPictureFormData = action.payload;
        },
        avatarUploaded: (state) => {
            state.defaultAvatarID = null;
            state.avatarPictureFormData = null;
        }
    }
})

export const {defaultAvatarSelected, avatarPictureSelected, avatarUploaded} = avatarUploadSlice.actions;
export default avatarUploadSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

export const userDataSlice = createSlice({
    name: 'userData',
    initialState: {
        data: {
            id: '',
            username: '',
            email: '',
            firstName: '',
            lastName: '',
            role: '',
            avatar: '',
            accessToken: {},
            DOB: '',
            phone: '',
            country: '',
            date: '',
            coursesEnrolled: [],
            subscribedClasses: [],
        },
    },
    reducers: {
        setUsername: (state, action) => {
            state.data.username = action.payload;
        },
        setFirstName: (state, action) => {
            state.data.firstName = action.payload;
        },
        setLastName: (state, action) => {
            state.data.lastName = action.payload;
        },
        setDOB: (state, action) => {
            state.data.DOB = action.payload;
        },
        setPhone: (state, action) => {
            state.data.phone = action.payload;
        },
        setCountry: (state, action) => {
            state.data.country = action.payload;
        },
        setUserData: (state, action) => {
            state.data = action.payload;
        },
        setCoursesEnrolled: (state, action) => {
            state.data.coursesEnrolled = action.payload;
        },
        setAccessToken: (state, action) => {
            state.data.accessToken = action.payload;
        },
        setAvatar: (state, action) => {
            state.data.avatar = action.payload;
        },
        setSubscribedClasses: (state, action) => {
            state.data.subscribedClasses = action.payload;
        }
    },
});

export const { 
    setUserData, 
    setAccessToken, 
    setAvatar, 
    setCoursesEnrolled, 
    setUsername,
    setFirstName,
    setLastName,
    setDOB,
    setPhone,
    setCountry,
    setSubscribedClasses
} = userDataSlice.actions;

export default userDataSlice.reducer;
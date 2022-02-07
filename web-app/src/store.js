import {configureStore} from '@reduxjs/toolkit';
import sortCoursesReducer from './reducers/sortCoursesSlice';
import avatarUploadReducer from './reducers/avatarUploadSlice';
import userDataReducer from './reducers/userDataSlice';
import createCourseReducer from './reducers/createCourseSlice';
import uiParamReducer from './reducers/uiParamSlice';

export default configureStore({
    reducer: {
        sortCourses: sortCoursesReducer,
        avatarUpload: avatarUploadReducer,
        userData: userDataReducer,
        createCourse: createCourseReducer,
        uiParam: uiParamReducer
    }
})
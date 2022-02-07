import { createSlice } from "@reduxjs/toolkit";

export const createCourseSlice = createSlice({
    name: "createCourse",
    initialState: {
        courseName: "",
        courseDescription: "",
        coursePrice: 0,
        courseDifficulty: null,
        courseCategory: null,
        searchTags: [],
        courseTopics: ['', '', ''],
        coursePrerequisites: [''],
        originalText: "",
        courseCover: null,
        courseCoverBlob: null,
        courseCoverName: "",
        isPublished: false,
    },
    reducers: {
        setCourseName: (state, action) => {
            state.courseName = action.payload;
        },
        setCourseDescription: (state, action) => {
            state.courseDescription = action.payload;
        },
        setCoursePrice: (state, action) => {
            state.coursePrice = action.payload;
        },
        setCourseDifficulty: (state, action) => {
            state.courseDifficulty = action.payload;
        },
        setCourseCategory: (state, action) => {
            state.courseCategory = action.payload;
        },
        setSearchTags: (state, action) => {
            state.searchTags = action.payload;
        },
        setCourseTopics: (state, action) => {
            state.courseTopics = action.payload;
        },
        setCoursePrerequisites: (state, action) => {
            state.coursePrerequisites = action.payload;
        },
        setCourseCoverBlob: (state, action) => {
            state.courseCoverBlob = action.payload;
        },
        setCourseCoverName: (state, action) => {
            state.courseCoverName = action.payload;
        },
        setStepOne: (state, action) => {
            state.courseName = action.payload.courseName;
            state.courseDifficulty = action.payload.difficulty;
            state.courseCategory = action.payload.category;
            state.searchTags = action.payload.searchTags;
        },
        setStepThree: (state, action) => {
            state.courseDescription = action.payload.description;
            state.coursePrerequisites = action.payload.prerequisites;
            state.originalText = action.payload.originalText;
        },
        setStepFour: (state, action) => {
            state.courseCover = action.payload.courseCover;
            state.isPublished = action.payload.isPublished;
            state.coursePrice = action.payload.coursePrice;
        },
        clearAll: (state, action) => {
            state.courseName = "";
            state.courseDescription = "";
            state.coursePrice = 0;
            state.courseDifficulty = null;
            state.courseCategory = null;
            state.searchTags = [];
            state.courseTopics = ['', '', ''];
            state.coursePrerequisites = [''];
            state.originalText = "";
            state.courseCover = null;
            state.courseCoverBlob = null;
            state.courseCoverName = "";
            state.isPublished = false;
        },
        setCourse: (state, action) => {
            state.courseName = action.payload.courseName;
            state.courseDescription = action.payload.courseDescription;
            state.coursePrice = action.payload.coursePrice;
            state.courseDifficulty = action.payload.courseDifficulty;
            state.courseCategory = action.payload.courseCategory;
            state.searchTags = action.payload.searchTags;
            state.courseTopics = action.payload.courseTopics;
            state.coursePrerequisites = action.payload.coursePrerequisites;
            state.courseCover = action.payload.courseCover;
            state.isPublished = action.payload.isPublished;
        },
    },
});

export const {
    setCourseName,
    setCourseDescription,
    setCoursePrice,
    setCourseDifficulty,
    setCourseCategory,
    setSearchTags,
    setCourseTopics,
    setStepOne,
    setStepThree,
    setCoursePrerequisites,
    setStepFour,
    setCourseCoverBlob,
    setCourseCoverName,
    clearAll,
    setCourse,
} = createCourseSlice.actions;
export default createCourseSlice.reducer;
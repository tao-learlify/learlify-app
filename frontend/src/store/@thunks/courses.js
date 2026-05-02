import api from 'api'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchCoursesThunk = createAsyncThunk(
  'courses/fetch',
  /**
   * @param {string} model
   */
  async ({ model, demo }, { rejectWithValue, signal }) => {
    try {
      const courses = await api.courses.fetchCourses(model, demo, signal)

      return courses
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchAdvanceThunk = createAsyncThunk(
  'advance/fetch',
  async (course, { rejectWithValue, signal }) => {
    try {
      const advance = await api.courses.fetchAdvance(course, signal)

      return advance
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchCourseThunk = createAsyncThunk(
  'course/fetch',
  /**
   * @param {string} resource
   */
  async (resource, { rejectWithValue, signal }) => {
    try {
      const data = await api.courses.fetchCourse(resource, signal)

      return data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const createAdvanceThunk = createAsyncThunk(
  'advance/create',
  async (data, { rejectWithValue }) => {
    try {
      const advance = await api.courses.createAdvance(data)

      return advance
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

import api from 'api'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const createConfirmedClassThunk = createAsyncThunk(
  'classes/create', async (schedule, { rejectWithValue }) => {
    try {
      const classRoom = await api.classes.createClassRoom(schedule)

      return classRoom
    } catch (err) {
      return rejectWithValue(err)
    }
  } 
)

export const fetchClassRoomsThunk = createAsyncThunk(
  'classes/fetch', async (data = null, { rejectWithValue }) => {
    try {
      const classrooms = await api.classes.fetchClassRooms()

      return classrooms
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)


export const fetchClassRoomThunk = createAsyncThunk(
  'classRoom/fetch', async ({ token }, { rejectWithValue }) => {
    try {
      const livestream = await api.classes.fetchClassRoom({
        token
      })

      return livestream
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)
import api from 'api'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchOutgoingClassThunk = createAsyncThunk(
  'classes/fetchOutgoing',
  async (param, { rejectWithValue }) => {
    try {
      const outgoingClass = await api.schedules.fetchOutgoingClass(param)

      return outgoingClass
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const fetchSchedulesThunk = createAsyncThunk(
  'schedules/fetch',
  async ({ push, ...options } = { push: null }, { rejectWithValue }) => {

    try {

      const schedules = await api.schedules.fetchSchedules(options)

      return {
        ...schedules,
        push
      }
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const deleteScheduleThunk = createAsyncThunk(
  'schedules/delete',
  async ({ id }, { rejectWithValue, signal }) => {
    try {
      const schedule = await api.schedules.deleteSchedule({ id, signal })

      return schedule
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const createScheduleThunk = createAsyncThunk(
  'schedules/create',
  async (data, { rejectWithValue }) => {
    
    try {
      const schedule = await api.schedules.createSchedule(data)

      return schedule
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)
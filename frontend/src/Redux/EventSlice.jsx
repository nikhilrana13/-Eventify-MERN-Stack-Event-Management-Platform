import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"



 const initialState = {
    Events:[],
    pagination:null,
    loading:true,
    error:null,
}

export const fetchEvents = createAsyncThunk("Event/fetchEvents",async(filters={},{rejectWithValue})=>{
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/event/all-events`,{
            params:filters,
            withCredentials:true
        })
        // console.log("response from createasync",response.data)
        if(response.data){
            return new Promise((resolve) => {
                resolve(response?.data?.data)
            })
        } 
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "Failed to fetch events")
    }
})



export const EventSlice = createSlice({
    name:"Event",
    initialState,
    extraReducers:(builder)=>{
        builder.addCase(fetchEvents.pending,(state,action)=>{
            state.loading = true
            state.error = null
        }),
        builder.addCase(fetchEvents.fulfilled,(state,action)=>{
                 state.Events = action.payload.events
                 state.pagination = action.payload.pagination
                 state.loading = false
                 state.error = null
               
        }),
        builder.addCase(fetchEvents.rejected,(state,action)=>{
            state.loading = false,
            state.error = action.payload
        })
    }
})

export default EventSlice.reducer
// src/features/chat/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk('chat/fetchUsers', async (_, thunkAPI) => {
  try {
    const res = await axios.get('http://localhost:3000/api/users', { withCredentials: true });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || 'Failed to fetch users');
  }
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (receiverId, thunkAPI) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/messages/${receiverId}`, { withCredentials: true });
    return { receiverId, messages: res.data.messages };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || 'Failed to fetch messages');
  }
});

export const sendMessage = createAsyncThunk('chat/sendMessage', async ({ receiverId, message }, thunkAPI) => {
  try {
    const res = await axios.post(
      `http://localhost:3000/api/messages/${receiverId}`,
      { message },
      { withCredentials: true }
    );
    return { receiverId, message: res.data.message };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || 'Failed to send message');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    users: [],
    messages: {}, // {receiverId: [messages]}
    currentReceiverId: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearChat: (state) => {
      state.messages = {};
    },
    setCurrentReceiver: (state, action) => {
      state.currentReceiverId = action.payload;
    },
    addSocketMessage: (state, action) => {
      const msg = action.payload;
      const otherUserId =
        msg.senderId === state.currentReceiverId
          ? msg.senderId
          : msg.receiverId === state.currentReceiverId
          ? msg.receiverId
          : null;

      if (otherUserId) {
        if (!state.messages[otherUserId]) {
          state.messages[otherUserId] = [];
        }
        const exists = state.messages[otherUserId].some((m) => m._id === msg._id);
        if (!exists) state.messages[otherUserId].push(msg);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { receiverId, messages } = action.payload;
        state.messages[receiverId] = messages;
        state.currentReceiverId = receiverId;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { receiverId, message } = action.payload;
        if (!state.messages[receiverId]) {
          state.messages[receiverId] = [];
        }
        state.messages[receiverId].push(message);
      });
  },
});

export const { clearChat, addSocketMessage, setCurrentReceiver } = chatSlice.actions;
export default chatSlice.reducer;

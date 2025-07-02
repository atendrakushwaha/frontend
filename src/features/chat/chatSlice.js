// src/features/chat/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Fetch all users (except self)
export const fetchUsers = createAsyncThunk('chat/fetchUsers', async (_, thunkAPI) => {
  try {
    const res = await axios.get('http://localhost:3000/api/users', { withCredentials: true });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || 'Failed to fetch users');
  }
});

// ✅ Fetch all messages between current user and selected receiver
export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (receiverId, thunkAPI) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/messages/${receiverId}`, {
      withCredentials: true,
    });
    return { receiverId, messages: res.data.messages };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || 'Failed to fetch messages');
  }
});

// ✅ Send a message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ receiverId, message }, thunkAPI) => {
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
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    users: [],
    messages: {}, // {receiverId: [msg1, msg2]}
    currentReceiverId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentReceiver: (state, action) => {
      state.currentReceiverId = action.payload;
    },
    addSocketMessage: (state, action) => {
      const message = action.payload;
      const key =
        message.senderId === state.currentReceiverId
          ? message.senderId
          : message.receiverId;

      if (!state.messages[key]) {
        state.messages[key] = [];
      }

      // Prevent duplicates
      const isDuplicate = state.messages[key].some((msg) => msg._id === message._id);
      if (!isDuplicate) {
        state.messages[key].push(message);
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

export const { addSocketMessage, setCurrentReceiver } = chatSlice.actions;
export default chatSlice.reducer;

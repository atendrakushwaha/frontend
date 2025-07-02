import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Message_Box from '../components/Message_Box';
import Chat_Box from '../components/Chat_Box';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="lg:w-[80%] mx-auto mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Message_Box onUserSelect={setSelectedUser} />
        {selectedUser ? (
          <Chat_Box user={selectedUser} />
        ) : (
          <div className="bg-white shadow-md flex justify-center items-center h-[85vh] text-gray-500">
            <div className="text-center">
              <i className="ri-message-2-line text-3xl mb-2" />
              <p>Select a user to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../features/chat/chatSlice';

const Message_Box = ({ onUserSelect }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter((u) => u._id !== user?._id);

  return (
    <div className="bg-white border-r h-[85vh] overflow-y-auto">
      <div className="p-4 font-bold text-lg bg-indigo-600 text-white">Messages</div>
      <ul>
        {filteredUsers.map((u) => (
          <li
            key={u._id}
            onClick={() => onUserSelect(u)}
            className="cursor-pointer px-4 py-3 hover:bg-gray-100 border-b"
          >
            <div className="font-medium text-gray-800">{u.username}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Message_Box;

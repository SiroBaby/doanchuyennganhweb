
"use client"
import React, { useState } from 'react';
import { useGetUsersQuery, useAddUserMutation } from './services/users';

const Home: React.FC = () => {
  const {data: users, error, isLoading } = useGetUsersQuery();
  const [addUser] = useAddUserMutation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleAddUser = async () => {
    try {
      await addUser({name, email }).unwrap();
      setName('');
      setEmail('');
    } catch (err) {
      console.error('Failed to add user:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <ul className="mb-4">
        {users?.map(user => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border p-2"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2"
        />
        <button
          onClick={handleAddUser}
          className="bg-blue-500 text-white p-2"
        >
          Add User
        </button>
      </div>
    </div>
  );
};

export default Home;

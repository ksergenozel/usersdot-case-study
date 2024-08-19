import { User } from "../models/User";

export const fetchUsers = async ({ queryKey }: any) => {
  const [_, search, page, pageSize] = queryKey;
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users?search=${search}&page=${page}&pageSize=${pageSize}`);
  if (!response.ok) throw new Error('Failed to fetch users');
  const data = await response.json();
  return data.data;
};

export const fetchUser = async (userId: number) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  const data = await response.json();
  return data.data as User;
};

export const createUser = async (data: User) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create user');
}

export const deleteUser = async (userId: number) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/delete/${userId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete user');
}

export const updateUser = async (userId: number, data: User) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/update/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update user');
}
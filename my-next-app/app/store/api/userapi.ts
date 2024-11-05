import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface User {
  user_id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  role_id?: number;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/trpc' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUserById: builder.query<User, string>({
      query: (id) => `user.getUserById?input=${id}`,
      transformResponse: (response: { result: { data: User } }) => {
        return response.result.data;
      },
      providesTags: (result) => 
        result ? [{ type: 'User', id: result.user_id }] : ['User'],
    }),

    getUsers: builder.query<User[], void>({
      query: () => 'user.getUsers',
      transformResponse: (response: { result: { data: User[] } }) => response.result.data,
      providesTags: (result) =>
        result
          ? [...result.map(({ user_id }) => ({ type: 'User' as const, id: user_id })), 'User']
          : ['User'],
    }),
  }),
});

export const {
    useGetUserByIdQuery,
    useGetUsersQuery,
  } = usersApi;
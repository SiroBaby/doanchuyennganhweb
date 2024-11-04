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
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:10000/trpc' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUserById: builder.query<User, string>({
      query: (id) => `getUserById?input=${id}`,
      transformResponse: (response: { result: { data: User } }) => response.result.data,
      providesTags: (result) => 
        result ? [{ type: 'User', id: result.user_id }] : ['User'],
    }),

    getUsers: builder.query<User[], void>({
      query: () => 'getUsers',
      transformResponse: (response: { result: { data: User[] } }) => response.result.data,
      providesTags: (result) =>
        result
          ? [...result.map(({ user_id }) => ({ type: 'User' as const, id: user_id })), 'User']
          : ['User'],
    }),

    updateUser: builder.mutation<void, Partial<User> & { user_id: string }>({
      query: (userId) => ({
        url: 'updateUser',
        method: 'POST',
        body: userId,
      }),
      invalidatesTags: ['User'],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: 'deleteUser',
        method: 'POST',
        body: userId,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
    useGetUserByIdQuery,
    useGetUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
  } = usersApi;
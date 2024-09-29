import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/trpc' }),
  tagTypes: ['User'], // Định nghĩa loại tag ở đây
  endpoints: (builder) => ({
    getUsers: builder.query<{ id: number; name: string; email: string }[], void>({
      query: () => 'getUsers',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: { result: { data: any[] } }) => response.result.data,
      providesTags: (result) =>
        result ? 
          [...result.map(({ id }) => ({ type: 'User' as const, id })), 'User'] 
          : ['User'], // Thêm id cho từng người dùng
    }),
    addUser: builder.mutation<void, { name: string; email: string }>({
      query: (user) => ({
        url: 'addUser',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'], // Invalidates tags để trigger lại getUsers
    }),
    deleteUser: builder.mutation<void, { id: number }>({
      query: (payload) => ({
        url: `deleteUser`, // không cần thêm ID vào URL
        method: 'POST', // dùng POST
        body: payload, // truyền ID trong body
      }),
      invalidatesTags: ['User'], // Invalidates tags để trigger lại getUsers
    }),
  }),
});

export const { useGetUsersQuery, useAddUserMutation, useDeleteUserMutation } = usersApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000' }),
  endpoints: (builder) => ({
    getUsers: builder.query<{ id: number; name: string; email: string }[], void>({
      query: () => 'getUsers',
      transformResponse: (response: { result: { data: any[] } }) => response.result.data,
    }),
    addUser: builder.mutation<void, { name: string; email: string }>({
      query: (user) => ({
        url: 'addUser',
        method: 'POST',
        body: user,
      }),
    }),
  }),
});

export const { useGetUsersQuery, useAddUserMutation } = usersApi;
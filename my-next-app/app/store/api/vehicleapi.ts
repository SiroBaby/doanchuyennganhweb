import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';



// Tạo API cho phương tiện
export const vehiclesApi = createApi({
  reducerPath: 'vehiclesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/trpc' }), // Cập nhật địa chỉ base URL
  tagTypes: ['Vehicle'], // Định nghĩa loại tag cho việc invalidate cache
  endpoints: (builder) => ({
    getVehicleById: builder.query<{ vehicle_id: number; vehicle_code: string; vehicle_type: string; max_capacity: number; current_status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RETIRED' }, number>({
    query: (id) => `getVehicleById?input=${id}`,
    transformResponse: (response: { result: { data: { vehicle_id: number; vehicle_code: string; vehicle_type: string; max_capacity: number; current_status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RETIRED' } } }) => {
      return response.result.data; // Trả về đối tượng vehicle
    },
    providesTags: (result) =>
      result ? [{ type: 'Vehicle', id: result.vehicle_code }] : ['Vehicle'], // Cung cấp tag cho phương tiện
  }),
    getVehicles: builder.query<Array<{ vehicle_id: number; vehicle_code: string; vehicle_type: string; max_capacity: number; current_status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RETIRED' }>, void>({ // Thay đổi kiểu trả về là mảng Vehicle
      query: () => 'getVehicles',
      transformResponse: (response: { result: { data: Array<{ vehicle_id: number; vehicle_code: string; vehicle_type: string; max_capacity: number; current_status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RETIRED' }> } }) => response.result.data, // Chuyển đổi phản hồi
      providesTags: (result) =>
        result ?
          [...result.map(({ vehicle_code }) => ({ type: 'Vehicle' as const, id: vehicle_code })), 'Vehicle'] // Cung cấp tag cho từng phương tiện
          : ['Vehicle'],
    }),
    addVehicle: builder.mutation<void, { vehicle_code: string; vehicle_type: string; max_capacity: number; current_status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RETIRED' }>({
      query: (vehicle) => ({
        url: 'addVehicle',
        method: 'POST',
        body: vehicle,
      }),
      invalidatesTags: ['Vehicle'], // Invalidates tags để trigger lại các endpoint liên quan
    }),
    updateVehicle: builder.mutation<void, { id: number; vehicle_code: string; vehicle_type: string; max_capacity: number; current_status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RETIRED' }>({
      query: ({ id, ...vehicle }) => ({
        url: `updateVehicle`, // Đường dẫn có thể thay đổi tùy thuộc vào backend
        method: 'POST',
        body: {id, ...vehicle},
      }),
      invalidatesTags: ['Vehicle'],
    }),
    deleteVehicle: builder.mutation<void, {id: number}>({
      query: (id) => ({
        url: `deleteVehicle`,
        method: 'POST',
        body: id,
      }),
      invalidatesTags: ['Vehicle'],
    }),
  }),
});

// Xuất các hook để sử dụng trong các component
export const { useAddVehicleMutation, useGetVehiclesQuery, useGetVehicleByIdQuery, useUpdateVehicleMutation, useDeleteVehicleMutation } = vehiclesApi;

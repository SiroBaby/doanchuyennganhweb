import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Định nghĩa kiểu dữ liệu cho phương tiện
interface Vehicle {
    vehicle_code: string;
    vehicle_type: string;
    max_capacity: number;
    current_status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RETIRED';
}


// Tạo API cho phương tiện
export const vehiclesApi = createApi({
  reducerPath: 'vehiclesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://doanchuyennganhweb.onrender.com/trpc' }), // Cập nhật địa chỉ base URL
  tagTypes: ['Vehicle'], // Định nghĩa loại tag cho việc invalidate cache
  endpoints: (builder) => ({
    getVehicleById: builder.query<Vehicle, number>({
        query: (id) => `vehicle/${id}`, // Thay thế bằng đường dẫn thực tế của API
      }),
    getVehicles: builder.query<Vehicle[], void>({ // Thay đổi kiểu trả về là mảng Vehicle
        query: () => 'getVehicles',
        transformResponse: (response: { result: { data: Vehicle[] } }) => response.result.data, // Chuyển đổi phản hồi
        providesTags: (result) =>
          result ? 
            [...result.map(({ vehicle_code }) => ({ type: 'Vehicle' as const, id: vehicle_code })), 'Vehicle'] // Cung cấp tag cho từng phương tiện
          : ['Vehicle'],
      }),
    addVehicle: builder.mutation<void, Vehicle>({
        query: (vehicle) => ({
            url: 'addVehicle', // Thay đổi thành URL đúng cho việc thêm phương tiện
            method: 'POST',
            body: vehicle,
        }),
        invalidatesTags: ['Vehicle'], // Invalidates tags để trigger lại các endpoint liên quan
    }),
    // Có thể thêm các endpoint khác ở đây, ví dụ như getVehicles, deleteVehicle, v.v.
  }),
});

// Xuất các hook để sử dụng trong các component
export const { useAddVehicleMutation, useGetVehiclesQuery, useGetVehicleByIdQuery } = vehiclesApi;

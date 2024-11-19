// orderapi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define interfaces based on your Prisma schema
export interface OrderDetails {
  booking_id: number;
  booking_date: string;
  number_of_people: number;
  total_price: number;
  booking_status: string;
  payment_status: string;
  User: {
    user_id: string;
    full_name: string;
    email: string;
  };
  TourSchedule: {
    schedule_id: number;
    start_date: string;
    end_date: string;
    Tour: {
      tour_name: string;
      duration: number;
      Location: {
        location_name: string;
      }
    }
  };
  VehicleAssignment: {
    Vehicle: {
      vehicle_code: string;
      vehicle_type: string;
    }
  };
  Invoices: Array<{
    invoice_id: number;
    amount: number;
    payment_status: string;
    date: string;
  }>;
}

interface ApiResponse<T> {
  result: {
    data: T;
  };
}

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://doanchuyennganhweb.onrender.com/trpc' }),
  endpoints: (builder) => ({
    getOrderDetails: builder.query<OrderDetails, number>({
      query: (id) => (`order.getOrderDetails?input=${id}`),
      transformResponse: (response: ApiResponse<OrderDetails>) => response.result.data,
    }),
  }),
});

export const {
  useGetOrderDetailsQuery
} = orderApi;
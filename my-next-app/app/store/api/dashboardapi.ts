import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface DashboardStats {
  todayEarnings: number;
  totalBookings: number;
  pendingTours: number;
  tourTypeStats: Array<{
    tour_type_id: number;
    _count: number;
    TourType: {
      type_name: string;
    };
  }>;
  monthlyStats: Record<string, {
    income: number;
    tours: number;
  }>;
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://doanchuyennganhweb.onrender.com/trpc' }),
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => 'dashboard.getDashboardStats',
      transformResponse: (response: { result: { data: DashboardStats } }) => response.result.data,
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Interfaces
export interface Location {
  location_id: number;
  location_name: string;
  country: string;
  city: string;
  created_at: string; // Change from Date to string since JSON doesn't handle Date objects
  updated_at: string;
}

export interface TourType {
  type_id: number;
  type_name: string;
  description: string | null;
}

export interface Tour {
  tour_id: number;
  tour_name: string;
  description: string | null;
  duration: string | null;
  price_range: string | null;
  max_participants: number;
  location_id: number;
  tour_type_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AddTourRequest {
  tour_name: string;
  description: string | null;
  duration: string | null;
  price_range: string | null;
  max_participants: number;
  location_id: number;
  tour_type_id: number;
  images?: string[];
}

export interface UpdateTourRequest extends AddTourRequest {
  tour_id: number;
  images_to_delete?: number[];
}

export interface Schedule {
  schedule_id?: number;
  start_date: string;
  end_date: string;
  base_price: number;
  available_slots: number;
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED' | 'FULL';
  vehicle_id?: number;
}

export interface ApiResponse<T> {
  result: {
    data: T;
  };
}

interface TourResponse extends Tour {
  Location: Location;
  TourType: TourType;
  // Add other relations if needed
}

export interface TourImage {
  image_id: number;
  tour_id: number;
  image_url: string;
  created_at: string;
}

export interface TourListResponse extends Tour {
  Location: Location;
  TourType: TourType;
  TourImages: TourImage[];
}

export interface TourSchedule {
  schedule_id: number;
  start_date: string;
  end_date: string;
  base_price: number;
  available_slots: number;
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED' | 'FULL';
  vehicle_id?: number;  // Add this line
  VehicleAssignments?: {
    vehicle_id: number;
    Vehicle: Vehicle;
  }[];
}

export interface TourDetailResponse extends Tour {
  Location: Location;
  TourType: TourType;
  TourImages: TourImage[];
  TourSchedules: TourSchedule[];
}

export interface Vehicle {
  vehicle_id: number;
  vehicle_code: string;
  vehicle_type: string;
  max_capacity: number;
  current_status: string;
}

export interface UpdateScheduleRequest {
  schedule_id: number;
  start_date: string;
  end_date: string;
  base_price: number;
  available_slots: number;
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED' | 'FULL';
  vehicle_id?: number;
}

// API definition
export const tourApi = createApi({
  reducerPath: 'tourApi',
  tagTypes: ['Tour'], // Add this line to define tag types
  baseQuery: fetchBaseQuery({ baseUrl: 'https://doanchuyennganhweb.onrender.com/trpc' }),
  endpoints: (builder) => ({
    getLocations: builder.query<Location[], void>({
      query: () => 'location.getLocations',
      transformResponse: (response: ApiResponse<Location[]>) => response.result.data,
    }),
    getTourTypes: builder.query<TourType[], void>({
      query: () => 'tourType.getTourTypes',
      transformResponse: (response: ApiResponse<TourType[]>) => response.result.data,
    }),
    addTour: builder.mutation<TourResponse, AddTourRequest>({
      query: (tour) => ({
        url: 'tour.addTour',
        method: 'POST',
        body: tour,
      }),
      transformResponse: (response: ApiResponse<TourResponse>) => response.result.data,
      invalidatesTags: ['Tour'], // Add this line
    }),
    getTours: builder.query<TourListResponse[], void>({
      query: () => 'tour.getTours',
      transformResponse: (response: ApiResponse<TourListResponse[]>) => response.result.data,
      providesTags: ['Tour'], // Add this line to provide tags
    }),
    deleteTour: builder.mutation<void, number>({
      query: (tourId) => ({
        url: `tour.deleteTour`,
        method: 'POST',
        body: { id: tourId },
      }),
      invalidatesTags: ['Tour'], // Add this line to invalidate cache
    }),
    getTourById: builder.query<TourDetailResponse, number>({
      query: (id) => ({
        url: 'tour.getTourById',
        params: { input: id }
      }),
      transformResponse: (response: ApiResponse<TourDetailResponse>) => response.result.data,
      providesTags: ['Tour'],
    }),
    updateTour: builder.mutation<TourResponse, UpdateTourRequest>({
      query: (tour) => ({
        url: 'tour.updateTour',
        method: 'POST',
        body: tour,
      }),
      invalidatesTags: ['Tour'],
    }),
    addSchedule: builder.mutation<void, { tourId: number, schedule: Schedule }>({
      query: ({ tourId, schedule }) => ({
        url: 'tour.addSchedule',
        method: 'POST',
        body: { tourId, schedule },
      }),
      invalidatesTags: ['Tour'],
    }),
    deleteSchedule: builder.mutation<void, number>({
      query: (scheduleId) => ({
        url: 'tour.deleteSchedule',
        method: 'POST',
        body: { id: scheduleId },
      }),
      invalidatesTags: ['Tour'],
    }),
    getAvailableVehicles: builder.query<Vehicle[], void>({
      query: () => 'vehicle.getAvailableVehicles',
      transformResponse: (response: ApiResponse<Vehicle[]>) => response.result.data,
    }),
    updateSchedule: builder.mutation<void, UpdateScheduleRequest>({
      query: (schedule) => ({
        url: 'tour.updateSchedule',
        method: 'POST',
        body: schedule,
      }),
      invalidatesTags: ['Tour'],
    }),
    getSchedulesByTourId: builder.query<TourSchedule[], number>({
      query: (tourId) => ({
        url: 'tour.getSchedulesByTourId',
        params: { input: tourId }
      }),
      transformResponse: (response: ApiResponse<TourSchedule[]>) => response.result.data,
      providesTags: (_result, _error, id) => [{ type: 'Tour', id }],
    }),
  }),
});

export const { 
  useGetLocationsQuery, 
  useGetTourTypesQuery, 
  useAddTourMutation,
  useGetToursQuery,
  useDeleteTourMutation,
  useGetTourByIdQuery,
  useUpdateTourMutation,
  useAddScheduleMutation,
  useDeleteScheduleMutation,
  useGetAvailableVehiclesQuery,
  useUpdateScheduleMutation,
  useGetSchedulesByTourIdQuery,
} = tourApi;

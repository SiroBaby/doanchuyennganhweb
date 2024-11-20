"use client";
import React from "react";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Legend } from "recharts";
import { TooltipProps } from "recharts";
import { SvgIcon } from "@mui/material";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TourIcon from '@mui/icons-material/Tour';
import "../../globals.css";
import { useGetDashboardStatsQuery } from "@/app/store/api/dashboardapi";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded shadow-lg border border-gray-200">
        <p className="font-bold text-gray-700">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${(entry.value ?? 0).toLocaleString()} ${entry.name === 'income' ? 'VND' : ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Page = () => {
  const { data: dashboardStats, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  const monthlyData = Object.entries(dashboardStats?.monthlyStats || {}).map(([name, data]) => ({
    name,
    ...data,
  }));

  const tourTypeData = dashboardStats?.tourTypeStats.map(stat => ({
    name: stat.TourType.type_name,
    value: stat._count,
  })) || [];

  return (
    <div className="bg-gray-100 dark:bg-dark-body transition-colors duration-200">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="!bg-gradient-to-r !from-red-500 !to-red-600 !text-white !transition-all !duration-300 !hover:shadow-xl hover:scale-105">
              <CardContent className="!flex justify-between items-center">
                <div>
                  <Typography variant="h6" className="font-bold mb-2">
                    Total Earning Today
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    {dashboardStats?.todayEarnings.toLocaleString()} VND
                  </Typography>
                </div>
                <div>
                  <SvgIcon component={MonetizationOnIcon} className="!h-auto !w-16" />
                </div>
              </CardContent>
            </Card>
            
            {/* Repeat similar updates for other cards */}
            <Card className="!bg-gradient-to-r !from-blue-500 !to-blue-600 !text-white !shadow-lg !transition-all !duration-300 !hover:shadow-xl hover:scale-105">
              <CardContent className="!flex justify-between items-center">
                <div>
                  <Typography variant="h6" className="font-bold mb-2">
                    Total Orders
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    {dashboardStats?.totalBookings || 0}
                  </Typography>
                </div>
                <div>
                  <SvgIcon component={ShoppingCartIcon} className="!h-auto !w-16" />
                </div>
              </CardContent>
            </Card>
            <Card className="!bg-gradient-to-r !from-green-500 !to-green-600 !text-white !shadow-lg !transition-all !duration-300 !hover:shadow-xl hover:scale-105">
              <CardContent className="flex justify-between items-center">
                <div>
                  <Typography variant="h6" className="font-bold mb-2">
                    Tours Waiting
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    {dashboardStats?.pendingTours || 0}
                  </Typography>
                </div>
                <div>
                  <SvgIcon component={TourIcon} className="!h-auto !w-16" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Monthly Income Chart */}
            <Card className="dark:bg-dark-sidebar shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent>
                <Typography variant="h6" className="font-bold mb-4 text-gray-700 dark:text-dark-text">
                  Monthly Income
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient
                        id="colorIncome"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorIncome)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tour Types Distribution Chart */}
            <Card className="dark:bg-dark-sidebar shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent>
                <Typography variant="h6" className="font-bold mb-4 text-gray-700 dark:text-dark-text">
                  Tour Types Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tourTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {tourTypeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Tour Sales Chart */}
          <Card className="mt-6 shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-dark-sidebar">
            <CardContent>
              <Typography variant="h6" className="font-bold mb-4 text-gray-700 dark:text-dark-text">
                Monthly Tour Sales
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="tours" fill="#82ca9d">
                    {monthlyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;

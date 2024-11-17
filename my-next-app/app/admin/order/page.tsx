import React from 'react';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const OrderPage = () => {
  // Sample order data
  const orders = [
    { id: 1, userId: 'User', vehicleID: 'xyz', scheduleID: 'abc', date: '15/01/2004' },
    { id: 1, userId: 'User', vehicleID: 'xyz', scheduleID: 'abc', date: '15/01/2004' },
    { id: 1, userId: 'User', vehicleID: 'xyz', scheduleID: 'abc', date: '15/01/2004' },
    { id: 1, userId: 'User', vehicleID: 'xyz', scheduleID: 'abc', date: '15/01/2004' },
    { id: 1, userId: 'User', vehicleID: 'xyz', scheduleID: 'abc', date: '15/01/2004' },
    { id: 1, userId: 'User', vehicleID: 'xyz', scheduleID: 'abc', date: '15/01/2004' },
    { id: 1, userId: 'User', vehicleID: 'xyz', scheduleID: 'abc', date: '15/01/2004' },
  ];

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 dark:bg-dark-body">
      <div className="h-screen p-6">
        <Card className="!bg-white dark:!bg-dark-sidebar shadow-lg h-full flex flex-col">
          <CardContent className="!p-0 flex flex-col h-full">
            <TableContainer 
              component={Paper} 
              className="!bg-transparent flex-grow overflow-hidden flex flex-col"
            >
              <div className="flex-grow overflow-auto">
                <Table stickyHeader className="min-w-full">
                  <TableHead>
                    <TableRow>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        OrderID
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        UserID
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        VehicleID
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        ScheduleID
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Date
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order, index) => (
                      <TableRow 
                        key={index}
                        className="hover:!bg-gray-50 dark:hover:!bg-dark-selected transition-colors duration-150"
                      >
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {order.id}
                        </TableCell>
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {order.userId}
                        </TableCell>
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {order.vehicleID}
                        </TableCell>
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {order.scheduleID}
                        </TableCell>
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {order.date}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <IconButton 
                              className="!text-blue-500 hover:!bg-blue-50 dark:hover:!bg-blue-900"
                              size="small"
                            >
                              <EditIcon className="!w-7 !h-6" />
                            </IconButton>
                            <IconButton 
                              className="!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900"
                              size="small"
                            >
                              <DeleteIcon className="!w-7 !h-6" />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderPage;
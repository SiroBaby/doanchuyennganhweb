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
  Typography,
  Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';

const TourPage = () => {
  // Sample tour data
  const tours = [
    { id: 1, name: 'Trà Vinh', location: 'Trà Vinh', image: '/api/placeholder/100/100' },
    { id: 1, name: 'Trà Vinh', location: 'Trà Vinh', image: '/api/placeholder/100/100' },
    { id: 1, name: 'Trà Vinh', location: 'Trà Vinh', image: '/api/placeholder/100/100' },
    { id: 1, name: 'Trà Vinh', location: 'Trà Vinh', image: '/api/placeholder/100/100' },
    { id: 1, name: 'Trà Vinh', location: 'Trà Vinh', image: '/api/placeholder/100/100' },
    { id: 1, name: 'Trà Vinh', location: 'Trà Vinh', image: '/api/placeholder/100/100' },
    { id: 1, name: 'Trà Vinh', location: 'Trà Vinh', image: '/api/placeholder/100/100' },
    { id: 1, name: 'Trà Vinh', location: 'Trà Vinh', image: '/api/placeholder/100/100' },
    { id: 1, name: 'Trà Vinh', location: 'Trà Vinh', image: '/api/placeholder/100/100' },
    { id: 1, name: 'Trà Vinh', location: 'Trà Vinh', image: '/api/placeholder/100/100' },
  ];

  return (
    <div className="h-screen overflow-y-auto bg-gray-100 dark:bg-dark-body">
      {/* Fixed height container for the table */}
      <div className="h-screen p-6">
        <Card className="!bg-white dark:!bg-dark-sidebar shadow-lg h-full flex flex-col">
          <CardContent className="!p-0 flex flex-col h-full">
            {/* Table with fixed header */}
            <TableContainer 
              component={Paper} 
              className="!bg-transparent flex-grow overflow-hidden flex flex-col"
            >
              <div className="flex-grow overflow-auto">
                <Table stickyHeader className="min-w-full">
                  <TableHead>
                    <TableRow>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        TourID
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Tour Name
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Image
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Location
                      </TableCell>
                      <TableCell className="!font-bold !text-gray-700 dark:!text-gray-200 !bg-gray-50 dark:!bg-dark-sidebar !text-2xl">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tours.map((tour, index) => (
                      <TableRow 
                        key={index}
                        className="hover:!bg-gray-50 dark:hover:!bg-dark-selected transition-colors duration-150"
                      >
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {tour.id}
                        </TableCell>
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {tour.name}
                        </TableCell>
                        <TableCell>
                          <div className="relative w-16 h-16 !text-xl">
                            <Image
                              src={tour.image}
                              alt={tour.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="!text-gray-600 dark:!text-gray-300 !text-xl">
                          {tour.location}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <IconButton 
                              // onClick={() => console.log('Edit tour', tour.id)}
                              className="!text-blue-500 hover:!bg-blue-50 dark:hover:!bg-blue-900"
                              size="small"
                            >
                              <EditIcon className="!w-7 !h-6" />
                            </IconButton>
                            <IconButton 
                              // onClick={() => console.log('Delete tour', tour.id)}
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

export default TourPage;
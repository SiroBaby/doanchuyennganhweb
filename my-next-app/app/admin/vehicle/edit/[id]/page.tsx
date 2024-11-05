'use client';
import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material/Select';
import { useUpdateVehicleMutation, useGetVehicleByIdQuery } from '@/app/store/api/vehicleapi';

interface VehicleData {
    vehicle_code: string;
    vehicle_type: string;
    max_capacity: number;
    current_status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RETIRED';
}

const EditVehiclePage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const params = useParams();
    const vehicleId = Number(params.id);

    const { data: vehicle, error, isLoading } = useGetVehicleByIdQuery(vehicleId);
    const [updateVehicle] = useUpdateVehicleMutation();

    const [vehicleData, setVehicleData] = useState<VehicleData>({
        vehicle_code: '',
        vehicle_type: '',
        max_capacity: 0,
        current_status: 'AVAILABLE',
    });


    useEffect(() => {
        if (vehicle) {
            setVehicleData({
                vehicle_code: vehicle.vehicle_code,
                vehicle_type: vehicle.vehicle_type,
                max_capacity: vehicle.max_capacity,
                current_status: vehicle.current_status,
            });
        }
    }, [vehicle]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setVehicleData(prevData => ({
            ...prevData,
            [name]: name === 'max_capacity' ? Math.max(1, Number(value)) : value, // Đảm bảo max_capacity không dưới 1
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateVehicle({ id: vehicleId, ...vehicleData }).unwrap();
            alert("Phương tiện được cập nhật thành công")
            router.push('/admin/vehicle');
        } catch (error) {
            console.error("Error updating vehicle:", error);
            alert("Có lỗi xảy ra khi cập nhật phương tiện.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">Có lỗi xảy ra khi tải dữ liệu phương tiện.</Typography>;
    if (!vehicle) return <Typography color="error">Phương tiện không tồn tại.</Typography>;


    return (
        <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardContent>
                    <Typography variant="h5" component="div" className="mb-4">
                        Chỉnh sửa Phương tiện
                    </Typography>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <TextField
                            fullWidth
                            label="Mã Phương tiện"
                            name="vehicle_code"
                            value={vehicleData.vehicle_code}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Loại Phương tiện"
                            name="vehicle_type"
                            value={vehicleData.vehicle_type}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Sức chứa tối đa"
                            name="max_capacity"
                            type="number"
                            value={vehicleData.max_capacity}
                            onChange={handleChange}
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                name="current_status"
                                value={vehicleData.current_status}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="AVAILABLE">Sẵn sàng</MenuItem>
                                <MenuItem value="IN_USE">Đang sử dụng</MenuItem>
                                <MenuItem value="MAINTENANCE">Bảo trì</MenuItem>
                                <MenuItem value="RETIRED">Ngưng hoạt động</MenuItem>
                            </Select>
                        </FormControl>
                        <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
                            {isSubmitting ? <CircularProgress size={24} /> : 'Lưu thay đổi'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditVehiclePage;

import { PrismaClient } from '@prisma/client';
import { initTRPC } from '@trpc/server';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();
const t = initTRPC.create();

const vehicleRouter = t.router({
  getVehicleById: t.procedure.input(z.object({
    id: z.string(), // Xác thực ID là chuỗi
  })).query(async ({ input }) => {
    const vehicle = await prisma.vehicle.findUnique({
      where: { vehicle_id: parseInt(input.id) }, // Chuyển đổi ID thành số nguyên
      select: {
        vehicle_code: true,
        vehicle_type: true,
        max_capacity: true,
        current_status: true,
      },
    });
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    return vehicle;
  }),
  getVehicles: t.procedure.query(async () => {
    return await prisma.vehicle.findMany({
      select: {
        vehicle_id: true,
        vehicle_code: true,
        vehicle_type: true,
        max_capacity: true,
        current_status: true,
      }
    })
  }),
  addVehicle: t.procedure.input(z.object({
    vehicle_code: z.string(),
    vehicle_type: z.string(),
    max_capacity: z.number(),
    current_status: z.string(),
  })).mutation(async ({ input }) => {
    return await prisma.vehicle.create({
      data: {
        vehicle_code: input.vehicle_code,
        vehicle_type: input.vehicle_type,
        max_capacity: input.max_capacity,
        current_status: input.current_status,
      },
    });
  })
});


app.use(cors());
app.use('/trpc', createExpressMiddleware({ router: vehicleRouter }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});

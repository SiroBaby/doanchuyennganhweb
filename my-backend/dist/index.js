"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const server_1 = require("@trpc/server");
const express_1 = require("@trpc/server/adapters/express");
const cors_1 = __importDefault(require("cors"));
const express_2 = __importDefault(require("express"));
const zod_1 = require("zod");
const app = (0, express_2.default)();
const prisma = new client_1.PrismaClient();
const t = server_1.initTRPC.create();
const vehicleRouter = t.router({
    getVehicleById: t.procedure.input(zod_1.z.object({
        id: zod_1.z.string(), // Xác thực ID là chuỗi
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
        });
    }),
    addVehicle: t.procedure.input(zod_1.z.object({
        vehicle_code: zod_1.z.string(),
        vehicle_type: zod_1.z.string(),
        max_capacity: zod_1.z.number(),
        current_status: zod_1.z.string(),
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
app.use((0, cors_1.default)());
app.use('/trpc', (0, express_1.createExpressMiddleware)({ router: vehicleRouter }));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});

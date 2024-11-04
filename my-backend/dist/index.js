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
const svix_1 = require("svix");
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_2.default)();
const prisma = new client_1.PrismaClient();
const t = server_1.initTRPC.create();
const port = process.env.PORT || 4000;
app.use(body_parser_1.default.json());
const webhookRouter = express_2.default.Router();
webhookRouter.post('/webhooks', async (req, res) => {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
        console.error('Missing WEBHOOK_SECRET');
        return res.status(500).json({
            success: false,
            message: 'Server configuration error'
        });
    }
    // Get the headers
    const svix_id = req.headers['svix-id'];
    const svix_timestamp = req.headers['svix-timestamp'];
    const svix_signature = req.headers['svix-signature'];
    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({
            success: false,
            message: 'Missing svix headers'
        });
    }
    try {
        const wh = new svix_1.Webhook(WEBHOOK_SECRET);
        const evt = wh.verify(JSON.stringify(req.body), {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });
        console.log('Webhook type:', evt.type);
        console.log('Webhook data:', evt.data);
        // Handle user.created or user.updated events
        if (evt.type === 'user.created' || evt.type === 'user.updated') {
            const { id, email_addresses, first_name, last_name } = evt.data;
            // Get the primary email
            const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id);
            if (!primaryEmail) {
                console.error('No primary email found for user:', id);
                return res.status(400).json({
                    success: false,
                    message: 'No primary email found'
                });
            }
            if (evt.type === 'user.created') {
                // Create new user
                await prisma.user.create({
                    data: {
                        user_id: String(id),
                        email: primaryEmail.email_address,
                        full_name: `${first_name || ''} ${last_name || ''}`.trim(),
                        password: 'CLERK_AUTH_USER',
                        password_salt: 'CLERK_AUTH_USER',
                        status: 'ACTIVE',
                        created_at: new Date(evt.data.created_at),
                    },
                });
                console.log('User created successfully:', id);
            }
            else if (evt.type === 'user.updated') {
                // Update existing user
                await prisma.user.update({
                    where: { user_id: id },
                    data: {
                        email: primaryEmail.email_address,
                        full_name: `${first_name || ''} ${last_name || ''}`.trim(),
                        updated_at: new Date(),
                    },
                });
                console.log('User updated successfully:', id);
            }
        }
        return res.status(200).json({
            success: true,
            message: 'Webhook processed successfully'
        });
    }
    catch (err) {
        console.error('Error processing webhook:', err);
        return res.status(400).json({
            success: false,
            message: 'Error processing webhook',
            error: err instanceof Error ? err.message : 'Unknown error'
        });
    }
});
const vehicleRouter = t.router({
    getVehicleById: t.procedure
        .input(zod_1.z.number())
        .query(async ({ input }) => {
        const vehicle = await prisma.vehicle.findUnique({
            select: {
                vehicle_id: true,
                vehicle_code: true,
                vehicle_type: true,
                max_capacity: true,
                current_status: true,
            },
            where: { vehicle_id: input }
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
    }),
    updateVehicle: t.procedure.input(zod_1.z.object({
        id: zod_1.z.number(),
        vehicle_code: zod_1.z.string(),
        vehicle_type: zod_1.z.string(),
        max_capacity: zod_1.z.number(),
        current_status: zod_1.z.string(),
    })).mutation(async ({ input }) => {
        const updatedVehicle = await prisma.vehicle.update({
            where: { vehicle_id: input.id },
            data: {
                vehicle_code: input.vehicle_code,
                vehicle_type: input.vehicle_type,
                max_capacity: input.max_capacity,
                current_status: input.current_status,
            },
        });
        return updatedVehicle;
    }),
    deleteVehicle: t.procedure
        .input(zod_1.z.object({ id: zod_1.z.number() }))
        .mutation(async ({ input }) => {
        return await prisma.vehicle.delete({
            where: { vehicle_id: input.id }
        });
    })
});
app.use((0, cors_1.default)());
app.use('/trpc', (0, express_1.createExpressMiddleware)({ router: vehicleRouter }));
app.use('/api', webhookRouter);
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

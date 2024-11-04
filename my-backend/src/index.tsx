import { PrismaClient } from '@prisma/client';
import { initTRPC } from '@trpc/server';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import bodyParser from 'body-parser';

const app = express();
const prisma = new PrismaClient();
const t = initTRPC.create();

app.use(bodyParser.json());

// Clerk Webhook Secret
const CLERK_WEBHOOK_SECRET = 'whsec_qJshoxPSgNdzwpL9/K6dOOSDXbEaob1E'; // Replace with your actual secret
// Verify Clerk webhook signature
function verifyClerkSignature(req: Request, res: Response, next: NextFunction) {
  const signature = req.headers['clerk-signature'] as string | undefined;

  if (!signature) {
    return res.status(401).send('Signature missing');
  }

  const payload = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', CLERK_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).send('Invalid signature');
  }

  next();
}


// Clerk Webhook Handler
app.post('/api/clerk-webhook', verifyClerkSignature, async (req: Request, res: Response) => {
  const event = req.body;

  try {
    switch (event.type) {
      case 'user.created':
        await prisma.user.create({
          data: {
            user_id: event.data.id,
            full_name: event.data.full_name,
            email: event.data.email_addresses[0]?.email_address,
            phone_number: event.data.phone_numbers[0]?.phone_number,
            password: "thisisasuperstrongpassword",
            status: 'ACTIVE',
            created_at: new Date(),
          },
        });
        console.log('User created in database:', event.data);
        break;

      case 'user.updated':
        await prisma.user.update({
          where: { user_id: event.data.id },
          data: {
            full_name: event.data.full_name,
            email: event.data.email_addresses[0]?.email_address,
            phone_number: event.data.phone_numbers[0]?.phone_number,
            updated_at: new Date(),
          },
        });
        console.log('User updated in database:', event.data);
        break;

      case 'user.deleted':
        await prisma.user.update({
          where: { user_id: event.data.id },
          data: {
            status: 'INACTIVE',
            deleted_at: new Date(),
          },
        });
        console.log('User marked as deleted in database:', event.data);
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }

    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send('Error handling webhook');
  }
});

const vehicleRouter = t.router({
  getVehicleById: t.procedure
  .input(z.number())
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
  }),
  updateVehicle: t.procedure.input(z.object({
    id: z.number(),
    vehicle_code: z.string(),
    vehicle_type: z.string(),
    max_capacity: z.number(),
    current_status: z.string(),
  }),).mutation(async ({ input }) => {
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
  .input(z.object({id: z.number() }))
  .mutation(async ({input}) =>{
    return await prisma.vehicle.delete({
      where: {vehicle_id: input.id}
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

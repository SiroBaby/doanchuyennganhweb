import { PrismaClient } from '@prisma/client';
import { initTRPC } from '@trpc/server';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Webhook } from 'svix';
import bodyParser from 'body-parser';

const app = express();
const prisma = new PrismaClient();
const t = initTRPC.create();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

type ClerkWebhookEvent = {
  data: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email_addresses: Array<{
      id: string;
      email_address: string;
    }>;
    primary_email_address_id: string;
    created_at: number;
  };
  object: string;
  type: string;
};

const webhookRouter = express.Router();

webhookRouter.post('/webhooks', async (req: Request, res: Response) => {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error('Missing WEBHOOK_SECRET');
    return res.status(500).json({ 
      success: false,
      message: 'Server configuration error' 
    });
  }

  // Get the headers
  const svix_id = req.headers['svix-id'] as string;
  const svix_timestamp = req.headers['svix-timestamp'] as string;
  const svix_signature = req.headers['svix-signature'] as string;

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ 
      success: false,
      message: 'Missing svix headers' 
    });
  }

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(JSON.stringify(req.body), {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as ClerkWebhookEvent;

    console.log('Webhook type:', evt.type);
    console.log('Webhook data:', evt.data);

    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = evt.data;

      const primaryEmail = email_addresses.find(
        email => email.id === evt.data.primary_email_address_id
      );

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
            user_id: id,
            email: primaryEmail.email_address,
            full_name: `${first_name || ''} ${last_name || ''}`.trim(),
            password: 'CLERK_AUTH_USER',
            password_salt: 'CLERK_AUTH_USER',
            status: 'ACTIVE',
            created_at: new Date(evt.data.created_at),
          },
        });
        console.log('User created successfully:', id);
      } else if (evt.type === 'user.updated') {
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

    if (evt.type === 'user.deleted') {
      await prisma.user.delete({
        where: { user_id: evt.data.id },
      });
      console.log('User deleted successfully:', evt.data.id);
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (err) {
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
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.vehicle.delete({
        where: { vehicle_id: input.id }
      });
    })
});


app.use(cors());
app.use('/trpc', createExpressMiddleware({ router: vehicleRouter }));
app.use('/api', webhookRouter);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

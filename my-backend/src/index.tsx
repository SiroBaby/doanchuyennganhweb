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
const port = process.env.PORT || 4000;

app.use(bodyParser.json());


const CLERK_WEBHOOK_SECRET = 'whsec_qJshoxPSgNdzwpL9/K6dOOSDXbEaob1E';

function verifyClerkSignature(req: Request, res: Response, next: NextFunction) {
  try {
    const svixId = req.headers["svix-id"] as string;
    const svixTimestamp = req.headers["svix-timestamp"] as string;
    const svixSignature = req.headers["svix-signature"] as string;

    console.log('Verification Headers:', {
      svixId,
      svixTimestamp,
      svixSignature
    });

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('Missing Svix headers');
      return res.status(401).json({ error: 'Missing Svix headers' });
    }

    // Parse signed content
    const payloadString = JSON.stringify(req.body);
    const signedContent = `${svixId}.${svixTimestamp}.${payloadString}`;

    // Get signature from header
    const signatures = svixSignature.split(' ').map(sig => sig.split(',')[1]);

    // Verify signature
    let isValid = false;
    for (const signature of signatures) {
      const hash = crypto
        .createHmac('sha256', CLERK_WEBHOOK_SECRET)
        .update(signedContent)
        .digest('hex');
      
      if (hash === signature) {
        isValid = true;
        break;
      }
    }

    if (!isValid) {
      console.error('Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    next();
  } catch (error) {
    console.error('Error in signature verification:', error);
    return res.status(500).json({ error: 'Error verifying signature' });
  }
}

app.post('/api/clerk-webhook', verifyClerkSignature, async (req: Request, res: Response) => {
  console.log('Webhook received:', req.body.type);
  
  const event = req.body;

  try {
    switch (event.type) {
      case 'user.created':
        const userData = {
          user_id: event.data.id,
          full_name: `${event.data.first_name || ''} ${event.data.last_name || ''}`.trim(),
          email: event.data.email_addresses?.[0]?.email_address || null,
          phone_number: event.data.phone_numbers?.[0]?.phone_number || null,
          status: 'ACTIVE',
          created_at: new Date(event.data.created_at),
          password: "thisisasuperstrongpassword"
        };

        console.log('Creating user with data:', userData);

        await prisma.user.create({
          data: userData
        });

        console.log('User created successfully');
        break;

      case 'user.updated':
        const updateData = {
          full_name: `${event.data.first_name || ''} ${event.data.last_name || ''}`.trim(),
          email: event.data.email_addresses?.[0]?.email_address,
          phone_number: event.data.phone_numbers?.[0]?.phone_number,
          updated_at: new Date()
        };

        console.log('Updating user with data:', {
          userId: event.data.id,
          updateData
        });

        await prisma.user.update({
          where: { user_id: event.data.id },
          data: updateData
        });

        console.log('User updated successfully');
        break;

      case 'user.deleted':
        console.log('Deleting user:', event.data.id);
        
        await prisma.user.update({
          where: { user_id: event.data.id },
          data: {
            status: 'INACTIVE',
            deleted_at: new Date()
          }
        });

        console.log('User marked as deleted successfully');
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    console.error('Full event data:', JSON.stringify(event, null, 2));
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

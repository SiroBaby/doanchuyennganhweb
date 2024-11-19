import { PrismaClient } from '@prisma/client';
import { initTRPC } from '@trpc/server';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { Webhook } from 'svix';
import { number, z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';

const app = express();
const prisma = new PrismaClient();
const t = initTRPC.create();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

//Thêm thanh toán VNPAY
function formatVNPayDateTime(date: Date): string {
  // Convert to Vietnam timezone (GMT+7)
  const vietnamTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  
  return vietnamTime.getUTCFullYear() +
    String(vietnamTime.getUTCMonth() + 1).padStart(2, '0') +
    String(vietnamTime.getUTCDate()).padStart(2, '0') +
    String(vietnamTime.getUTCHours()).padStart(2, '0') +
    String(vietnamTime.getUTCMinutes()).padStart(2, '0') +
    String(vietnamTime.getUTCSeconds()).padStart(2, '0');
}

function createVNPayUrl(orderId: string, amount: number, orderInfo: string, returnUrl: string, ipAddr: string) {
  const vnp_TmnCode = process.env.VNP_TMN_CODE || "";
  const vnp_HashSecret = process.env.VNP_HASH_SECRET || "";
  const vnp_Url = process.env.VNP_URL || "";

  const now = new Date();
  const createDate = formatVNPayDateTime(now);
  const expireDate = formatVNPayDateTime(new Date(now.getTime() + 15 * 60 * 1000));

  // Tạo đối tượng chứa parameters
  const vnp_Params: { [key: string]: string } = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnp_TmnCode,
    vnp_Amount: (amount * 100).toString(),
    vnp_CreateDate: createDate,
    vnp_CurrCode: "VND",
    vnp_IpAddr: ipAddr,
    vnp_Locale: "vn",
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_ReturnUrl: returnUrl,
    vnp_ExpireDate: expireDate,
    vnp_TxnRef: orderId
  };

  // Sắp xếp các tham số theo thứ tự a-z
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc, key) => {
      if (vnp_Params[key] !== "" && vnp_Params[key] !== null && vnp_Params[key] !== undefined) {
        acc[key] = vnp_Params[key];
      }
      return acc;
    }, {} as { [key: string]: string });

  // Tạo chuỗi query từ các tham số đã sắp xếp
  const queryString = new URLSearchParams(sortedParams).toString();

  // Tạo chữ ký
  const hmac = crypto.createHmac('sha512', vnp_HashSecret);
  const signed = hmac.update(Buffer.from(queryString, 'utf-8')).digest('hex');

  // Tạo URL cuối cùng
  return `${vnp_Url}?${queryString}&vnp_SecureHash=${signed}`;
}

// API tạo URL thanh toán
app.post("/create-payment-url", (req: Request, res: Response) => {
  const { orderId, amount, orderInfo, ipAddr } = req.body;

  if (!orderId || !amount || !orderInfo || !ipAddr) {
      return res.status(400).json({ success: false, message: "Missing parameters" });
  }

  const returnUrl = process.env.VNP_RETURN_URL || "";

  const paymentUrl = createVNPayUrl(orderId, amount, orderInfo, returnUrl, ipAddr);

  res.status(200).json({ success: true, paymentUrl });
});

app.get("/vnpay-return", (req: Request, res: Response) => {
  const vnp_Params = req.query;
  const vnp_HashSecret = process.env.VNP_HASH_SECRET || "";

  // Lấy chữ ký từ VNPay
  const vnp_SecureHash = vnp_Params['vnp_SecureHash'] as string;
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  // Sắp xếp các tham số theo thứ tự a-z
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc, key) => {
      if (vnp_Params[key] !== "" && vnp_Params[key] !== null && vnp_Params[key] !== undefined) {
        acc[key] = vnp_Params[key] as string;
      }
      return acc;
    }, {} as { [key: string]: string });

  // Tạo chuỗi query từ các tham số đã sắp xếp
  const queryString = new URLSearchParams(sortedParams).toString();

  // Tạo chữ ký để so sánh
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(queryString, 'utf-8')).digest('hex');

  // So sánh chữ ký
  if (signed === vnp_SecureHash) {
    res.status(200).json({
      success: true,
      message: "Payment successful",
      data: vnp_Params
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid signature"
    });
  }
});

// Add IPN handler
app.post("/vnpay-ipn", (req: Request, res: Response) => {
  const vnp_Params = req.body;
  const vnp_HashSecret = process.env.VNP_HASH_SECRET || "";

  let orderId = vnp_Params['vnp_TxnRef'];
  let rspCode = vnp_Params['vnp_ResponseCode'];

  // Get VNPAY's secure hash
  const vnp_SecureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  // Sort parameters
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc, key) => {
      if (vnp_Params[key] !== "" && vnp_Params[key] !== null && vnp_Params[key] !== undefined) {
        acc[key] = vnp_Params[key];
      }
      return acc;
    }, {} as { [key: string]: string });

  // Create query string
  const signData = Object.keys(sortedParams)
    .map(key => `${key}=${sortedParams[key]}`)
    .join('&');

  // Create signature
  const hmac = crypto.createHmac('sha512', vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  let paymentStatus = '0';
  let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  if(vnp_SecureHash === signed){ //kiểm tra checksum
      if(checkOrderId){
          if(checkAmount){
              if(paymentStatus=="0"){ //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                  if(rspCode=="00"){
                      //thanh cong
                      //paymentStatus = '1'
                      // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                      res.status(200).json({RspCode: '00', Message: 'Success'})
                  }
                  else {
                      //that bai
                      //paymentStatus = '2'
                      // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                      res.status(200).json({RspCode: '00', Message: 'Success'})
                  }
              }
              else{
                  res.status(200).json({RspCode: '02', Message: 'This order has been updated to the payment status'})
              }
          }
          else{
              res.status(200).json({RspCode: '04', Message: 'Amount invalid'})
          }
      }       
      else {
          res.status(200).json({RspCode: '01', Message: 'Order not found'})
      }
  }
  else {
      res.status(200).json({RspCode: '97', Message: 'Checksum failed'})
  }
});
// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../img');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

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
            user_id: id.toString(),
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
          where: { user_id: id.toString() },
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
        where: { user_id: evt.data.id.toString() },
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
    }),
  getAvailableVehicles: t.procedure.query(async () => {
    return await prisma.vehicle.findMany({
      where: {
        current_status: 'AVAILABLE'
      }
    });
  }),
});

const userRouter = t.router({
  getUserById: t.procedure
    .input(z.string())
    .query(async ({ input }) => {
      try{
      const user = await prisma.user.findUnique({
        where: { user_id: input },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
    }),

  getUsers: t.procedure.query(async () => {
    return await prisma.user.findMany({
      where: {
        status: 'ACTIVE'
      }
    });
  })
});

const TourRouter = t.router({
  getTourById: t.procedure
    .input(z.number())
    .query(async ({ input }) => {
      const tour = await prisma.tour.findUnique({
        where: { tour_id: input },
        include: {
          Location: true,
          TourType: true,
          TourImages: true,
          Reviews: {
            include: {
              User: {
                select: {
                  full_name: true
                }
              }
            },
            orderBy: {
              created_at: 'desc'
            }
          }
        }
      });
      if (!tour) {
        throw new Error('Tour not found');
      }
      return tour;
    }),
  getTours: t.procedure.query(async () => {
    return await prisma.tour.findMany({
      include: {
        Location: true,
        TourType: true,
        TourImages: true,
      },
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }),
  addTour: t.procedure
    .input(z.object({
      tour_name: z.string().min(1, 'Tên tour là bắt buộc'),
      description: z.string().nullable(),
      duration: z.string(),
      price_range: z.string(),
      max_participants: z.number().int().min(1, 'Số người tối thiểu là 1'),
      location_id: z.number().int().positive('Địa điểm là bắt buộc'),
      tour_type_id: z.number().int().positive('Loại tour là bắt buộc'),
      images: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        // First check if location and tour type exist
        const [location, tourType] = await Promise.all([
          prisma.location.findUnique({
            where: { location_id: input.location_id }
          }),
          prisma.tourType.findUnique({
            where: { type_id: input.tour_type_id }
          })
        ]);

        if (!location) {
          throw new Error('Địa điểm không tồn tại');
        }

        if (!tourType) {
          throw new Error('Loại tour không tồn tại');
        }

        // Create tour with transaction to ensure data consistency
        const tour = await prisma.$transaction(async (tx) => {
          // Create the tour first
          const newTour = await tx.tour.create({
            data: {
              tour_name: input.tour_name,
              description: input.description,
              duration: input.duration,
              price_range: input.price_range,
              max_participants: input.max_participants,
              location_id: input.location_id,
              tour_type_id: input.tour_type_id,
              created_at: new Date(),
              updated_at: new Date(),
            },
          });

          // If there are images, create the image records
          if (input.images && input.images.length > 0) {
            await tx.tourImage.createMany({
              data: input.images.map(image_url => ({
                tour_id: newTour.tour_id,
                image_url,
                created_at: new Date(),
              })),
            });
          }

          // Return the complete tour with relations
          return await tx.tour.findUnique({
            where: { tour_id: newTour.tour_id },
            include: {
              Location: true,
              TourType: true,
              TourImages: true,
            },
          });
        });

        if (!tour) {
          throw new Error('Lỗi khi tạo tour');
        }

        return tour;
      } catch (error) {
        console.error('Error creating tour:', error);
        throw new Error(error instanceof Error ? error.message : 'Không thể tạo tour');
      }
    }),
  deleteTour: t.procedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(async ({ input }) => {
      try {
        // Soft delete by updating deleted_at
        await prisma.tour.update({
          where: { tour_id: input.id },
          data: {
            deleted_at: new Date(),
          },
        });
        return { success: true };
      } catch (error) {
        console.error('Error deleting tour:', error);
        throw new Error('Không thể xóa tour');
      }
    }),
  updateTour: t.procedure
    .input(z.object({
      tour_id: z.number(),
      tour_name: z.string().min(1),
      description: z.string().nullable(),
      duration: z.string(),
      price_range: z.string(),
      max_participants: z.number().int().min(1),
      location_id: z.number().int().positive(),
      tour_type_id: z.number().int().positive(),
      images: z.array(z.string()).optional(),
      images_to_delete: z.array(z.number()).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const tour = await prisma.$transaction(async (tx) => {
          // Delete specified images
          if (input.images_to_delete?.length) {
            await tx.tourImage.deleteMany({
              where: {
                image_id: { in: input.images_to_delete },
              },
            });
          }

          // Add new images
          if (input.images?.length) {
            await tx.tourImage.createMany({
              data: input.images.map(image_url => ({
                tour_id: input.tour_id,
                image_url,
                created_at: new Date(),
              })),
            });
          }

          // Update tour details
          const updatedTour = await tx.tour.update({
            where: { tour_id: input.tour_id },
            data: {
              tour_name: input.tour_name,
              description: input.description,
              duration: input.duration,
              price_range: input.price_range,
              max_participants: input.max_participants,
              location_id: input.location_id,
              tour_type_id: input.tour_type_id,
              updated_at: new Date(),
            },
            include: {
              Location: true,
              TourType: true,
              TourImages: true,
            },
          });

          return updatedTour;
        });

        return tour;
      } catch (error) {
        console.error('Error updating tour:', error);
        throw new Error('Không thể cập nhật tour');
      }
    }),

  addSchedule: t.procedure
    .input(z.object({
      tourId: z.number(),
      schedule: z.object({
        start_date: z.string(),
        end_date: z.string(),
        base_price: z.number(),
        available_slots: z.number(),
        status: z.enum(['ACTIVE', 'CANCELLED', 'COMPLETED', 'FULL']),
        vehicle_id: z.number().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      const schedule = await prisma.tourSchedule.create({
        data: {
          tour_id: input.tourId,
          start_date: new Date(input.schedule.start_date),
          end_date: new Date(input.schedule.end_date),
          base_price: input.schedule.base_price,
          available_slots: input.schedule.available_slots,
          status: input.schedule.status,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      if (input.schedule.vehicle_id) {
        await prisma.vehicleAssignment.create({
          data: {
            schedule_id: schedule.schedule_id,
            vehicle_id: input.schedule.vehicle_id,
            available_seats: input.schedule.available_slots,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
      }

      return schedule;
    }),

  getReviewsByTourId: t.procedure
    .input(z.number())
    .query(async ({ input }) => {
      try {
        const reviews = await prisma.review.findMany({
          where: {
            tour_id: input
          },
          include: {
            User: {
              select: {
                full_name: true
              }
            }
          },
          orderBy: {
            created_at: 'desc'
          }
        });
        return reviews;
      } catch (error) {
        console.error('Error fetching reviews:', error);
        throw new Error('Không thể lấy đánh giá');
      }
    }),

  deleteSchedule: t.procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await prisma.tourSchedule.delete({
        where: { schedule_id: input.id },
      });
      return { success: true };
    }),
  updateSchedule: t.procedure
    .input(z.object({
      schedule_id: z.number(),
      start_date: z.string(),
      end_date: z.string(),
      base_price: z.number(),
      available_slots: z.number(),
      status: z.enum(['ACTIVE', 'CANCELLED', 'COMPLETED', 'FULL']),
      vehicle_id: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        await prisma.$transaction(async (tx) => {
          await tx.tourSchedule.update({
            where: { schedule_id: input.schedule_id },
            data: {
              start_date: new Date(input.start_date),
              end_date: new Date(input.end_date),
              base_price: input.base_price,
              available_slots: input.available_slots,
              status: input.status,
              updated_at: new Date(),
            },
          });

          // Handle vehicle assignment
          if (input.vehicle_id) {
            // Delete existing assignment if any
            await tx.vehicleAssignment.deleteMany({
              where: { schedule_id: input.schedule_id }
            });

            // Create new assignment
            await tx.vehicleAssignment.create({
              data: {
                schedule_id: input.schedule_id,
                vehicle_id: input.vehicle_id,
                available_seats: input.available_slots,
                created_at: new Date(),
                updated_at: new Date(),
              },
            });
          }
        });
      } catch (error) {
        console.error('Error updating schedule:', error);
        throw new Error('Không thể cập nhật lịch trình');
      }
    }),

  getSchedulesByTourId: t.procedure
    .input(z.number())
    .query(async ({ input }) => {
      const schedules = await prisma.tourSchedule.findMany({
        where: { 
          tour_id: input 
        },
        include: {
          VehicleAssignments: {
            include: {
              Vehicle: true
            }
          }
        },
        orderBy: {
          start_date: 'asc'
        }
      });
      return schedules;
    }),
});

const locationRouter = t.router({
  getLocations: t.procedure.query(async () => {
    return await prisma.location.findMany();
  }),
});

const tourTypeRouter = t.router({
  getTourTypes: t.procedure.query(async () => {
    return await prisma.tourType.findMany();
  }),
});

const appRouter = t.router({
  vehicle: vehicleRouter,
  user: userRouter,
  tour: TourRouter,
  location: locationRouter,
  tourType: tourTypeRouter,
  getScheduleById: t.procedure
    .input(z.number())
    .query(async ({ input }) => {
      try {
        const schedule = await prisma.tourSchedule.findUnique({
          where: { schedule_id: input },
          include: {
            Tour: {
              select: {
                tour_name: true,
              }
            },
            VehicleAssignments: {
              include: {
                Vehicle: true
              }
            }
          }
        });
        
        if (!schedule) {
          throw new Error('Schedule not found');
        }

        return schedule;
      } catch (error) {
        console.error('Error fetching schedule:', error);
        throw new Error('Could not fetch schedule');
      }
    }),

  createBooking: t.procedure
    .input(z.object({
      user_id: z.string(),
      schedule_id: z.number(),
      number_of_people: z.number(),
      total_price: z.number(),
      special_requests: z.string().optional(),
      booking_status: z.string(),
      payment_status: z.string()
    }))
    .mutation(async ({ input }) => {
      try {
        // Get the vehicle assignment for this schedule
        const vehicleAssignment = await prisma.vehicleAssignment.findFirst({
          where: { schedule_id: input.schedule_id }
        });

        if (!vehicleAssignment) {
          throw new Error('No vehicle assigned to this schedule');
        }

        // Create booking with the vehicle assignment
        const booking = await prisma.booking.create({
          data: {
            user_id: input.user_id,
            schedule_id: input.schedule_id,
            assignment_id: vehicleAssignment.assignment_id,
            booking_date: new Date(),
            number_of_people: input.number_of_people,
            total_price: input.total_price,
            special_requests: input.special_requests,
            booking_status: input.booking_status,
            payment_status: input.payment_status
          }
        });

        // Update available slots in schedule
        await prisma.tourSchedule.update({
          where: { schedule_id: input.schedule_id },
          data: {
            available_slots: {
              decrement: input.number_of_people
            }
          }
        });

        return booking;
      } catch (error) {
        console.error('Error creating booking:', error);
        throw new Error('Could not create booking');
      }
    }),

  updateBookingStatus: t.procedure
    .input(z.object({
      booking_id: z.number(),
      payment_status: z.string(),
      booking_status: z.string()
    }))
    .mutation(async ({ input }) => {
      return prisma.booking.update({
        where: { booking_id: input.booking_id },
        data: {
          payment_status: input.payment_status,
          booking_status: input.booking_status
        }
      });
    }),

  createInvoice: t.procedure
    .input(z.object({
      booking_id: z.number(),
      user_id: z.string(),
      amount: z.number(),
      payment_status: z.string()
    }))
    .mutation(async ({ input }) => {
      return prisma.invoice.create({
        data: {
          booking_id: input.booking_id,
          user_id: input.user_id,
          amount: input.amount,
          date: new Date(),
          payment_status: input.payment_status
        }
      });
    }),

  updateInvoiceStatus: t.procedure
    .input(z.object({
      booking_id: z.number(),
      payment_status: z.string()
    }))
    .mutation(async ({ input }) => {
      return prisma.invoice.updateMany({
        where: { booking_id: input.booking_id },
        data: { payment_status: input.payment_status }
      });
    })
});

app.use(cors());
app.use('/trpc', createExpressMiddleware({ router: appRouter }));
app.use('/api', webhookRouter);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static files from img directory
app.use('/img', express.static(path.join(__dirname, '../img')));

// Cấu hình cloudinary
cloudinary.config({
  cloud_name: 'dzjcbikrl',
  api_key: '191154734859175', 
  api_secret: process.env.CLOUDINARY_SECRET
});

// Cấu hình multer để xử lý upload
const memoryUpload = multer({
  storage: multer.memoryStorage()
});

// Upload endpoint
app.post('/api/upload', memoryUpload.array('images'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    const uploadPromises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        // Tạo stream để upload
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'tours',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result.secure_url);
            else reject(new Error('Upload failed: result is undefined'));
          }
        );

        // Pipe buffer vào stream
        uploadStream.end(file.buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);
    res.json({ imageUrls });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.post('/api/reviews', async (req: Request, res: Response) => {
  try {
    const { tour_id, user_id, rating, comment } = req.body;

    const review = await prisma.review.create({
      data: {
        tour_id: Number(tour_id),
        user_id: user_id,
        rating: Number(rating),
        comment: comment,
        review_date: new Date(),
        created_at: new Date(),
      },
      include: {
        User: {
          select: {
            full_name: true
          }
        }
      }
    });

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: 'Could not create review' });
  }
});

app.get('/api/schedules/:id', async (req: Request, res: Response) => {
  try {
    const scheduleId = parseInt(req.params.id);
    const schedule = await prisma.tourSchedule.findUnique({
      where: { schedule_id: scheduleId },
      include: {
        Tour: true, // Include full tour data
        VehicleAssignments: {
          include: {
            Vehicle: true
          }
        }
      }
    });

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create booking endpoint
app.post('/api/bookings', async (req: Request, res: Response) => {
  try {
    const { user_id, schedule_id, number_of_people, total_price, special_requests } = req.body;
    
    console.log('Creating booking with data:', { user_id, schedule_id, number_of_people, total_price });

    // Convert number_of_people to integer
    const numberOfPeople = parseInt(number_of_people);
    
    // Validate the conversion
    if (isNaN(numberOfPeople)) {
      return res.status(400).json({ error: 'Invalid number of people' });
    }

    // Check if schedule exists and has enough slots
    const schedule = await prisma.tourSchedule.findUnique({
      where: { schedule_id }
    });

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    if (schedule.available_slots < numberOfPeople) {
      return res.status(400).json({ error: 'Not enough available slots' });
    }

    // Get the vehicle assignment
    const vehicleAssignment = await prisma.vehicleAssignment.findFirst({
      where: { schedule_id }
    });

    if (!vehicleAssignment) {
      return res.status(400).json({ error: 'No vehicle assigned to this schedule' });
    }

    // Create booking using transaction to ensure data consistency
    const booking = await prisma.$transaction(async (prisma) => {
      // Create the booking
      const newBooking = await prisma.booking.create({
        data: {
          user_id,
          schedule_id,
          assignment_id: vehicleAssignment.assignment_id,
          booking_date: new Date(),
          number_of_people: numberOfPeople, // Use the converted integer value
          total_price,
          special_requests,
          booking_status: 'PENDING',
          payment_status: 'PENDING'
        }
      });

      // Update available slots
      await prisma.tourSchedule.update({
        where: { schedule_id },
        data: {
          available_slots: {
            decrement: numberOfPeople  // Use the converted integer value
          }
        }
      });

      return newBooking;
    });

    console.log('Booking created successfully:', booking);
    res.status(201).json(booking);

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      error: 'Could not create booking',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/invoices', async (req: Request, res: Response) => {
  try {
    const { booking_id, user_id, amount } = req.body;
    
    console.log('Creating invoice with data:', { booking_id, user_id, amount });

    // Verify booking exists
    const booking = await prisma.booking.findUnique({
      where: { booking_id }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const invoice = await prisma.invoice.create({
      data: {
        booking_id,
        user_id,
        amount,
        date: new Date(),
        payment_status: 'PENDING'
      }
    });

    console.log('Invoice created successfully:', invoice);
    res.status(201).json(invoice);

  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ 
      error: 'Could not create invoice',
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Update booking status endpoint
app.patch('/api/bookings/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { payment_status, booking_status } = req.body;

    const booking = await prisma.booking.update({
      where: { booking_id: Number(id) },
      data: { 
        payment_status,
        booking_status 
      }
    });

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Could not update booking' });
  }
});

// Update invoice status endpoint
app.patch('/api/invoices/booking/:bookingId', async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { payment_status } = req.body;

    const invoice = await prisma.invoice.updateMany({
      where: { booking_id: Number(bookingId) },
      data: { payment_status }
    });

    res.json(invoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Could not update invoice' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

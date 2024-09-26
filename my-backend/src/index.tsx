import express from 'express';
import cors from 'cors';
import { initTRPC } from '@trpc/server';
import { PrismaClient } from '@prisma/client';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();
const t = initTRPC.create();

const userRouter = t.router({
  getUsers: t.procedure.query(async () => {
    return await prisma.user.findMany();
  }),
  addUser: t.procedure.input(z.object({
    name: z.string(),
    email: z.string().email()
  })).mutation(async ({ input }) => {
    return await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
      },
    });
  }),
  deleteUser: t.procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    return await prisma.user.delete({
      where: { id: input.id }, // lấy ID từ body
    });
  }),
});;


app.use(cors());
app.use('/trpc', createExpressMiddleware({ router: userRouter }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});

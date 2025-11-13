import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().datetime().optional()
});

const updateTaskSchema = createTaskSchema.partial();

// All routes require authentication
router.use(authenticate);

// Get all tasks for the authenticated user
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { status, priority } = req.query;

    const tasks = await prisma.task.findMany({
      where: {
        userId: req.userId!,
        ...(status && { status: status as string }),
        ...(priority && { priority: priority as string })
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// Get a single task
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!
      }
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

// Create a task
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const data = createTaskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        userId: req.userId!
      }
    });

    res.status(201).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError('Invalid input', 400));
    } else {
      next(error);
    }
  }
});

// Update a task
router.put('/:id', async (req: AuthRequest, res, next) => {
  try {
    const data = updateTaskSchema.parse(req.body);

    const existingTask = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!
      }
    });

    if (!existingTask) {
      throw new AppError('Task not found', 404);
    }

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined
      }
    });

    res.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError('Invalid input', 400));
    } else {
      next(error);
    }
  }
});

// Delete a task
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const existingTask = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!
      }
    });

    if (!existingTask) {
      throw new AppError('Task not found', 404);
    }

    await prisma.task.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

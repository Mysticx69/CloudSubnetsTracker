import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient, Project } from '@prisma/client';
import path from 'path';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Environment variables
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

// Initialize Express
const app = express();

// Security middleware
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
}));
app.use(express.json());

// Rate limiting for production
if (NODE_ENV === 'production') {
  const rateLimit = require('express-rate-limit');
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }));
}

// Serve static files in production
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../build')));
}

// API Routes
app.get('/api/projects', async (_req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        subnets: true,
      },
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

interface ProjectParams {
  id: string;
}

interface CreateProjectBody {
  name: string;
  description: string;
  vpcCidr: string;
  status?: string;
}

interface ErrorResponse {
  error: string;
}

app.get('/api/projects/:id', async (req: Request<ProjectParams>, res: Response) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        subnets: true,
      },
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/projects', async (req: Request<{}, {}, CreateProjectBody>, res: Response) => {
  const { name, description, vpcCidr, status = 'ACTIVE' } = req.body;
  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        vpcCidr,
        status,
      },
    });
    return res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

interface CreateSubnetBody {
  cidr: string;
  region: string;
  environment: string;
}

app.post('/api/projects/:id/subnets', async (req: Request<ProjectParams, {}, CreateSubnetBody>, res: Response) => {
  try {
    const { cidr, region, environment } = req.body;
    const subnet = await prisma.subnet.create({
      data: {
        cidr,
        region,
        environment,
        projectId: req.params.id,
      },
    });
    res.status(201).json(subnet);
  } catch (error) {
    console.error('Error creating subnet:', error);
    res.status(500).json({ error: 'Failed to create subnet' });
  }
});

app.delete('/api/projects/:id', async (req: Request<ProjectParams>, res: Response) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

interface UpdateProjectBody {
  name?: string;
  description?: string;
  vpcCidr?: string;
  status?: string;
}

app.put('/api/projects/:id', async (req: Request<ProjectParams, {}, UpdateProjectBody>, res: Response) => {
  const { id } = req.params;
  const { name, description, vpcCidr, status } = req.body;
  
  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(vpcCidr && { vpcCidr }),
        ...(status && { status }),
      },
    });
    return res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return res.status(400).json({ error: 'A project with this name already exists' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve React app in production
if (NODE_ENV === 'production') {
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../build/index.html'));
  });
}

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
}); 
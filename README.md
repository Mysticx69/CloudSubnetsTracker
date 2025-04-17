# Cloud Subnets Tracker

A full-stack application for tracking cloud subnets, built with React, Express, and PostgreSQL.

## Architecture Overview

### Frontend (React)
- Built with React and Material-UI
- TypeScript for type safety
- Responsive design
- Real-time updates

### Backend (Express)
- RESTful API
- TypeScript for type safety
- Express for routing and middleware
- PM2 for process management

### Database (PostgreSQL)
- Prisma ORM for database operations
- PostgreSQL for data persistence
- Automatic migrations
- Data validation

## Production Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- PM2 (for process management)
- Nginx (optional, for reverse proxy)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cloud-subnets-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
cp .env.example .env.production
```

4. Configure database:
```bash
# Update DATABASE_URL in .env.production
DATABASE_URL="postgresql://user:password@localhost:5432/cloud_project_tracker?schema=public"
```

5. Deploy database schema:
```bash
npm run prisma:deploy
```

### Production Deployment

1. Build the application:
```bash
npm run prod:prepare
```

2. Set up PM2:
```bash
sudo npm install -g pm2
sudo pm2 startup
pm2 start ecosystem.config.js --env production
pm2 save
```

3. Verify the application is running:
```bash
pm2 status
```

### Process Management

The application runs under PM2 with the following configuration:
- Single instance mode (can be scaled to cluster mode)
- Auto-restart on crashes
- Memory limit of 1GB
- Production environment variables

To manage the application:
```bash
# View status
pm2 status

# View logs
pm2 logs

# Restart application
pm2 restart cloud-subnets-tracker

# Stop application
pm2 stop cloud-subnets-tracker
```

## Data Persistence

The application uses PostgreSQL for data persistence with the following models:

### Project Model
- `id`: Unique identifier (UUID)
- `name`: Project name
- `description`: Project description
- `vpcCidr`: VPC CIDR block
- `status`: Project status (ACTIVE, COMPLETED, ON_HOLD)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `subnets`: Related subnets (one-to-many relationship)

### Subnet Model
- `id`: Unique identifier (UUID)
- `cidr`: Subnet CIDR block
- `region`: Cloud region
- `environment`: Environment type (DEV, STAGING, PROD)
- `projectId`: Related project ID
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Workflow

### Development Workflow
1. Create/update Prisma schema
2. Generate Prisma client
3. Implement API endpoints
4. Develop frontend components
5. Test locally
6. Deploy to production

### Production Workflow
1. Code changes are pushed to repository
2. Build process creates optimized production files
3. PM2 manages the Node.js process
4. Database migrations are applied
5. Application serves both API and static files

### Data Flow
1. Frontend makes API requests to Express server
2. Express server uses Prisma to interact with PostgreSQL
3. Data is validated and persisted
4. Frontend receives updates and re-renders

## Security

- Rate limiting enabled in production
- CORS configured for allowed origins
- Environment variables for sensitive data
- Database credentials secured
- PM2 process isolation

## Monitoring

The application can be monitored using:
- PM2 monitoring tools
- Database logs
- Application logs
- System metrics

## Troubleshooting

Common issues and solutions:
1. Database connection issues
   - Check DATABASE_URL in .env.production
   - Verify PostgreSQL is running
   - Check network connectivity

2. Application crashes
   - Check PM2 logs: `pm2 logs`
   - Verify memory limits
   - Check for database errors

3. Build issues
   - Clear node_modules and reinstall
   - Check TypeScript version compatibility
   - Verify all dependencies are installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

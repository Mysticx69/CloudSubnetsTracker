# Cloud Subnets Tracker

A full-stack application for tracking cloud subnets, built with React, Express, and PostgreSQL. The application manages subnet allocation in the 172.16.x.0/24 range.

## Quick Production Deployment Guide

### 1. System Requirements
- Node.js v18 or higher
- PostgreSQL 12 or higher
- PM2 (for process management)
- Git

### 2. PostgreSQL Setup
```bash
# Install PostgreSQL if not already installed
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database user
sudo -u postgres createuser --interactive
# Enter name: cloud_user
# Make as superuser: yes

# Set password for the user
sudo -u postgres psql
postgres=# \password cloud_user
# Enter password: reF2mlCP17Y1
postgres=# \q

# Create database
sudo -u postgres createdb cloud_subnets_tracker
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cloud_subnets_tracker TO cloud_user;"
```

### 3. Application Setup
```bash
# Clone repository
git clone <repository-url>
cd cloud-subnets-tracker

# Install dependencies
npm install

# Install PM2 globally
sudo npm install -g pm2
```

### 4. Environment Configuration
```bash
# Create .env file
cat > .env << EOL
DATABASE_URL="postgresql://cloud_user:reF2mlCP17Y1@localhost:5432/cloud_subnets_tracker?schema=public"
EOL
```

### 5. Build and Deploy
```bash
# Prepare production build
npm run prod:prepare

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
sudo pm2 startup
```

### 6. Verify Deployment
```bash
# Check application status
pm2 status

# View logs
pm2 logs cloud-subnets-tracker
```

## Management Commands

### Application Management
```bash
# Restart application
pm2 restart cloud-subnets-tracker

# Stop application
pm2 stop cloud-subnets-tracker

# View logs
pm2 logs cloud-subnets-tracker

# Monitor resources
pm2 monit
```

### Database Management
```bash
# Connect to database
psql -U cloud_user -d cloud_subnets_tracker

# Backup database
pg_dump -U cloud_user cloud_subnets_tracker > backup.sql

# Restore database
psql -U cloud_user cloud_subnets_tracker < backup.sql
```

## Application Features
- Subnet management in 172.16.x.0/24 range
- Project status tracking (In Progress, Production, Decommissioned)
- Multiple cloud provider support (AWS, OVH, CloudAvenue)
- Real-time status updates
- Project filtering by status

## Troubleshooting

### Common Issues

1. Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check database connection
psql -U cloud_user -d cloud_subnets_tracker -c "\conninfo"
```

2. Application Not Starting
```bash
# Check PM2 logs
pm2 logs cloud-subnets-tracker

# Verify environment variables
pm2 env 0
```

3. Port Conflicts
```bash
# Check if port 3000 is in use
sudo lsof -i :3000

# Change port in ecosystem.config.js if needed
```

### Support
For additional support or to report issues, please create an issue in the repository.

## Security Notes
- Always change default database passwords in production
- Use appropriate firewall rules
- Keep Node.js and dependencies updated
- Regularly backup the database

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

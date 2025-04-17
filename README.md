# Cloud Subnets Tracker

A full-stack application for tracking cloud subnets, built with React. The application manages subnet allocation in the 172.16.x.0/24 range.

## Quick Production Deployment Guide

### 1. System Requirements
- Node.js v18 or higher
- PM2 (for process management)
- Git

### 2. Application Setup
```bash
# Clone repository
git clone <repository-url>
cd cloud-subnets-tracker

# Install dependencies
npm install

# Install PM2 globally
sudo npm install -g pm2
```

### 3. Build and Deploy
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

### 4. Verify Deployment
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

## Application Features
- Subnet management in 172.16.x.0/24 range
- Project status tracking (In Progress, Running, Decommissioned)
- Multiple cloud provider support (AWS, OVH, CloudAvenue)
- Real-time status updates
- Project filtering by status

## Troubleshooting

### Common Issues

1. Application Not Starting
```bash
# Check PM2 logs
pm2 logs cloud-subnets-tracker

# Verify environment variables
pm2 env 0
```

2. Port Conflicts
```bash
# Check if port 3000 is in use
sudo lsof -i :3000

# Change port in ecosystem.config.js if needed
```

### Support
For additional support or to report issues, please create an issue in the repository.

## Security Notes
- Keep Node.js and dependencies updated
- Use appropriate firewall rules

## Architecture Overview

### Frontend (React)
- Built with React and Material-UI
- TypeScript for type safety
- Responsive design
- Real-time updates

## Data Persistence

The application uses browser's localStorage for data persistence with the following characteristics:

### Current Implementation
- Data is stored in the browser's localStorage
- Data persists across page refreshes within the same browser
- Data is not shared between different browsers
- Data is stored locally on the user's machine

### Project Data Structure
- `id`: Unique identifier (UUID)
- `name`: Project name
- `description`: Project description
- `status`: Project status (In Progress, Running, Decommissioned)
- `subnet`: Subnet CIDR block in 172.16.x.0/24 range
- `createdAt`: Creation timestamp

## Workflow

### Development Workflow
1. Develop frontend components
2. Test locally
3. Deploy to production

### Production Workflow
1. Code changes are pushed to repository
2. Build process creates optimized production files
3. PM2 manages the Node.js process
4. Application serves static files

## Security

- CORS configured for allowed origins
- Environment variables for sensitive data
- PM2 process isolation

## Monitoring

The application can be monitored using:
- PM2 monitoring tools
- Application logs
- System metrics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

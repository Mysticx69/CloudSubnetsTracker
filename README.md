# Cloud Subnets Tracker

A modern web application for tracking and managing cloud infrastructure subnets across different providers. Built with React, TypeScript, and Material-UI.

## Features

- 🚀 Create and manage cloud infrastructure projects
- 🔄 Track project status (In Progress, Running, Decommissioned)
- 🌐 Support for multiple cloud providers (AWS, OVH, CloudAvenue)
- 📊 Automatic subnet allocation and management
- 🎨 Modern, responsive UI with Material-UI components
- 🔒 Data persistence with JSON file storage
- ⚡ Real-time status updates

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Material-UI (MUI)
  - Vite

- **Backend:**
  - Node.js
  - Express
  - PM2 (Process Manager)

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- PM2 (for production deployment)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cloud-subnets-tracker
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

## Development

1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

## Production Deployment

1. Build the frontend:
   ```bash
   npm run prod:build
   ```

2. Start the services using PM2:
   ```bash
   pm2 start ecosystem.config.js
   ```

3. Monitor the services:
   ```bash
   pm2 monit
   ```

## Project Structure

```
cloud-subnets-tracker/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── types/             # TypeScript type definitions
│   └── App.tsx            # Main application component
├── server/                 # Backend server code
│   ├── data.json          # Data storage
│   └── index.js           # Express server
├── ecosystem.config.js     # PM2 configuration
└── package.json           # Project dependencies
```

## API Endpoints

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

## Data Structure

Projects are stored with the following structure:
```typescript
interface Project {
  id: string;              // UUID
  name: string;            // Project name
  status: ProjectStatus;   // In Progress | Running | Decommissioned
  provider: CloudProvider; // AWS | OVH | CloudAvenue
  subnet: string;          // Automatically allocated subnet (e.g., 172.16.1.0/24)
  createdAt: Date;         // Creation timestamp
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

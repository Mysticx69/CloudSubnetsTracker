module.exports = {
  apps: [
    {
      name: 'cloud-subnets-tracker-frontend',
      script: 'npx',
      args: 'serve -s build -l 3000',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G'
    },
    {
      name: 'cloud-subnets-tracker-backend',
      script: 'node',
      args: 'server/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      watch: false,
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G'
    }
  ]
}; 
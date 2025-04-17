module.exports = {
  apps: [{
    name: 'cloud-subnets-tracker',
    script: 'dist/server/index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}; 
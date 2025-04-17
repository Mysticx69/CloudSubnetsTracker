module.exports = {
  apps: [{
    name: 'cloud-subnets-tracker',
    script: 'npx',
    args: 'serve -s build',
    env: {
      NODE_ENV: 'production',
    },
    watch: false,
    instances: 1,
    autorestart: true,
    max_memory_restart: '1G'
  }]
}; 
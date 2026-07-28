module.exports = {
  apps: [{
    name: 'viberoom-server',
    script: './dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: { NODE_ENV: 'production' },
    log_file: './logs/combined.log',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    time: true
  }]
}

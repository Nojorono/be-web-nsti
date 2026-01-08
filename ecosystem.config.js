module.exports = {
  apps: [
    {
      name: 'nikki-backend',
      script: './bin/http.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      // Uncomment dan sesuaikan jika perlu explicit Node.js 20 path
      // interpreter: '/home/nikkisu1/nodevenv/back-api.nikkisuper.my.id/nikkiBE/20/bin/node',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};


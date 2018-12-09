module.exports = {
  apps : [{
    name: 'Rootin',
    script: './build/index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '2G',
    env: {
      NODE_ENV: 'production',
      port: 8000
    },
    out_file: '/logs/stdout.log',
    error_file: '/logs/stderr.log'
  }],

  /*
   TODO: Evaluate this later.
  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }*/
};

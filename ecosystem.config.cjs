module.exports = {
  apps: [
    {
      name: 'yuzunav',
      port: 3000,
      exec_mode: 'fork',
      instances: 1,
      script: './.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}

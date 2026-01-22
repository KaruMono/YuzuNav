const path = require('path')
const fs = require('fs')

// 读取 .env 文件
const envPath = path.join(__dirname, '.env')
const envVars = {}

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
      }
    }
  })
}

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
        ...envVars,
      },
    },
  ],
}

# YuzuACG - ACG 资源导航网站

基于 Nuxt 3 构建的现代化 ACG 资源导航平台，支持用户注册、网站提交、评论、后台管理等功能。

## 技术栈

- **前端框架**: Nuxt 3
- **UI 样式**: Tailwind CSS
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **文件存储**: AWS S3 (或兼容 S3 的服务，如 MinIO)
- **认证**: JWT
- **邮件服务**: SMTP

## 功能特性

- ✅ 用户注册/登录（支持邮件验证）
- ✅ 网站提交和管理
- ✅ 评论系统（支持回复）
- ✅ 网站收藏
- ✅ 后台管理（网站审核、分类管理、系统设置、用户管理）
- ✅ 响应式设计（支持深色模式）
- ✅ 文件上传（头像、网站 Logo）
- ✅ 网站标签管理
- ✅ 评论开关控制
- ✅ 多链接支持

## 安装配置教程

### 一、环境要求

- Node.js >= 18.0.0
- PostgreSQL >= 12.0
- npm 或 yarn 或 pnpm

### 二、克隆项目

```bash
git clone <your-repo-url>
cd YuzuNav
```

### 三、安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 四、配置环境变量

1. 复制环境变量示例文件：

```bash
cp env.example .env
```

2. 编辑 `.env` 文件，配置以下内容：

#### 4.1 数据库配置

```env
DATABASE_URL="postgresql://用户名:密码@localhost:5432/数据库名?schema=public"
```

**示例：**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/yuzunav?schema=public"
```

**PostgreSQL 安装指南：**

- **Windows**: 下载安装包从 [PostgreSQL 官网](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql@14`
- **Linux (Ubuntu/Debian)**: `sudo apt-get install postgresql postgresql-contrib`

创建数据库：
```sql
CREATE DATABASE yuzunav;
```

#### 4.2 JWT 密钥配置

```env
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

**重要提示：** 生产环境请使用强随机字符串，可以使用以下命令生成：

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32
```

#### 4.3 S3 文件存储配置

**选项 1：使用 AWS S3**

```env
S3_ACCESS_KEY_ID="your-aws-access-key-id"
S3_SECRET_ACCESS_KEY="your-aws-secret-access-key"
S3_REGION="us-east-1"
S3_BUCKET="your-bucket-name"
# S3_ENDPOINT 留空或注释掉
```

**选项 2：使用 MinIO（本地 S3 兼容服务）**

1. 安装 MinIO：
```bash
# 使用 Docker
docker run -d -p 9000:9000 -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"
```

2. 配置环境变量：
```env
S3_ACCESS_KEY_ID="minioadmin"
S3_SECRET_ACCESS_KEY="minioadmin"
S3_REGION="us-east-1"
S3_BUCKET="yuzunav"
S3_ENDPOINT="http://localhost:9000"
```

访问 MinIO 控制台：http://localhost:9001

#### 4.4 SMTP 邮件配置

**使用 Gmail 示例：**

1. 启用 Gmail 两步验证
2. 生成应用专用密码：
   - 访问 [Google 账户管理](https://myaccount.google.com/)
   - 安全 → 两步验证 → 应用专用密码
   - 生成密码并保存

3. 配置环境变量：
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="YuzuACG <your-email@gmail.com>"
```

**使用其他邮件服务：**

- **QQ 邮箱**:
```env
SMTP_HOST="smtp.qq.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-qq@qq.com"
SMTP_PASSWORD="授权码"  # 在QQ邮箱设置中获取
SMTP_FROM="YuzuACG <your-qq@qq.com>"
```

- **163 邮箱**:
```env
SMTP_HOST="smtp.163.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="your-email@163.com"
SMTP_PASSWORD="授权码"
SMTP_FROM="YuzuACG <your-email@163.com>"
```

#### 4.5 应用配置

```env
# 应用访问地址（用于邮件中的链接）
APP_URL="http://localhost:3000"

# 是否启用邮件验证（true/false）
ENABLE_EMAIL_VERIFICATION="true"

# Node 环境
NODE_ENV="development"
```

### 五、初始化数据库

1. 生成 Prisma Client：

```bash
npm run db:generate
```

2. 推送数据库架构到数据库：

```bash
# 开发环境推荐（直接同步架构）
npm run db:push

# 或使用迁移（生产环境推荐）
npm run db:migrate
```

3. 使用 Prisma Studio 可视化管理数据库（可选）：

```bash
npm run db:studio
```

访问 http://localhost:5555 打开 Prisma Studio

### 六、创建管理员账户

#### 方法 1：使用 Prisma Studio（推荐）

1. 运行 `npm run db:studio`
2. 打开 `users` 表
3. 点击 "Add record"
4. 填写以下字段：
   - `id`: 留空（自动生成）
   - `email`: 你的邮箱地址
   - `password_hash`: 使用以下命令生成密码哈希
   - `username`: 你的用户名（可选）
   - `email_verified`: `true`
   - `role`: `admin`
   - `created_at`: 留空（自动生成）

**生成密码哈希：**

```bash
# 使用 Node.js
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(hash => console.log(hash))"
```

#### 方法 2：使用 SQL 直接插入

```sql
-- 首先需要安装 pgcrypto 扩展（如果还没有）
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 插入管理员账户（密码需要先使用上面的命令生成哈希）
INSERT INTO users (id, email, password_hash, username, email_verified, role, created_at, updated_at)
VALUES (
  gen_random_uuid()::text,
  'admin@example.com',
  '$2a$10$YourGeneratedHashHere',  -- 替换为生成的哈希
  'Admin',
  true,
  'admin',
  NOW(),
  NOW()
);
```

#### 方法 3：使用临时脚本

创建 `scripts/create-admin.js`：

```javascript
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2] || 'admin@example.com';
  const password = process.argv[3] || 'admin123';
  const username = process.argv[4] || 'Admin';

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      username,
      emailVerified: true,
      role: 'admin',
    },
  });

  console.log('管理员账户创建成功！');
  console.log('邮箱:', user.email);
  console.log('用户名:', user.username);
  console.log('角色:', user.role);
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

运行脚本：

```bash
node scripts/create-admin.js admin@example.com admin123 Admin
```

### 七、初始化分类数据（可选）

使用 Prisma Studio 或 SQL 添加初始分类：

```sql
INSERT INTO categories (name, slug, icon, sort_order, created_at, updated_at)
VALUES
  ('在线动画', 'anime', 'fas fa-tv', 1, NOW(), NOW()),
  ('游戏资源', 'game', 'fas fa-gamepad', 2, NOW(), NOW()),
  ('艺术插画', 'art', 'fas fa-paint-brush', 3, NOW(), NOW()),
  ('无损音乐', 'music', 'fas fa-music', 4, NOW(), NOW());
```

### 八、启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 九、生产环境部署

#### 9.1 构建项目

```bash
npm run build
```

#### 9.2 预览生产构建

```bash
npm run preview
```

#### 9.3 使用 PM2 部署（推荐）

1. 安装 PM2：

```bash
npm install -g pm2
```

2. 创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'yuzunav',
    script: '.output/server/index.mjs',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

3. 启动应用：

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 9.4 使用 Docker 部署

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

构建和运行：

```bash
docker build -t yuzunav .
docker run -d -p 3000:3000 --env-file .env yuzunav
```

## 项目结构

```
yuzunav/
├── server/              # 服务端代码
│   ├── api/            # API 路由
│   │   ├── auth/       # 认证相关
│   │   ├── sites/      # 网站管理
│   │   ├── comments/   # 评论
│   │   ├── admin/      # 后台管理
│   │   └── upload/     # 文件上传
│   ├── utils/          # 工具函数
│   │   ├── db.ts       # 数据库连接
│   │   ├── jwt.ts      # JWT 工具
│   │   ├── s3.ts       # S3 客户端
│   │   └── email.ts    # SMTP 邮件
│   └── middleware/     # 服务端中间件
├── components/         # Vue 组件
│   └── layout/         # 布局组件
├── pages/              # 页面路由
│   ├── index.vue       # 首页
│   ├── site/[id].vue   # 网站详情
│   ├── login.vue       # 登录
│   ├── register.vue    # 注册
│   └── admin/          # 后台页面
├── composables/        # 组合式函数
│   ├── useAuth.ts      # 认证状态
│   ├── useSites.ts     # 网站数据
│   └── useComments.ts  # 评论功能
├── middleware/         # 路由中间件
├── assets/             # 静态资源
├── prisma/             # Prisma 配置
│   └── schema.prisma   # 数据库模型
└── public/             # 公共文件
```

## API 端点

### 认证

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 退出登录
- `GET /api/auth/me` - 获取当前用户信息
- `GET /api/auth/verify-email?token=xxx` - 验证邮箱

### 网站

- `GET /api/sites` - 获取网站列表
- `GET /api/sites/:id` - 获取网站详情
- `POST /api/sites` - 创建网站
- `PUT /api/sites/:id` - 更新网站
- `DELETE /api/sites/:id` - 删除网站
- `POST /api/sites/:id/favorite` - 收藏/取消收藏

### 评论

- `GET /api/comments?siteId=xxx` - 获取评论列表
- `POST /api/comments` - 创建评论
- `DELETE /api/comments/:id` - 删除评论

### 分类

- `GET /api/categories` - 获取分类列表

### 上传

- `POST /api/upload` - 上传文件

### 后台管理（需要管理员权限）

- `GET /api/admin/stats` - 获取统计数据
- `GET /api/admin/sites` - 获取网站列表（含待审核）
- `POST /api/admin/sites/:id/approve` - 批准网站
- `POST /api/admin/sites/:id/reject` - 拒绝网站
- `GET /api/admin/categories` - 获取分类列表
- `POST /api/admin/categories` - 创建分类
- `PUT /api/admin/categories/:id` - 更新分类
- `DELETE /api/admin/categories/:id` - 删除分类
- `GET /api/admin/users` - 获取用户列表
- `PUT /api/admin/users/:id` - 更新用户信息
- `GET /api/admin/settings` - 获取系统设置
- `POST /api/admin/settings` - 保存系统设置

## 常见问题

### Q: 数据库连接失败？

A: 检查以下几点：
1. PostgreSQL 服务是否运行
2. `DATABASE_URL` 配置是否正确
3. 数据库用户是否有权限
4. 防火墙是否阻止连接

### Q: S3 上传失败？

A: 检查以下几点：
1. S3 凭证是否正确
2. 存储桶是否存在
3. 存储桶权限设置是否正确
4. 如果使用 MinIO，检查端点地址

### Q: 邮件发送失败？

A: 检查以下几点：
1. SMTP 配置是否正确
2. 是否使用了应用专用密码（Gmail）
3. 邮箱服务商是否允许 SMTP 访问
4. 防火墙是否阻止 SMTP 端口

### Q: 如何重置管理员密码？

A: 使用 Prisma Studio 或 SQL 更新密码哈希：

```sql
-- 生成新密码哈希后替换
UPDATE users 
SET password_hash = '$2a$10$NewHashHere' 
WHERE email = 'admin@example.com';
```

### Q: 如何备份数据库？

A: 使用 PostgreSQL 备份命令：

```bash
pg_dump -U postgres yuzunav > backup.sql
```

恢复：

```bash
psql -U postgres yuzunav < backup.sql
```

## 开发说明

### 数据库迁移

```bash
# 创建新迁移
npm run db:migrate

# 应用迁移
npm run db:push
```

### Prisma Studio

可视化数据库管理工具：

```bash
npm run db:studio
```

## 许可证

ISC

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0
- 初始版本发布
- 用户认证系统
- 网站管理功能
- 评论系统
- 后台管理界面
- 文件上传功能
- 邮件验证功能

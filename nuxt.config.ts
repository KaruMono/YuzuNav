// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-01-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  nitro: {
    // 配置静态资源目录
    publicAssets: [
      {
        dir: 'uploads',
        baseURL: '/uploads',
        maxAge: 60 * 60 * 24 * 7, // 7天缓存
      },
    ],
  },
  runtimeConfig: {
    // 私有配置（仅在服务端可用）
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/yuzunav',
    s3AccessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    s3Region: process.env.S3_REGION || 'us-east-1',
    s3Bucket: process.env.S3_BUCKET || '',
    s3Endpoint: process.env.S3_ENDPOINT || '',
    s3CdnUrl: process.env.S3_CDN_URL || '',
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: parseInt(process.env.SMTP_PORT || '587'),
    smtpSecure: process.env.SMTP_SECURE === 'true',
    smtpUser: process.env.SMTP_USER || '',
    smtpPassword: process.env.SMTP_PASSWORD || '',
    smtpFrom: process.env.SMTP_FROM || '',
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    // 存储配置
    storageType: process.env.STORAGE_TYPE || '',
    // 公共配置（客户端也可访问）
    public: {
      enableEmailVerification: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
      // 网站配置（环境变量预配置，可被数据库覆盖）
      siteName: process.env.SITE_NAME || '',
      siteSubtitle: process.env.SITE_SUBTITLE || '',
      siteIconType: process.env.SITE_ICON_TYPE || '',
      siteIcon: process.env.SITE_ICON || '',
      siteIconColor: process.env.SITE_ICON_COLOR || '',
      siteLogoUrl: process.env.SITE_LOGO_URL || '',
      // CDN 配置
      cdnProvider: process.env.CDN_PROVIDER || '',
      customCdnUrl: process.env.CUSTOM_CDN_URL || '',
      // SEO 配置
      seoTitle: process.env.SEO_TITLE || '',
      seoDescription: process.env.SEO_DESCRIPTION || '',
      seoKeywords: process.env.SEO_KEYWORDS || '',
      faviconUrl: process.env.FAVICON_URL || '',
      appleTouchIconUrl: process.env.APPLE_TOUCH_ICON_URL || '',
    }
  },
  app: {
    head: {
      title: '网站导航',
      htmlAttrs: {
        lang: 'zh-CN',
      },
      script: [
        {
          innerHTML: `
            (function() {
              try {
                var savedMode = localStorage.getItem('color-mode');
                var isDark = savedMode === 'dark' || (savedMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            })();
          `,
          type: 'text/javascript',
        }
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary' },
      ],
      link: [
        // Font Awesome 改为动态加载，根据后台 CDN 设置
        { rel: 'canonical', href: process.env.APP_URL || 'http://localhost:3000' },
      ]
    }
  }
})

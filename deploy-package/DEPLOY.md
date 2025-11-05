# 部署说明

## 📦 部署包内容

这个文件夹包含了所有需要部署到服务器的文件。

## 🚀 部署步骤

### 1. 上传文件到服务器

将整个 `deploy-package` 文件夹上传到你的服务器（通过 FTP、SCP 或其他方式）。

```bash
# 示例：使用 SCP 上传
scp -r deploy-package your-user@your-server:/path/to/app
```

### 2. 连接到服务器

```bash
ssh your-user@your-server
cd /path/to/app/deploy-package
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填写你的配置：

```bash
cp .env.example .env.local
nano .env.local
```

**必须配置的环境变量：**

```bash
# Pinata IPFS API
PINATA_JWT=your_pinata_jwt_token_here

# Alchemy Sepolia RPC
NEXT_PUBLIC_API_KEY=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# 部署的智能合约地址
NEXT_PUBLIC_MARKET_ADDRESS=0x46c8BF67BF0e7260654Ec873401B438e0530cbCa

# Etherscan API（可选）
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### 4. 安装依赖

```bash
npm install --production
```

### 5. 启动应用

```bash
# 方式 1: 直接启动（测试用）
npm start

# 方式 2: 使用 PM2（推荐生产环境）
npm install -g pm2
pm2 start npm --name "nft-marketplace" -- start
pm2 save
pm2 startup
```

应用将在 **http://your-server-ip:3000** 运行。

### 6. 配置反向代理（可选但推荐）

使用 Nginx 将域名指向应用：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📋 服务器要求

- **Node.js**: v16 或更高版本
- **内存**: 至少 1GB RAM
- **端口**: 3000（或配置其他端口）

## 🔧 常用命令

```bash
# 查看运行状态（PM2）
pm2 status

# 查看日志
pm2 logs nft-marketplace

# 重启应用
pm2 restart nft-marketplace

# 停止应用
pm2 stop nft-marketplace
```

## ⚠️ 注意事项

1. **不要提交** `.env.local` 文件到版本控制
2. **确保防火墙** 开放了 3000 端口（或你配置的端口）
3. **建议使用** HTTPS（Let's Encrypt）保护用户数据
4. **定期备份** 环境变量配置

## 🆘 故障排查

### 应用无法启动
- 检查 Node.js 版本：`node -v`
- 检查端口占用：`lsof -i :3000`
- 查看错误日志：`pm2 logs`

### 图片上传失败
- 检查 `PINATA_JWT` 是否正确配置
- 检查 Pinata API 配额

### 连接不上区块链
- 检查 `NEXT_PUBLIC_API_KEY` 是否正确
- 检查 Alchemy API 配额

## 📞 获取帮助

遇到问题？查看主 README.md 的故障排查部分。

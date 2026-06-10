# GitHub 代码上传完整指南

## 📋 前置准备
1. 注册 GitHub 账号：https://github.com/
2. 安装 Git：https://git-scm.com/downloads
3. 配置 Git 用户名和邮箱：
   ```bash
   git config --global user.name "你的GitHub用户名"
   git config --global user.email "你的GitHub邮箱"
   ```

## 🚀 上传步骤

### 第1步：在 GitHub 上创建新仓库
- 登录 GitHub 后，点击右上角「+」→「New repository」
- 仓库名称：`tiktok-auction`
- 选择 Public 或 Private
- **不要**勾选 "Initialize this repository with a README"
- 点击「Create repository」

### 第2步：本地初始化 Git 仓库
在项目根目录 `c:\Users\42279\Desktop\tiktok` 下执行：
```bash
cd c:\Users\42279\Desktop\tiktok
git init
git add .
git commit -m "feat: 实时竞拍全栈系统完整提交"
```

### 第3步：关联远程仓库并推送
替换下面的 `你的用户名` 为你实际的 GitHub 用户名：
```bash
git remote add origin https://github.com/你的用户名/tiktok-auction.git
git branch -M main
git push -u origin main
```

## ✅ 推送完成
刷新你的 GitHub 仓库页面，就能看到所有代码已经上传成功了！

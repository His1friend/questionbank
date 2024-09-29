



# 题库系统

## 项目简介

题库系统是一个基于 Vue 3 前端框架和 Spring Boot 后端框架开发的在线题库管理系统。用户可以通过该系统进行题目的添加、修改、删除和答题等操作，支持多种题型（如单选题、多选题和主观题）。系统还具备题目分类、知识点管理、用户管理等功能。

## 功能说明

- **题目管理**: 支持添加、编辑、删除题目，题目类型包括单选、多选、主观题等。
- **分类与知识点管理**: 可对题目进行分类并关联到不同的知识点。
- **答题功能**: 用户可以在线答题，支持单选、多选及主观题作答。
- **用户管理**: 支持用户注册、登录、权限管理功能。
- **统计功能**: 显示用户答题的正确率、题目通过率等统计信息。
- **身份验证**: 采用 JWT（JSON Web Token）技术进行用户身份验证。

## 技术栈

- **前端**: Vue 3, Vue Router, Vuex, Axios
- **后端**: Spring Boot, MyBatis
- **数据库**: MySQL
- **身份验证**: JWT (JSON Web Token)
- **桌面端发布**: Electron

## 项目结构

```
project-root
│
├── frontend/               # 前端项目
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/                # 后端项目
│   ├── src/
│   └── pom.xml
│
├── docs/                   # 文档
│
└── README.md               # 项目说明文件
```

## 安装与运行

### 前端部分

1. 安装前端依赖：
   ```bash
   cd frontend
   npm install
   ```

2. 启动前端开发服务器：
   ```bash
   npm run serve
   ```

### 后端部分

1. 安装后端依赖并启动：
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

2. 确保已配置好 MySQL 数据库，并在 `application.yml` 中设置数据库连接信息。

### 数据库配置

确保已在 MySQL 中创建了对应的数据库，并在 `backend/src/main/resources/application.yml` 文件中修改以下配置：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/questionbank
    username: root
    password: yourpassword
```

### 初始化数据库

执行数据库初始化脚本，位于 `backend/src/main/resources/sql/init.sql` 中，运行该脚本以创建所需的数据表。

### 打包项目

- 打包前端应用：
  ```bash
  npm run build
  ```

- 后端打包：
  ```bash
  mvn clean package
  ```

### 使用 Electron 发布桌面应用

1. 安装 Electron 依赖：
   ```bash
   npm install electron
   ```

2. 打包桌面应用：
   ```bash
   npm run electron:build
   ```

## 使用说明

1. 注册并登录账号，登录后即可进行题目的创建和管理。
2. 添加新题目时，可选择题目类型并填写题目信息，保存后会自动同步到后台数据库。
3. 进入答题页面，选择题目类型进行答题，系统会记录答题情况并显示统计数据。
4. 管理员可以通过后台管理系统对所有题目进行管理。

## 贡献指南

欢迎对该项目进行贡献！如果你有任何建议或发现了 bug，请提交 Issue 或发起 Pull Request。


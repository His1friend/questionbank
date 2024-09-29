<template>
      <div class="logo-container">
        <img :src="require('@/assets/logo.png')" alt="Logo" class="logo" />
        <span class="logo-text">题库系统</span>
      </div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >

      <el-menu-item index="1" @click="handleSelect('home')">
        <i class="el-icon-house"></i> 首页
      </el-menu-item>
      <el-menu-item index="2" @click="handleSelect('QuestionController')">
        <i class="el-icon-edit-outline"></i> 题库管理
      </el-menu-item>
      <el-menu-item index="3" @click="handleSelect('exam')">
        <i class="el-icon-notebook-2"></i> 考试
      </el-menu-item>
      <el-submenu index="5" class="menu-item-right">
        <template #title>
          <i class="el-icon-user"></i> 用户
        </template>
        <el-menu-item index="5-1" @click="handleSelect('profile')">个人中心</el-menu-item>
        <el-menu-item index="5-2" @click="handleSelect('logout')">退出登录</el-menu-item>
      </el-submenu>
    </el-menu>
  </template>
  <script>
  export default {
    data() {
      return {
        activeIndex: '1',
      };
    },
    methods: {
      handleSelect(route) {
        this.$router.push({ name: route });
      }
    }
  };
  </script>
  <style scoped>
  .el-menu-demo {
    display: flex;
    justify-content: space-between; /* 分散对齐子项 */
  }
  
  .menu-item-right {
    margin-left: auto; /* 推动子菜单到右侧 */
  }
  .logo{
    width: 100px;
  height: auto;
  margin-right: 10px;
  }
  .logo-text{
    color: #0b7df0;
  font-size: 30px;
  font-weight: bold;
  margin-right: 10px;

  }
  .logo-container {
  display: flex;
  justify-content: space-between; /* Space between logo and text */
  align-items: center;
  width: 100%;
  padding: 10px;
}
  .menu-container {
  display: flex;
  flex-direction: column;
  align-items: left;
  background-color: #c68121;
}
  </style>
  
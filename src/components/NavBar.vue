<template>
  <div class="page-container">
    <div class="button-container">
      <button type="button" class="neo-button" aria-label="题库系统">
        <span class="button-text">题库系统</span>
        <div class="button-glow"></div>
      </button>
    </div>

    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo cyber-menu"
      mode="horizontal"
      text-color="#E4F1FE"
      active-text-color="#00FFFF"
    >
      <el-menu-item index="1" @click="handleSelect('home')" class="menu-item">
        <i class="el-icon-house menu-icon"></i> 首页
      </el-menu-item>
      <el-menu-item index="2" @click="handleSelect('QuestionController')" class="menu-item">
        <i class="el-icon-edit-outline menu-icon"></i> 题库管理
      </el-menu-item>
      <el-menu-item index="3" @click="handleSelect('exam')" class="menu-item">
        <i class="el-icon-notebook-2 menu-icon"></i> 考试
      </el-menu-item>
      <el-menu-item index="4" @click="handleSelect('KnowledgeMap')" class="menu-item">
        <i class="el-icon-notebook-2 menu-icon"></i> 知识图谱
      </el-menu-item>
      <el-submenu index="5" class="menu-item-right">
        <template #title>
          <i class="el-icon-user menu-icon"></i> 用户
        </template>
        <el-menu-item index="5-1" @click="handleSelect('about')">个人中心</el-menu-item>
        <el-menu-item index="5-2" @click="logout">退出登录</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      activeIndex: '1',
    };
  },
  methods: {
    handleSelect(route) {
      this.$router.push({ name: route });
    },
    logout() {
      try {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        ElMessage.success('已成功退出登录');
      } catch (error) {
        console.error('注销失败:', error);
        ElMessage.error('退出登录失败，请稍后再试');
      } finally {
        this.$router.push({ name: 'home' });
      }
    },
  },
};
</script>

<style scoped>

.cyber-menu {
  background: rgba(16, 16, 28, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(66, 211, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(66, 211, 255, 0.15);
}

.menu-item {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: rgba(66, 211, 255, 0.1);
  transform: translateY(-2px);
}

.menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00FFFF);
  animation: cyber-line 3s linear infinite;
}

.menu-icon {
  font-size: 1.2em;
  margin-right: 8px;
  color: #00FFFF;
  text-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
}

.neo-button {
  position: relative;
  padding: 1.5rem 3rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #E4F1FE;
  background: linear-gradient(45deg, #141E30, #243B55);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.button-text {
  position: relative;
  z-index: 1;
  background: linear-gradient(90deg, #E4F1FE, #00FFFF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 8px rgba(0, 255, 255, 0.3);
}

.button-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
  background: radial-gradient(circle, rgba(66, 211, 255, 0.4) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.neo-button:hover .button-glow {
  opacity: 1;
  animation: pulse 2s infinite;
}

.neo-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

@keyframes cyber-line {
  0% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.4;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }
}

.menu-item-right {
  margin-left: auto;
  border-left: 1px solid rgba(66, 211, 255, 0.2);
}

/* Submenu styling */
.el-submenu ::v-deep .el-submenu__title:hover {
  background: rgba(66, 211, 255, 0.1) !important;
}

.el-submenu ::v-deep .el-menu {
  background: rgba(16, 16, 28, 0.95) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(66, 211, 255, 0.2);
  border-radius: 8px;
}

.el-menu-item {
  transition: all 0.3s ease !important;
}

.el-menu-item:hover {
  background: rgba(66, 211, 255, 0.1) !important;
  color: #00FFFF !important;
}
</style>
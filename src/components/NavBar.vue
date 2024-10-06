<template>
      <div class="button-container">
      <button
        type="button"
        class="shimmer-button"
        aria-label="题库系统"
      >
        <span class="button-text">题库系统</span>
      </button>
    </div>
         
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#000000"
      text-color="#fff"
      active-text-color="#00FFFF"
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
    border-radius: 20px;
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
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.1);
  }
  .logo-text{
    color: #00FFFF;
  font-size: 30px;
  font-weight: bold;
  margin-right: 10px;
  z-index: 1;

  }
  .logo-container {
  display: flex;
  justify-content: space-between; /* Space between logo and text */
  align-items: center;
  width: 50%;
  padding: 10px;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0);
}
  .menu-container {
  display: flex;
  flex-direction: column;
  align-items: left;
  background-color: #c68121;
  border-radius: 20px;
}
.button-container {
    position: relative; /* 使得button可以使用绝对定位 */
    width: 100%; /* 可以根据需要调整 */
    height: 100px; /* 根据需求设置高度 */
    margin-bottom: 50px;
    padding-bottom: 0;
  }
  
  .shimmer-button {
    padding: 2rem 4rem; /* 按钮内边距 */
    font-size: 1.5rem; /* 字体大小 */
    font-weight: bold; /* 字体加粗 */
    border: none; /* 去掉边框 */
    border-radius: 24px; /* 边角圆滑 */
    position: absolute; /* 绝对定位 */
    bottom: -20px; /* 将按钮向下移动一些，使其露出边缘 */
    left: 50%; /* 水平居中 */
    transform: translateX(-50%); /* 水平居中修正 */
    color: transparent; /* 文字颜色为透明以实现光晕效果 */
    background: conic-gradient(
      from var(--shimmer-angle),
      #fb00ff 0%,
      #ff0000 10%,
      #036e6e 20%
    ); /* 渐变背景 */
    animation: shimmer 2.5s linear infinite; /* 动画效果 */
  }
  
  /* 按钮文字 */
  .button-text {
    position: relative; /* 文字相对位置 */
    color: #f8fafc; /* 文字颜色 */
  }
  
  /* 动画关键帧 */
  @keyframes shimmer {
    0% {
      --shimmer-angle: 0deg; /* 初始角度 */
    }
    100% {
      --shimmer-angle: 360deg; /* 最终角度 */
    }
  }
  
  /* 按钮伪元素（用于更好的光晕效果） */
  .shimmer-button::after {
    content: attr(aria-label); /* 使用aria-label作为内容 */
    position: absolute; /* 绝对定位 */
    top: 2px; /* 上偏移 */
    left: 2px; /* 左偏移 */
    right: 2px; /* 右偏移 */
    bottom: 2px; /* 下偏移 */
    background-color: #000000; /* 背景颜色 */
    border-radius: 22px; /* 边角圆滑 */
    z-index: -1; /* 置于下方 */
  }
  .menu-container {
  position: relative; /* 使得光晕效果在菜单周围 */
  padding: 2px; /* 给菜单周围留出一些空间 */
  z-index: -1;
}

.el-menu-demo {
  position: relative; /* 确保菜单在光晕效果上方 */
  z-index: 1; /* 确保菜单在光晕效果上方 */
}

/* 光晕效果 */
.shimmer-effect {
  padding: 2rem 4rem;
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background: conic-gradient(
    from 0deg,
    rgba(0, 255, 255, 0.1) 0%,
    rgba(0, 255, 255, 0.5) 50%,
    rgba(0, 255, 255, 0.1) 100%
  ); /* 使用渐变效果 */
  filter: blur(30px); /* 模糊效果 */
  z-index: 0; /* 确保光晕在菜单下面 */
  animation: shmmer 2.5s linear infinite; /* 添加动画 */
}

@keyframes shmmer {
  0% {
    transform: rotate(0deg); /* 初始角度 */
  }
  100% {
    transform: rotate(360deg); /* 旋转一周 */
  }
}
  </style>
  
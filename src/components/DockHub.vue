<template>
  <div class="dock">
    <div class="space"></div>
    <div class="dock-container">
      <el-button
      class="dock-item"
      @click="openApp(dockItems[0])"
      :style="{ margin: '0 15px' }"
    >
    <el-icon><HomeFilled /></el-icon>
      
    </el-button>
    <el-button
      class="dock-item"
      @click="openApp(dockItems[1])"
      :style="{ margin: '0 15px' }"
    >
    <el-icon><Goods /></el-icon>
    </el-button>
    <el-button
      class="dock-item"
      @click="openApp(dockItems[2])"
      :style="{ margin: '0 15px' }"
    >
    <el-icon><Coordinate /></el-icon>
    </el-button>
    </div>
    <div class="space"></div>
  </div>
</template>

<script>
import { Coordinate, Goods, HomeFilled } from '@element-plus/icons';

export default {
  methods: 
  {
    openApp(item) {
      console.log(`打开应用: ${item.title}`);
      // 在这里添加打开应用的逻辑
    },
  },
  components:{
    Goods,
    HomeFilled,
    Coordinate

  }
};
</script>

<style scoped>
.dock {
  position: fixed;
  bottom: 20px; /* 将 Dock 置于底部 */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.dock-container {
  display: flex;
  align-items: center;
}

.dock-item {
  width: 50px; /* 修改图标大小 */
  height: 50px;
  border-radius: 50%; /* 设计为圆形 */
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s;
  background-color: #000000;
}

.dock-item:hover {
  transform:translateY(-10px) scale(1.2); /* 鼠标悬停时放大 */
}
</style>

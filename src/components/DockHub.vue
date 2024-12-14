<template>
  <div class="dock">
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
  <ChatDiolog v-if="isChatDialogVisible" />
</template>

<script>
import { ref } from 'vue'; // 导入 ref
import { Coordinate, Goods, HomeFilled } from '@element-plus/icons';
import ChatDiolog from './ChatDiolog.vue';

export default {
  name: 'DockHub',
  components: {
    ChatDiolog, // 确保 ChatDiolog 被注册
    Goods,
    HomeFilled,
    Coordinate,
  },
  setup() {
    const isChatDialogVisible = ref(false); // 用于控制 ChatDiolog 的显示状态

    // dockItems 数组
    const dockItems = [
      { title: '应用1' },
      { title: '应用2' }, // 这里可以是 ChatDialog
      { title: '应用3' },
    ];

    const openApp = (item) => {
      console.log(`打开应用: ${item.title}`);
      // 检查点击的应用是否为 ChatDialog
      if (item.title === '应用2') {
        isChatDialogVisible.value = !isChatDialogVisible.value; // 切换 ChatDialog 的可见性
      }
      // 其他应用的逻辑...
    };

    return {
      dockItems,
      openApp,
      isChatDialogVisible,
    };
  },
};
</script>

<style scoped>
.dock {
  position: fixed;
  bottom: 20px; /* 将 Dock 置于底部 */
  right: 20px; /* 将 Dock 固定在右侧 */
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.dock-item {
  width: 50px; /* 修改图标大小 */
  height: 50px;
  border-radius: 50%; /* 设计为圆形 */
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s;
  background-color: #ffffff;
  color: #000000;
}

.dock-item:hover {
  transform: translateY(-10px) scale(1.2); /* 鼠标悬停时放大 */
}
</style>




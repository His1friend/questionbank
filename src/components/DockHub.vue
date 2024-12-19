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
  <input type="file" ref="fileInput" accept="image/*" @change="handleFileUpload" style="display: none;" />
  <div v-if="showUploadedImage" class="uploaded-image-container">
    <img :src="uploadedImage" alt="Uploaded Image" class="uploaded-image" />
    <el-button class="close-button" @click="closeUploadedImageViewer"><el-icon><Close /></el-icon></el-button>
  </div>
</template>

<script>
import { ref } from 'vue'; // 导入 ref 和 onMounted
import { Coordinate, Goods, HomeFilled, Close } from '@element-plus/icons';
import ChatDiolog from './ChatDiolog.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'DockHub',
  components: {
    ChatDiolog, // 确保 ChatDiolog 被注册
    Goods,
    HomeFilled,
    Coordinate,
    Close,
  },
  setup() {
    const isChatDialogVisible = ref(false); // 用于控制 ChatDiolog 的显示状态
    const router = useRouter();
    const fileInput = ref(null);
    const uploadedImage = ref(null);
    const showUploadedImage = ref(false);

    // dockItems 数组
    const dockItems = [
      { title: '应用1' },
      { title: '应用2' }, // 这里可以是 ChatDialog
      { title: '上传图片' },
    ];

    const openApp = (item) => {
      console.log(`打开应用: ${item.title}`);
      if (item.title === '应用1') {
        router.push('/');
        // 在这里添加打开应用1的逻辑
      }
      // 检查点击的应用是否为 ChatDialog
      if (item.title === '应用2') {
        isChatDialogVisible.value = !isChatDialogVisible.value; // 切换 ChatDialog 的可见性
      }
      // 检查点击的应用是否为 上传图片
      if (item.title === '上传图片') {
        fileInput.value.click(); // 触发文件输入框的点击事件
      }
      // 其他应用的逻辑...
    };

    const handleFileUpload = (event) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedImage.value = e.target.result; // 设置上传的图片 URL
          showUploadedImageViewer();
        };
        reader.readAsDataURL(files[0]);
      }
    };

    const showUploadedImageViewer = () => {
      showUploadedImage.value = true;
    };

    const closeUploadedImageViewer = () => {
      showUploadedImage.value = false;
      uploadedImage.value = null; // 清空上传的图片 URL
    };

    return {
      dockItems,
      openApp,
      isChatDialogVisible,
      fileInput,
      uploadedImage,
      showUploadedImage,
      handleFileUpload,
      showUploadedImageViewer,
      closeUploadedImageViewer,
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

.uploaded-image-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.uploaded-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 10px;
  margin-bottom: 10px;
}

.close-button {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.4);
}
</style>




<template>
    <div
      class="dialog-container"
      :style="{ top: position.y + 'px', left: position.x + 'px' }"
      @mousedown="startDragging"
      @mouseup="stopDragging"
      @mousemove="dragging"
      @mouseleave="stopDragging"
    >
      <div class="dialog-header" @click="toggleCollapse">
        <h2>对话</h2>
        <button class="toggle-btn">{{ isCollapsed ? '展开' : '折叠' }}</button>
      </div>
      <transition name="fade">
        <div v-if="!isCollapsed" class="dialog-body">
          <div v-for="(item, index) in conversation" :key="index" class="dialog-item">
            <strong>用户：</strong>{{ item.user }}<br />
            <strong>张振太：</strong>{{ item.ai }}
          </div>
        </div>
      </transition>
      <div class="input-area">
        <input v-model="userInput" placeholder="请输入您的问题..." />
        <button @click="sendMessage">发送</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const conversation = ref([]);
  const userInput = ref('');
  const isCollapsed = ref(false);
  
  // 拖动相关变量
  const position = ref({ x: 0, y: 0 });
  const isDragging = ref(false);
  const dragOffset = ref({ x: 0, y: 0 });
  
  // 切换折叠状态
  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value;
  };
  
  // 发送消息
  const sendMessage = async () => {
  // 检查输入是否为空
  if (userInput.value.trim() === '') return;

  const userMessage = userInput.value;
  conversation.value.push({ user: userMessage, ai: '' });
  userInput.value = '';

  try {
    const response = await fetch('http://localhost:8080/api/openai/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userMessage }), // 发送用户消息
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应 JSON
    // 获取响应文本
    const responseText = await response.text(); // 将响应解析为文本
    const aiMessage = responseText
    // 更新对话历史
    conversation.value[conversation.value.length - 1].ai = aiMessage; // 更新用户最新消息的 AI 回复
  } catch (error) {
    console.error('发送请求失败:', error);
    conversation.value.push({ user: '', ai: '发送请求失败，请重试。' }); // 提示用户
  }
};
  
  // 拖动相关方法
  const startDragging = (event) => {
    isDragging.value = true;
    dragOffset.value.x = event.clientX - position.value.x;
    dragOffset.value.y = event.clientY - position.value.y;
  
    // 在页面上添加监听器，以实现全图拖拽
    window.addEventListener('mousemove', dragging);
    window.addEventListener('mouseup', stopDragging);
  };
  
  const stopDragging = () => {
    isDragging.value = false;
  
    // 移除全图拖拽的监听器
    window.removeEventListener('mousemove', dragging);
    window.removeEventListener('mouseup', stopDragging);
  };
  
  const dragging = (event) => {
    if (isDragging.value) {
      position.value.x = event.clientX - dragOffset.value.x;
      position.value.y = event.clientY - dragOffset.value.y;
    }
  };
  
  // 组件挂载时初始化位置
  onMounted(() => {
    position.value.x = window.innerWidth / 2; // 初始化到页面中心
    position.value.y = window.innerHeight / 2;
  });
  
  // 组件卸载时清理事件
  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', dragging);
    window.removeEventListener('mouseup', stopDragging);
  });
  </script>
  
  <style scoped>
  .dialog-container {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    width: 400px;
    position: absolute;
    cursor: grab; /* 鼠标样式 */
    background: white; /* 添加背景以确保内容可见 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加阴影 */
    z-index: 10;
  }
  
  .dialog-header {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }
  
  .dialog-body {
    margin-top: 10px;
  }
  
  .dialog-item {
    margin-bottom: 5px;
  }
  
  .input-area {
    margin-top: 10px;
    display: flex;
  }
  
  input {
    flex: 1;
    padding: 5px;
  }
  
  button {
    padding: 5px 10px;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  </style>
  
<template>
    <div class="gradient-circle"></div>
  </template>
  
  <script>
  export default {
    name: "GradientCircleAnimation",
  };
  </script>
  
  <style scoped>
  .gradient-circle {
    width: 150px; /* 光圈的宽度 */
    height: 150px; /* 光圈的高度 */
    border-radius: 50%; /* 使其成为圆形 */
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
    position: relative;
    animation: pulse 2s infinite; /* 动画效果 */
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.6); /* 增加一些光晕效果 */
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1); /* 初始大小 */
    }
    50% {
      transform: scale(1.1); /* 放大 */
    }
    100% {
      transform: scale(1); /* 回到初始大小 */
    }
  }
  </style>
  
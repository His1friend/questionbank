<template>
    <div class="button-container">
      <button
        type="button"
        class="shimmer-button"
        aria-label="生成 AI 内容"
      >
        <span class="button-text">生成 AI 内容</span>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ShimmerButton',
  };
  </script>
  
  <style scoped>
  .button-container {
    position: relative; /* 使得button可以使用绝对定位 */
    width: 100%; /* 可以根据需要调整 */
    height: 400px; /* 根据需求设置高度 */
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
      #1e293b 0%,
      #64748b 10%,
      #1e293b 20%
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
    background-color: #1e293b; /* 背景颜色 */
    border-radius: 22px; /* 边角圆滑 */
    z-index: -1; /* 置于下方 */
  }
  </style>
  
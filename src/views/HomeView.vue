<template>
  <div class="carousel-container">
    <div class="carousel-mask">
      <div class="ellipse-top"></div>
      <div class="carousel-content">
        <img
          v-for="(image, index) in images"
          :key="index"
          :src="image"
          class="carousel-image"
          alt="Carousel Image"
        />
      </div>
      <div class="ellipse-bottom"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        "https://via.placeholder.com/400x200?text=Image1",
        "https://via.placeholder.com/400x200?text=Image2",
        "https://via.placeholder.com/400x200?text=Image3",
        "https://via.placeholder.com/400x200?text=Image4",
      ],
    };
  },
};
</script>

<style scoped>
.carousel-container {
  width: 100%;
  height: 400px; /* 适应你需要的高度 */
  position: relative;
  margin: 0 auto;
  overflow: hidden; /* 确保内容不会溢出 */
}

/* 遮罩层 */
.carousel-mask {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 顶部椭圆遮罩 */
.ellipse-top {
  position: absolute;
  top: 0;
  width: 100%;
  height: 50%;
  background-color: black; /* 遮罩颜色 */
  clip-path: ellipse(60% 40% at 50% 0%); /* 顶部椭圆 */
  z-index: 1; /* 在内容上方 */
}

/* 底部椭圆遮罩 */
.ellipse-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50%;
  background-color: black; /* 遮罩颜色 */
  clip-path: ellipse(60% 40% at 50% 100%); /* 底部椭圆 */
  z-index: 1; /* 在内容上方 */
}

.carousel-content {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  animation: slide 15s linear infinite; /* 图片从左到右移动 */
}

/* 图片样式 */
.carousel-image {
  width: 800px;
  height: 400px;
  object-fit: cover;
  margin-right: 10px; /* 图片之间的间距 */
  z-index: 0;
}

/* 图片从左到右的动画 */
@keyframes slide {
  0% {
    left: -100%; /* 初始位置在左侧 */
  }
  100% {
    left: 100%; /* 最终位置在右侧 */
  }
}
</style>

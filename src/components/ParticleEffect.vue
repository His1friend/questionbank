<template>
  <div class="particle-background">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const canvas = ref(null);

onMounted(() => {
  const ctx = canvas.value.getContext('2d');
  let width = canvas.value.width = window.innerWidth;
  let height = canvas.value.height = window.innerHeight;

  const particles = [];
  const numParticles = 20; // 减少数量

  // 生成随机粒子
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 6 + 4,  // 增大流星体积
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 5 + 3,
      brightness: Math.random() * 0.5 + 0.5,
      angle: Math.random() *1+90 // 不同角度的流星
    });
  }

  function animate() {
    // 为了实现拖尾效果，使用半透明背景而不是清空整个画布
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';  // 0.1 使之前的绘制稍微可见，产生拖尾
    ctx.fillRect(0, 0, width, height);

    particles.forEach(particle => {
      // 更新粒子位置
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // 如果流星超过屏幕边界，将其重置到右上角
      if (particle.x > width || particle.y > height) {
        particle.x = Math.random() * width;
        particle.y = 0;
      }

      // 绘制流星
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(129,26,156 , ${particle.brightness})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();

  // 监听窗口大小调整
  window.addEventListener('resize', () => {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
    width = canvas.value.width;
    height = canvas.value.height;
  });
});
</script>

<style scoped>
.particle-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
canvas {
  display: block;
  color: #811A9C;
}
</style>

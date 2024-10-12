<template>
  <canvas ref="canvas" class="code-rain"></canvas>
</template>

<script>
export default {
  data() {
    return {
      columns: [], // 存储每列的字符
      fontSize: 16,
      fallingChars: [], // 存储下落的字符
      dropSpeed: 5, // 字符下落速度
    };
  },
  mounted() {
    this.initCanvas();
    this.startRain();
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.canvas;
      this.ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.columns = Math.floor(canvas.width / this.fontSize);
      this.fallingChars = Array(this.columns).fill(0);
    },
    startRain() {
      const characters = "傻逼张振泰";
      const characterArray = characters.split("");

      const draw = () => {
        // 设置背景颜色，带透明度
        this.ctx.fillStyle = "rgba(255, 255, 255)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        for (let i = 0; i < this.columns; i++) {
          const char = characterArray[Math.floor(Math.random() * characterArray.length)];
          const x = i * this.fontSize;
          const y = this.fallingChars[i] * this.fontSize;

          // 随机生成颜色
          const color = this.getRandomColor();
          this.ctx.fillStyle = color;
          this.ctx.font = `${this.fontSize}px monospace`;
          this.ctx.fillText(char, x, y);

          if (y > this.ctx.canvas.height && Math.random() > 0.975) {
            this.fallingChars[i] = 0; // 重置字符位置
          }

          this.fallingChars[i] += this.dropSpeed / this.fontSize; // 控制下落速度
        }

        requestAnimationFrame(draw);
      };

      draw();
    },
    // 生成随机颜色
    getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
  },
};
</script>

<style scoped>
.code-rain {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>

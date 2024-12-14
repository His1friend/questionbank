<template>
  <div class="login-container">
    <h2>登录</h2>
    <form @submit.prevent="handleSubmit">
      <!-- 用户名和密码输入 -->
      <div>
        <label for="username">用户名:</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div>
        <label for="password">密码:</label>
        <input type="password" v-model="password" id="password" required />
      </div>

      <!-- 验证码组件 -->
      <div class="captcha-component">
        <img :src="captchaImage" alt="Captcha" @click="fetchCaptcha" />
        <p>点击图片刷新验证码</p>
        <input
          type="text"
          v-model="userInput"
          placeholder="请输入验证码"
          class="captcha-input"
        />
        <button @click="validateCaptcha" :disabled="isLoading">
          验证
        </button>
        <p v-if="message" :class="messageClass">{{ message }}</p>
      </div>

      <button type="submit" style="margin-bottom: 10px;" :disabled="!isCaptchaValid">登录</button>
      <button type="button" @click="router.push('/register')">注册</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from '../store/index';
import Cookies from 'js-cookie';

const router = useRouter();
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const userStore = useUserStore();
const messageClass = ref('');

// 验证码相关的变量和方法
const captchaImage = ref(null);
const captchaToken = ref(null);
const userInput = ref('');
const message = ref('');
const isLoading = ref(false);
const isCaptchaValid = ref(false);

// 获取验证码
const fetchCaptcha = async () => {
  try {
    const response = await axios.get("/captcha/generate");
    captchaImage.value = response.data.captchaImage;
    captchaToken.value = response.data.captchaToken;
    message.value = ""; // 清空提示信息
  } catch (error) {
    message.value = "验证码加载失败，请重试！";
  }
};

// 验证验证码
const validateCaptcha = async () => {
  if (!userInput.value) {
    message.value = "请输入验证码！";
    return;
  }

  isLoading.value = true;
  try {
    const response = await axios.post(
      "/captcha/validate",
      null,
      {
        params: {
          captchaToken: captchaToken.value,
          captcha: userInput.value,
        },
      }
    );
    message.value = response.data; // 成功提示
    messageClass.value = "success-message";
    isCaptchaValid.value = true;
  } catch (error) {
    message.value = error.response?.data || "验证码验证失败！";
    messageClass.value = "error-message";
    isCaptchaValid.value = false;
  } finally {
    isLoading.value = false;
  }
};

// 提交登录表单
const handleSubmit = async () => {
  if (!isCaptchaValid.value) {
    errorMessage.value = '请先通过验证码验证';
    return;
  }

  try {
    console.log('当前 URL:', window.location.href);
    const hash = window.location.hash.split('?')[1]; // 获取 '?' 之后的部分
    const redirect = new URLSearchParams(hash).get('redirect') || '/'; //

    const response = await axios.post('http://localhost:8080/users/login', {
      username: username.value,
      password: password.value,
    });

    userStore.setUser({
      userName: response.data.user.memberName,
      userId: response.data.user.uid,
      role: response.data.user.role,
    });

    console.log('登录成功:', response.data);
    const token = response.data.token; // 根据您的后端返回格式获取令牌
    Cookies.set('token', token, { expires: 7 });
    
    router.push(redirect);
  } catch (error) {
    console.error('登录失败:', error);
    errorMessage.value = '用户名或密码错误';
    isCaptchaValid.value = false; // 登录失败后重新需要验证验证码
  }
};

onMounted(() => {
  fetchCaptcha(); // 组件加载时自动获取验证码
});
</script>

<style scoped>
/* 样式保持不变 */
.login-container {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
.error {
  color: red;
}
.captcha-component {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.captcha-input {
  padding: 5px;
  font-size: 14px;
  width: 200px;
}

.success-message {
  color: green;
}

.error-message {
  color: red;
}
</style>
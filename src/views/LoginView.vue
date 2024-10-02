<template>
  <div class="login-container">
    <h2>登录</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="username">用户名:</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div>
        <label for="password">密码:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit">登录</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import axios from 'axios';
import Cookies from 'js-cookie';
const router = useRouter();
const username = ref('');
const password = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  try {
    console.log('当前 URL:', window.location.href);
    const hash = window.location.hash.split('?')[1]; // 获取 '?' 之后的部分
  const redirect = new URLSearchParams(hash).get('redirect') || '/'; //
    console.log(redirect);
    const response = await axios.post('http://localhost:8080/users/login', {
      username: username.value,
      password: password.value,
    });
    console.log('当前 URL:', window.location.href);
    console.log('登录成功:', response.data);
    const token = response.data; // 根据您的后端返回格式获取令牌
    Cookies.set('token', token, { expires: 7 });
    
    console.log(redirect);
    // 重定向到目标路由
    router.push(redirect);
    // 在这里处理登录成功后的逻辑，如存储令牌
  } catch (error) {
    console.error('登录失败:', error);
    errorMessage.value = '用户名或密码错误';
  }
};
</script>

<style scoped>
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
</style>

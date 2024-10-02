<template>
    <div class="register">
      <h2>注册</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="identity">身份:</label>
          <select v-model="identity" required>
            <option value="" disabled>请选择身份</option>
            <option value="2">老师</option>
            <option value="3">学生</option>
          </select>
        </div>
        
        <div>
          <label for="name">姓名:</label>
          <input type="text" v-model="name" required />
        </div>
        
        <div>
          <label for="studentId">学号:</label>
          <input type="text" v-model="studentId" required />
        </div>
  
        <button type="submit">注册</button>
      </form>
      
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        identity: '',
        name: '',
        studentId: '',
        errorMessage: '',
      };
    },
    methods: {
      async handleSubmit() {
        try {
          const response = await axios.post('http://localhost:8080/users/register', {
            identity: this.identity,
            name: this.name,
            studentId: this.studentId,
          });
          console.log('注册成功:', response.data);
          // 注册成功后的逻辑，比如跳转到登录页面或显示成功消息
        } catch (error) {
          console.error('注册失败:', error);
          this.errorMessage = '注册失败，请重试。';
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .register {
    max-width: 300px;
    margin: 0 auto;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .error {
    color: red;
  }
  </style>
  
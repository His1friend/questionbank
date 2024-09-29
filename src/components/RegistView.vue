<template>
    <div class="register-container">
      <el-card class="register-card" shadow="hover">
        <h2>注册</h2>
        <el-form :model="registerForm" :rules="rules" ref="registerFormRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" type="password" placeholder="确认密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleRegister">注册</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  // 注册表单
  const registerForm = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  // 表单引用，用于验证
  const registerFormRef = ref(null)
  
  // 表单验证规则
  const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    confirmPassword: [
      { required: true, message: '请确认密码', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value !== registerForm.value.password) {
            callback(new Error('两次输入的密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }
  
  // 注册函数
  const handleRegister = () => {
    registerFormRef.value.validate(async (valid) => {
      if (valid) {
        try {
          // 发送注册请求
          const response = await axios.post('https://your-api-url.com/register', registerForm.value)
          if (response.data.success) {
            ElMessage.success('注册成功！')
            router.push('/login')
          } else {
            ElMessage.error('注册失败: ' + response.data.message)
          }
        } catch (error) {
          ElMessage.error('请求失败，请检查网络连接或联系管理员')
        }
      }
    })
  }
  </script>
  
  <style scoped>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
  }
  .register-card {
    width: 400px;
    padding: 20px;
  }
  </style>
  

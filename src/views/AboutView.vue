<template>
  <div class="container">
    <div v-if="userStore.userName" class="user-info">
      <h3 class="welcome">欢迎，{{ userStore.userName }}</h3>
      <p class="user-details">用户ID: <span>{{ userStore.userId }}</span></p>
      <p class="user-details">角色: <span>{{ roleText }}</span></p>
      
      <div v-if="userStore.role === 1" class="role-info">
        <p>你是学生，权限较低。</p>
      </div>
      <div v-if="userStore.role === 2" class="role-info">
        <p>你是老师，拥有较高权限。</p>
      </div>

      <h3 class="section-title">修改密码</h3>
      <form @submit.prevent="updatePassword" class="password-form">
        <div class="form-group">
          <label for="newPassword">新密码：</label>
          <input type="password" id="newPassword" v-model="newPassword" required />
        </div>
        <button type="submit" class="btn">修改密码</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../store/index';
import  {ElMessage} from 'element-plus';
export default {
  data() {
    return {
      username: '',
      password: '',
      role: 1,
      newPassword: ''
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    roleText() {
      return this.userStore.role === 1 ? '学生' : '老师';
    }
  },
  methods: {
    login() {
      this.userStore.setUser(this.username, Date.now(), this.password, this.role);
    },
    validatePassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // 示例正则表达式，确保密码至少包含一个数字、一个小写字母、一个大写字母，并且长度至少为8
    if (!passwordRegex.test(password)) {
      ElMessage.error('密码不符合要求，请确保密码至少包含一个数字、一个小写字母、一个大写字母，并且长度至少为8');
      return false;
    }
    return true;
  },

  async updatePassword() {
    if (!this.validatePassword(this.newPassword)) {
      return;
    }
    try {
      await axios.post('http://localhost:8080/users/updatePassword',{
        userId: this.userStore.userId,
        newPassword: this.newPassword
      });
      ElMessage.success('密码修改成功');
    } catch (error) {
      console.error('密码修改失败:', error); // 记录错误日志
      ElMessage.error('密码修改失败：' + error.message);
    }
  }
  }
};
</script>

<style scoped>
/* 设置背景色和布局 */
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.user-info {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.welcome {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.user-details {
  font-size: 16px;
  color: #555;
}

.user-details span {
  font-weight: bold;
}

.role-info {
  margin-top: 10px;
  padding: 10px;
  background-color: #e8f7e9;
  color: #2a8a2a;
  border: 1px solid #2a8a2a;
  border-radius: 5px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-top: 30px;
  margin-bottom: 10px;
}

.password-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-size: 14px;
  color: #555;
}

.form-group input {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 5px;
}

.btn {
  padding: 12px;
  font-size: 16px;
  color: #fff;
  background-color: #4CAF50;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #45a049;
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>

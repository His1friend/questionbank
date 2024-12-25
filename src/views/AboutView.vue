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
          <input 
            type="password" 
            id="newPassword" 
            v-model="passwordForm.newPassword"
            required 
          />
          <small class="password-requirements">
            密码必须包含至少8个字符，包括大小写字母和数字
          </small>
        </div>
        <div class="form-group">
          <label for="confirmPassword">确认新密码：</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="passwordForm.confirmPassword"
            required 
          />
          <small 
            v-if="passwordForm.newPassword && passwordForm.confirmPassword && !passwordsMatch" 
            class="error-message"
          >
            两次输入的密码不一致
          </small>
        </div>
        <button 
          type="submit" 
          class="btn"
          :disabled="!isFormValid || isSubmitting"
        >
          修改密码
        </button>
      </form>
    </div>
    <div v-else>
      <p>未登录或会话已过期，请重新登录</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../store/index';
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      username: '',
      role: 1,
      passwordForm: {
        newPassword: '',
        confirmPassword: ''
      },
      isSubmitting: false
    };
  },
  
  computed: {
    userStore() {
      return useUserStore();
    },
    roleText() {
      return this.userStore.role === 1 ? '学生' : '老师';
    },
    passwordsMatch() {
      return this.passwordForm.newPassword === this.passwordForm.confirmPassword;
    },
    isFormValid() {
      return (
        this.passwordForm.newPassword &&
        this.passwordForm.confirmPassword &&
        this.passwordsMatch &&
        this.validatePassword(this.passwordForm.newPassword)
      );
    }
  },
  
  mounted() {
    this.userStore.initializeFromStorage();
    if (!this.userStore.userName) {
      this.$router.push('/login');
    }
  },
  
  methods: {
    validatePassword(password) {
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      return passwordRegex.test(password);
    },
    
    async updatePassword() {
      if (this.isSubmitting || !this.isFormValid) {
        return;
      }
      
      try {
        this.isSubmitting = true;
        
        // 验证新密码格式
        if (!this.validatePassword(this.passwordForm.newPassword)) {
          ElMessage.error('新密码不符合要求，请确保密码至少包含一个数字、一个小写字母、一个大写字母，并且长度至少为8');
          return;
        }
        
        // 验证两次输入的密码是否一致
        if (!this.passwordsMatch) {
          ElMessage.error('两次输入的新密码不一致');
          return;
        }
        
        // 提交新密码
        await axios.post('http://localhost:8080/users/updatePassword', {
          userId: this.userStore.userId,
          newPassword: this.passwordForm.newPassword
        });
        
        ElMessage.success('密码修改成功');
        
        // 清空表单
        this.passwordForm = {
          newPassword: '',
          confirmPassword: ''
        };
        
      } catch (error) {
        console.error('密码修改失败:', error);
        ElMessage.error('密码修改失败：' + (error.response?.data?.message || error.message));
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.password-form {
  max-width: 400px;
  margin: 20px auto;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.password-requirements {
  display: block;
  color: #666;
  font-size: 0.8em;
  margin-top: 5px;
}

.error-message {
  color: #ff4d4f;
  font-size: 0.8em;
  margin-top: 5px;
}

.btn {
  width: 100%;
  padding: 10px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:disabled {
  background-color: #d9d9d9;
  cursor: not-allowed;
}
</style>
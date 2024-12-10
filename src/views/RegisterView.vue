<template>
  <div class="register">
    <h2>注册</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="role">身份:</label>
        <select 
          v-model="role" 
          required 
          class="form-control"
          @animationend="resetAnimation"
        >
          <option value="" disabled>请选择身份</option>
          <option value="2">老师</option>
          <option value="3">学生</option>
        </select>
      </div>

      <div class="form-group">
        <label for="member_name">姓名:</label>
        <input 
          type="text" 
          v-model="member_name" 
          required 
          class="form-control"
          :class="{ 'shake-animation': submitAttempted && !member_name }"
        />
      </div>

      <div class="form-group">
        <label for="uid">学号:</label>
        <input 
          type="text" 
          v-model="uid" 
          required 
          class="form-control"
          :class="{ 'shake-animation': submitAttempted && !uid }"
        />
      </div>

      <div class="form-group password-group">
        <label for="password">密码:</label>
        <div class="password-wrapper">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="password" 
            required 
            class="form-control"
            :class="{ 'shake-animation': submitAttempted && !password }"
          />
          <button 
            type="button" 
            @click="togglePasswordVisibility" 
            class="password-toggle"
          >
            {{ showPassword ? '隐藏' : '显示' }}
          </button>
        </div>
      </div>

      <div class="submit-section">
        <button 
          type="submit" 
          class="submit-btn"
          :class="{ 'loading': isSubmitting }"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '正在注册...' : '注册' }}
        </button>
      </div>
    </form>

    <div 
      v-if="status.message" 
      class="status-message"
      :class="[status.type]"
    >
      {{ status.message }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  setup() {
    const role = ref('')
    const member_name = ref('')
    const uid = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const submitAttempted = ref(false)
    const isSubmitting = ref(false)
    const status = ref({
      message: '',
      type: ''
    })

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    const resetAnimation = () => {
      submitAttempted.value = false
    }

    const handleSubmit = async () => {
      submitAttempted.value = true

      // 基本验证
      if (!role.value || !member_name.value || !uid.value || !password.value) {
        status.value = {
          message: '请填写所有必填字段',
          type: 'error'
        }
        return
      }

      isSubmitting.value = true

      try {
         axios.post('http://localhost:8080/users/register', {
          role: role.value,
          member_name: member_name.value,
          uid: uid.value,
          password: password.value
        })

        status.value = {
          message: '注册成功！',
          type: 'success'
        }

        // 重置表单
        role.value = ''
        member_name.value = ''
        uid.value = ''
        password.value = ''
      } catch (error) {
        status.value = {
          message: error.response?.data?.message || '注册失败，请重试',
          type: 'error'
        }
      } finally {
        isSubmitting.value = false
        submitAttempted.value = false
      }
    }

    return {
      role,
      member_name,
      uid,
      password,
      showPassword,
      submitAttempted,
      isSubmitting,
      status,
      handleSubmit,
      togglePasswordVisibility,
      resetAnimation
    }
  }
}
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.form-control:focus {
  border-color: #4a90e2;
  outline: none;
}

.password-wrapper {
  display: flex;
  align-items: center;
}

.password-toggle {
  margin-left: 10px;
  background: none;
  border: none;
  color: #4a90e2;
  cursor: pointer;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #357abd;
}

.submit-btn.loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.status-message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
}

.status-message.success {
  background-color: #dff0d8;
  color: #3c763d;
}

.status-message.error {
  background-color: #f2dede;
  color: #a94442;
}

.shake-animation {
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
</style>
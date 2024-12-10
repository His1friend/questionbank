<template>
  <div class="question-card">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
    </div>
    
    <!-- 错误状态 -->
    <div v-if="error" class="error-message">
      <div class="error-content">
        <svg xmlns="http://www.w3.org/2000/svg" class="error-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        {{ error }}
      </div>
    </div>
    
    <!-- 题目内容 -->
    <template v-if="question && !loading && !error">
      <div class="card-header">
        <!-- 题目标题和标签 -->
        <div class="header-content">
          <h2 class="question-title">{{ question.questionName }}</h2>
          <div class="tag-container">
            <span :class="['tag', getCategoryClass(question.categoryId)]">
              {{ getCategoryLabel(question.categoryId) }}
            </span>
            <span :class="['tag', getDifficultyClass(question.difficultyLevel)]">
              {{ getDifficultyLabel(question.difficultyLevel) }}
            </span>
          </div>
        </div>
        
        <!-- 元信息 -->
        <div class="meta-info">
          <span>出题人: {{ question.maker }}</span>
          <span>创建时间: {{ formatDate(question.createdAt) }}</span>
        </div>
      </div>

      <div class="card-content">
        <!-- 题目内容 -->
        <div class="question-text">{{ question.questionText }}</div>

        <!-- 选项区域 -->
        <div class="options-container">
          <!-- 单选题 -->
          <template v-if="question.categoryId === 1">
            <div class="radio-group">
              <div 
                v-for="(option, index) in options" 
                :key="index" 
                class="radio-option"
                @click="selectedAnswer = option"
              >
                <input 
                  type="radio" 
                  :id="'option-' + index" 
                  :value="option"
                  v-model="selectedAnswer"
                  class="radio-input"
                />
                <label :for="'option-' + index" class="option-label">
                  {{ option }}
                </label>
              </div>
            </div>
          </template>

          <!-- 多选题 -->
          <template v-if="question.categoryId === 2">
            <div class="checkbox-group">
              <div 
                v-for="(option, index) in options" 
                :key="index" 
                class="checkbox-option"
                @click="toggleOption(option)"
              >
                <input 
                  type="checkbox" 
                  :id="'option-' + index" 
                  :value="option"
                  v-model="selectedAnswers"
                  class="checkbox-input"
                />
                <label :for="'option-' + index" class="option-label">
                  {{ option }}
                </label>
              </div>
            </div>
          </template>

          <!-- 主观题 -->
          <template v-if="question.categoryId === 3">
            <textarea
              v-model="subjectiveAnswer"
              class="subjective-input"
              rows="4"
              placeholder="请输入你的答案"
            ></textarea>
          </template>
        </div>

        <!-- 提交按钮 -->
        <div class="submit-container">
          <button 
            @click="submitAnswer"
            class="submit-button"
            :disabled="loading"
          >
            提交答案
          </button>
        </div>

        <!-- 统计信息 -->
        <div class="statistics">
          <span>通过率:</span>
          <div class="progress-bar">
            <div 
              class="progress-value"
              :style="{ width: `${calculatePassRate}%` }"
            ></div>
          </div>
          <span>{{ calculatePassRate }}%</span>
          <span>({{ question.passedNumber }}/{{ question.totalNumber }})</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted,defineProps } from 'vue'
import axios from 'axios'

// API 配置

const props = defineProps({
  qid: {
    type: Number,
    required: true
  }
})

// 状态定义
const question = ref(null)
const loading = ref(true)
const error = ref(null)
const selectedAnswer = ref('')
const selectedAnswers = ref([])
const subjectiveAnswer = ref('')

// 计算属性
const options = computed(() => {
  if (!question.value?.option) return []
  return question.value.option.split('|')
})

const calculatePassRate = computed(() => {
  if (!question.value) return 0
  const { passedNumber, totalNumber } = question.value
  if (!totalNumber) return 0
  return ((passedNumber / totalNumber) * 100).toFixed(1)
})

// 方法定义
const getCategoryLabel = (categoryId) => {
  const categories = {
    1: '单选题',
    2: '多选题',
    3: '主观题'
  }
  return categories[categoryId] || '未知类型'
}

const getCategoryClass = (categoryId) => {
  const classes = {
    1: 'tag-blue',
    2: 'tag-purple',
    3: 'tag-green'
  }
  return classes[categoryId] || 'tag-gray'
}

const getDifficultyLabel = (level) => {
  const difficulties = {
    1: '简单',
    2: '中等',
    3: '困难'
  }
  return difficulties[level] || '未知'
}

const getDifficultyClass = (level) => {
  const classes = {
    1: 'tag-success',
    2: 'tag-warning',
    3: 'tag-danger'
  }
  return classes[level] || 'tag-default'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const toggleOption = (option) => {
  const index = selectedAnswers.value.indexOf(option)
  if (index === -1) {
    selectedAnswers.value.push(option)
  } else {
    selectedAnswers.value.splice(index, 1)
  }
}

const fetchQuestion = async () => {
  try {
    loading.value = true
    error.value = null
    const { data } = await axios.get(`/questions/${props.qid}`)
    if (data.code === 1) {
      question.value = data.data
      console.log("OK")
    } else {
      throw new Error(data.msg || '获取题目失败')
    }
  } catch (err) {
    error.value = err.response?.data?.msg || err.message || '获取题目失败'
  } finally {
    loading.value = false
  }
}

const submitAnswer = async () => {
  if (loading.value) return

  let answer
  switch (question.value.categoryId) {
    case 1:
      answer = selectedAnswer.value
      break
    case 2:
      answer = selectedAnswers.value
      break
    case 3:
      answer = subjectiveAnswer.value
      break
    default:
      return
  }

  try {
    loading.value = true
    const response = await axios.post(`/questions/answer/${props.qid}`, { answer })
    if (response.data.code === 1) {
      alert('答案提交成功！')
      alert(response.data.data)
    } else {
      throw new Error(response.data.msg || '提交答案失败')
    }
  } catch (err) {
    error.value = err.response?.data?.msg || err.message || '提交答案失败'
  } finally {
    loading.value = false
  }
}

// 生命周期钩子
onMounted(() => {
  fetchQuestion()
})
</script>

<style scoped>
.question-card {
  position: absolute;
  top: 50%;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 9999;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-message {
  padding: 15px;
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  margin-bottom: 20px;
}

.error-content {
  display: flex;
  align-items: center;
  color: #ff4d4f;
}

.error-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.card-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.question-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.tag-container {
  display: flex;
  gap: 10px;
}

.tag {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
}

.tag-blue {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #1890ff;
}

.tag-purple {
  background-color: #f9f0ff;
  border: 1px solid #d3adf7;
  color: #722ed1;
}

.tag-green {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
}

.tag-success {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
}

.tag-warning {
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  color: #faad14;
}

.tag-danger {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
}

.meta-info {
  font-size: 14px;
  color: #666;
  display: flex;
  gap: 20px;
}

.question-text {
  font-size: 16px;
  line-height: 1.6;
  background-color: #fafafa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.options-container {
  margin: 20px 0;
}

.radio-group,
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-option,
.checkbox-option {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.radio-option:hover,
.checkbox-option:hover {
  background-color: #f0f0f0;
}

.option-label {
  margin-left: 10px;
  cursor: pointer;
}

.subjective-input {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
  line-height: 1.5;
}

.subjective-input:focus {
  outline: none;
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.submit-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.submit-button {
  padding: 8px 24px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #40a9ff;
}

.submit-button:disabled {
  background-color: #d9d9d9;
  cursor: not-allowed;
}

.statistics {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #666;
}

.progress-bar {
  width: 200px;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-value {
  height: 100%;
  background-color: #52c41a;
  border-radius: 4px;
  transition: width 0.3s ease;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .question-card {
    margin: 10px;
    padding: 15px;
  }
}
</style>
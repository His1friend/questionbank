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
          <h2 class="question-title">
            <input 
              v-model="localQuestion.questionName" 
              @input="handleQuestionChange"
              type="text" 
              placeholder="请输入题目名称"
              class="editable-input"
            />
          </h2>
          <div class="tag-container">
            <span :class="['tag', getCategoryClass(localQuestion.categoryId)]">
              {{ getCategoryLabel(localQuestion.categoryId) }}
            </span>
            <span :class="['tag', getDifficultyClass(localQuestion.difficultyLevel)]">
              {{ getDifficultyLabel(localQuestion.difficultyLevel) }}
            </span>
          </div>
        </div>
        
        <!-- 元信息 -->
        <div class="meta-info">
          <span>出题人: {{ localQuestion.maker }}</span>
          <span>创建时间: {{ formatDate(localQuestion.createdAt) }}</span>
        </div>
      </div>

      <div class="card-content">
        <!-- 题目内容 -->
        <div class="question-text">
          <textarea
            v-model="localQuestion.questionText"
            @input="handleQuestionChange"
            class="editable-textarea"
            rows="4"
            placeholder="请输入题目内容"
          ></textarea>
        </div>

        <!-- 选项区域 -->
        <div class="options-container">
          <!-- 单选题 -->
          <template v-if="localQuestion.categoryId === 1">
            <div class="radio-group">
              <div 
                v-for="(option, index) in localOptionArray" 
                :key="index" 
                class="radio-option"
              >
                <input 
                  type="text" 
                  v-model="localOptionArray[index]"
                  @input="handleOptionChange"
                  class="editable-input"
                  placeholder="选项"
                />
              </div>
              <button @click="addOption" class="add-button">添加选项</button>
            </div>
          </template>

          <!-- 多选题 -->
          <template v-if="localQuestion.categoryId === 2">
            <div class="checkbox-group">
              <div 
                v-for="(option, index) in localOptionArray" 
                :key="index" 
                class="checkbox-option"
              >
                <input 
                  type="text" 
                  v-model="localOptionArray[index]"
                  @input="handleOptionChange"
                  class="editable-input"
                  placeholder="选项"
                />
              </div>
              <button @click="addOption" class="add-button">添加选项</button>
            </div>
          </template>

          <!-- 主观题 -->
          <template v-if="localQuestion.categoryId === 3">
            <p>主观题不需要选项。</p>
          </template>
        </div>

        <!-- 提交按钮 -->
        <div class="submit-container">
          <button 
            @click="updateQuestion"
            class="submit-button"
            :disabled="loading"
          >
            更新题目
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  qid: {
    type: Number,
    required: true
  }
})

// 状态定义
const question = ref(null)
const localQuestion = ref({
  questionName: '',
  questionText: '',
  categoryId: null,
  difficultyLevel: null,
  maker: '',
  createdAt: '',
  option: ''
})
const loading = ref(true)
const error = ref(null)

// 本地选项数组
const localOptionArray = ref([])

// 处理问题变更
const handleQuestionChange = () => {
  question.value = { ...localQuestion.value }
}

// 处理选项变更
const handleOptionChange = () => {
  localQuestion.value.option = localOptionArray.value.join('|')
  handleQuestionChange()
}

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

const addOption = () => {
  localOptionArray.value.push('')
  handleOptionChange()
}

const fetchQuestion = async () => {
  try {
    loading.value = true
    error.value = null
    const { data } = await axios.get(`/questions/${props.qid}`)
    if (data.code === 1) {
      question.value = {
        ...data.data,
        option: data.data.option || ''
      }
      // 同步到本地状态
      localQuestion.value = { ...question.value }
      // 初始化本地选项数组
      localOptionArray.value = question.value.option ? question.value.option.split('|') : []
    } else {
      throw new Error(data.msg || '获取题目失败')
    }
  } catch (err) {
    error.value = err.response?.data?.msg || err.message || '获取题目失败'
  } finally {
    loading.value = false
  }
}

const updateQuestion = async () => {
  if (loading.value) return

  try {
    loading.value = true
    const response = await axios.put(`/questions/update`, question.value)
    if (response.data.code === 1) {
      ElMessage.success('题目更新成功！')
      await fetchQuestion()
    } else {
      throw new Error(response.data.msg || '更新题目失败')
    }
  } catch (err) {
    error.value = err.response?.data?.msg || err.message || '更新题目失败'
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
/* 基本样式 */
.question-card {
  border: 1px solid #ccc;
  padding: 20px;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  background-color: #fddede;
  color: #cc0000;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
}

.error-icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-right: 5px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.header-content {
  flex-grow: 1;
}

.question-title {
  font-size: 1.5em;
  margin: 0;
}

.editable-input {
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.tag-container {
  margin-top: 8px;
}

.tag {
  display: inline-block;
  padding: 4px 8px;
  margin-right: 8px;
  border-radius: 4px;
  color: white;
}

.tag-blue {
  background-color: #3498db;
}

.tag-purple {
  background-color: #9b59b6;
}

.tag-green {
  background-color: #2ecc71;
}

.tag-gray {
  background-color: #95a5a6;
}

.tag-success {
  background-color: #2ecc71;
}

.tag-warning {
  background-color: #e67e22;
}

.tag-danger {
  background-color: #e74c3c;
}

.tag-default {
  background-color: #ecf0f1;
  color: black;
}

.meta-info {
  margin-top: 16px;
  color: #777;
}

.card-content {
  margin-top: 20px;
}

.question-text {
  margin-bottom: 20px;
}

.editable-textarea {
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
}

.options-container {
  margin-bottom: 20px;
}

.radio-group, .checkbox-group {
  display: flex;
  flex-direction: column;
}

.radio-option, .checkbox-option {
  margin-bottom: 8px;
}

.add-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.add-button:hover {
  background-color: #2980b9;
}

.submit-container {
  text-align: right;
}

.submit-button {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>




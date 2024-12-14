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
                v-model="question.questionName" 
                type="text" 
                placeholder="请输入题目名称"
                class="editable-input"
              />
            </h2>
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
          <div class="question-text">
            <textarea
              v-model="question.questionText"
              class="editable-textarea"
              rows="4"
              placeholder="请输入题目内容"
            ></textarea>
          </div>
  
          <!-- 选项区域 -->
          <div class="options-container">
            <!-- 单选题 -->
            <template v-if="question.categoryId === 1">
              <div class="radio-group">
                <div 
                  v-for="(option, index) in options" 
                  :key="index" 
                  class="radio-option"
                >
                  <input 
                    type="text" 
                    v-model="options[index]"
                    class="editable-input"
                    placeholder="选项"
                  />
                </div>
                <button @click="addOption" class="add-button">添加选项</button>
              </div>
            </template>
  
            <!-- 多选题 -->
            <template v-if="question.categoryId === 2">
              <div class="checkbox-group">
                <div 
                  v-for="(option, index) in options" 
                  :key="index" 
                  class="checkbox-option"
                >
                  <input 
                    type="text" 
                    v-model="options[index]"
                    class="editable-input"
                    placeholder="选项"
                  />
                </div>
                <button @click="addOption" class="add-button">添加选项</button>
              </div>
            </template>
  
            <!-- 主观题 -->
            <template v-if="question.categoryId === 3">
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
  
          <!-- 统计信息 -->
          <!-- <div class="statistics">
            <span>通过率:</span>
            <div class="progress-bar">
              <div 
                class="progress-value"
                :style="{ width: `${calculatePassRate}%` }"
              ></div>
            </div>
            <span>{{ calculatePassRate }}%</span>
            <span>({{ question.passedNumber }}/{{ question.totalNumber }})</span>
          </div> -->
        </div>
      </template>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, defineProps } from 'vue'
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
  
  // 计算属性
  const options = computed({
    get() {
      if (!question.value?.option) return []
      return question.value.option.split('|')
    },
    set(newOptions) {
      question.value.option = newOptions.join('|')
    }
  })
  
 /*  const calculatePassRate = computed(() => {
    if (!question.value) return 0
    const { passedNumber, totalNumber } = question.value
    if (!totalNumber) return 0
    return ((passedNumber / totalNumber) * 100).toFixed(1)
  }) */
  
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
    options.value.push('')
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
  
  const updateQuestion = async () => {
    if (loading.value) return
  
    try {
      loading.value = true
      console.log(question.value)
      const response = await axios.put(`/questions/update`, question.value)
      if (response.data.code === 1) {
        alert('题目更新成功！')
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
  .question-card {
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 0 auto;
  }
  
  .loading-container {
    text-align: center;
    padding: 20px;
  }
  
  .loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #09f;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .error-message {
    background-color: #fdd;
    color: #c00;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 10px;
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
    align-items: center;
    margin-bottom: 15px;
  }
  
  .header-content {
    display: flex;
    flex-direction: column;
  }
  
  .question-title {
    font-size: 24px;
    margin-bottom: 5px;
  }
  
  .tag-container {
    display: flex;
    gap: 5px;
  }
  
  .tag {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    color: white;
  }
  
  .tag-blue {
    background-color: #007bff;
  }
  
  .tag-purple {
    background-color: #6f42c1;
  }
  
  .tag-green {
    background-color: #28a745;
  }
  
  .tag-gray {
    background-color: #6c757d;
  }
  
  .tag-success {
    background-color: #28a745;
  }
  
  .tag-warning {
    background-color: #ffc107;
  }
  
  .tag-danger {
    background-color: #dc3545;
  }
  
  .tag-default {
    background-color: #6c757d;
  }
  
  .meta-info {
    font-size: 14px;
    color: #555;
  }
  
  .card-content {
    margin-top: 20px;
  }
  
  .question-text {
    margin-bottom: 20px;
  }
  
  .options-container {
    margin-bottom: 20px;
  }
  
  .radio-group, .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .radio-option, .checkbox-option {
    display: flex;
    align-items: center;
  }
  
  .radio-input, .checkbox-input {
    margin-right: 10px;
  }
  
  .editable-input {
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
  
  .editable-textarea {
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
  
  .add-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .add-button:hover {
    background-color: #0056b3;
  }
  
  .submit-container {
    text-align: right;
  }
  
  .submit-button {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .submit-button:hover {
    background-color: #218838;
  }
  
  .statistics {
    margin-top: 20px;
    font-size: 14px;
    color: #555;
  }
  
  .progress-bar {
    background-color: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
    margin: 5px 0;
    height: 20px;
  }
  
  .progress-value {
    background-color: #28a745;
    height: 100%;
  }
  </style>
  
  
  
  
<template>
  <el-form :model="questionForm" :rules="rules" ref="questionFormRef">
    <el-form-item label="题目名称" prop="question_name">
      <el-input v-model="questionForm.question_name" />
    </el-form-item>
    <el-form-item label="题目描述" prop="question_text">
      <el-input v-model="questionForm.question_text" />
    </el-form-item>
    <el-form-item label="题目类型" prop="type">
      <el-select v-model="questionForm.type">
        <el-option label="单选题" value="single" />
        <el-option label="多选题" value="multiple" />
        <el-option label="主观题" value="subjective" />``
      </el-select>
    </el-form-item>
    <el-form-item v-if="questionForm.type === 'single'" label="单选答案" prop="answer">
      <el-radio-group v-model="questionForm.answer">
        <div v-for="(option, index) in questionForm.options" :key="index" style="display: flex; align-items: center;">
          <el-radio :label="option.value" style="margin-right: 10px"></el-radio>
          <el-input v-model="option.value" placeholder="请输入选项内容"></el-input>
        </div>
      </el-radio-group>
    </el-form-item>

    <el-form-item v-if="questionForm.type === 'multiple'" label="多选答案" prop="answer">
      <el-checkbox-group v-model="questionForm.answer">
        <div v-for="(option, index) in questionForm.options" :key="index" style="display: flex; align-items: center;">
          <el-checkbox :label="option.value" style="margin-right: 10px"></el-checkbox>
          <el-input v-model="option.value" placeholder="请输入选项内容"></el-input>
        </div>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item v-if="questionForm.type === 'subjective'" label="答案" prop="answer">
      <el-input type="textarea" v-model="questionForm.answer" placeholder="输入答案" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </el-form-item>
  </el-form>
</template>


<script setup>
import { ref ,watch } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

// 表单数据，默认有四个选项
const questionForm = ref({
  question_name: '',
  question_text: '',
  type: 'single', // 默认单选题
  options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }], // 四个默认选项
  answer:[]
})
const typeToCategoryId = {
  single: 1,   // 单选题对应分类ID 1
  multiple: 2, // 多选题对应分类ID 2
  subjective: 3 // 主观题对应分类ID 3
};

// 表单验证规则
const rules = {
  question_name: [{ required: true, message: '请输入题目名称', trigger: 'blur' }],
  question_text: [{ required: true, message: '请输入题目描述', trigger: 'blur' }],
  type: [{ required: true, message: '请选择题目类型', trigger: 'change' }],
  options: [{ required: true, message: '请填写所有选项', trigger: 'blur' }],
  answer: [{ required: true, message: '请输入正确答案', trigger: 'blur' }]
}

const questionFormRef = ref(null)
watch(() => questionForm.value.type, (newType) => {
  // 清空选项和答案
  questionForm.value.options = [{ value: '' }, { value: '' }, { value: '' }, { value: '' }];
  questionForm.value.answer = newType === 'multiple' ? [] : ''; // 单选题和主观题时清空为字符串，多选题清空为数组
});

// 提交表单
const submitForm = () => {
  questionFormRef.value.validate((Valid) => {
    if (Valid) {
      let question = { ...questionForm.value }; // 创建一个表单的副本
      
      const categoryId = typeToCategoryId[question.type] || 0; 
      // 如果是多选题，转换答案数组为逗号分隔的字符串
      if (question.type === 'multiple') {
        question.answer = question.answer.join(',');}
        const questionData = {
          questionName: question.question_name, // 不需要 question.value
        questionText: question.question_text,
        option: question.options.map(option => option.value).join('|'), // 合并选项
        categoryId: categoryId, // 假设有分类 ID，可以动态赋值
        difficultyLevel: 3, // 假设难度为3，可以动态赋值
        passedNumber: 0,
        totalNumber: 0,
        knowledgeNode: 0, // 知识点 ID
        createdAt: new Date().toISOString(), // ISO格式时间
        maker: "John Doe", // 出题者
        // 如果需要传递答案或题目类型
        answer: question.answer
};
      axios.post('/questions/add', questionData)
        .then(() => {
          ElMessage.success('题目添加成功')
          resetForm()
        })
        .catch(() => {
          ElMessage.error('题目添加失败')
        })
    } else {
      ElMessage.error('表单验证失败')
    }
    })
}

// 重置表单
const resetForm = () => {
  questionForm.value = {
    question_name: '',
    question_text: '',
    type: 'single',
    options: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }], // 重置为四个选项
    answer: ''
  }
  questionFormRef.value?.resetFields()
}

</script>

<style scoped>
.add-question-form {
  max-width: 600px;
  margin: 0 auto;
}
.option-item {
  margin-bottom: 10px;
}
</style>

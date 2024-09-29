<template>
  <el-form :model="questionForm" ref="questionFormRef" :rules="rules" label-width="120px">
    <!-- 题目名称 -->
    <el-form-item label="题目名称" prop="question_name">
      <el-input v-model="questionForm.question_name" placeholder="请输入题目名称"></el-input>
    </el-form-item>

    <!-- 题目描述 -->
    <el-form-item label="题目描述" prop="question_text">
      <el-input v-model="questionForm.question_text" type="textarea" placeholder="请输入题目描述"></el-input>
    </el-form-item>

    <!-- 选项（假设是多选题） -->
    <el-form-item label="题目选项" prop="options">
      <el-input v-model="questionForm.options" placeholder="请输入选项，使用逗号分隔"></el-input>
    </el-form-item>

    <!-- 题目难度 -->
    <el-form-item label="题目难度" prop="difficulty_level">
      <el-select v-model="questionForm.difficulty_level" placeholder="选择难度">
        <el-option label="简单" value="easy"></el-option>
        <el-option label="中等" value="medium"></el-option>
        <el-option label="困难" value="hard"></el-option>
      </el-select>
    </el-form-item>

    <!-- 知识点 -->
    <el-form-item label="关联知识点" prop="knowledge_node">
      <el-tree
        :data="knowledgeNodes"
        show-checkbox
        node-key="node_id"
        ref="tree"
        :default-checked-keys="questionForm.knowledge_node"
        @check-change="onKnowledgeNodeChange">
      </el-tree>
    </el-form-item>

    <!-- 操作按钮 -->
    <el-form-item>
      <el-button type="primary" @click="submitForm">保存</el-button>
      <el-button @click="resetForm">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

export default {
  setup() {
    const questionForm = ref({
      question_name: '',
      question_text: '',
      options: '',
      difficulty_level: '',
      knowledge_node: []  // 关联知识点ID
    });

    const rules = ref({
      question_name: [{ required: true, message: '请输入题目名称', trigger: 'blur' }],
      question_text: [{ required: true, message: '请输入题目描述', trigger: 'blur' }],
      options: [{ required: true, message: '请输入选项', trigger: 'blur' }],
      difficulty_level: [{ required: true, message: '请选择题目难度', trigger: 'change' }],
    });

    const knowledgeNodes = ref([]); // 知识点树数据

    // 获取题目详情（假设题目ID从路由参数中获取）
    const fetchQuestionDetail = async (id) => {
      try {
        const response = await axios.get(`/api/questions/${id}`);
        questionForm.value = response.data;
      } catch (error) {
        ElMessage.error('获取题目详情失败');
      }
    };

    // 获取知识点树
    const fetchKnowledgeNodes = async () => {
      try {
        const response = await axios.get('/api/knowledge-nodes');
        knowledgeNodes.value = response.data;
      } catch (error) {
        ElMessage.error('获取知识点失败');
      }
    };

    // 提交表单
    const submitForm = () => {
      const form = questionForm.value;
      axios.put(`/api/questions/${form.qid}`, form)
        .then(() => {
          ElMessage.success('题目更新成功');
        })
        .catch(error => {
          ElMessage.error('题目更新失败: ' + error.message);
        });
    };

    // 重置表单
    const resetForm = () => {
      fetchQuestionDetail(questionForm.value.qid);
    };

    // 知识点选中变更
    const onKnowledgeNodeChange = (checkedNodes) => {
      questionForm.value.knowledge_node = checkedNodes.map(node => node.node_id);
    };

    // 在页面加载时获取数据
    onMounted(() => {
      const questionId = 1; // 假设题目ID从路由获取
      fetchQuestionDetail(questionId);
      fetchKnowledgeNodes();
    });

    return {
      questionForm,
      rules,
      knowledgeNodes,
      submitForm,
      resetForm,
      onKnowledgeNodeChange,
    };
  },
};
</script>

<style scoped>
/* 根据需要定制样式 */
</style>

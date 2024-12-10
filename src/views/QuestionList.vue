<template>
  <el-scrollbar>
    <el-input
      v-model="searchQuery"
      placeholder="请输入题目ID或名称进行搜索"
      style="margin-bottom: 16px;"
    />
    <el-table :data="filteredTableData" style="width: 100%">
      <el-table-column prop="qid" label="题目 ID" width="100" />
      <el-table-column prop="questionName" label="题目" />
      <el-table-column label="题型" width="120">
        <template #default="scope">
          <span>{{ categoryMap[scope.row.categoryId] || '未知题型' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="difficultyLevel" label="难度" />
      <el-table-column prop="passedNumber" label="通过次数" />
      <el-table-column prop="totalNumber" label="总数" />
      <el-table-column prop="knowledgeNode" label="知识点" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button @click="editQuestion(scope.row.qid)" type="primary" size="small">编辑</el-button>
          <el-button @click="confirmDelete(scope.row.qid)" type="danger" size="small">删除</el-button>
          <el-button @click="viewDetails(scope.row.qid)" type="info" size="small">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-scrollbar>
  <QuestionDetail v-if="dialogVisible" :qid="currentQid" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus';
import QuestionDetail from './QuestionDetail.vue';
import axios from 'axios'

// 定义表格数据
const tableData = ref([])
const dialogVisible = ref(false);
const currentQid = ref(null);
const searchQuery = ref('');
const categoryMap = {
  1: '单选题',
  2: '多选题',
  3: '简答题'
}

// 计算属性用于过滤表格数据
const filteredTableData = computed(() => {
  return tableData.value.filter(item => 
    item.qid.toString().includes(searchQuery.value) ||
    item.questionName.includes(searchQuery.value)
  )
})

// 在组件挂载时获取数据
onMounted(() => {
  axios.get('/questions/list')
    .then(response => {
      if (response.data.code === 1) {
        tableData.value = response.data.data // 将后端数据赋值给表格数据
      } else {
        console.error('获取数据失败:', response.data.msg)
      }
    })
    .catch(error => {
      console.error('请求失败:', error)
    })
})

const confirmDelete = (qid) => {
  ElMessageBox.confirm('此操作将永久删除该题目, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deleteQuestion(qid);
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};

// 删除题目
const deleteQuestion = async (qid) => {
  try {
    await axios.delete(`/questions/${qid}`);
    ElMessage.success('删除成功');
    // 更新前端列表
    tableData.value = tableData.value.filter((item) => item.qid !== qid);
  } catch (error) {
    ElMessage.error('删除失败: ' + error.message);
  }
};

const viewDetails = (qid) => {
  currentQid.value = qid;
  dialogVisible.value = !dialogVisible.value;
};
</script>




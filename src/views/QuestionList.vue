<template>
  <el-scrollbar>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="qid" label="题目 ID" width="100" />
      <el-table-column prop="questionName" label="题目" />
      <el-table-column prop="categoryId" label="类别 ID" />
      <el-table-column prop="difficultyLevel" label="难度" />
      <el-table-column prop="passedNumber" label="通过次数" />
      <el-table-column prop="totalNumber" label="总数" />
      <el-table-column prop="knowledgeNode" label="知识点" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button @click="editQuestion(scope.row.qid)" type="primary" size="small">编辑</el-button>
          <el-button @click="confirmDelete(scope.row.qid)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-scrollbar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus';
import axios from 'axios'

// 定义表格数据
const tableData = ref([])

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

</script>

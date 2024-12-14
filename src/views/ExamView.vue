<template>
  <div style="background-color: #ffffff; padding: 20px;">
    <h1>试卷列表</h1>
    <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; font-size: 14px;">
      <thead>
        <tr>
          <th>试卷ID</th>
          <th>试卷名称</th>
          <th>创建者ID</th>
          <th>创建时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(exam, index) in exams" :key="index" :style="{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }">
          <td>{{ exam.examId }}</td>
          <td><a href="#" @click.prevent="loadExamDetails(exam.examId)" style="color: blue; text-decoration: none;" :style="{ color: hoverIndex === index ? 'red' : 'blue' }" @mouseover="hoverIndex = index" @mouseout="hoverIndex = -1">{{ exam.examName }}</a></td>
          <td>{{ exam.uid }}</td>
          <td>{{ new Date(exam.createdAt).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="detailVisible">
      <h1 style="font-size: 20px; text-align: center;">试卷详情</h1>
      <button @click="closeDetails" class="button">返回试卷列表</button>
      <RecycleScroller
        class="scroller"
        :items="filteredQuestions"
        :item-size="600" 
        key-field="qid"
        v-slot="{ item }"
      >
        <div v-if="item && item.qid" class="question-container">
          <QuestionDetail :qid="item.qid" />
        </div>
        <div v-else class="error-message">
          <p>题目信息无效</p>
        </div>
      </RecycleScroller>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, computed } from 'vue';
import QuestionDetail from './QuestionDetail.vue'; // 引入 QuestionDetail 组件
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

export default {
  components: {
    QuestionDetail,
    RecycleScroller,
  },
  setup() {
    const exams = ref([]);
    const questions = ref([]);
    const detailVisible = ref(false);
    const currentExamId = ref(null);
    const hoverIndex = ref(-1);

    const loadExams = async () => {
      try {
        const response = await axios.get('/exam/getExam');
        if (response.data.code === 1) {
          exams.value = response.data.data;
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    const loadExamDetails = async (examId) => {
      try {
        const response = await axios.get(`/exam/getQuestion/${examId}`);
        if (response.data.code === 1) {
          questions.value = response.data.data.filter(q => q && q.qid); // 过滤掉无效的 question
          detailVisible.value = true;
          currentExamId.value = examId;
        }
      } catch (error) {
        console.error('Error fetching exam details:', error);
      }
    };

    const closeDetails = () => {
      detailVisible.value = false;
      currentExamId.value = null;
    };

    // 计算属性，用于过滤无效的 questions
    const filteredQuestions = computed(() => {
      return questions.value.filter(q => q && q.qid);
    });

    loadExams();

    return {
      exams,
      questions,
      detailVisible,
      currentExamId,
      hoverIndex,
      loadExamDetails,
      closeDetails,
      filteredQuestions,
    };
  },
};
</script>

<style scoped>
/* 样式可以根据需要进一步调整 */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #f5f5f5;
}

.button {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.button:hover {
  background-color: #2980b9;
}

.scroller {
  height: 600px; /* 设置滚动容器的高度 */
}

.error-message {
  background-color: #fddede;
  color: #cc0000;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.question-container {
  margin-bottom: 20px; /* 增加题目之间的间距 */
  padding: 10px; /* 增加内边距 */
  border: 1px solid #ddd; /* 添加边框 */
  border-radius: 5px; /* 圆角边框 */
  background-color: #fff; /* 白色背景 */
}
</style>




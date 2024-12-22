<template>
  <div style="background-color: #ffffff; padding: 20px;">
    <h1>试卷列表</h1>
    <button @click="showAddForm = true" class="button">添加试卷</button>
    
    <div v-if="showAddForm">
      <h2>添加新试卷</h2>
      <form @submit.prevent="addExam">
        <label for="examId">试卷ID:</label>
        <input type="number" id="examId" v-model="newExam.examId" required><br><br>
        
        <label for="examName">试卷名称:</label>
        <input type="text" id="examName" v-model="newExam.examName" required><br><br>
        
        <label for="uid">创建者ID:</label>
        <input type="number" id="uid" :value="user.userId" readonly><br><br>
        
        <label for="createdAt">创建时间:</label>
        <input type="datetime-local" id="createdAt" v-model="newExam.createdAt" required><br><br>
        
        <button type="submit" class="button">提交</button>
        <button type="button" @click="showAddForm = false" class="button">取消</button>
      </form>
    </div>

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
      <button @click="openUpdate" class="button">管理题目</button>
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

    <div v-if="updateVisible">
      <h1 style="font-size: 20px; text-align: center;">题目管理</h1>
      <button @click="closeUpdate" class="button">返回试卷详情</button>
      <RecycleScroller
        class="scroller"
        :items="questions"
        :item-size="600" 
        key-field="qid"
        v-slot="{ item }"
      >
        <div v-if="item && item.qid" class="question-update-container">
          <ExamEditView :qid="item.qid" :combinationId="currentExamId" @updateQuestion="handleUpdateQuestion" @deleteQuestion="handleDeleteQuestion"  />
        </div>
        <div v-else class="error-message">
          <p>题目信息无效</p>
        </div>
      </RecycleScroller>
      <button @click="addNewQuestion" class="button">添加新题目</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, computed } from 'vue';
import { useUserStore } from '@/store/index'; // 确保路径正确
import QuestionDetail from './QuestionDetail.vue'; // 引入 QuestionDetail 组件
import ExamEditView from './ExamEditView.vue';
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

export default {
  components: {
    QuestionDetail,
    ExamEditView,
    RecycleScroller,
  },
  setup() {
    const user = useUserStore();
    const exams = ref([]);
    const questions = ref([]);
    const detailVisible = ref(false);
    const updateVisible = ref(false);
    const currentExamId = ref(null);
    const hoverIndex = ref(-1);
    const showAddForm = ref(false);
    const newExam = ref({
      examId: '',
      examName: '',
      uid: user.userId || '', // 初始化时设置为用户ID或空字符串
      createdAt: ''
    });

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
          console.log('Loaded questions:', questions.value);
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

    const openUpdate = () => {
      updateVisible.value = true;
      detailVisible.value = false;
    };

    const closeUpdate = () => {
      updateVisible.value = false;
      detailVisible.value = true;
    };

    const handleUpdateQuestion = (updatedQuestion) => {
      const index = questions.value.findIndex(q => q.qid === updatedQuestion.qid);
      if (index !== -1) {
        questions.value[index] = updatedQuestion;
      }
    };

    const handleDeleteQuestion = (qid) => {
      questions.value = questions.value.filter(q => q.qid !== qid);
    };

    const addNewQuestion = () => {
      const newQid = prompt("请输入新题目的 qid:");
      axios.post('/exam/addQuestion',{
        questionId:newQid,
        combinationId:currentExamId.value
        }).then(response=>{
          console.log(response.data)
          alert(response.data.msg)
          loadExamDetails(currentExamId.value)
        }).catch(error=>{
          console.error('Error adding new question:', error);
          alert('添加失败，请检查输入的 qid 是否有效')
        })
      
    };

    const addExam = async () => {
      try {
        const response = await axios.post('/exam/addExam', newExam.value);
        if (response.data.code === 1) {
          exams.value.push(newExam.value);
          showAddForm.value = false;
          newExam.value = {
            examId: '',
            examName: '',
            uid: user.userId || '', // 重置为用户ID或空字符串
            createdAt: ''
          };
          alert('试卷添加成功');
        } else {
          alert('试卷添加失败');
        }
      } catch (error) {
        console.error('Error adding exam:', error);
        alert('试卷添加失败，请检查输入的信息');
      }
    };

    // 计算属性，用于过滤无效的 questions
    const filteredQuestions = computed(() => {
      return questions.value.filter(q => q && q.qid);
    });

    loadExams();

    return {
      user,
      exams,
      questions,
      detailVisible,
      updateVisible,
      currentExamId,
      hoverIndex,
      loadExamDetails,
      closeDetails,
      openUpdate,
      closeUpdate,
      handleUpdateQuestion,
      handleDeleteQuestion,
      addNewQuestion,
      filteredQuestions,
      showAddForm,
      newExam,
      addExam,
    };
  },
};
</script>

<style scoped>
.button {
  margin: 5px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}
</style>




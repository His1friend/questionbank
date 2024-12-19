<template>
  <div>
    <h2>Question Analysis</h2>

    <!-- 柱状图：难度级别题目数量 -->
    <div ref="barChart" style="width: 80%; height: 400px; margin: 0 auto;"></div>
    <p v-if="!loaded">Loading...</p>

    <!-- 折线图：难度级别通过人数 -->
    <div ref="lineChart" style="width: 80%; height: 400px; margin: 0 auto;"></div>
    <p v-if="!loaded">Loading...</p>

    <!-- 饼图：题目种类数量 -->
    <div ref="pieChart" style="width: 80%; height: 400px; margin: 0 auto;"></div>
    <p v-if="!loaded">Loading...</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  setup() {
    const barChart = ref(null);
    const lineChart = ref(null);
    const pieChart = ref(null);
    const loaded = ref(false);

    onMounted(async () => {
      try {
        // 使用 Axios 获取数据
        const response = await axios.get('/questions/list');
        const result = response.data;
        console.log('Response:', result);

        if (result.code === 1) { // 确保检查的是 code === 1 表示成功
          // 处理返回的数据
          const difficultyCounts = {};
          const passedCounts = {};
          const categoryCounts = {};

          result.data.forEach(item => {
            console.log('Item:', item);
            const level = item.difficultyLevel;
            const categoryId = item.categoryId;
            const passedNumber = item.passedNumber;

            if (!difficultyCounts[level]) {
              difficultyCounts[level] = 0;
            }
            difficultyCounts[level]++;

            if (!passedCounts[level]) {
              passedCounts[level] = 0;
            }
            passedCounts[level] += passedNumber;

            if (!categoryCounts[categoryId]) {
              categoryCounts[categoryId] = 0;
            }
            categoryCounts[categoryId]++;
          });

          const difficultyLabels = [];
          const difficultyData = [];
          const passedData = [];

          for (const level in difficultyCounts) {
            difficultyLabels.push(`Level ${level}`);
            difficultyData.push(difficultyCounts[level]);
            passedData.push(passedCounts[level]);
          }

          const categoryLabels = [];
          const categoryData = [];

          for (const categoryId in categoryCounts) {
            categoryLabels.push(`Category ${categoryId}`);
            categoryData.push(categoryCounts[categoryId]);
          }

          // 初始化柱状图：难度级别题目数量
          const barChartInstance = echarts.init(barChart.value);
          const barOption = {
            title: {
              text: 'Question Difficulty Levels (Bar Chart)',
              left: 'center',
            },
            tooltip: {},
            xAxis: {
              data: difficultyLabels,
            },
            yAxis: {},
            series: [
              {
                name: 'Number of Questions',
                type: 'bar',
                data: difficultyData,
                itemStyle: {
                  color: 'rgba(75, 192, 192, 0.6)',
                },
              },
            ],
          };
          barChartInstance.setOption(barOption);

          // 初始化折线图：难度级别通过人数
          const lineChartInstance = echarts.init(lineChart.value);
          const lineOption = {
            title: {
              text: 'Passed Number by Difficulty Level (Line Chart)',
              left: 'center',
            },
            tooltip: {},
            xAxis: {
              data: difficultyLabels,
            },
            yAxis: {},
            series: [
              {
                name: 'Passed Number',
                type: 'line',
                data: passedData,
                itemStyle: {
                  color: 'rgba(255, 99, 132, 0.6)',
                },
              },
            ],
          };
          lineChartInstance.setOption(lineOption);

          // 初始化饼图：题目种类数量
          const pieChartInstance = echarts.init(pieChart.value);
          const pieOption = {
            title: {
              text: 'Question Categories (Pie Chart)',
              left: 'center',
            },
            tooltip: {
              trigger: 'item',
            },
            legend: {
              orient: 'vertical',
              left: 'left',
            },
            series: [
              {
                name: 'Number of Questions',
                type: 'pie',
                radius: '50%',
                data: categoryLabels.map((label, index) => ({
                  name: label,
                  value: categoryData[index],
                })),
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                  },
                },
              },
            ],
          };
          pieChartInstance.setOption(pieOption);

          loaded.value = true;
        } else {
          console.error('Error fetching data:', result.msg);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    });

    return {
      barChart,
      lineChart,
      pieChart,
      loaded,
    };
  },
};
</script>

<style scoped>
/* 添加一些基本样式 */
h2 {
  text-align: center;
}

canvas {
  max-width: 80%;
  margin: 0 auto;
}
</style>




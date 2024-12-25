<template>
  <div>
    <h2>Question Analysis</h2>

    <!-- 柱状图：难度级别题目数量 -->
    <div ref="barChart" style="width: 80%; height: 400px; margin: 0 auto;"></div>
    <p v-if="!loaded">Loading...</p>

    <!-- 折线图：难度级别总通过人数 -->
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
          const totalCounts = {};
          const categoryCounts = {};

          result.data.forEach(item => {
            console.log('Item:', item);
            const level = item.difficultyLevel;
            const categoryId = item.categoryId;
            const passedNumber = item.passedNumber;
            const totalNumber = item.totalNumber;

            if (!difficultyCounts[level]) {
              difficultyCounts[level] = 0;
              passedCounts[level] = 0;
              totalCounts[level] = 0;
            }
            difficultyCounts[level]++;
            passedCounts[level] += passedNumber;
            totalCounts[level] += totalNumber;

            if (!categoryCounts[categoryId]) {
              categoryCounts[categoryId] = 0;
            }
            categoryCounts[categoryId]++;
          });

          const difficultyLabels = [];
          const difficultyData = [];
          const passRates = [];
          const totalPassedCounts = [];

          for (const level in difficultyCounts) {
            difficultyLabels.push(`Level ${level}`);
            difficultyData.push(difficultyCounts[level]);
            const passRate = (passedCounts[level] / totalCounts[level]) * 100;
            passRates.push(passRate.toFixed(2));
            totalPassedCounts.push(passedCounts[level]);
          }

          const categoryLabels = ['Choice', 'Calculation', 'Short Answer'];
          const categoryData = [
            categoryCounts[1] || 0,
            categoryCounts[2] || 0,
            categoryCounts[3] || 0,
          ];

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

          // 初始化折线图：难度级别总通过人数
          const lineChartInstance = echarts.init(lineChart.value);
          const lineOption = {
            title: {
              text: 'Total Passed Numbers by Difficulty Level (Line Chart)',
              left: 'center',
            },
            tooltip: {
              trigger: 'axis',
              formatter: function (params) {
                return params.map(param => `${param.seriesName}: ${param.value}`).join('<br/>');
              },
            },
            xAxis: {
              data: difficultyLabels,
            },
            yAxis: {
              axisLabel: {
                formatter: '{value}',
              },
            },
            series: [
              {
                name: 'Total Passed Numbers',
                type: 'line',
                data: totalPassedCounts,
                itemStyle: {
                  color: 'rgba(255, 99, 132, 0.6)',
                },
                symbolSize: 8,
                smooth: true,
              },
            ],
          };
          lineChartInstance.setOption(lineOption);

          // 初始化饼图：题目种类数量
          const pieChartInstance = echarts.init(pieChart.value);
          const colors = ['#FF6384', '#36A2EB', '#FFCE56'];
          const pieOption = {
            title: {
              text: 'Question Categories (Pie Chart)',
              left: 'center',
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)',
            },
            legend: {
              orient: 'vertical',
              right: 10,
            },
            series: [
              {
                name: 'Number of Questions',
                type: 'pie',
                radius: '50%',
                center: ['50%', '60%'],
                data: categoryLabels.map((label, index) => ({
                  name: label,
                  value: categoryData[index],
                })),
                itemStyle: {
                  color: (params) => colors[params.dataIndex % colors.length],
                },
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                  },
                },
                label: {
                  show: true,
                  formatter: '{b}: {c}',
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




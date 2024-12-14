<template>
  <div class="network-container">
    <svg ref="networkRef" width="700" height="700" display: block></svg>
    <div class="tooltip" ref="tooltipRef"></div>
    <el-dialog v-model="dialogVisible" >
      <el-form :model="selectedNode" label-width="100px">
        <el-form-item label="ID">
          <el-input v-model="selectedNode.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="Label">
          <el-input v-model="selectedNode.label"></el-input>
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="selectedNode.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="题目">
          <el-table :data="filteredQuestionList" style="width: 100%" @row-click="selectQuestion">
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
          </el-table>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveChanges">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, ref, nextTick, watch, onUnmounted } from 'vue';
import * as d3 from 'd3';
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  setup() {
    const networkRef = ref(null);
    const tooltipRef = ref(null);
    const dialogVisible = ref(false);
    const selectedNode = ref({});
    const tableData = ref([]);
    const questionList = ref([]);
    let simulation;
    let resizeObserver;

    const getRelationColor = (relation) => {
      const colorMap = {
        'parent': '#FF6B88',     // 粉红色，代表父关系
        'child': '#FFA726',       // 橙色，代表子关系
        'default': '#4A90E2',      // 蓝色，默认关系
        'bro': '#64D3DD'
      };
      return colorMap[relation] || colorMap['default'];
    };

    const fetchData = async () => {
      try {
        const response = await axios.get('/knowledge');
        const { nodes, edges } = response.data;

        const formattedNodes = nodes.map(node => ({
          id: node.kid,
          label: node.kname,
          description: node.description,
          questionId: node.questionId || '' // 假设节点有一个 questionId 字段
        }));

        const formattedEdges = edges.map(edge => ({
          source: edge.sourceKid,
          target: edge.targetKid,
          relation: edge.relation
        }));

        await nextTick();
        createNetwork(formattedNodes, formattedEdges);
        tableData.value = formattedNodes;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchQuestions = async () => {
      try {
        console.log("Fetching questions...");
        const response = await axios.get('/questions/list');
        if (response.data.code === 1) {
          questionList.value = response.data.data; // 将后端数据赋值给题目列表
          console.log("Fetched questions successfully:", questionList.value);
        } else {
          console.error('获取题目数据失败:', response.data.msg);
        }
      } catch (error) {
        console.error('请求题目数据失败:', error);
      }
    };

    const filterQuestionsByKid = (kid) => {
      console.log("Filtering questions by kid:", kid);
      const filteredQuestions = questionList.value.filter(question => question.knowledgeNode === kid);
      console.log("Filtered questions:", filteredQuestions);
      return filteredQuestions;
    };

    const selectQuestion = (row) => {
      console.log("Selected question:", row);
      selectedNode.value.questionId = row.qid;
    };

    const createNetwork = (nodes, links) => {
      const svg = d3.select(networkRef.value);
      if (!svg.empty()) {
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        // 清除之前的内容
        svg.selectAll("*").remove();

        // 创建渐变和动态水滴效果的 defs
        const defs = svg.append("defs");

        // 创建水滴动画渐变
        links.forEach((link, index) => {
          const linkColor = getRelationColor(link.relation);
          
          const gradient = defs.append("linearGradient")
            .attr("id", `droplet-gradient-${index}`)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "100%").attr("y2", "0%");

          gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", linkColor)
            .attr("stop-opacity", 0);

          gradient.append("stop")
            .attr("offset", "50%")
            .attr("stop-color", linkColor)
            .attr("stop-opacity", 1);

          gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", linkColor)
            .attr("stop-opacity", 0);
        });

        simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink().id(d => d.id).distance(100))
          .force("charge", d3.forceManyBody().strength(-200))
          .force("center", d3.forceCenter(width / 2, height / 2));

        // 添加连接线
        const linkGroup = svg.append("g").attr("class", "links");
        linkGroup
          .selectAll("line")
          .data(links)
          .enter().append("line")
          .attr("class", "link")
          .style("stroke", (d, i) => `url(#droplet-gradient-${i})`)
          .style("stroke-width", 3)
          .style("stroke-linecap", "round")
          .style("opacity", 0.7);

        // 添加动态水滴
        const dropletGroup = svg.append("g").attr("class", "droplets");
        links.forEach((link, index) => {
          const droplet = dropletGroup.append("circle")
            .attr("class", "droplet")
            .attr("r", 5)
            .style("fill", getRelationColor(link.relation))
            .style("opacity", 0.8);

          // 添加水滴动画
          function animateDroplet() {
            droplet
              .transition()
              .duration(2000)
              .ease(d3.easeLinear)
              .attrTween("cx", () => {
                return t => {
                  const l = links[index];
                  return l.source.x + (l.target.x - l.source.x) * t;
                };
              })
              .attrTween("cy", () => {
                return t => {
                  const l = links[index];
                  return l.source.y + (l.target.y - l.source.y) * t;
                };
              })
              .on("end", animateDroplet);
          }
          animateDroplet();
        });

        // 添加节点
        svg.append("g")
          .attr("class", "nodes")
          .selectAll("circle")
          .data(nodes)
          .enter().append("circle")
          .attr("class", "node")
          .attr("r", 8)
          .style("fill", "#6A5ACD")  // 更柔和的堇色
          .style("stroke", "#B0C4DE")
          .style("stroke-width", 2)
          .on("mouseover", function(event, d) {
            const tooltip = d3.select(tooltipRef.value);
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html(d.label)
              .style("left", (event.pageX + 5) + "px")
              .style("top", (event.pageY - 28) + "px");
          })
          .on("mouseout", function() {
            d3.select(tooltipRef.value).transition().duration(500).style("opacity", 0);
          })
          .on("click", function(event, d) {
            selectedNode.value = { ...d }; 
            fetchQuestions(); // 获取题目列表
            dialogVisible.value = true;
          })
          .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        simulation.nodes(nodes).on("tick", ticked);
        simulation.force("link").links(links);
      } else {
        console.error("SVG not found");
      }
    };

    const ticked = () => {
      d3.selectAll('.link')
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      d3.selectAll('.node')
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      d3.selectAll('.droplet')
        .attr("cx", (d, i) => {
          const link = simulation.force("link").links()[i];
          return link.source.x + (link.target.x - link.source.x) * 0.5;
        })
        .attr("cy", (d, i) => {
          const link = simulation.force("link").links()[i];
          return link.source.y + (link.target.y - link.source.y) * 0.5;
        });
    };

    const dragstarted = (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    };

    const dragended = (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    const saveChanges = async () => {
      try {
        await axios.put('/knowledge/node', {
          kid: selectedNode.value.id,
          kname: selectedNode.value.label,
          description: selectedNode.value.description,
          questionId: selectedNode.value.questionId
        });
        ElMessage.success('更新成功');

        const updatedNodeIndex = tableData.value.findIndex(node => node.id === selectedNode.value.id);
        if (updatedNodeIndex !== -1) {
          tableData.value[updatedNodeIndex].label = selectedNode.value.label;
          tableData.value[updatedNodeIndex].description = selectedNode.value.description;
          tableData.value[updatedNodeIndex].questionId = selectedNode.value.questionId;
        }

        dialogVisible.value = false;
      } catch (error) {
        console.error("Error updating data:", error);
        ElMessage.error('更新失败');
      }
    };

    const filteredQuestionList = ref([]);

    const throttle = (func, limit) => {
      let lastFunc;
      let lastRan;
      return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
          func.apply(context, args);
          lastRan = Date.now();
        } else {
          clearTimeout(lastFunc);
          lastFunc = setTimeout(function() {
            if ((Date.now() - lastRan) >= limit) {
              func.apply(context, args);
              lastRan = Date.now();
            }
          }, limit - (Date.now() - lastRan));
        }
      };
    };

    const handleResize = throttle(() => {
      const svg = d3.select(networkRef.value);
      if (!svg.empty() && simulation) {
        const width = +svg.attr("width");
        const height = +svg.attr("height");
        simulation.force("center", d3.forceCenter(width / 2, height / 2)).alphaTarget(0.3).restart();
      }
    }, 200);

    const categoryMap = {
      1: '单选题',
      2: '多选题',
      3: '判断题',
      4: '填空题',
      5: '简答题'
    };

    onMounted(() => {
      fetchData();
      fetchQuestions(); // 初始化题目列表

      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(networkRef.value);
    });

    onUnmounted(() => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    });

    watch(
      () => selectedNode.value.id,
      (newKid) => {
        console.log("Selected node ID changed to:", newKid);
        filteredQuestionList.value = filterQuestionsByKid(newKid);
      }
    );

    return {
      networkRef,
      tooltipRef,
      dialogVisible,
      selectedNode,
      saveChanges,
      tableData,
      questionList,
      filteredQuestionList,
      fetchQuestions,
      filterQuestionsByKid,
      selectQuestion,
      categoryMap
    };
  }
};
</script>

<style scoped>
.tooltip {
  position: absolute;
  text-align: center;
  padding: 5px;
  font: 12px sans-serif;
  background: rgba(176, 196, 222, 0.8);
  border-radius: 8px;
  pointer-events: none;
  opacity: 0;
}

.node {
  cursor: pointer;
  transition: all 0.3s ease;
}

.node:hover {
  stroke-width: 4px;
  transform: scale(1.1);
}

.link {
  transition: opacity 0.3s ease;
}

.network-container {
  width: 100%;
  height: 100vh; /* 使用视窗单位 */
  position: relative;
  overflow: hidden;
}
</style>




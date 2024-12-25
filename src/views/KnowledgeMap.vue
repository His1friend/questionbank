<template>
  <div class="network-container">
    <div class="svg-container" ref="containerRef">
      <svg ref="networkRef" :width="width" :height="height">
        <defs>
          <!-- 定义箭头 -->
          <marker id="arrowhead" viewBox="0 -5 10 10" refX="20" refY="0" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M0,-5L10,0L0,5" fill="#999"/>
          </marker>
        </defs>
      </svg>
      <div class="tooltip" ref="tooltipRef"></div>
    </div>
    
    <!-- 对话框 -->
    <el-dialog v-model="dialogVisible" width="80%" destroy-on-close>
      <el-form label-width="120px">
        <el-form-item label="节点ID">
          <el-input v-model="selectedNode.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="节点名称">
          <el-input v-model="selectedNode.label"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="selectedNode.description"></el-input>
        </el-form-item>
        <el-form-item label="题目ID">
          <el-select v-model="selectedNode.questionId" placeholder="请选择题目">
            <el-option
              v-for="question in filteredQuestionList"
              :key="question.qid"
              :label="question.title"
              :value="question.qid"
            ></el-option>
          </el-select>
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
import { onMounted, ref, nextTick, onUnmounted } from 'vue';
import * as d3 from 'd3';
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  setup() {
    const networkRef = ref(null);
    const tooltipRef = ref(null);
    const containerRef = ref(null);
    const dialogVisible = ref(false);
    const selectedNode = ref({});
    const tableData = ref([]);
    const questionList = ref([]);
    const width = ref(0);
    const height = ref(0);
    let simulation;

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


    const createNetwork = (nodes, links) => {
      const svg = d3.select(networkRef.value);
      if (!svg.empty()) {
        // 设置初始宽度和高度
        svg.attr("width", width.value).attr("height", height.value);

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
          .force("link", d3.forceLink(links).id(d => d.id).distance(100))
          .force("charge", d3.forceManyBody().strength(-10)) // 减少斥力强度
          .force("center", d3.forceCenter(width.value / 2, height.value / 2));

        // 添加边界约束
        simulation.on("tick", () => {
          nodes.forEach(node => {
            node.x = Math.max(node.r, Math.min(width.value - node.r, node.x));
            node.y = Math.max(node.r, Math.min(height.value - node.r, node.y));
          });
        });

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
            selectedNode.value.filteredQuestionList = filterQuestionsByKid(d.id);
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
      updateDimensions();
    }, 200);
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

    const updateDimensions = () => {
      if (containerRef.value) {
        width.value = containerRef.value.clientWidth;
        height.value = containerRef.value.clientHeight;
        if (simulation) {
          simulation.force("center", d3.forceCenter(width.value / 2, height.value / 2)).alphaTarget(0.3).restart();
        }
      }
    };
    onMounted(async () => {
      // 使用nextTick确保DOM已经更新
      await nextTick();
      updateDimensions();
      fetchData();
      fetchQuestions();

      // 监听窗口大小变化
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    return {
      networkRef,
      tooltipRef,
      containerRef,
      dialogVisible,
      selectedNode,
      tableData,
      questionList,
      width,
      height,
      saveChanges
    };
  }
};
</script>

<style scoped>
.network-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 60px); /* 减去导航栏的高度 */
  background-color: #f0f2f5;
}

.svg-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.tooltip {
  position: absolute;
  text-align: center;
  padding: 8px;
  font: 12px sans-serif;
  background: rgba(176, 196, 222, 0.9);
  border-radius: 8px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.node {
  cursor: pointer;
  stroke: white;
  stroke-width: 1.5px;
}

.node:hover {
  stroke-width: 3px;
}

.link {
  stroke: #999;
  stroke-opacity: 0.6;
}
</style>
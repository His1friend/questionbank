<template>
  <div>
    <svg ref="networkRef" width="500" height="500"></svg>
    <div class="tooltip" ref="tooltipRef"></div>
  </div>
</template>

<script>
import { onMounted, ref, nextTick } from 'vue';
import * as d3 from 'd3';
import axios from 'axios';

export default {
  setup() {
    const networkRef = ref(null);
    const tooltipRef = ref(null);
    let simulation; // 声明外部变量

    const fetchData = async () => {
      try {
        const response = await axios.get('/knowledge');
        const { nodes, edges } = response.data;

        const formattedNodes = nodes.map(node => ({
          id: node.kid,
          label: node.kname,
          description: node.description
        }));

        const formattedEdges = edges.map(edge => ({
          source: edge.sourceKid,
          target: edge.targetKid,
          relation: edge.relation
        }));

        await nextTick(); // 等待 DOM 渲染完成
        createNetwork(formattedNodes, formattedEdges);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const createNetwork = (nodes, links) => {
      const svg = d3.select(networkRef.value);
      if (!svg.empty()) {
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        // 使用外部 simulation 变量
        simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink().id(d => d.id).distance(100))
          .force("charge", d3.forceManyBody().strength(-200))
          .force("center", d3.forceCenter(width / 2, height / 2));

        svg.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(links)
          .enter().append("line")
          .attr("class", "link")
          .style("stroke", d => {
            if (d.relation === 'parent') return 'red';
            if (d.relation === 'child') return 'orange';
            return '#00FFFF'; // 默认颜色
            })
          .style("stroke-opacity", 0.6);

        svg.append("g")
          .attr("class", "nodes")
          .selectAll("circle")
          .data(nodes)
          .enter().append("circle")
          .attr("class", "node")
          .attr("r", 8)
          .style("fill", "steelblue")
          .style("stroke", "#B180D7")
          .style("stroke-width", 1.5)
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
          .on("dblclick", function(event, d) {
            alert(`Double clicked on: ${d.label}`);
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
    };

    const dragstarted = (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart(); // 使用外部的 simulation
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    };

    const dragended = (event, d) => {
      if (!event.active) simulation.alphaTarget(0); // 使用外部的 simulation
      d.fx = null;
      d.fy = null;
    };

    onMounted(() => {
      fetchData();
    });

    return {
      networkRef,
      tooltipRef
    };
  }
};
</script>




<style>
.tooltip {
  position: absolute;
  text-align: center;
  padding: 5px;
  font: 12px sans-serif;
  background: lightsteelblue;
  border: 0px;
  border-radius: 8px;
  pointer-events: none;
  opacity: 0;
}

.node {
  fill: #B180D7;
  stroke: white;
  stroke-width: 1.5px;
}

.link {
  stroke: #999;
  stroke-opacity: 0.6;
}
</style>

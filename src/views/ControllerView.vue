<template>
    <el-container class="layout-container-demo" style="height: 100vh">
      <!-- 侧边栏 -->
      <el-aside width="200px" v-if="showSidebar">
        <el-scrollbar>
          <el-menu :default-active="activeMenu" @select="handleSelect">
            <!-- 菜单导航 -->
            <el-sub-menu index="1">
              <template #title>
                <el-icon><icon-menu /></el-icon>题库管理
              </template>
              <el-menu-item index="QuestionList">查看题目</el-menu-item>
              <el-menu-item index="QuestionCreate">添加题目</el-menu-item>
              <el-menu-item index="EditQuestion">编辑题目</el-menu-item>
              <el-menu-item index="QuestionDetail">删除题目</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="1-5">
              <template #title>
                <el-icon><icon-menu /></el-icon>统计分析
              </template>
              <el-menu-item index="StateView">题目统计</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
  
      <!-- 主容器 -->
      <el-container>
        <!-- 工具栏 -->
        <el-header style="text-align: right; font-size: 12px">
          <div class="toolbar">
            <el-dropdown>
              <el-icon style="margin-right: 8px; margin-top: 1px">
                <setting />
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>导出</el-dropdown-item>
                  <el-dropdown-item>导入</el-dropdown-item>
                  <el-dropdown-item>设置</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span>管理员</span>
          </div>
        </el-header>
  
        <!-- 主内容区 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </template>
  

  
<script setup>
import { computed, watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const activeIndex = ref('1');

const showSidebar = computed(() => {
  // 如果当前路径是 '/QuestionController' 或其子路径，则显示侧边栏
  return route.path.startsWith('/QuestionController');
});

const handleSelect = (index) => {
  router.push( {path: `/QuestionController/${index}`} );
};

// Watch route changes to update activeIndex
watch(route, (to) => {
  activeIndex.value = to.path.split('/').pop(); // 根据当前路径更新菜单项的激活状态
}, { immediate: true });
</script>
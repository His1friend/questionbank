<template>
    <div class="not-found">
      <h1>404</h1>
      <p>抱歉，您访问的页面不存在。</p>
      <router-link to="/">返回首页</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound'
  }
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    margin-top: 50px;
  }
  
  h1 {
    font-size: 5em;
    color: #333;
  }
  
  p {
    font-size: 1.2em;
    color: #666;
  }
  
  a {
    text-decoration: none;
    color: #007bff;
    font-weight: bold;
  }
  
  a:hover {
    text-decoration: underline;
  }
  </style>
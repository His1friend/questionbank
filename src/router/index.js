import { createRouter, createWebHashHistory } from 'vue-router'
import axios from 'axios'
import HomeView from '../views/HomeView.vue'
import NavBar from '@/components/NavBar.vue'
import QuestionCreate from '@/views/QuestionCreate.vue'
import QuestionDetail from '@/views/QuestionDetail.vue'
import QuestionList from '@/views/QuestionList.vue'
import ControllerView from '@/views/ControllerView.vue'
import ExamView from '@/views/ExamView.vue'
import LoginView from '@/views/LoginView.vue'
import EditQuestion from '@/views/EditQuestion.vue'
import StateView from '@/views/StateView.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    components: { 
      default: HomeView,
      NavBar:NavBar
    }
  },
  {
    path: '/QuestionController',
    name: 'QuestionController',
    meta: { requiresAuth: true },
    children: [
      { path: 'QuestionList', component: QuestionList },  // 不需要斜杠
      { path: 'QuestionCreate', component: QuestionCreate },
      { path: 'EditQuestion', component: EditQuestion },
      { path: 'QuestionDetail', component: QuestionDetail },
      { path:'StateView',component:StateView}
    ],
    component: ControllerView,
    
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path:'/navBar',
    name:'NavBar',
    component:NavBar

  },
  {
    path:'/KnowledgeMap',
    name:'KnowledgeMap',
    component: () => import('@/views/KnowledgeMap.vue'),

  },
  
  {
    path:'/create',
    name:'QuestionCreate',
    component:QuestionCreate,
    meta: { requiresAuth: true }
  },
  {
    path:'/detail',
    name:'QuestionDetail',
    component:QuestionDetail,
    meta: { requiresAuth: false }
  },
  {
    path:'/list',
    name:'QuestionList',
    component:QuestionList,
    meta: { requiresAuth: true }
  },
  {
    path:'/exam',
    name:'exam',
    component:ExamView,
    meta: { requiresAuth: true }
  },
  { path: '/login', 
    component: LoginView 
  },
  {
    path:'/register',
    name:'register',
    component: () => import('@/views/RegisterView.vue'),
  },
  {
    path:'/edit',
    name:'EditQuestion',
    component:EditQuestion,
    meta: { requiresAuth: true }
  },
  {
    path:'/CaptchaView',
    name:'CaptchaView',
    component: () => import('@/views/CaptchaView.vue'),
  },
  {
    path:'/state',
    name:'StateView',
    component:StateView,
    meta: { requiresAuth: true }
  },
  {
    path:'/404',
    name:'404',
    component: () => import('@/views/NotView.vue'),
  },
  {
    path:'/:pathMatch(.*)*',
    name:'notFound',
    component: () => import('@/views/NotView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path:'/questionupdater',
    name:'questionupdater',
    component: () => import('@/views/QuestionUpdateView.vue'),
    meta: { requiresAuth: false }
  }

]


const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach(async (to, from, next) => {
  const token = getCookie('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isLoginPage = to.path === '/login';
  const redirect = new URLSearchParams(window.location.search).get('redirect') || '/';
  console.log('Token:', token);
  console.log('Requires Auth:', requiresAuth);
  console.log('Is Login Page:', isLoginPage);

  if (requiresAuth) {
    if (!token) {
      console.log('No token found, redirecting to login.');
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
      return;
    }

    // 这里可以添加 token 有效性检查逻辑
    const isValidToken = await validateToken(token);
    if (!isValidToken) {
      console.log('Invalid token, redirecting to login.');
      localStorage.removeItem('token');
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
      return;
    }
  }

  if (isLoginPage && token) {
    console.log('User is logged in, redirecting to home.');
    next(redirect);
    return;
  }

  console.log('Proceeding to next route.');
  next();
});
async function validateToken(token) {
  try {
    const response = await axios.post('/users/validate-token', { token }); // 请求后端验证 token
    return response.data; // 根据返回的数据判断 token 是否有效
  } catch (error) {
    return false; // 出现错误则视为无效 token
  }
}
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
console.log(router.getRoutes());
export default router

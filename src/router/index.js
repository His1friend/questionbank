import { createRouter, createWebHashHistory } from 'vue-router'
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
    meta: { requiresAuth: false },
    children: [
      { path: 'QuestionList', component: QuestionList },  // 不需要斜杠
      { path: 'QuestionCreate', component: QuestionCreate },
      { path: 'EditQuestion', component: EditQuestion },
      { path: 'QuestionDetail', component: QuestionDetail },
      { path:'StateView',component:StateView}
    ],
    component: ControllerView
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
    path:'/create',
    name:'QuestionCreate',
    component:QuestionCreate,
    meta: { requiresAuth: false }
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
    meta: { requiresAuth: false }
  },
  {
    path:'/exam',
    name:'exam',
    component:ExamView,
    meta: { requiresAuth: false }
  },
  { path: '/login', component: LoginView }
]


const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isLoginPage = to.path === '/login';
 if (requiresAuth && !token) {
  
    next('/login');
    return;
  }

  if (isLoginPage && token) {

    next('/');
    return;
  }

  // If you have any async operations, handle them here
  // await someAsyncFunction();


  next();
});
console.log(router.getRoutes());
export default router

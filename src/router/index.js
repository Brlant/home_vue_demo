import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login/login.vue'
import home from '../components/home/home.vue'
import welcome from '../components/welcome/welcome.vue'
import users from '../components/user/users.vue'
import power from '../components/power/power.vue'
import roles from "../components/power/roles";
import categories from "../components/goods/categories";
import params from "../components/goods/params";
import report from "../components/report/report";
import list from "../components/goods/list";
import order from "../components/order/order";
import add from "../components/goods/add";

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/login', component: login },
    {
      path: '/home',
      component: home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: welcome },
        { path: '/users', component: users },
        { path: '/rights', component: power },
        { path: '/roles', component: roles},
        { path: '/categories', component: categories},
        { path: '/params', component: params},
        { path: '/goods', component: list},
        { path: '/goods/add', component: add},
        { path: '/orders', component: order},
        { path: '/reports', component: report},
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router

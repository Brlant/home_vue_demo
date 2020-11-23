// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'

import ElementUI from 'element-ui';

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//导入 NProgress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import _ from 'lodash'
Vue.prototype._ = _

import 'element-ui/lib/theme-chalk/index.css';
import { MessageBox } from 'element-ui';
Vue.prototype.$confirm = MessageBox.confirm
import '../src/assets/fonts/iconfont.css'

import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
//在request拦截器中，展示进度条NProgress.start()
axios.interceptors.request.use(config=>{
  // console.log(config)
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
//在response拦截器中，隐藏进度条NProgress.done()
axios.interceptors.response.use(config=>{
  // console.log(config)
  NProgress.done()
  return config
})
Vue.prototype.$http = axios


Vue.use(ElementUI);
//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

Vue.filter('dateFormat',function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDay()+'').padStart(2,'0')

  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

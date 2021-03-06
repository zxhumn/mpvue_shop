import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'
// 配置axios
import axios from 'axios';
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    wx.showLoading({
        title:'正在加载中。。。',
        mask:true
    })
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });


// 使用Promise
axios.defaults.adapter  =function (config) {
    // if(config.env==='mp'){
        // console.log(config)
    return new Promise((resolve,reject)=>{

      
        wx.request({
            url:config.url,
            data:config.params?config.params:config.data,
            method:config.method,
            success:function(res){
                resolve(res)
            },
            fail:function(err){
                reject(err)
            },
            complete:function(){
                wx.hideLoading()
            }

        })
    })
// }
}
axios.defaults.baseURL="https://www.zhengzhicheng.cn/";
// axios.defaults.baseURL = "http://www.127.0.0.1:3306";
Vue.prototype.$axios = axios;

const app = new Vue(App)
app.$mount()
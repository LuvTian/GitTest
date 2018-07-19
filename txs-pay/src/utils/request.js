import axios from 'axios'
import { Message, MessageBox, Loading } from 'element-ui'
import store from '../store'
import { getToken, getMadisonToken } from '@/utils/auth'

function request(config) {
  var _config = {
    loading: false,
    errormsg: false,
    BASE_API: '',
    ...config
  }
  let _APIGateway = 'BASE_API' + (_config.BASE_API ? '_' + _config.BASE_API : '');
  // 创建axios实例
  const service = axios.create({
    baseURL: process.env[_APIGateway], // api的base_url
    timeout: 10000, // 请求超时时间
    headers: { 'Platform': 'H5', 'Access-Token': getMadisonToken() }
  })

  var loadTip

  // request拦截器
  service.interceptors.request.use(config => {
    if (store.getters.token) {
      config.headers['logintoken'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if (_config.loading) {
      loadTip = Loading.service({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
    return config
  }, error => {
    // Do something with request error
    console.log(error) // for debug
    if (_config.loading) {
      loadTip.close()
    }
    Promise.reject(error)
  })

  // respone拦截器
  service.interceptors.response.use(
    response => {
      const res = response.data
      if (_config.loading) {
        loadTip.close()
      }
      //ASPNET接口
      if (_config.BASE_API === 'APSNET') {
        if (res) {
          return res;
        }
      } else {
        return res;
        //java接口
        if (res.code == '200') {
          return response.data;
        } else {
          return Promise.reject(res.errormsg)
        }
      }
    },
    error => {
      if (_config.loading) {
        loadTip.close()
      }
      // console.log('err' + error)// for debug
      // Message({
      //   message: error.message,
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      return Promise.reject(error)
    }
  )
  return service;
}
export default request


// if (res.code !== '0000') {
//   // 1000:Token 过期了;
//   if (res.code === '1000') {
//     MessageBox.alert(res.message, '登录过期', {
//       confirmButtonText: '重新登录',
//       callback: () => {
//         store.dispatch('FedLogOut').then(() => {
//           location.reload()// 为了重新实例化vue-router对象 避免bug
//         })
//       }
//     })
//   } else {
//     if (!response.config.handleError) {
//       Message({
//         message: res.message,
//         type: 'error',
//         duration: 5 * 1000
//       })
//     }
//   }
//   return Promise.reject(res.message)
// } 
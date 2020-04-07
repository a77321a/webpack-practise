import axios from 'axios';
import QS from "qs";
// import { Message, Loading } from 'element-ui';
//定义loading变量
let loading;
//使用Element loading-start 方法
function startLoading () {
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
//使用Element loading-close 方法
function endLoading () {
  loading.close()
}
//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0;
export function showFullScreenLoading () {
  if (needLoadingRequestCount === 0) {
    // startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    // endLoading()
  }
}
let api = axios.create();
if (process.env.NODE_ENV === 'development') {
  //测试地址
  // api.defaults.baseURL = "http://192.168.10.40:3000/mock/34/ks";
  // api.defaults.baseURL = "http://192.168.200.230:8080/axcTask/";//易家龙
  // api.defaults.baseURL = "http://192.168.10.225:8081/axcExam/";//陈小雨
  api.defaults.baseURL = "http://192.168.200.84:8081/axcTask/";//朱德安

  api.defaults.baseURL = "http://192.168.10.116:8081/axcExam/";//杨鹏
} else {
  //真实环境
  //api.defaults.baseURL = "http://192.168.0.111:8191/processAnalysis0000/";
}
//预览地址文件前缀
export const previewUrl = 'http://192.168.10.22';
export const baseUrl = api.defaults.baseURL;

api.interceptors.request.use((config) => {
  config.headers.authtoken = "346636";
  showFullScreenLoading()
  return config;
}, (error) => {
  return Promise.reject(error);
});


api.interceptors.response.use((response) => {
  //响应接口统一处理
  if (response.data.status && response.data.status != 200) {
    // Message.error(response.data.message)
  }
  tryHideFullScreenLoading()
  return response;
}, (error) => {
  return Promise.reject(error);
});

//get
api.getApi = (method, data, func) => {
  var url = api.defaults.baseURL + method;
  api({
    url: url,
    method: 'get',
    params: data,
  }).then(response => {
    if ((response.data.errCode == 200) && func) {
      func(response.data);
    }
  }).catch(request => {
    console.log(request);
  })
};

/**
 * GET 请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求的参数]
 */
export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params
    }).then(res => {
      // if (res.data.code == 200) {
      resolve(res.data);
      // }
    }).catch(err => {
      reject(err.data);
    })
  })
}


/**
 * POST 请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求的参数]
 */

export const post = (url, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      headers: {
        'Content-type': 'application/json'
      },
      data: params
    }).then(res => {
      if (res.data.code == 200) {
        resolve(res.data);
      }
    }).catch(err => {
      reject(err.data);
    })
  })
}

/**
 * POST 请求
 * 请求参数封装进url中， 不传入body
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求的参数]
 */
export const postRequest = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, '', {
      params
    }).then(res => {
      // if (res.data.code == 200) {
      resolve(res.data);
      // }
    }).catch(err => {
      reject(err.data);
    })
  })
}

/**
 * download file
 */
export const downloadFile = (url, param) => {
  let a = document.createElement('a')
  a.href = api.defaults.baseURL + url + '?' + QS.stringify(param);
  a.click();
}

export default api;

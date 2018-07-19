import request from '@/utils/request'

export function login(config, loginReq) {
  return request(config)({
    url: '/StoreServices.svc/Anonymous/user/loginverification',
    method: 'post',
    data: loginReq
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

/**
 * 获取图形验证码
 * @param {*} APSNET 
 */
export function captcha(APSNET) {
  return request({
    BASE_API: APSNET
  })({
    url: '/StoreServices.svc/Anonymous/user/getimgcode',
    method: 'post',
    data: {}
  })
}
/**
 * 获取短信验证码
 * @param {any} APSNET 
 */
export function smsCode(APSNET, params) {
  return request({
    BASE_API: APSNET
  })({
    url: '/StoreServices.svc/Anonymous/user/sendusersms',
    method: 'post',
    data: params
  })
}
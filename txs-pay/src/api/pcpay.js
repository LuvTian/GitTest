import request from '@/utils/request'

// 获取僧财宝个人信息
export function getUserInfo(params) {
  return request({ BASE_API: 'APSNET' })({
    url: '/StoreServices.svc/user/info',
    method: 'POST',
    data: {}
  })
}

// pc僧财宝充值接口
export function accountDeposit(params) {
  return request()({
    url: '/account/deposit/send',
    method: 'post',
    data: params
  })
}

// 获取交易记录的数据
export function getRecordList(params) {
  return request()({
    url: '/txs/pc/trans/record',
    method: 'post',
    data: params
  })
}

// 退出登录
export function signOut(params) {
  return request({
    BASE_API: 'APSNET'
  })({
    url: '/StoreServices.svc/user/userquit',
    method: 'post',
    data: {}
  })
}

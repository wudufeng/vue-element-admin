import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/product/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function refreshProduct(data) {
  return request({
    url: '/product/pullDetail',
    method: 'get',
    params: {
      platformCode: data.platformCode,
      accountId: data.accountId,
      platformProductId: data.platformProductId
    }
  })
}

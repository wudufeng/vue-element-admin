import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/sale/app/product/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function pullProduct(data) {
  return request({
    url: '/sale/app/product/pullList',
    method: 'get',
    params: data
  })
}

export function pullRetry(data) {
  return request({
    url: '/sale/app/product/pull/' + data,
    method: 'get'
  })
}

export function refreshProduct(data) {
  return request({
    url: '/sale/app/product/pullDetail',
    method: 'get',
    params: {
      platformCode: data.platformCode,
      accountId: data.accountId,
      platformProductId: data.platformProductId
    }
  })
}

export function getProductExtension(query) {
  return request({
    url: '/sale/app/product/extension',
    method: 'get',
    params: query
  })
}

export function getEventLogList(data) {
  return request({
    url: '/sale/app/product/getEventLogPage',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function getPullProductLogList(data) {
  return request({
    url: '/sale/app/product/getPullProductLogPage',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

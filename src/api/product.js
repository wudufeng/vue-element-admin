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
    method: 'post',
    params: data
  })
}

export function pullRetry(data, productSplitDate) {
  return request({
    url: '/sale/app/product/pull/' + data.executionId + '?productSplitDate=' + productSplitDate,
    method: 'get'
  })
}

export function ignore(platformCode, executionId) {
  return request({
    url: '/sale/app/product/pull-log/ignore?platformCode=' + platformCode + '&executionId=' + executionId,
    method: 'put'
  })
}

export function refreshProduct(data) {
  return request({
    url: '/sale/app/product/' + (data.productId !== undefined ? 'transfer' : 'pullDetail'),
    method: 'get',
    params: {
      platformCode: data.platformCode,
      accountId: data.accountId,
      platformProductId: data.platformProductId
    }
  })
}

export function getProductPayload(query) {
  return request({
    url: '/sale/app/product/payload',
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
    url: '/sale/app/product/pull-log/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

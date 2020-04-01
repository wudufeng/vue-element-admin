import request from '@/utils/request'

// 上传查询
export function uploadSearch(data) {
  return request({
    url: '/middle/image/platform/admin/list',
    method: 'get',
    params: data
  })
}

// 上传重试
export function uploadRetry(data) {
  return request({
    url: '/middle/image/platform/retry',
    method: 'get',
    params: { 'ids': data }
  })
}

// 同步查询
export function syncSearch(path, data) {
  return request({
    url: path,
    method: 'get',
    params: data
  })
}

// 同步删除
export function syncDel(path, data) {
  return request({
    url: path,
    method: 'get',
    params: { 'ids': data }
  })
}

// 同步重试
export function syncRetry(path, data) {
  return request({
    url: path,
    method: 'get',
    params: { 'ids': data }
  })
}

// 图片基本信息查询
export function imageSearch(path, data) {
  return request({
    url: path,
    method: 'get',
    params: data
  })
}

// 修改图片
export function imageUpdate(path, data) {
  return request({
    url: path,
    method: 'get',
    params: data
  })
}

// 海外同步到本地
export function syncToLocal(path, data) {
  return request({
    url: path,
    method: 'get',
    params: { 'ids': data }
  })
}

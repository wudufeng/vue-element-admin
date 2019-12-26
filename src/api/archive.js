import request from '@/utils/request'

// export function getArchiveDatasourceList(data) {
//   return request({
//     url: '/archive/archive-datasource/list',
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     },
//     data
//   })
// }
//
// export function addArchiveDatasource(data) {
//   return request({
//     url: '/archive/archive-datasource',
//     method: 'post',
//     params: data
//   })
// }
//
// export function getArchiveDatasourceDetail(id) {
//   return request({
//     url: '/archive/archive-datasource/' + id,
//     method: 'get'
//   })
// }
//
// export function updateArchiveDatasource(data) {
//   return request({
//     url: '/archive/archive-datasource',
//     method: 'put',
//     params: data
//   })
// }
//
// export function removeArchiveDatasource(id) {
//   return request({
//     url: '/archive/archive-datasource/' + id,
//     method: 'delete'
//   })
// }
//
// export function getArchiveJobList(data) {
//   return request({
//     url: '/archive/archive-job/list',
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     },
//     data
//   })
// }
//
// export function addArchiveJob(data) {
//   return request({
//     url: '/archive/archive-job',
//     method: 'post',
//     params: data
//   })
// }

// 执行归档
export function execArchiveJob(data) {
  return request({
    url: '/archive/archive-job/exec/' + data.id,
    method: 'post'
  })
}

// 批量启用归档任务
export function enableArchiveJob(data) {
  return request({
    url: '/archive/archive-job/enable',
    method: 'put',
    params: { 'archiveJobIds': data }
  })
}

// 批量禁用归档任务
export function disableArchiveJob(data) {
  return request({
    url: '/archive/archive-job/disable',
    method: 'put',
    params: { 'archiveJobIds': data }
  })
}
// export function getArchiveJobDetail(id) {
//   return request({
//     url: '/archive/archive-job/' + id,
//     method: 'get'
//   })
// }
//
// export function updateArchiveJob(data) {
//   return request({
//     url: '/archive/archive-job',
//     method: 'put',
//     params: data
//   })
// }
//
// export function removeArchiveJob(id) {
//   return request({
//     url: '/archive/archive-job/' + id,
//     method: 'delete'
//   })
// }


import request from '@/utils/request'

export function getDatabaseInfoList(data) {
  return request({
    url: '/codegen/database-info/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function addDatabaseInfo(data) {
  return request({
    url: '/codegen/database-info',
    method: 'post',
    params: data
  })
}

export function updateDatabaseInfo(data) {
  return request({
    url: '/codegen/database-info',
    method: 'put',
    params: data
  })
}

export function removeDatabaseInfo(id) {
  return request({
    url: '/codegen/database-info/' + id,
    method: 'delete'
  })
}

export function getCodeGeneratorList(data) {
  return request({
    url: '/codegen/table/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function addCodeGenerator(data) {
  request({
    url: '/codegen/code/generate',
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}

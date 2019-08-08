import request from '@/utils/request'

export function getTenantList(data) {
  return request({
    url: '/upms/tenant/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function addTenant(data) {
  return request({
    url: '/upms/tenant',
    method: 'post',
    params: data
  })
}

export function getTenantDetail(data) {
  return request({
    url: '/upms/tenant',
    method: 'get',
    params: data
  })
}

export function updateTenant(data) {
  return request({
    url: '/upms/tenant',
    method: 'put',
    params: data
  })
}

export function removeTenant(id) {
  return request({
    url: '/upms/tenant/' + id,
    method: 'delete'
  })
}

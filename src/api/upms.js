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

// 组织架构CURD
export function getOrganizationList(data) {
  return request({
    url: '/upms/organization/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function addOrganization(data) {
  return request({
    url: '/upms/organization',
    method: 'post',
    params: data
  })
}

export function getOrganizationDetail(id) {
  return request({
    url: '/upms/organization/' + id,
    method: 'get'
  })
}

export function updateOrganization(data) {
  return request({
    url: '/upms/organization',
    method: 'put',
    params: data
  })
}

export function removeOrganization(id) {
  return request({
    url: '/upms/organization/' + id,
    method: 'delete'
  })
}

export function getOrganizationTree(tenantId) {
  const data = request({
    url: '/upms/organization/trees',
    method: 'get',
    params: tenantId
  })
  return data
}

export function getUserInfoList(data) {
  return request({
    url: '/upms/user-info/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function addUserInfo(data) {
  return request({
    url: '/upms/user-info',
    method: 'post',
    params: data
  })
}

export function getUserInfoDetail(id) {
  return request({
    url: '/upms/user-info/' + id,
    method: 'get'
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/upms/user-info',
    method: 'put',
    params: data
  })
}

export function removeUserInfo(id) {
  return request({
    url: '/upms/user-info/' + id,
    method: 'delete'
  })
}

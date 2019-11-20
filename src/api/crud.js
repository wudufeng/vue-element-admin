import request from '@/utils/request'

export function getList(pathVal, data) {
  return request({
    url: pathVal + (pathVal.lastIndexOf('/') === (pathVal.length - 1) ? '' : '/list'),
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function add(pathVal, data) {
  return request({
    url: pathVal,
    method: 'post',
    transformRequest: [function(data) {
      let ret = ''
      for (const it in data) {
        const key = encodeURIComponent(it)
        if (key.slice(0, 1) !== '$') {
          ret += key + '=' + encodeURIComponent(data[it]) + '&'
        }
      }
      return ret
    }],
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function get(pathVal, data) {
  return request({
    url: pathVal,
    method: 'get',
    params: data
  })
}

export function getDetail(pathVal, id) {
  return request({
    url: pathVal + '/' + id,
    method: 'get'
  })
}

export function update(pathVal, data) {
  return request({
    url: pathVal,
    method: 'put',
    transformRequest: [function(data) {
      let ret = ''
      for (const it in data) {
        const key = encodeURIComponent(it)
        if (key.slice(0, 1) !== '$') {
          ret += key + '=' + encodeURIComponent(data[it]) + '&'
        }
      }
      return ret
    }],
    data: data
  })
}

export function remove(pathVal, id) {
  return request({
    url: pathVal + '/' + id,
    method: 'delete'
  })
}

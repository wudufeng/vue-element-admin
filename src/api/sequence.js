import request from '@/utils/request'

export function getSequenceDefinitionList(data) {
  return request({
    url: '/sequence/definition',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function addSequenceDefinition(data) {
  return request({
    url: '/sequence/definition',
    method: 'put',
    params: data
  })
}

export function getSequenceDefinitionDetail(data) {
  return request({
    url: '/sequence/definition/' + data,
    method: 'get'
  })
}

export function updateSequenceDefinition(seqId, data) {
  return request({
    url: '/sequence/definition/' + seqId,
    method: 'post',
    params: data
  })
}

export function removeSequenceDefinition(data) {
  return request({
    url: '/sequence/definition',
    method: 'delete',
    params: data
  })
}

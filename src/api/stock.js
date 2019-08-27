import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/sales/stock/rule-config/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function getRuleConfig(data) {
  return request({
    url: '/sales/stock/getRuleConfig',
    method: 'get',
    params: { ruleConfigId: data }
  })
}

export function enableRuleConfig(id, enable) {
  return request({
    url: '/sales/stock/updateEnable',
    method: 'post',
    params: { id: id, enable: enable }
  })
}

export function addRuleConfig(data) {
  return request({
    url: '/sales/stock/addRuleConfig',
    method: 'post',
    data
  })
}

export function updateRuleConfig(data) {
  return request({
    url: '/sales/stock/updateRuleConfig',
    method: 'post',
    data
  })
}

export function operateStock(query) {
  return request({
    url: '/sales/stock/batch/operate',
    method: 'post',
    params: query
  })
}

export function fetchOperateLogList(data) {
  return request({
    url: '/sales/stock/getOperateLogPage',
    method: 'post',
    data
  })
}

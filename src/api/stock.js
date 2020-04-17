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

export function operateStock(data) {
  return request({
    url: '/sales/stock/batch/operate',
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

export function batchUpdateStock(data) {
  return request({
    url: '/sales/stock/EB/batch-update',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function fetchOperateLogList(data) {
  return request({
    url: '/sales/stock/getOperateLogPage',
    method: 'post',
    data
  })
}

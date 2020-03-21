/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const stockRouter = {
  path: '/sales/stock',
  component: Layout,
  redirect: '/rule-config',
  name: 'stockManage',
  meta: {
    title: '库存调整',
    icon: 'table'
  },
  children: [
    {
      path: 'rule-config',
      component: () => import('@/views/stock/rule-config-crud'),
      name: 'RuleConfigCrud',
      meta: { title: '规则配置' }
    },
    {
      path: 'trigger',
      component: () => import('@/views/stock/trigger'),
      name: 'RuleConfigTrigger',
      meta: { title: '触发调整' }
    },
    {
      path: 'operate-request',
      component: () => import('@/views/stock/operate-request'),
      name: 'StockOperateRequest',
      meta: { title: '操作任务' }
    },
    {
      path: 'rule-exclusive',
      component: () => import('@/views/stock/rule-exclusive'),
      name: 'RuleExclusive',
      meta: { title: '排除列表' }
    },
    {
      path: 'operate-logs',
      component: () => import('@/views/stock/operate-logs'),
      name: 'OperateLogs',
      meta: { title: '库存日志' }
    },
    {
      path: 'operate-logs/:platform(\\w+)/:id(\\d+)',
      component: () => import('@/views/stock/operate-logs'),
      name: 'OperateLogs+',
      meta: { title: '库存日志', noCache: true, activeMenu: '/stock/trigger' },
      hidden: true
    },
    {
      path: 'offline-log',
      component: () => import('@/views/stock/offline-logs'),
      name: 'OfflineLogs',
      meta: { title: '下架日志' }
    }
  ]
}
export default stockRouter

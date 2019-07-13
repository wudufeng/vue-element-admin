/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const stockRouter = {
  path: '/stock',
  component: Layout,
  redirect: '/stock/config',
  name: 'stockManage',
  meta: {
    title: '库存调整',
    icon: 'table'
  },
  children: [
    {
      path: 'config',
      component: () => import('@/views/stock/rule-config'),
      name: 'rule-config',
      meta: { title: '规则配置' }
    },
    {
      path: 'trigger',
      component: () => import('@/views/stock/trigger'),
      name: 'trigger',
      meta: { title: '触发调整' }
    },
    {
      path: 'logs',
      component: () => import('@/views/stock/operate-logs'),
      name: 'logs',
      meta: { title: '库存日志', noCache: false }
    },
    {
      path: 'logs/:platform(\\w+)/:id(\\d+)',
      component: () => import('@/views/stock/operate-logs'),
      name: 'logs+',
      meta: { title: '库存日志', noCache: false, activeMenu: '/stock/trigger' },
      hidden: true
    }
  ]
}
export default stockRouter

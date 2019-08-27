/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: '/sale/app/order/order-pull-log',
  name: 'orderManage',
  meta: {
    title: '拉单管理',
    icon: 'table'
  },
  children: [
    {
      path: '/sale/app/order/order-info',
      component: () => import('@/views/order/order-info'),
      name: 'OrderInfo',
      meta: { title: '订单信息', icon: 'list' }
    },
    {
      path: '/sale/app/order/pull',
      component: () => import('@/views/order/trigger-pull'),
      name: 'OrderPullTrigger',
      meta: { title: '触发任务', icon: 'list' }
    },
    {
      path: '/sale/app/order/order-pull-log',
      component: () => import('@/views/order/order-pull-log'),
      name: 'OrderPullLog',
      meta: { title: '执行记录', icon: 'list' }
    }
  ]
}
export default orderRouter

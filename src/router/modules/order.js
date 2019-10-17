/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const orderRouter = {
  path: '/sale/app/order/',
  component: Layout,
  redirect: '',
  name: 'orderManage',
  meta: {
    title: '拉单管理',
    icon: 'table'
  },
  children: [
    {
      path: 'pull',
      component: () => import('@/views/order/trigger-pull'),
      name: 'OrderPullTrigger',
      meta: { title: '触发拉单', icon: 'list' }
    },
    {
      path: 'pull-log',
      component: () => import('@/views/order/order-pull-log'),
      name: 'OrderPullLog',
      meta: { title: '拉单记录', icon: 'list' }
    },
    {
      path: '',
      component: () => import('@/views/order/order-info'),
      name: 'OrderInfo',
      meta: { title: '原始订单', icon: 'list' }
    }
  ]
}
export default orderRouter

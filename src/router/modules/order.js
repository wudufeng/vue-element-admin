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
      component: () => import('@/views/order/origin-order'),
      name: 'OriginOrder',
      meta: { title: '原始订单', icon: 'list' }
    },
    {
      path: 'transfer',
      component: () => import('@/views/order/transfer-order'),
      name: 'TransferOrder',
      meta: { title: '转换订单', icon: 'list' }
    },
    {
      path: 'transfer/detail',
      component: () => import('@/views/order/transfer-order-detail'),
      name: 'TransferOrder',
      meta: { title: '订单明细', icon: 'list' },
      hidden: true
    },
    {
      path: 'transfer/exception',
      component: () => import('@/views/order/transfer-order-exception'),
      name: 'TransferOrder',
      meta: { title: '异常信息', icon: 'list' },
      hidden: true
    },
    {
      path: 'cancel',
      component: () => import('@/views/order/cancel-order'),
      name: 'TransferOrder',
      meta: { title: '取消订单', icon: 'list' }
    }
  ]
}
export default orderRouter

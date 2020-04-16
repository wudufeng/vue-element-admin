/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const orderRouter = {
  path: '/sale/app/order/',
  component: Layout,
  redirect: '',
  name: 'orderManage',
  meta: {
    title: '拉单管理',
    icon: 'el-icon-document-copy'
  },
  children: [
    {
      path: 'pull',
      component: () => import('@/views/order/trigger-pull'),
      name: 'OrderPullTrigger',
      meta: { title: '触发拉单', icon: 'el-icon-s-promotion' }
    },
    {
      path: 'pull-log',
      component: () => import('@/views/order/order-pull-log'),
      name: 'OrderPullLog',
      meta: { title: '拉单记录', icon: 'el-icon-document' }
    },
    {
      path: '',
      component: () => import('@/views/order/origin-order'),
      name: 'OriginOrder',
      meta: { title: '原始订单', icon: 'el-icon-files' }
    },
    {
      path: 'transfer',
      component: () => import('@/views/order/transfer-order'),
      name: 'TransferOrder',
      meta: { title: '转换订单', icon: 'el-icon-refresh' }
    },
    {
      path: 'transfer/detail',
      component: () => import('@/views/order/transfer-order-detail'),
      name: 'TransferOrderDetail',
      meta: { title: '订单明细', icon: 'el-icon-document' },
      hidden: true
    },
    {
      path: 'transfer/exception',
      component: () => import('@/views/order/transfer-order-exception'),
      name: 'TransferOrderException',
      meta: { title: '异常信息', icon: 'el-icon-warning-outline' },
      hidden: true
    },
    {
      path: 'cancel',
      component: () => import('@/views/order/cancel-order'),
      name: 'TransferOrder',
      meta: { title: '取消订单', icon: 'el-icon-circle-close' }
    }
  ]
}
export default orderRouter

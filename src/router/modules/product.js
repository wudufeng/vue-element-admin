/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const productRouter = {
  path: '/sale/app/product',
  component: Layout,
  redirect: '',
  name: 'productManage',
  meta: {
    title: '商品管理',
    icon: 'el-icon-goods'
  },
  children: [
    {
      path: '',
      component: () => import('@/views/product/product'),
      name: 'Product',
      meta: { title: '商品列表', icon: 'el-icon-tickets' }
    },
    {
      path: 'pull',
      component: () => import('@/views/product/pull-product'),
      name: 'PullProductTrigger',
      meta: { title: ' 拉取商品', icon: 'el-icon-download' }
    },
    {
      path: 'pull-log',
      component: () => import('@/views/product/product-pull-log'),
      name: 'ProductPullLog',
      meta: { title: '执行记录', icon: 'el-icon-document' }
    },
    {
      path: 'event-log/list',
      component: () => import('@/views/product/event-log'),
      name: 'EventLogList',
      meta: { title: ' 变更日志', icon: 'el-icon-edit-outline' }
    },
    {
      path: 'payload/:platform(\\w+)/:productId(\\d+)',
      component: () => import('@/views/product/product-payload'),
      name: 'ProductPayload',
      meta: { title: '原报文数据', noCache: false, activeMenu: '/sale/app/product' },
      hidden: true
    }
  ]
}
export default productRouter

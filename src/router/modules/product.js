/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const productRouter = {
  path: '/product',
  component: Layout,
  redirect: '/sale/app/product',
  name: 'productManage',
  meta: {
    title: '商品管理',
    icon: 'table'
  },
  children: [
    {
      path: '/sale/app/product',
      component: () => import('@/views/product/product'),
      name: 'Product',
      meta: { title: '商品列表' }
    },
    {
      path: '/sale/app/product/pull',
      component: () => import('@/views/product/pull-product'),
      name: 'PullProductTrigger',
      meta: { title: ' 拉取商品' }
    },
    {
      path: 'pull-product-log/list',
      component: () => import('@/views/product/product-pull-log'),
      name: 'ProductPullLog',
      meta: { title: '执行记录' }
    },
    {
      path: 'event-log/list',
      component: () => import('@/views/product/event-log'),
      name: 'EventLogList',
      meta: { title: ' 变更日志' }
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

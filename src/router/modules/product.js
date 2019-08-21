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
      path: 'pull',
      component: () => import('@/views/product/pull-product'),
      name: 'PullProductTrigger',
      meta: { title: ' 拉取商品' }
    },
    {
      path: 'pull-product-log/list',
      component: () => import('@/views/product/ProductPullLog'),
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
      path: 'extension/:platform(\\w+)/:productId(\\d+)',
      component: () => import('@/views/product/product-extension'),
      name: 'ProductExtension',
      meta: { title: '原报文数据', noCache: false, activeMenu: '/sale/app/product' },
      hidden: true
    }
  ]
}
export default productRouter

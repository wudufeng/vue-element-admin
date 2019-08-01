/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const productRouter = {
  path: '/product',
  component: Layout,
  redirect: '/product/list',
  name: 'productManage',
  meta: {
    title: '商品管理',
    icon: 'table'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/product/product-list'),
      name: 'ProductList',
      meta: { title: '商品列表' }
    },
    {
      path: 'pull',
      component: () => import('@/views/product/pull-product'),
      name: 'PullProductTrigger',
      meta: { title: ' 拉取商品' }
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
      meta: { title: '商品详情', noCache: false, activeMenu: '/product/list' },
      hidden: true
    }
  ]
}
export default productRouter

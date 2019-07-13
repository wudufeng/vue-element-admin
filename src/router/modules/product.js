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
      name: 'product-list',
      meta: { title: '商品列表' }
    }
  ]
}
export default productRouter

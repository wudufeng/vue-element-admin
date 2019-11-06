/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const marketingRouter = {
  path: '/sale/app/marketing',
  component: Layout,
  redirect: 'gift-relation',
  name: 'marketingManage',
  meta: {
    title: '营销管理',
    icon: 'table'
  },
  children: [
    {
      path: 'gift-relation',
      component: () => import('@/views/marketing/gift-relation'),
      name: 'GiftRelation',
      meta: { title: '赠品管理', icon: 'list' }
    },
    {
      path: 'platform-sku-map',
      component: () => import('@/views/marketing/platform-sku-map'),
      name: 'GiftRelation',
      meta: { title: '销售SKU映射', icon: 'list' }
    }
  ]
}
export default marketingRouter

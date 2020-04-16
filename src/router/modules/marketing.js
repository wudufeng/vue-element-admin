/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const marketingRouter = {
  path: '/sale/app/marketing',
  component: Layout,
  redirect: 'gift-relation',
  name: 'marketingManage',
  meta: {
    title: '营销管理',
    icon: 'el-icon-data-line'
  },
  children: [
    {
      path: 'gift-relation',
      component: () => import('@/views/marketing/gift-relation'),
      name: 'GiftRelation',
      meta: { title: '赠品管理', icon: 'el-icon-present' }
    },
    {
      path: 'platform-sku-map',
      component: () => import('@/views/marketing/platform-sku-map'),
      name: 'PlatformSkuMap',
      meta: { title: '销售SKU映射', icon: 'el-icon-set-up' }
    },
    {
      path: 'customer-blacklist',
      component: () => import('@/views/marketing/customer-blacklist'),
      name: 'CustomerBlacklist',
      meta: { title: '顾客黑名单', icon: 'el-icon-s-opportunity' }
    }
  ]
}
export default marketingRouter

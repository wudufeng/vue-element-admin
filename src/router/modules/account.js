/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const accountRouter = {
  path: '/sale/app/account',
  component: Layout,
  redirect: 'info',
  name: 'accountManage',
  meta: {
    title: '销售管理',
    icon: 'table'
  },
  children: [
    {
      path: 'info',
      component: () => import('@/views/account/account-info'),
      name: 'AccountInfo',
      meta: { title: '账号管理', icon: 'list' }
    }
  ]
}
export default accountRouter

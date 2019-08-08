/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const upmsRouter = {
  path: '/upms',
  component: Layout,
  redirect: 'tenant',
  name: 'upmsManage',
  meta: {
    title: '权限管理',
    icon: 'table'
  },
  children: [
    {
      path: 'tenant',
      component: () => import('@/views/upms/Tenant'),
      name: 'Tenant',
      meta: { title: '租户管理', icon: 'list' }
    },
    {
      path: 'organization',
      component: () => import('@/views/upms/Tenant'),
      name: 'Organization',
      meta: { title: '机构管理', icon: 'list' }
    },
    {
      path: 'user',
      component: () => import('@/views/upms/Tenant'),
      name: 'User',
      meta: { title: '用户管理', icon: 'list' }
    }
  ]
}
export default upmsRouter

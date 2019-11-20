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
      component: () => import('@/views/upms/Organization'),
      name: 'Organization',
      meta: { title: '组织架构', icon: 'list' }
    },
    {
      path: 'menu',
      component: () => import('@/views/upms/menu'),
      name: 'Menu',
      meta: { title: '菜单管理', icon: 'list' }
    },
    {
      path: 'role',
      component: () => import('@/views/upms/role'),
      name: 'Role',
      meta: { title: '角色管理', icon: 'list' }
    },
    {
      path: 'user-info',
      component: () => import('@/views/upms/userinfo'),
      name: 'UserInfo',
      meta: { title: '用户管理', icon: 'list' }
    }
  ]
}
export default upmsRouter

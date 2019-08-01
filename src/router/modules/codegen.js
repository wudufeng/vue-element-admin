/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const codegenRouter = {
  path: '/codegen',
  component: Layout,
  redirect: '/database-info/list',
  name: 'codegen',
  meta: {
    title: '数据源管理',
    icon: 'table'
  },
  children: [
    {
      path: 'database-info/list',
      component: () => import('@/views/codegen/DatabaseInfoList'),
      name: 'DatabaseInfoList',
      meta: { title: '数据源列表', icon: 'list' }
    },
    {
      path: 'database-info/create',
      component: () => import('@/views/codegen/DatabaseInfoDetail'),
      name: 'Create DatabaseInfo',
      meta: { title: '新建数据源', icon: 'edit' }
    },
    {
      path: 'database-info/edit/:id(\\d+)',
      component: () => import('@/views/codegen/DatabaseInfoDetail'),
      name: 'EditDatabaseInfo',
      meta: { title: '编辑数据源', noCache: true, activeMenu: '/codegen/database-info/list' },
      hidden: true
    }
  ]
}
export default codegenRouter

/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const codegenRouter = {
  path: '/codegen',
  component: Layout,
  redirect: 'datasource',
  name: 'codegen',
  meta: {
    title: '代码生成',
    icon: 'table'
  },
  children: [
    {
      path: 'datasource',
      component: () => import('@/views/codegen/DatabaseInfo'),
      name: 'DatabaseInfo',
      meta: { title: '数据源管理', icon: 'list' }
    },
    {
      path: ':databaseId(\\d+)',
      component: () => import('@/views/codegen/CodeGenerator'),
      name: 'CodeGenerator',
      meta: { title: '代码生成', activeMenu: '/codegen' },
      hidden: true
    },
    {
      path: 'project',
      component: () => import('@/views/codegen/DatabaseInfo'),
      name: 'Project',
      meta: { title: '生成项目', icon: 'edit' }
    }
  ]
}
export default codegenRouter

/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const codegenRouter = {
  path: '/codegen',
  component: Layout,
  redirect: '/codegen',
  name: 'codegen',
  meta: {
    title: '代码生成',
    icon: 'table'
  },
  children: [
    {
      path: '/',
      component: () => import('@/views/codegen/DatabaseInfo'),
      name: 'DatabaseInfo',
      meta: { title: '数据源管理', icon: 'table' },
      hidden: true
    },
    {
      path: '/codegen/:databaseId(\\d+)',
      component: () => import('@/views/codegen/CodeGenerator'),
      name: 'CodeGenerator',
      meta: { title: '代码生成', activeMenu: '/codegen' },
      hidden: true
    }
  ]
}
export default codegenRouter

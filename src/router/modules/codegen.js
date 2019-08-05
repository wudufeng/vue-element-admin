/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const codegenRouter = {
  path: '/codegen',
  component: Layout,
  redirect: '/database-info/list',
  name: 'codegen',
  meta: {
    title: '代码生成',
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
      path: '/generator',
      component: () => import('@/views/codegen/DatabaseInfoList'),
      name: 'CodeGenerator',
      meta: { title: '代码生成', icon: 'edit' }
    }
  ]
}
export default codegenRouter

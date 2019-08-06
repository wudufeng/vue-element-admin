/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const sequenceRouter = {
  path: '/sequence',
  component: Layout,
  redirect: '/definition/list',
  name: 'sequenceManage',
  meta: {
    title: '序列管理',
    icon: 'table'
  },
  children: [
    {
      path: 'definition/list',
      component: () => import('@/views/sequence/SequenceDefinition'),
      name: 'SequenceDefintion',
      meta: { title: '序列定义', icon: 'list' }
    }
  ]
}
export default sequenceRouter

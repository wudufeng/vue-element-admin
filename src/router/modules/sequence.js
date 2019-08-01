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
      component: () => import('@/views/sequence/SequenceList'),
      name: 'SequenceList',
      meta: { title: '序列定义', icon: 'list' }
    },
    {
      path: 'definition/create',
      component: () => import('@/views/sequence/CreateSequence'),
      name: 'CreateSequence',
      meta: { title: '创建序列', icon: 'edit' }
    },
    {
      path: 'definition/edit/:id(\\d+)',
      component: () => import('@/views/sequence/EditSequence'),
      name: 'EditSequence',
      meta: { title: '修改序列', noCache: true, isEdit: true, activeMenu: '/sequence/sequence-definition/list' },
      hidden: true
    }
  ]
}
export default sequenceRouter

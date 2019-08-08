/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const sequenceRouter = {
  path: '/sequence',
  component: Layout,
  redirect: '/sequence',
  name: 'sequence',
  meta: {
    title: '序列管理',
    icon: 'list'
  },
  children: [
    {
      path: '/',
      component: () => import('@/views/sequence/SequenceDefinition'),
      name: 'SequenceDefintion',
      meta: { title: '序列定义', icon: 'list' },
      hidden: true
    }
  ]
}
export default sequenceRouter

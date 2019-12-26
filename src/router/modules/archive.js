/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const archiveRouter = {
  path: '/archive',
  component: Layout,
  redirect: 'archive-datasource',
  name: 'archiveManage',
  meta: {
    title: '归档管理',
    icon: 'table'
  },
  children: [
    {
      path: 'archive-datasource',
      component: () => import('@/views/archive/archivedatasource'),
      name: 'archivedatasource',
      meta: { title: '数据源配置', icon: 'list' }
    },
    {
      path: 'archive-job',
      component: () => import('@/views/archive/archivejob'),
      name: 'archivejob',
      meta: { title: '归档任务', icon: 'list' }
    },
    {
      path: 'archive-job-log',
      component: () => import('@/views/archive/archivejoblog'),
      name: 'archivejoblog',
      meta: { title: '归档日志', icon: 'list' }
    }
  ]
}
export default archiveRouter

/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const archiveRouter = {
  path: '/archive',
  component: Layout,
  redirect: 'archive-datasource',
  name: 'archiveManage',
  meta: {
    title: '归档管理',
    icon: 'component'
  },
  children: [
    {
      path: 'archive-datasource',
      component: () => import('@/views/archive/archivedatasource'),
      name: 'ArchiveDatasource',
      meta: { title: '数据源配置', icon: 'password' }
    },
    {
      path: 'archive-job',
      component: () => import('@/views/archive/archivejob'),
      name: 'ArchiveJob',
      meta: { title: '归档任务', icon: 'example' }
    },
    {
      path: 'archive-job-log',
      component: () => import('@/views/archive/archivejoblog'),
      name: 'ArchiveJobLog',
      meta: { title: '归档日志', icon: 'search' }
    }
  ]
}
export default archiveRouter

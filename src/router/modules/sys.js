/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const accountRouter = {
  path: '/sale/app',
  component: Layout,
  redirect: 'info',
  name: 'accountManage',
  meta: {
    title: '系统管理',
    icon: 'el-icon-setting'
  },
  children: [
    {
      path: 'account/info',
      component: () => import('@/views/sys/account-info'),
      name: 'AccountInfo',
      meta: { title: '账号管理', icon: 'el-icon-user' }
    },
    {
      path: 'sys/message-recoverer',
      component: () => import('@/views/sys/messagere-coverer'),
      name: 'MessageRecoverer',
      meta: { title: '异常管理', icon: 'el-icon-warning-outline' }
    }
  ]
}
export default accountRouter

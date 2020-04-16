/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const imageRouter = {
  path: '/image',
  component: Layout,
  redirect: '/image/list',
  name: 'imageManage',
  meta: {
    title: '图片管理',
    icon: 'el-icon-picture-outline'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/image/image-list'),
      name: 'ImageList',
      meta: { title: '图片列表', icon: 'el-icon-s-grid' }
    },
    {
      path: 'sync',
      component: () => import('@/views/image/image-sync'),
      name: 'ImageSync',
      meta: { title: '图片同步', icon: 'el-icon-sort' }
    },
    {
      path: 'upload',
      component: () => import('@/views/image/image-upload'),
      name: 'ImageUpload',
      meta: { title: '图片上传', icon: 'el-icon-upload' }
    }
  ]
}
export default imageRouter

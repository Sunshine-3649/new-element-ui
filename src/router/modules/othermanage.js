// 其他出入库模块路径
const othermanage = () => import('@/view/otherwarehousemanage/othermanage/othermanage'); // 其他出入库管理
const otheraddoredit = () => import('@/view/otherwarehousemanage/othermanage/otheraddoredit/otheraddoredit'); // 其他出入库管理新增or编辑
const otheraudit = () => import('@/view/otherwarehousemanage/otheraudit/otheraudit'); // 其他出入库审核
const otherdetail = () => import('@/view/otherwarehousemanage/otheraudit/otherdetail/otherdetail'); // 其他出入库审核详情
const otherwarehousein = () => import('@/view/otherwarehousemanage/otherwarehousein/otherwarehousein'); // 其他入库通知单
const otherwarehouseout = () => import('@/view/otherwarehousemanage/otherwarehouseout/otherwarehouseout'); // 其他出库通知单

const otherwarehousemanage = [
  {
    path: '/othermanage',
    name: 'othermanage',
    meta: {
        title: '其他出入库管理',
        code: 10612
    },
    component: othermanage
  },
  {
    path: '/othermanage/otheraddoredit/:outInCode',
    name: 'otheraddoredit',
    meta: {
      title: '其他出入库管理'
    },
    component: otheraddoredit
  },
  {
    path: '/otheraudit',
    name: 'otheraudit',
    meta: {
        title: '其他出入库审核',
        code: 10613
    },
    component: otheraudit
  },
  {
    path: '/otheraudit/otherdetail/:id',
    name: 'otherdetail',
    meta: {
      title: '其他出入库审核'
    },
    component: otherdetail
  },
  {
    path: '/otherwarehousein',
    name: 'otherwarehousein',
    meta: {
        title: '其他入库通知单',
        code: 10614
    },
    component: otherwarehousein
  },
  {
    path: '/otherwarehouseout',
    name: 'otherwarehouseout',
    meta: {
        title: '其他出库通知单',
        code: 10615
    },
    component: otherwarehouseout
  }

];

export default otherwarehousemanage;

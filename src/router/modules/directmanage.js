// 订单管理模块路径
const directordermanage = () => import('@/view/directmanage/directordermanage/directordermanage'); // 订单管理
const directexcepmanage = () => import('@/view/directmanage/directexcepmanage/directexcepmanage'); // 订单管理
const supplierorder = () => import('@/view/directmanage/supplierorder/supplierorder'); // 供应商订单
const shippenotice = () => import('@/view/directmanage/shippenotice/shippenotice'); // 发货通知单管理

const directmanage = [
  {
    path: '/directordermanage',
    name: 'directordermanage',
    meta: {
        title: '订单管理',
        code: 20401
    },
    component: directordermanage
  },
  {
    path: '/directexcepmanage',
    name: 'directexcepmanage',
    meta: {
        title: '拆单异常管理',
        code: 20404
    },
    component: directexcepmanage
  },
  {
    path: '/supplierorder',
    name: 'supplierorder',
    meta: {
        title: '供应商订单',
        code: 20402
    },
    component: supplierorder
  },
  {
    path: '/shippenotice',
    name: 'shippenotice',
    meta: {
        title: '发货通知单管理',
        code: 20403
    },
    component: shippenotice
  }

];

export default directmanage;

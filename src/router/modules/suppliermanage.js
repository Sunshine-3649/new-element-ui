// 供应商管理
const supplierManage = () => import('@/view/suppliermanage/supplierapplymanage'); // 供应商管理
const supplierAdd = () => import('@/view/suppliermanage/supplierapplymanage/supplierapplyadd'); // 供应商管理新增
const supplierapplyRedit = () => import('@/view/suppliermanage/supplierapplymanage/supplierapplyRedit'); // 供应商管理编辑
const supplierapplyDetail = () => import('@/view/suppliermanage/supplierapplymanage/supplierapplydetail'); // 供应商详情
const supplierapply = () => import('@/view/suppliermanage/supplierapply/supplierapply'); // 供应商申请
const supplierapplydetail = () => import('@/view/suppliermanage/supplierapply/supplierapplydetail'); // 供应商申请
const supplierapplyaudit = () => import('@/view/suppliermanage/supplierapply/supplierapplyaudit'); // 供应商申请审批
const supplierapplyauditdetail = () => import('@/view/suppliermanage/supplierapply/supplierapplyauditdetail'); // 供应商申请审批详情

const suppliermanage = [
    {
      path: '/supplierManage',
      name: 'supplierManage',
      meta: {
          title: '供应商管理',
          code: 10301
      },
        component: supplierManage
    },
  {
    path: '/supplierManage/supplierAdd/',
    name: 'supplierAdd',
    meta: {
      title: '供应商管理'
    },
    component: supplierAdd
  },
  {
    path: '/supplierManage/supplierapplyRedit/:id',
    name: 'supplierapplyRedit',
    meta: {
        title: '供应商管理'
    },
    component: supplierapplyRedit
    },
  {
    path: '/supplierManage/supplierapplyDetail/:id',
    name: 'supplierapplyDetail',
    meta: {
        title: '供应商管理'
    },
    component: supplierapplyDetail
  },
  {
    path: '/supplierapplydetail',
    name: 'supplierapplydetail',
    meta: {
        title: '供应商申请详情'
    },
    component: supplierapplydetail
  },
  {
    path: '/supplierapplyaudit',
    name: 'supplierapplyaudit',
    meta: {
        title: '供应商申请审批',
        code: 10302
    },
    component: supplierapplyaudit
  },
  {
    path: '/supplierapplyaudit/supplierapplyauditdetail',
    name: 'supplierapplyauditdetail',
    meta: {
      title: '供应商申请审批'
    },
    component: supplierapplyauditdetail
  },
  {
    path: '/supplierapply',
    name: 'supplierapply',
    meta: {
        title: '供应商申请',
        code: 20201
    },
      component: supplierapply
  }

];

export default suppliermanage;

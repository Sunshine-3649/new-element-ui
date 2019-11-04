// 采购管理模块路径
const purchasesgroup = () => import('@/view/purchasemanage/purchasemanage/purchasegroupmanage/purchasesgroup'); // 采购组管理
const purchasegroupaddoredit = () => import('@/view/purchasemanage/purchasemanage/purchasegroupmanage/purchasegroupaddoredit/purchasegroupaddoredit'); // 采购组管理新增or编辑
const purchasegroupdetail = () => import('@/view/purchasemanage/purchasemanage/purchasegroupmanage/purchasegroupdetail/purchasegroupdetail'); // 采购组管理详情
const purchaseordermanage = () => import('@/view/purchasemanage/purchasemanage/purchaseordermanage/purchaseordermanage'); // 采购单管理
const purchaseorderaddoredit = () => import('@/view/purchasemanage/purchasemanage/purchaseordermanage/purchaseorderaddoredit/purchaseorderaddoredit'); // 采购单管理新增or编辑
const purchaseorderaudit = () => import('@/view/purchasemanage/purchasemanage/purchaseorderaudit/purchaseorderaudit'); // 采购单审核
const purchaseauditdetail = () => import('@/view/purchasemanage/purchasemanage/purchaseorderaudit/purchaseauditdetail/purchaseauditdetail'); // 采购单审核详情
const warenoticordermanage = () => import('@/view/purchasemanage/purchasemanage/warenoticordermanage/warenoticordermanage'); // 入库通知单管理
const warenoticorderdetail = () => import('@/view/purchasemanage/purchasemanage/warenoticordermanage/warenoticorderdetail/warenoticorderdetail'); // 入库通知单管理详情
const purchreturnordermanage = () => import('@/view/purchasemanage/returnmanage/purchreturnordermanage/purchreturnordermanage'); // 采购退货单管理
const purchreturnorderaddoredit = () => import('@/view/purchasemanage/returnmanage/purchreturnordermanage/purchreturnorderaddoredit/purchreturnorderaddoredit'); // 采购退货单管理新增or编辑
const purchreturnordeaudit = () => import('@/view/purchasemanage/returnmanage/purchreturnordeaudit/purchreturnordeaudit'); // 采购退货单审核
const returnordeauditdetail = () => import('@/view/purchasemanage/returnmanage/purchreturnordeaudit/returnordeauditdetail/returnordeauditdetail'); // 采购退货单审核详情
const returnorderout = () => import('@/view/purchasemanage/returnmanage/returnorderout/returnorderout'); // 退货出库通知单

const purchasemanage = [
  {
    path: '/purchasesgroup',
    name: 'purchasesgroup',
    meta: {
        title: '采购组管理',
        code: 20301
    },
    component: purchasesgroup
  },
  {
    path: '/purchasesgroup/purchasegroupaddoredit/:id',
    name: 'purchasegroupaddoredit',
    meta: {
      title: '采购组管理'
    },
    component: purchasegroupaddoredit
  },
  {
    path: '/purchasesgroup/purchasegroupdetail/:id',
    name: 'purchasegroupdetail',
    meta: {
      title: '采购组管理'
    },
    component: purchasegroupdetail
  },
  {
    path: '/purchaseordermanage',
    name: 'purchaseordermanage',
    meta: {
        title: '采购单管理',
        code: 20302
    },
    component: purchaseordermanage
  },
  {
    path: '/purchaseordermanage/purchaseorderaddoredit/:id',
    name: 'purchaseorderaddoredit',
    meta: {
      title: '采购单管理'
    },
    component: purchaseorderaddoredit
  },
  {
    path: '/purchaseorderaudit',
    name: 'purchaseorderaudit',
    meta: {
        title: '采购单审核',
        code: 20303
    },
    component: purchaseorderaudit
  },
  {
    path: '/purchaseorderaudit/purchaseauditdetail/:id',
    name: 'purchaseauditdetail',
    meta: {
      title: '采购单审核'
    },
    component: purchaseauditdetail
  },
  {
    path: '/warenoticordermanage',
    name: 'warenoticordermanage',
    meta: {
        title: '入库通知单管理',
        code: 20304
    },
    component: warenoticordermanage
  },
  {
    path: '/warenoticordermanage/warenoticorderdetail/:id',
    name: 'warenoticorderdetail',
    meta: {
      title: '入库通知单管理'
    },
    component: warenoticorderdetail
  },
  {
    path: '/purchreturnordermanage',
    name: 'purchreturnordermanage',
    meta: {
        title: '采购退货单管理',
        code: 20307
    },
    component: purchreturnordermanage
  },
  {
    path: '/purchreturnordermanage/purchreturnorderaddoredit/:id',
    name: 'purchreturnorderaddoredit',
    meta: {
      title: '采购退货单管理'
    },
    component: purchreturnorderaddoredit
  },
  {
    path: '/purchreturnordeaudit',
    name: 'purchreturnordeaudit',
    meta: {
        title: '采购退货单审核',
        code: 20308
    },
    component: purchreturnordeaudit
  },
  {
    path: '/purchreturnordeaudit/returnordeauditdetail/:id',
    name: 'returnordeauditdetail',
    meta: {
      title: '采购退货单审核'
    },
    component: returnordeauditdetail
  },
  {
    path: '/returnorderout',
    name: 'returnorderout',
    meta: {
        title: '退货出库通知单',
        code: 20309
    },
    component: returnorderout
  }

];

export default purchasemanage;

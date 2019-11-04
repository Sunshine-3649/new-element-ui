// 仓储管理模块路径
const storeinfomanage = () => import('@/view/storemanage/storeinfomanage/storeinfomanage/storeinfomanage'); // 仓库信息管理
const storeinfoaddoredit = () => import('@/view/storemanage/storeinfomanage/storeinfomanage/storeinfoaddoredit/storeinfoaddoredit'); // 仓库信息管理新增or编辑
const ownermanage = () => import('@/view/storemanage/storeinfomanage/storeinfomanage/ownermanage/ownermanage'); // 货主管理
const commonmanage = () => import('@/view/storemanage/storeinfomanage/storeinfomanage/commonmanage/commonmanage'); // 商品管理
const logisticsmanage = () => import('@/view/storemanage/storeinfomanage/logisticsmanage/logisticsmanage'); // 物流公司管理
const transordermanage = () => import('@/view/storemanage/warehsetransmanage/transordermanage/transordermanage'); // 调拨单管理
const transorderaddoredit = () => import('@/view/storemanage/warehsetransmanage/transordermanage/transorderaddoredit/transorderaddoredit'); // 调拨单管理新增or编辑
const transorderaudit = () => import('@/view/storemanage/warehsetransmanage/transorderaudit/transorderaudit'); // 调拨单审核列表
const transorderauditdetail = () => import('@/view/storemanage/warehsetransmanage/transorderaudit/transorderauditdetail/transorderauditdetail'); // 调拨单审核详情
const transorderwarehousein = () => import('@/view/storemanage/warehsetransmanage/transorderwarehousein/transorderwarehousein'); // 调拨入库通知单
const transorderwarehouseout = () => import('@/view/storemanage/warehsetransmanage/transorderwarehouseout/transorderwarehouseout'); // 调拨出库通知单

const needapplymanage = () => import('@/view/storemanage/needsordermanage/needapplymanage/needapplymanage'); // 要货申请-全部
const needapplydetail = () => import('@/view/storemanage/needsordermanage/needapplymanage/needapplydetail/needapplydetail'); // 要货申请-全部详情
const needpurchaseaudit = () => import('@/view/storemanage/needsordermanage/needpurchaseaudit/needpurchaseaudit'); // 要货采购审核
const needpurchaseauditdetail = () => import('@/view/storemanage/needsordermanage/needpurchaseaudit/needpurchaseauditdetail/needpurchaseauditdetail'); // 要货采购审核详情
const needwarehouseaudit = () => import('@/view/storemanage/needsordermanage/needwarehouseaudit/needwarehouseaudit'); // 要货仓库审核
const needwarehouseauditdetail = () => import('@/view/storemanage/needsordermanage/needwarehouseaudit/needwarehouseauditdetail/needwarehouseauditdetail'); // 要货仓库审核详情

const storemanage = [
  {
    path: '/storeinfomanage',
    name: 'storeinfomanage',
    meta: {
        title: '仓储信息管理',
        code: 10601
    },
    component: storeinfomanage
  },
  {
    path: '/storeinfomanage/storeinfoaddoredit/:id',
    name: 'storeinfoaddoredit',
    meta: {
      title: '仓储信息管理'
    },
    component: storeinfoaddoredit
  },
  {
    path: '/storeinfomanage/ownermanage',
    name: 'ownermanage',
    meta: {
      title: '仓储信息管理'
    },
    component: ownermanage
  },
  {
    path: '/storeinfomanage/commonmanaged',
    name: 'commonmanage',
    meta: {
      title: '仓储信息管理'
    },
    component: commonmanage
  },
  {
    path: '/logisticsmanage',
    name: 'logisticsmanage',
    meta: {
        title: '物流公司管理',
        code: 10603
    },
    component: logisticsmanage
  },
  {
    path: '/transordermanage',
    name: 'transordermanage',
    meta: {
        title: '调拨单管理',
        code: 10605
    },
    component: transordermanage
  },
  {
    path: '/transordermanage/transorderaddoredit/:id',
    name: 'transorderaddoredit',
    meta: {
      title: '调拨单管理'
    },
    component: transorderaddoredit
  },
  {
    path: '/transorderaudit',
    name: 'transorderaudit',
    meta: {
        title: '调拨单审核列表',
        code: 10606
    },
    component: transorderaudit
  },
  {
    path: '/transorderaudit/transorderauditdetail/:id/:auditResult/:isAuditStatus',
    name: 'transorderauditdetail',
    meta: {
      title: '调拨单审核列表'
    },
    component: transorderauditdetail
  },
  {
    path: '/transorderwarehousein',
    name: 'transorderwarehousein',
    meta: {
        title: '调拨入库通知单',
        code: 10608
    },
    component: transorderwarehousein
  },
  {
    path: '/transorderwarehouseout',
    name: 'transorderwarehouseout',
    meta: {
        title: '调拨出库通知单',
        code: 10607
    },
    component: transorderwarehouseout
  },
  {
    path: '/needapplymanage',
    name: 'needapplymanage',
    meta: {
        title: '要货申请-全部',
        code: 10617
    },
    component: needapplymanage
  },
  {
    path: '/needapplymanage/needapplydetail/:id',
    name: 'needapplydetail',
    meta: {
        title: '要货申请-全部'
    },
    component: needapplydetail
  },
  {
    path: '/needpurchaseaudit',
    name: 'needpurchaseaudit',
    meta: {
        title: '要货采购审核',
        code: 10618
    },
    component: needpurchaseaudit
  },
  {
    path: '/needpurchaseaudit/needpurchaseauditdetail/:id',
    name: 'needpurchaseauditdetail',
    meta: {
        title: '要货采购审核'
    },
    component: needpurchaseauditdetail
  },
  {
    path: '/needwarehouseaudit',
    name: 'needwarehouseaudit',
    meta: {
        title: '要货仓库审核',
        code: 10619
    },
    component: needwarehouseaudit
  },
  {
    path: '/needwarehouseaudit/needwarehouseauditdetail/:id',
    name: 'needwarehouseauditdetail',
    meta: {
        title: '要货仓库审核'
    },
    component: needwarehouseauditdetail
  }
];

export default storemanage;

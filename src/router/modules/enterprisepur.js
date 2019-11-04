// 企业购模块页面路径
const ordermanage = () => import('@/view/enterpurchase/ordermanage/ordermanage'); // 订单管理
const ordermanageDetail = () => import('@/view/enterpurchase/ordermanage/ordermanagedetail/ordermanagedetail'); // 订单管理订单详情
const goodmanage = () => import('@/view/enterpurchase/goodmanage/goodmanage'); // 商品管理
const gooddetail = () => import('@/view/enterpurchase/goodmanage/gooddetail/gooddetail'); // 商品详情
const mymarket = () => import('@/view/enterpurchase/mymarket/mymarket'); // 小泰集市
const marketdetail = () => import('@/view/enterpurchase/goodmanage/gooddetail/gooddetail'); // 小泰集市详情(商品详情)
const planandstragy = () => import('@/view/enterpurchase/planandstragy/planandstragy'); // 计划与策略
const plandetail = () => import('@/view/enterpurchase/planandstragy/plandetail/plandetail'); // 计划与策略 详情页
const addoredit = () => import('@/view/enterpurchase/planandstragy/planaddoredit/planaddoredit'); // 计划与策略 新增或者编辑
const distributormanage = () => import('@/view/enterpurchase/distributor/distributormanage/distributormanage'); // 分销商管理
const managedetail = () => import('@/view/enterpurchase/distributor/distributormanage/managedetail/managedetail'); // 分销商管理详情
const manageaddoredit = () => import('@/view/enterpurchase/distributor/distributormanage/manageaddoredit/manageaddoredit'); // 分销商管理新增or编辑
const distributoraccred = () => import('@/view/enterpurchase/distributor/distributoraccred/distributoraccred'); // 分销商授权
const accreddetail = () => import('@/view/enterpurchase/distributor/distributoraccred/accreddetail/accreddetail'); // 分销商授权详情
const accredaddoredit = () => import('@/view/enterpurchase/distributor/distributoraccred/accredaddoredit/accredaddoredit'); // 分销商授权新增or编辑
const supplier = () => import('@/view/enterpurchase/supplier/supplier'); // 供应商
const supplierdetail = () => import('@/view/enterpurchase/supplier/supplierdetail/supplierdetail'); // 供应商详情
const suppaddoredit = () => import('@/view/enterpurchase/supplier/suppaddoredit/suppaddoredit');// 供应商详情

const shopMapManage = () => import('@/view/enterpurchase/shopMap/shopMapManage'); // 商品映射管理
const shopMapDetail = () => import('@/view/enterpurchase/shopMap/shopMapDetail/shopMapDetail'); // 商品映射编辑
const shopMapAdd = () => import('@/view/enterpurchase/shopMap/shopMapAdd/shopMapAdd'); // 商品映射详情

const invoiceManage = () => import('@/view/enterpurchase/invoice/invoiceManage'); // 发货单管理
const invoiceManageDetail = () => import('@/view/enterpurchase/invoice/invoiceManageDetail/invoiceManageDetail'); // 发货单详情

const enterprisepur = [{
  path: '/ordermanage',
  name: 'ordermanage',
  meta: {
      title: '订单列表',
      code: 20607,
      secondTitle: '订单管理'
  },
  component: ordermanage
}, {
  path: '/ordermanage/ordermanageDetail/:id',
  name: 'ordermanageDetail',
  meta: {
    title: '订单详情'
  },
  component: ordermanageDetail
}, {
  path: '/goodmanage',
  name: 'goodmanage',
  meta: {
      title: '商品列表',
      code: 20608,
      secondTitle: '商品管理'
  },
  component: goodmanage
}, {
  path: '/goodmanage/gooddetail/:id',
  name: 'gooddetail',
  meta: {
    title: '商品详情'
  },
  component: gooddetail
}, {
  path: '/mymarket',
  name: 'mymarket',
  meta: {
      title: '供应中心',
      code: 20609,
      secondTitle: '小泰集市'
  },
  component: mymarket
}, {
  path: '/mymarket/marketdetail/:id',
  name: 'marketdetail',
  meta: {
    title: '小泰集市详情'
  },
  component: marketdetail
}, {
  path: '/planandstragy',
  name: 'planandstragy',
  meta: {
      title: '定价计划',
      code: 20610
  },
  component: planandstragy
}, {
  path: '/planandstragy/plandetail/:id',
  name: 'plandetail',
  meta: {
    title: '计划与策略详情'
  },
  component: plandetail
}, {
  path: '/planandstragy/planaddoredit/:id',
  name: 'planaddoredit',
  meta: {
    title: '新增或编辑'
  },
  component: addoredit
}, {
  path: '/distributormanage',
  name: 'distributormanage',
  meta: {
      title: '分销商管理',
      code: 20611
  },
  component: distributormanage
}, {
  path: '/distributormanage/managedetail/:id',
  name: 'managedetail',
  meta: {
    title: '分销商管理详情'
  },
  component: managedetail
}, {
  path: '/distributormanage/manageaddoredit/:id',
  name: 'manageaddoredit',
  meta: {
    title: '分销商管理新增or编辑'
  },
  component: manageaddoredit
}, {
  path: '/distributoraccred',
  name: 'distributoraccred',
  meta: {
      title: '分销商授权',
      code: 20612
  },
  component: distributoraccred
}, {
  path: '/distributoraccred/accreddetail/:id',
  name: 'accreddetail',
  meta: {
    title: '分销商授权详情'
  },
  component: accreddetail
}, {
  path: '/distributoraccred/accredaddoredit/:id',
  name: 'accredaddoredit',
  meta: {
    title: '分销商授权新增or编辑'
  },
  component: accredaddoredit
}, {
  path: '/supplier',
  name: 'supplier',
  meta: {
      title: '供应商授权',
      code: 20613,
      secondTitle: '供应商'
  },
  component: supplier
}, {
  path: '/supplier/supplierdetail/:id',
  name: 'supplierdetail',
  meta: {
    title: '供应商详情'
  },
  component: supplierdetail
}, {
  path: '/supplier/suppaddoredit/:id',
  name: 'suppaddoredit',
  meta: {
    title: '供应商新增或编辑'
  },
  component: suppaddoredit
}, {
  path: '/shopMapManage',
  name: 'shopMapManage',
  meta: {
      title: '商品映射管理',
      code: 20616
  },
  component: shopMapManage
}, {
  path: '/shopMapManage/shopMapDetail/:id',
  name: 'shopMapDetail',
  meta: {
    title: '商品映射新增和编辑'
  },
  component: shopMapDetail
}, {
  path: '/shopMapManage/shopMapAdd/:id',
  name: 'shopMapAdd',
  meta: {
    title: '商品映射详情'
  },
  component: shopMapAdd
}, {
  path: '/invoiceManage',
  name: 'invoiceManage',
  meta: {
      title: '发货单管理',
      code: 20615
  },
  component: invoiceManage
}, {
  path: '/invoiceManage/invoiceManageDetail/:id',
  name: 'invoiceManageDetail',
  meta: {
    title: '发货单详情'
  },
  component: invoiceManageDetail
}];

export default enterprisepur;

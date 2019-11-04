/**
 * Created by hzhxf on 2019/3/15. 库存管理
 */
const goodsstocklist = () => import('@/view/stockmanage/goodsstocklist/goodsstocklist'); // 商品库存查询
const stocksetting = () => import('@/view/stockmanage/stocksetting/stocksetting'); // 库存设置
const freezeaddoreidt = () => import('@/view/stockmanage/stocksetting/freezeaddoreidt'); // 库存设置新增or编辑
const stockadjustlist = () => import('@/view/stockmanage/stockadjustmanage/stockadjustlist/stockadjustlist'); // 库存调整单
const stockadjustdetail = () => import('@/view/stockmanage/stockadjustmanage/stockadjustlist/stockadjustdetail/stockadjustdetail'); // 库存调整单编辑
const stockadjustaudit = () => import('@/view/stockmanage/stockadjustmanage/stockadjustaudit/stockadjustaudit'); // 库存调整单审核
const stockadjustauditdetail = () => import('@/view/stockmanage/stockadjustmanage/stockadjustaudit/stockadjustauditdetail/stockadjustauditdetail'); // 库存调整单审核详情
const warehouseinadjust = () => import('@/view/stockmanage/stockadjustmanage/warehouseinadjust'); // 入库调整单
const warehouseoutadjust = () => import('@/view/stockmanage/stockadjustmanage/warehouseoutadjust'); // 出库调整单
const stockmanage = [{
  path: '/goodsstocklist',
  name: 'goodsstocklist',
  meta: {
    title: '商品库存查询',
    code: 10901
  },
  component: goodsstocklist
},
{
  path: '/stocksetting',
  name: 'stocksetting',
  meta: {
    title: '库存设置',
    code: 10902
  },
  component: stocksetting
  },
  {
  path: '/stocksetting/freezeaddoreidt/:id',
  name: 'freezeaddoreidt',
  meta: {
    title: '库存设置'
  },
  component: freezeaddoreidt
},
{
  path: '/stockadjustlist',
  name: 'stockadjustlist',
  meta: {
    title: '库存调整单',
    code: 10906
  },
  component: stockadjustlist
},
{
  path: '/stockadjustlist/stockadjustdetail/:id',
  name: 'stockadjustdetail',
  meta: {
    title: '库存调整单'
  },
  component: stockadjustdetail
},
  {
    path: '/stockadjustaudit',
    name: 'stockadjustaudit',
    meta: {
      title: '库存调整审核',
      code: 10907
    },
    component: stockadjustaudit
  },
  {
    path: '/stockadjustaudit/stockadjustauditdetail/:id/:flag',
    name: 'stockadjustDetail',
    meta: {
      title: '库存调整审核'
    },
    component: stockadjustauditdetail
  },
  {
    path: '/warehouseinadjust',
    name: 'warehouseinadjust',
    meta: {
      title: '入库调整单',
      code: 10909
    },
    component: warehouseinadjust
  },
  {
    path: '/warehouseoutadjust',
    name: 'warehouseoutadjust',
    meta: {
      title: '出库调整单',
      code: 10908
    },
    component: warehouseoutadjust
  }
];

export default stockmanage;

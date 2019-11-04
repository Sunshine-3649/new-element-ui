const afterSale = () => import('@/view/refund/afterSale/afterSale'); // 售后单列表
const afterSaleAdd = () => import('@/view/refund/afterSaleAdd/afterSaleAdd'); // 新增售货单
const afterSaleDetail = () => import('@/view/refund/afterSaleDetail/afterSaleDetail'); // 售货单详情
const returnreceipt = () => import('@/view/aftersalemanage/returnreceipt/returnreceipt'); // 退货入库单
const returnreceiptdetail = () => import('@/view/aftersalemanage/returnreceipt/returnreceiptdetail/returnreceiptdetail'); // 退货入库单详情

export default [
  {
    path: '/afterSale',
    name: 'afterSale',
    meta: {
        title: '售后单列表',
        code: 20703
    },
    component: afterSale
  },
  {
    path: '/afterSale/afterSaleAdd/:code',
    name: 'afterSaleAdd',
    meta: {
      title: '售后单列表'
    },
    component: afterSaleAdd
  },
  {
    path: '/afterSale/afterSaleDetail/:id',
    name: 'afterSaleDetail',
    meta: {
      title: '售后单列表'
    },
    component: afterSaleDetail
  },
  {
    path: '/returnreceipt',
    name: 'returnreceipt',
    meta: {
        title: '入库单列表',
        code: 20704
    },
    component: returnreceipt
  },
  {
    path: '/returnreceipt/returnreceiptdetail/:id',
    name: 'returnreceiptdetail',
    meta: {
      title: '入库单列表'
    },
    component: returnreceiptdetail
  }
];

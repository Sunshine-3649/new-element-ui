// 商品管理模块路径
const goodsgroup = () => import('@/view/goodsmanage/goodsgroup/goodsgroup'); // 商品组管理
const goodsprice = () => import('@/view/goodsmanage/goodsprice/goodsprice'); // 商品组管理
const minegoods = () => import('@/view/goodsmanage/minegoods/minegoods'); // 自采商品管理
const mineadd = () => import('@/view/goodsmanage/minegoods/mineadd/mineadd'); // 新增商品
const mineredit = () => import('@/view/goodsmanage/minegoods/mineredit/mineredit'); // 编辑商品
const minedetail = () => import('@/view/goodsmanage/minegoods/minedetail/minedetail'); // 商品详情
const undertakesgood = () => import('@/view/goodsmanage/undertakesgood/undertakesgood'); // 代发商品管理
const undertakesgoodDetail = () => import('@/view/goodsmanage/undertakesgood/undertakesgoodDetail/undertakesgoodDetail'); // 代发商品管理详情
const goodsquery = () => import('@/view/goodsmanage/goodsquery/goodsquery'); // 商品查询
const goodsquerydetail = () => import('@/view/goodsmanage/goodsquery/goodsquerydetail/goodsquerydetail'); // 商品查询详情
const goodsgroupredit = () => import('@/view/goodsmanage/goodsgroup/groupaddoredit/groupaddoredit'); // 商品查询
const minegoodsquery = () => import('@/view/goodsmanage/goodsquery/minegoodsquery'); // 自采商品查询
const onegoodquery = () => import('@/view/goodsmanage/goodsquery/onegoodquery'); ; // 一件代发商品查询

const goodsmanage = [{
    path: '/goodsgroup',
    name: 'goodsgroup',
    meta: {
        title: '商品组管理',
        code: 10203
    },
    component: goodsgroup
  },
  {
    path: '/goodsgroup/goodsgroupredit/:id/',
    name: 'goodsgroupredit',
    meta: {
      title: '商品组管理'
    },
    component: goodsgroupredit
  },
  {
    path: '/minegoods',
    name: 'minegoods',
    meta: {
        title: '自采商品管理',
        code: 10201
    },
    component: minegoods
  },
  {
    path: '/minegoods/mineadd',
    name: 'mineadd',
    meta: {
      title: '自采商品管理'
    },
    component: mineadd
  },
  {
    path: '/minegoods/mineredit/:id',
    name: 'mineredit',
    meta: {
        title: '自采商品管理'
    },
    component: mineredit
  },
  {
    path: '/minegoods/minedetail/:id',
    name: 'minedetail',
    meta: {
        title: '自采商品管理'
    },
    component: minedetail
  },
  {
    path: '/undertakesgood',
    name: 'undertakesgood',
    meta: {
        title: '代发商品管理',
        code: 10202
    },
    component: undertakesgood
  },
  {
    path: '/undertakesgood/undertakesgoodDetail/:id',
    name: 'undertakesgoodDetail',
    meta: {
        title: '代发商品管理'
    },
    component: undertakesgoodDetail
  },
  {
    path: '/goodsquery',
    name: 'goodsquery',
    redirect: '/goodsquery/minegoodsquery',
    meta: {
        title: '商品查询',
        name: 'minegoodsquery',
        code: 20101
    },
    component: goodsquery,
    children: [
        {
            path: 'minegoodsquery',
            component: minegoodsquery,
            meta: {
                title: '商品查询',
                name: 'minegoodsquery'
            }
        },
        {
            path: 'onegoodquery',
            component: onegoodquery,
            meta: {
                title: '商品查询',
                name: 'onegoodquery'
            }
        }
    ]
  },
    {

        path: '/goodsquery/goodsquerydetail/:id/:skuCode',
        name: 'goodsquerydetail',
        meta: {
          title: '商品查询'
        },
        component: goodsquerydetail

  },
  {
    path: '/goodsprice',
    name: 'goodsprice',
    meta: {
        title: '自采商品价格管理',
        code: 10204
    },
    component: goodsprice
  }

];

export default goodsmanage;

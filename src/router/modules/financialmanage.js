const JDfinancialmanage = () => import('@/view/financialmanage/JDfinancialmanage/JDfinancialmanage'); // 京东财务管理
const OILreport = () => import('@/view/financialmanage/OILreport/OILreport'); // 粮油代发报表
const kingdeegoods = () => import('@/view/financialmanage/kingdeegoods/kingdeegoods'); // 金蝶单据过滤商品列表
const kingdeeaddoredit = () => import('@/view/financialmanage/kingdeegoods/kingdeeaddoredit/kingdeeaddoredit'); // 金蝶单据过滤商品列表新增编辑
const synckingdeemonitor = () => import('@/view/financialmanage/synckingdeemonitor/synckingdeemonitor'); // 同步金蝶云单据监控

const financialmanage = [
    {
      path: '/JDfinancialmanage',
      name: 'JDfinancialmanage',
      meta: {
          title: '京东代发财务管理',
          code: 20501
      },
      component: JDfinancialmanage
    }, {
      path: '/OILreport',
      name: 'OILreport',
      meta: {
          title: '粮油代发报表',
          code: 20502
      },
      component: OILreport
    }, {
      path: '/kingdeegoods',
      name: 'kingdeegoods',
      meta: {
          title: '金蝶单据过滤商品列表',
          code: 20503
      },
      component: kingdeegoods
    }, {
      path: '/kingdeegoods/kingdeeaddoredit/:id',
      name: 'kingdeeaddoredit',
      meta: {
          title: '金蝶单据过滤商品列表新增编辑'
      },
      component: kingdeeaddoredit
    }, {
      path: '/synckingdeemonitor',
      name: 'synckingdeemonitor',
      meta: {
          title: '同步金蝶云单据监控',
          code: 20504
      },
      component: synckingdeemonitor
    }
];

export default financialmanage;

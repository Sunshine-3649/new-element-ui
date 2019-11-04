// 报表管理模块路径
const inventoryreport = () => import('@/view/reportmanage/inventoryreport/inventoryreport'); // 库存报表
const specialquery = () => import('@/view/reportmanage/inventoryreport/specialquery/specialquery'); // 特殊查询
const specwarehousereport = () => import('@/view/reportmanage/inventoryreport/specwarehousereport/specwarehousereport'); // 具体仓库报表

const reportmanage = [
  {
    path: '/inventoryreport',
    name: 'inventoryreport',
    meta: {
        title: '库存报表',
        code: 10801
    },
    component: inventoryreport
  },
  {
    path: '/inventoryreport/specialquery/:year/:month/:warehouseName/:warehouseCode',
    name: 'specialquery',
    meta: {
      title: '特殊查询'
    },
    component: specialquery
  },
  {
    path: '/inventoryreport/specwarehousereport',
    name: 'specwarehousereport',
    meta: {
      title: '具体仓库报表'
    },
    component: specwarehousereport
  }

];

export default reportmanage;

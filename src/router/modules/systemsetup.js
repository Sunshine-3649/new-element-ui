// 系统管理模块路径
const dictionarymanage = () => import('@/view/systemsetup/dictionarymanage/dictionarymanage'); // 字典管理模块
const developmentcompen = () => import('@/view/systemsetup/developmentcompen/developmentcompen'); // 开发补偿
const resourcemanage = () => import('@/view/systemsetup/resourcemanage/resourcemanage'); // 资源管理
const wmsresourcemanage = () => import('@/view/systemsetup/wmsresourcemanage/wmsresourcemanage'); // wms资源管理
const warehouseconfigmanage = () => import('@/view/systemsetup/warehouseconfigmanage/warehouseconfigmanage'); // 仓库配置管理

const systemsetup = [
  {
    path: '/dictionarymanage',
    name: 'dictionarymanage',
    meta: {
        title: '字典管理',
        code: 10405
    },
    component: dictionarymanage
  },
  {
    path: '/resourcemanage',
    name: 'resourcemanage',
    meta: {
        title: '资源管理',
        code: 10406
    },
    component: resourcemanage
  },
  {
    path: '/wmsresourcemanage',
    name: 'wmsresourcemanage',
    meta: {
        title: 'wms资源管理',
        code: 10410
    },
    component: wmsresourcemanage
  },
  {
    path: '/warehouseconfigmanage',
    name: 'warehouseconfigmanage',
    meta: {
        title: '仓库配置管理',
        code: 10408
    },
    component: warehouseconfigmanage
  },
  {
    path: '/developmentcompen',
    name: 'developmentcompen',
    meta: {
        title: '开发补偿',
        code: 10407
    },
    component: developmentcompen
  }

];

export default systemsetup;

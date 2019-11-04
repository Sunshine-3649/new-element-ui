// 业务设置模块路径
const shipwarehousematch = () => import('@/view/businesssetup/shipwarehousematch'); // 业务设置

const businesssetup = [
  {
    path: '/shipwarehousematch',
    name: 'shipwarehousematch',
    meta: {
        title: '发货仓库匹配',
        code: 10701
    },
    component: shipwarehousematch
  }

];

export default businesssetup;

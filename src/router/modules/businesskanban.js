// 业务设置模块路径
const businesskanbanopage = () => import('@/view/businesskanban/businesskanban'); // 业务看板页面

const businesskanban = [
  {
    path: '/businesskanbanopage',
    name: 'businesskanbanopage',
    meta: {
        title: '业务看板',
        code: 20801
    },
    component: businesskanbanopage
  }

];

export default businesskanban;

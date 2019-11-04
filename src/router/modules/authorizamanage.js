const SCMauthoriza = () => import('@/view/authorizamanage/SCMauthoriza/SCMauthoriza'); // 主系统授权
const SCMauthorizaAdd = () => import('@/view/authorizamanage/SCMauthoriza/SCMauthorizaAdd'); // 新增主系统授权
const roleManage = () => import('@/view/authorizamanage/roleManage/roleManage'); // 角色管理
const roleManageAdd = () => import('@/view/authorizamanage/roleManage/roleManageAdd'); // 新增角色管理
const WMSauthoriza = () => import('@/view/authorizamanage/WMSauthoriza/WMSauthoriza'); // 子系统授权
const WMSauthorizaAdd = () => import('@/view/authorizamanage/WMSauthoriza/WMSauthorizaAdd'); // 子系统授权新增


const router = [
    {
      path: '/SCMauthoriza',
      name: 'SCMauthoriza',
      meta: {
          title: '授权管理',
          code: 10403
      },
      component: SCMauthoriza
    },
    {
        path: '/SCMauthoriza/SCMauthorizaAdd',
        name: 'SCMauthorizaAdd',
        meta: {
          title: '授权管理'
        },
        component: SCMauthorizaAdd
    },
    {
      path: '/roleManage',
      name: 'roleManage',
      meta: {
          title: '角色管理'
      },
      component: roleManage
    },
    {
        path: '/roleManage/roleManageAdd',
        name: 'roleManageAdd',
        meta: {
          title: '角色管理'
        },
        component: roleManageAdd
    },
    {
        path: '/WMSauthoriza',
        name: 'WMSauthoriza',
        meta: {
            title: 'WMS授权管理',
            code: 10409
        },
        component: WMSauthoriza
    },
    {
        path: '/WMSauthoriza/WMSauthorizaAdd',
        name: 'WMSauthorizaAdd',
        meta: {
            title: 'WMS授权管理'
        },
        component: WMSauthorizaAdd
    }
];

export default router;

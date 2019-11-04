const organinfomanage = () => import('@/view/techbackmanage/organinfomanage/organinfomanage'); // 组织信息管理
const organinfoaddoredit = () => import('@/view/techbackmanage/organinfomanage/organinfoaddoredit/organinfoaddoredit'); // 组织信息管理新增编辑
const clientinfomanage = () => import('@/view/techbackmanage/clientinfomanage/clientinfomanage'); // 渠道客户信息管理
const clientinfoaddoredit = () => import('@/view/techbackmanage/clientinfomanage/clientinfoaddoredit/clientinfoaddoredit'); // 渠道客户信息新增编辑
const salechannelmanage = () => import('@/view/techbackmanage/salechannelmanage/salechannelmanage'); // 销售渠道管理
const salechanneladdoredit = () => import('@/view/techbackmanage/salechannelmanage/salechanneladdoredit/salechanneladdoredit'); // 销售渠道管理新增编辑
const linemanage = () => import('@/view/techbackmanage/linemanage/linemanage'); // 业务线管理
const officemanage = () => import('@/view/techbackmanage/officemanage/officemanage'); // 部门管理
const lineaddoredit = () => import('@/view/techbackmanage/linemanage/lineaddoredit/lineaddoredit'); // 业务线管理新增编辑

const techbackmanage = [
    {
      path: '/organinfomanage',
      name: 'organinfomanage',
      meta: {
        title: '组织信息管理'
      },
      component: organinfomanage
    },
    {
      path: '/organinfomanage/organinfoaddoredit/:id',
      name: 'organinfoaddoredit',
      meta: {
        title: '组织信息管理新增编辑'
      },
      component: organinfoaddoredit
    },
    {
      path: '/clientinfomanage',
      name: 'clientinfomanage',
      meta: {
        title: '渠道客户信息管理'
      },
      component: clientinfomanage
    },
    {
      path: '/clientinfomanage/clientinfoaddoredit/:id',
      name: 'clientinfoaddoredit',
      meta: {
        title: '渠道客户信息新增编辑'
      },
      component: clientinfoaddoredit
    },
    {
      path: '/salechannelmanage',
      name: 'salechannelmanage',
      meta: {
        title: '销售渠道管理'
      },
      component: salechannelmanage
    },
    {
      path: '/salechannelmanage/salechanneladdoredit/:id',
      name: 'salechanneladdoredit',
      meta: {
        title: '销售渠道新增编辑'
      },
      component: salechanneladdoredit
    },
    {
      path: '/linemanage',
      name: 'linemanage',
      meta: {
          title: '业务线管理',
          code: 10402
      },
      component: linemanage
    },
    {
      path: '/officemanage',
      name: 'officemanage',
      meta: {
          title: '部门管理',
          code: 10413
      },
      component: officemanage
    },
    {
      path: '/linemanage/lineaddoredit/:id',
      name: 'lineaddoredit',
      meta: {
        title: '业务线管理'
      },
      component: lineaddoredit
    }
];

export default techbackmanage;

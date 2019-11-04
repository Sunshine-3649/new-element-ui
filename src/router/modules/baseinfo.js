// 基础信息模块路径
const brandmanage = () => import('@/view/baseinfo/brandmanage/brandmanage'); // 品牌管理
const brandaddoredit = () => import('@/view/baseinfo/brandmanage/brandaddoredit/brandaddoredit'); // 品牌管理新增or编辑
const propmanage = () => import('@/view/baseinfo/propmanage/propmanage'); // 属性管理
const propaddoredit = () => import('@/view/baseinfo/propmanage/propaddoredit/propaddoredit'); // 属性管理新增or编辑
const classifymanage = () => import('@/view/baseinfo/classifymanage/classifymanage'); // 分类管理
const relevancebrand = () => import('@/view/baseinfo/classifymanage/relevancebrand'); // 分类管理-品牌管理
const relevanceprop = () => import('@/view/baseinfo/classifymanage/relevanceprop'); // 分类管理-属性管理

const baseinfo = [
  {
    path: '/brandmanage',
    name: 'brandmanage',
    meta: {
        title: '品牌管理',
        code: 10101
    },
    component: brandmanage
  },
  {
    path: '/brandmanage/brandaddoredit/:id',
    name: 'brandaddoredit',
    meta: {
      title: '品牌管理'
    },
    component: brandaddoredit
  },
  {
    path: '/propmanage',
    name: 'propmanage',
    meta: {
        title: '属性管理',
        code: 10102
    },
    component: propmanage
  },
  {
    path: '/propmanage/propaddoredit/:id',
    name: 'propaddoredit',
    meta: {
      title: '属性管理'
    },
    component: propaddoredit
  },
  {
    path: '/classifymanage',
    name: 'classifymanage',
    meta: {
        title: '分类管理',
        code: 10103
    },
    component: classifymanage
  },
  {
    path: '/classifymanage/relevancebrand/:id',
    name: 'relevancebrand',
    meta: {
      title: '分类管理'
    },
    component: relevancebrand
  },
  {
    path: '/classifymanage/relevanceprop/:id',
    name: 'relevanceprop',
    meta: {
      title: '分类管理'
    },
    component: relevanceprop
  }

];

export default baseinfo;

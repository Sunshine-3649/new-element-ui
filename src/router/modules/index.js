// 分割模块
import enterprisepur from './enterprisepur.js'; // 企业购模块
import baseinfo from './baseinfo.js'; // 基础信息模块
import goodsmanage from './goodsmanage.js'; // 商品管理模块
import stockmanage from './stockmanage.js'; // 库存管理
import suppliermanage from './suppliermanage.js'; // 供应商管理模块
import purchasemanage from './purchasemanage.js'; // 采购管理模块
import directmanage from './directmanage.js'; // 订单管理模块
import storemanage from './storemanage.js'; // 仓库管理模块
import systemsetup from './systemsetup.js'; // 仓库管理模块
import reportmanage from './reportmanage.js'; // 仓库管理模块
import refund from './refund.js'; // 退货流程
import businesskanban from './businesskanban.js'; // 业务看板
import businesssetup from './businesssetup.js'; // 业务设置
import othermanage from './othermanage.js'; // 其他出入库
import financialmanage from './financialmanage.js'; // 财务报表 authorizamanage
import authorizamanage from './authorizamanage.js'; // 授权管理
import techbackmanage from './techbackmanage.js'; // 技术后台管理

// 合并模块
const router = [...baseinfo, ...enterprisepur, ...goodsmanage, ...stockmanage, ...suppliermanage, ...purchasemanage, ...directmanage, ...storemanage, ...systemsetup, ...reportmanage, ...refund, ...businesskanban, ...businesssetup, ...othermanage, ...financialmanage, ...authorizamanage, ...techbackmanage];
// 导出模块
export default router;

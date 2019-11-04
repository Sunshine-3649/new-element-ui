/**
 *
 * @param {number} code  菜单标题code
 * 三位数code是一级菜单标题
 * 五位数code是二级级菜单标题
 * sortId 是菜单的排列顺序 按照从小到大排列
 */
let muneTitle = (code) => {
    switch (code) {
        case 208: // 业务看板
            return {title: '', sortId: 19};
        case 101:
            return {title: '基础信息', sortId: 1};
        case 102 :
            return {title: '商品', sortId: 2};
        case 201 : // 渠道
            return {title: '商品', sortId: 2};
        case 109 :
            return {title: '库存', sortId: 2};
        case 107 :
            return {title: '设置', sortId: 11};
        case 204 :
            return {title: '直营', sortId: 5};
        case 206 :
            return {title: '分销', sortId: 6};
        case 205 :
            return {title: '财务', sortId: 9};
        case 106 :
            return {title: '仓储', sortId: 8};
        case 203 :
            return {title: '采购', sortId: 4};
        case 207 :
            return {title: '售后', sortId: 7};
        case 108 :
            return {title: '报表', sortId: 10};
        case 103 :
            return {title: '供应商', sortId: 3};
        case 202 : // 渠道
            return {title: '供应商', sortId: 3};
        case 104 :
            return {title: '系统', sortId: 12};
        case 10609:
            return '仓储信息管理';
        case 10610:
            return '仓间调拨管理';
        case 10411:
            return '权限管理';
        case 10412:
            return '技术后台管理';
        case 10611:
            return '其他出入库管理';
        case 10616:
            return '要货单申请管理';
        case 20301:
            return '采购管理';
        case 20306:
            return '退货管理';
        case 20701:
            return '售后单管理';
        case 20702:
            return '退货入库单';
        case 20601:
            return '订单管理';
        case 20602:
            return '商品管理';
        case 20603:
            return '小泰集市';
        case 20604:
            return '计划与策略';
        case 20605:
            return '分销商';
        case 20606:
            return '供应商';
        case 20614:
            return '发货管理';
        case 10903:
            return '库存查询';
        case 10904:
            return '库存调整';
        case 10905:
            return '库存设置';
    }
};

export default muneTitle;

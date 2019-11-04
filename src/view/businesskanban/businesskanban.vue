<template>
  <div class="businesskanban">
      
    <div v-if="isPermissions">
        <div   class="card">
            <!-- 异常处理 -->
            <div  v-if="isFirst">
                <div class="left" :style="{'line-height': leftHeight}">
                异常处理
                </div>
                <div class="right">
                <div class="item" v-if="getHasTrue(20402)">
                    <p class="active" @click="toSupplierOrder2">供应商订单-下单异常</p>
                    <p v-if='dataCount.warehouse_order_status_2 > -1'>({{dataCount.warehouse_order_status_2}})</p>
                    <p class="active" v-else @click="getDatacount">({{isDataCount ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20402)">
                    <p class="active" @click="toSupplierOrder5">供应商订单-下单失败</p>
                    <p v-if='dataCount.warehouse_order_status_5 > -1'>({{dataCount.warehouse_order_status_5}})</p>
                    <p class="active" v-else @click="getDatacount">({{isDataCount ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20403)">
                    <p class="active"  @click="toOutboundOrderList1">发货单-仓库接收失败</p>
                    <p v-if='dataCount.outbound_order_status_1 > -1'>({{dataCount.outbound_order_status_1}})</p>
                    <p class="active" v-else @click="getDatacount">({{isDataCount ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20404)">
                    <p class="active" @click="toDirectexcepmanage">拆单异常-待了结</p>
                    <p v-if='dataCount.exception_order_status_1 > -1'>({{dataCount.exception_order_status_1}})</p>
                    <p class="active" v-else @click="getDatacount">({{isDataCount ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20304)">
                    <p class="active" @click="toWarenoticordermanage4">采购入库通知单-异常</p>
                    <p v-if='abnormity.noticeExceptionNum > -1'>({{abnormity.noticeExceptionNum}})</p>
                    <p class="active" v-else @click="getStatisticNumByStatus">({{isAbnormity ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20304)">
                    <p class="active" @click="toWarenoticordermanage1">采购入库通知单-失败</p>
                    <p v-if='abnormity.noticeFailNum > -1'>({{abnormity.noticeFailNum}})</p>
                    <p class="active" v-else @click="getStatisticNumByStatus">({{isAbnormity ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <!-- 第二行 -->
                <div class="item" v-if="getHasTrue(10607)">
                    <p class="active" @click="toStorehouseList4">调拨出库单-异常</p>
                    <p v-if='abnormity.allocateOutExceptionNum > -1'>({{abnormity.allocateOutExceptionNum}})</p>
                    <p class="active" v-else @click="getStatisticNumByStatus">({{isAbnormity ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(10608)">
                    <p class="active" @click="toStorehouseList6">调拨入库单-异常</p>
                    <p v-if='abnormity.allocateInException > -1'>({{abnormity.allocateInException}})</p>
                    <p class="active" v-else @click="getStatisticNumByStatus">({{isAbnormity ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20702)">
                    <p class="active" @click="toReturnreceipt">退货入库单-通知失败</p>
                    <p v-if='dataCount.after_sale_warehouse_notice_status_5 > -1'>({{dataCount.after_sale_warehouse_notice_status_5}})</p>
                    <p class="active" v-else @click="getDatacount">({{isDataCount ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(10614)">
                    <p class="active"  @click="toOtherwarehousein5">其他入库单-异常</p>
                    <p v-if='abnormity.otherInException > -1'>({{abnormity.otherInException}})</p>
                    <p class="active" v-else @click="getStatisticNumByStatus">({{isAbnormity ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(10614)">
                    <p class="active"  @click="toOtherwarehousein3">其他入库单-接收失败</p>
                    <p v-if='abnormity.otherInFail > -1'>({{abnormity.otherInFail}})</p>
                    <p class="active" v-else @click="getStatisticNumByStatus">({{isAbnormity ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20701)">
                    <p class="active"  @click="toAfterSale">售后单-通知仓库失败</p>
                    <p v-if='dataCount.after_sale_order_status_6 > -1'>({{dataCount.after_sale_order_status_6}})</p>
                    <p class="active" v-else @click="getDatacount">({{isDataCount ? '加载中...' : '数据请求失败' }})</p>
                </div>

                <!-- 第三行 -->
                <div class="item" v-if="getHasTrue(10615)">
                    <p class="active"  @click="otherOutException">其他出库单-异常</p>
                    <p v-if='abnormity.otherOutException > -1'>({{abnormity.otherOutException}})</p>
                    <p class="active" v-else @click="getStatisticNumByStatus">({{isAbnormity ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(10615)">
                    <p class="active"  @click="otherOutFail">其他出库单-接收失败</p>
                    <p v-if='abnormity.otherOutFail > -1'>({{abnormity.otherOutFail}})</p>
                    <p class="active" v-else @click="getStatisticNumByStatus">({{isDataCount ? '加载中...' : '数据请求失败' }})</p>
                </div>
                </div>
            </div>
            <!-- 发货任务 -->
            <div  v-if="isSecond">
                <div class="left">
                发货任务
                </div>
                <div class="right">
                <div class="item" v-if="getHasTrue(20401)">
                    <p class="active" @click="toDirectordermanage1">订单-待发货</p>
                    <p v-if='dataCount.shop_order_status_1 > -1'>({{dataCount.shop_order_status_1}})</p>
                    <p class="active" v-else @click="getDatacount">({{isDataCount ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20401)">
                    <p class="active" @click="toDirectordermanage6">订单-部分发货</p>
                    <p v-if='dataCount.shop_order_status_6 > -1'>({{dataCount.shop_order_status_6}})</p>
                    <p class="active" v-else @click="getDatacount">({{isDataCount ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20402)">
                    <p class="active" @click="toSupplierOrder1">供应商订单-待发送供应商</p>
                    <p v-if='dataCount.warehouse_order_status_1 > -1'>({{dataCount.warehouse_order_status_1}})</p>
                    <p class="active" v-else @click="getDatacount">({{isDataCount ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20403)">
                    <p class="active" @click="toOutboundOrderList2">发货单-待发货</p>
                    <p v-if='dataCount.outbound_order_status_2 > -1'>({{dataCount.outbound_order_status_2}})</p>
                    <p class="active" v-else @click="getDatacount">({{isDataCount ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20403)">
                    <p class="active" @click="toOutboundOrderList5">发货单-部分发货</p>
                    <p v-if='dataCount.outbound_order_status_5 > -1'>({{dataCount.outbound_order_status_5}})</p>
                    <p class="active" v-else @click="getDatacount">({{isDataCount ? '加载中...' : '数据请求失败' }})</p>
                </div>
                </div>
            </div>
            <!-- 审核任务 -->
            <div  v-if="isThird">
                <div class="left">
                审核任务
                </div>
                <div class="right">
                <div class="item" v-if="getHasTrue(10302)">
                    <p class="active" @click="toSupplierapplyaudit">供应商-待审批</p>
                    <p v-if='purchaseObj.supplierCount > -1'>({{purchaseObj.supplierCount}})</p>
                    <p class="active" v-else @click="getAuditData">({{isPurchaseObj ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20303)">
                    <p class="active" @click="toPurchaseorderaudit">采购单-待审核</p>
                    <p v-if='purchaseObj.purchaseOrderCount > -1'>({{purchaseObj.purchaseOrderCount}})</p>
                    <p class="active" v-else @click="getAuditData">({{isPurchaseObj ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20308)">
                    <p class="active" @click="toPurchreturnordeaudit">采购退货单-待审核</p>
                    <p v-if='purchaseObj.purchaseOutBountCount > -1'>({{purchaseObj.purchaseOutBountCount}})</p>
                    <p class="active" v-else @click="getAuditData">({{isPurchaseObj ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(10606)">
                    <p class="active" @click="toStorehouseList">调拨单-待审核</p>
                    <p v-if='purchaseObj.allocateOrderCount > -1'>({{purchaseObj.allocateOrderCount}})</p>
                    <p class="active" v-else @click="getAuditData">({{isPurchaseObj ? '加载中...' : '数据请求失败' }})</p>
                </div>
                </div>
            </div>
            <!-- 业务数据 -->
            <div v-if="isFour">
                <div class="left" style="line-height: 50px">
                业务数据<br />（今）
                </div>
                <div class="right">
                <div class="item" v-if="getHasTrue(20401)">
                    <p class="active"  @click="toDirectordermanageCurr(1)">订单数量（总）</p>
                    <p v-if='baseDataToday.orderNum > -1'>({{baseDataToday.orderNum}})</p>
                    <p class="active" v-else @click="getBaseBuiData">({{isBaseDataToday ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20402)">
                    <p class="active" @click="toSupplierOrder(1)">供应商订单数量</p>
                    <p v-if='baseDataToday.supplierOrderNum > -1'>({{baseDataToday.supplierOrderNum}})</p>
                    <p class="active" v-else @click="getBaseBuiData">({{isBaseDataToday ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20403)">
                    <p class="active"  @click="toOutboundOrderList(1)">发货单数量</p>
                    <p v-if='baseDataToday.outBountNum > -1'>({{baseDataToday.outBountNum}})</p>
                    <p class="active" v-else @click="getBaseBuiData">({{isBaseDataToday ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20101)">
                    <p>销售商品数量（件）</p>
                    <p v-if='baseDataToday.skuNum > -1'>({{baseDataToday.skuNum}})</p>
                    <p class="active" v-else @click="getBaseBuiData">({{isBaseDataToday ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20101)">
                    <p>销售SKU数量（种）</p>
                    <p v-if='baseDataToday.skuKinds > -1'>({{baseDataToday.skuKinds}})</p>
                    <p class="active" v-else @click="getBaseBuiData">({{isBaseDataToday ? '加载中...' : '数据请求失败' }})</p>
                </div>
                </div>
            </div>
            <!-- 业务数据 -->
            <div v-if="isFour">
                <div class="left"  style="line-height: 50px">
                业务数据<br />（昨）
                </div>
                <div class="right">
                <div class="item" v-if="getHasTrue(20401)">
                    <p class="active"  @click="toDirectordermanageCurr(2)">订单数量（总）</p>
                    <p v-if='baseDataYesterday.orderNum > -1'>({{baseDataYesterday.orderNum}})</p>
                    <p class="active" v-else @click="getBaseBuiData">({{isBaseDataYesterday ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20402)">
                    <p class="active" @click="toSupplierOrder(2)">供应商订单数量</p>
                    <p v-if='baseDataYesterday.supplierOrderNum > -1'>({{baseDataYesterday.supplierOrderNum}})</p>
                    <p class="active" v-else @click="getBaseBuiData">({{isBaseDataYesterday ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20403)">
                    <p class="active"  @click="toOutboundOrderList(2)">发货单数量</p>
                    <p v-if='baseDataYesterday.outBountNum > -1'>({{baseDataYesterday.outBountNum}})</p>
                    <p class="active" v-else @click="getBaseBuiData">({{isBaseDataYesterday ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20101)">
                    <p>销售商品数量（件）</p>
                    <p v-if='baseDataYesterday.skuNum > -1'>({{baseDataYesterday.skuNum}})</p>
                    <p class="active" v-else @click="getBaseBuiData">({{isBaseDataYesterday ? '加载中...' : '数据请求失败' }})</p>
                </div>
                <div class="item" v-if="getHasTrue(20101)">
                    <p>销售SKU数量（种）</p>
                    <p v-if='baseDataYesterday.skuKinds > -1'>({{baseDataYesterday.skuKinds}})</p>
                    <p class="active" v-else @click="getBaseBuiData">({{isBaseDataYesterday ? '加载中...' : '数据请求失败' }})</p>
                </div>
                </div>
            </div>
            </div>
            <div v-if="(!isFirst && !isSecond && !isThird && !isFour)">
                <p style="line-height: 25px;text-align: center">暂无数据权限，请联系管理员授权。</p>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'businesskanbanopage',
    data() {
      return {
        isAbnormity: true,
        isDataCount: true,
        isPurchaseObj: true,
        isBaseDataToday: true,
        isBaseDataYesterday: true,
        abnormity: {}, // 异常数据
        dataCount: {}, // 异常数据
        purchaseObj: {}, // 审核数据
        baseDataToday: {}, // 业务数据
        baseDataYesterday: {}, // 业务数据
        configList: [], // 权限列表
        allList: [ 20402, 20403, 20404, 20304, 10607, 10608, 20702, 10614, 20701, 20401, 10302, 20303, 20308, 10606, 20101, 10615 ], // 所有的模块权限
        currentList: [], // 当前用户权限
        isPermissions: this.$store.getters['selectChannel/isPermission']
      };
    },
    computed: {
      // 判断是否有业务看板权限
    //   isPermissions() {
    //     let permissions = this.$store.state.selectChannel.permission;
    //     let permissionsArr = permissions.filter((item) => {
    //         if (item.oneTitleCode === 208) {
    //             return item;
    //         }
    //     });
    //     return permissionsArr.length;
    //   },
      isFirst() {
        let arr = [ 20402, 20402, 20403, 20404, 20304, 20304, 10607, 10608, 20702, 10614, 10614, 20701 ];
        let count = 0;
        let isShow = true;
        this.currentList.forEach(item => {
          if (arr.indexOf(item) > -1) {
            count = count + 1;
          }
        });
        if (count < 1) {
          isShow = false;
        }
        return isShow;
      },
      isSecond() {
        let arr = [ 20401, 20402, 20403 ];
        let count = 0;
        let isShow = true;
        this.currentList.forEach(item => {
          if (arr.indexOf(item) > -1) {
            count = count + 1;
          }
        });
        if (count < 1) {
          isShow = false;
        }
        return isShow;
      },
      isThird() {
        let arr = [ 10302, 20303, 20308, 10606 ];
        let count = 0;
        let isShow = true;
        this.currentList.forEach(item => {
          if (arr.indexOf(item) > -1) {
            count = count + 1;
          }
        });
        if (count < 1) {
          isShow = false;
        }
        return isShow;
      },
      isFour() {
        let arr = [ 20401, 20402, 20402, 20101 ];
        let count = 0;
        let isShow = true;
        this.currentList.forEach(item => {
          if (arr.indexOf(item) > -1) {
            count = count + 1;
          }
        });
        if (count < 1) {
          isShow = false;
        }
        return isShow;
      },
      leftHeight() {
        let arr = [ 20402, 20402, 20403, 20404, 20304, 20304, 10607, 10608, 20702, 10614, 10614, 20701, 10615 ];
        let height = '205px';
        let count = 0;
        arr.forEach(item => {
          if (this.currentList.indexOf(item) > -1) {
            count = count + 1;
          }
        });
        if (count < 7) {
          height = '100px';
        } else if (count > 12) {
            height = '310px';
        }
        return height;
      }
    },
    created() {
      this.configList = sessionStorage.getItem('menuConfig') ? JSON.parse(sessionStorage.getItem('menuConfig')) : [];
      if (this.$store.getters['selectChannel/isPermission']) {
          this.getCurrentList();
      }
    },
    methods: {
      getCurrentList() {
        this.configList.forEach(item => {
          if (item.codeList && item.codeList.length) {
            item.codeList.forEach(subItem => {
              this.allList.forEach(allItem => {
                if (subItem === allItem) {
                  this.currentList.push(subItem);
                }
              });
            });
          }
        });
        this.getAuditData();
        this.getBaseBuiData();
        this.getStatisticNumByStatus();
        this.getDatacount();
      },
      // 审核任务
      getAuditData() {
        this.$AXIOS.GET('/statisticManager/auditData').then(res => {
          this.purchaseObj = res.result;
        }).finally(() => {
          this.isPurchaseObj = false;
        });
      },
      // 业务数据今天昨天
      getBaseBuiData() {
        this.$AXIOS.GET('/statisticManager/baseBuiData').then(res => {
          this.baseDataToday = res.result.today;
          this.baseDataYesterday = res.result.yesterday;
        }).finally(() => {
          this.isBaseDataToday = false;
          this.isBaseDataYesterday = false;
        });
      },
      // 异常数据
      getStatisticNumByStatus() {
        this.$AXIOS.GET('/statisticManager/getStatisticNumByStatus').then(res => {
          this.abnormity = res.result;
        }).finally(() => {
          this.isAbnormity = false;
        });
      },
      // 异常数据
      getDatacount() {
        this.$AXIOS.GET('/statisticManager/dataCount').then(res => {
          this.dataCount = res.result;
        }).finally(() => {
          this.isDataCount = false;
        });
      },
      // 判断是否显示
      getHasTrue(code) {
        return this.currentList.indexOf(code) > -1;
      },
      // 出库单异常
      otherOutException() {
        let config = {
            title: '其他出库通知单',
            id: 'otherwarehouseout',
            href: '/scm-chain-portal-vue/#/otherwarehouseout?status=5'
        };
        // top.window.addTab(config, true);
        this.$router.push({path: '/otherwarehouseout', query: {status: '5', reload: true}});
      },
      // 出库单接收失败
      otherOutFail() {
        let config = {
            title: '其他出库通知单',
            id: 'otherwarehouseout',
            href: '/scm-chain-portal-vue/#/otherwarehouseout?status=3'
        };
        // top.window.addTab(config, true);
        this.$router.push({path: '/otherwarehouseout', query: {status: '3', reload: true}});
      },
      // 供应商订单-下单异常
      toSupplierOrder2() {
        let config = {
          title: '供应商订单',
          id: 'supplierOrder',
          href: '/scm-chain-portal-vue/#/supplierorder?supplierOrderStatus=2'
        };
        // top.window.addTab(config, true);
        // this.$store.dispatch('selectChannel/setMuneTab', {
        //     title: '供应商订单',
        //     route: '/supplierorder'
        // });
        this.$router.push({path: '/supplierorder', query: {supplierOrderStatus: '2', reload: true}});
      },
      // 供应商订单-下单失败
      toSupplierOrder5() {
        let config = {
          title: '供应商订单',
          id: 'supplierOrder',
          href: '/scm-chain-portal-vue/#/supplierorder?supplierOrderStatus=5'
        };
        // top.window.addTab(config, true);
        this.$router.push({path: '/supplierorder', query: {supplierOrderStatus: '5', reload: true}});
      },
      // 发货通知单-仓库接收失败
      toOutboundOrderList1() {
        let config = {
          title: '发货通知单管理',
          id: 'orderList',
          href: '/scm-chain-portal-vue/#/shippenotice?status=1'
        };
        // top.window.addTab(config, true);
        this.$router.push({path: '/shippenotice', query: {status: '1', reload: true}});
      },
      // 拆单异常-待了结
      toDirectexcepmanage() {
        let config = {
          title: '拆单异常管理',
          id: 'nonOrderList',
          href: '/scm-chain-portal-vue/#/directexcepmanage?status=10'
        };
        // top.window.addTab(config, true);
        this.$router.push({path: '/directexcepmanage', query: {status: '10', reload: true}});
        // this.$router.push({
        //   path: '/directexcepmanage'
        // });
      },
      // 采购入库通知单-异常
      toWarenoticordermanage4() {
        let config = {
          title: '入库通知单管理',
          id: 'warehouseAdviceList',
          href: '/scm-chain-portal-vue/#/warenoticordermanage?warehouseNoticeStatus=4'
        };
        // top.window.addTab(config, true);
        this.$router.push({path: '/warenoticordermanage', query: {warehouseNoticeStatus: '4', reload: true}});
        // this.$router.push({
        //   path: '/warenoticordermanage',
        //   query: {
        //     warehouseNoticeStatus: 4
        //   }
        // });
      },
      // 采购入库通知单-失败
      toWarenoticordermanage1() {
        let config = {
          title: '入库通知单管理',
          id: 'warehouseAdviceList',
          href: '/scm-chain-portal-vue/#/warenoticordermanage?warehouseNoticeStatus=1'
        };
        // top.window.addTab(config, true);
        this.$router.push({path: '/warenoticordermanage', query: {warehouseNoticeStatus: '1', reload: true}});
        // this.$router.push({
        //   path: '/warenoticordermanage',
        //   query: {
        //     warehouseNoticeStatus: 1
        //   }
        // });
      },
      // 调拨出库单-出库异常
      toStorehouseList4() {
        let config = {
          title: '调拨出库通知单',
          id: 'storehouseAdviceList',
          href: '/scm-chain-portal-vue/#/transorderwarehouseout?status=4'
        };
        // top.window.addTab(config);
        this.$router.push({path: '/transorderwarehouseout', query: {status: '4', reload: true}});
      },
      // 调拨入库单-入库异常
      toStorehouseList6() {
        let config = {
          title: '调拨入库通知单',
          id: 'storehouseAdviceInList',
          href: '/scm-chain-portal-vue/#/transorderwarehousein?status=6'
        };
        // top.window.addTab(config);
        this.$router.push({path: '/transorderwarehousein', query: {status: '6', reload: true}});
      },
      // 退货入库单-通知失败
      toReturnreceipt() {
        let config = {
          title: '入库单列表',
          id: 'returnreceipt',
          href: '/scm-chain-portal-vue/#/returnreceipt?status=5'
        };
        // top.window.addTab(config);
        this.$router.push({path: '/returnreceipt', query: {status: '5', reload: true}});
        // this.$router.push({
        //   path: '/returnreceipt',
        //   query: {
        //     status: 5
        //   }
        // });
      },
      // 其他入库单-异常
      toOtherwarehousein5() {
        let config = {
          title: '其他入库通知单',
          id: 'otherwarehousein',
          href: '/scm-chain-portal-vue/#/otherwarehousein?status=5'
        };
        // top.window.addTab(config);
        this.$router.push({path: '/otherwarehousein', query: {status: '5', reload: true}});
        // this.$router.push({
        //   path: '/otherwarehousein',
        //   query: {
        //     status: 5
        //   }
        // });
      },
      // 其他入库单-接收失败
      toOtherwarehousein3() {
        let config = {
          title: '其他入库通知单',
          id: 'otherwarehousein',
          href: '/scm-chain-portal-vue/#/otherwarehousein?status=3'
        };
        // top.window.addTab(config);
        this.$router.push({path: '/otherwarehousein', query: {status: '3', reload: true}});
        // this.$router.push({
        //   path: '/otherwarehousein',
        //   query: {
        //     status: 3
        //   }
        // });
      },
      // 售后单-通知仓库失败
      toAfterSale() {
        let config = {
          title: '其他入库通知单',
          id: 'otherwarehousein',
          href: '/scm-chain-portal-vue/#/afterSale?status=6'
        };
        // top.window.addTab(config);
        this.$router.push({path: '/afterSale', query: {status: '6', reload: true}});
        // this.$router.push({
        //   path: '/afterSale',
        //   query: {
        //     status: 6
        //   }
        // });
      },
      // 订单-待发货
      toDirectordermanage1() {
        let config = {
          title: '订单管理',
          id: 'directordermanage',
          href: '/scm-chain-portal-vue/#/directordermanage?supplierOrderStatus=1'
        };
        // top.window.addTab(config);
        this.$router.push({path: '/directordermanage', query: {supplierOrderStatus: '1', reload: true}});
        // this.$router.push({
        //   path: '/directordermanage',
        //   query: {
        //     supplierOrderStatus: 1
        //   }
        // });
      },
      // 订单-部分发货
      toDirectordermanage6() {
        let config = {
          title: '订单管理',
          id: 'directordermanage',
          href: '/scm-chain-portal-vue/#/directordermanage?supplierOrderStatus=6'
        };
        this.$router.push({path: '/directordermanage', query: {supplierOrderStatus: '6', reload: true}});
        // top.window.addTab(config);
        // this.$router.push({
        //   path: '/directordermanage',
        //   query: {
        //     supplierOrderStatus: 6
        //   }
        // });
      },
      // 供应商订单-待发送供应商
      toSupplierOrder1() {
        let config = {
          title: '供应商订单',
          id: 'supplierOrder',
          href: '/scm-chain-portal-vue/#/supplierorder?supplierOrderStatus=1'
        };
        // top.window.addTab(config);
        this.$router.push({path: '/supplierorder', query: {supplierOrderStatus: '1', reload: true}});
      },
      // 发货单-待发货
      toOutboundOrderList2() {
        let config = {
          title: '发货通知单管理',
          id: 'orderList',
          href: '/scm-chain-portal-vue/#/shippenotice?status=2'
        };
        // top.window.addTab(config);
        this.$router.push({path: '/shippenotice', query: {status: '2', reload: true}});
      },
      // 发货单-部分发货
      toOutboundOrderList5() {
        let config = {
          title: '发货通知单管理',
          id: 'orderList',
          href: '/scm-chain-portal-vue/#/shippenotice?status=5'
        };
        // top.window.addTab(config);
        this.$router.push({path: '/shippenotice', query: {status: '5', reload: true}});
      },
      // 供应商-待审批
      toSupplierapplyaudit() {
        let config = {
          title: '供应商申请审批',
          id: 'supplierApplyAuditList',
          href: '/scm-chain-portal-vue/#/supplierapplyaudit'
        };
        // top.window.addTab(config);
        this.$router.push({path: '/supplierapplyaudit'});
        // this.$router.push({
        //   path: '/supplierapplyaudit'
        // });
      },
      // 采购单-待审核
      toPurchaseorderaudit() {
        let config = {
          title: '采购单审核',
          id: 'purchaseorderaudit',
          href: '/scm-chain-portal-vue/#/purchaseorderaudit'
        };
        // top.window.addTab(config);
        this.$router.push({path: '/purchaseorderaudit'});
        // this.$router.push({
        //   path: '/purchaseorderaudit'
        // });
      },
      // 采购退货单-待审核
      toPurchreturnordeaudit() {
        let config = {
          title: '采购退货单审核',
          id: 'purchreturnordeaudit',
          href: '/scm-chain-portal-vue/#/purchreturnordeaudit'
        };
        // top.window.addTab(config);
        this.$router.push({path: '/purchreturnordeaudit'});
        // this.$router.push({
        //   path: '/purchreturnordeaudit'
        // });
      },
      // 调拨单-待审核
      toStorehouseList() {
        let config = {
          title: '调拨单审核',
          id: 'storehouseAuditList',
          href: '/scm-chain-portal-vue/#/transorderaudit'
        };
        // top.window.addTab(config);
        this.$router.push({path: '/transorderaudit'});
      },
      // 订单数量（总）
      toDirectordermanageCurr(id) {
        let currMon = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
        let currDay = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
        let day = new Date().getFullYear() + '-' + currMon + '-' + currDay;
        if (id === 2) {
          let yestDay = new Date().getTime() - 24 * 60 * 60 * 1000;
          currMon = (new Date(yestDay).getMonth() + 1) < 10 ? '0' + (new Date(yestDay).getMonth() + 1) : new Date(yestDay).getMonth() + 1;
          currDay = new Date(yestDay).getDate() < 10 ? '0' + new Date(yestDay).getDate() : new Date(yestDay).getDate();
          day = new Date(yestDay).getFullYear() + '-' + currMon + '-' + currDay;
        }
        let config = {
          title: '订单管理',
          id: 'directordermanage',
          href: '/scm-chain-portal-vue/#/directordermanage?time=' + day
        };
        // top.window.addTab(config);
        this.$router.push({path: '/directordermanage', query: {time: day}});
        // this.$router.push({
        //   path: '/directordermanage',
        //   query: {
        //     time: day
        //   }
        // });
      },
      // 供应商订单数量
      toSupplierOrder(id) {
        let currMon = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
        let currDay = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
        let day = new Date().getFullYear() + '-' + currMon + '-' + currDay;
        if (id === 2) {
          let yestDay = new Date().getTime() - 24 * 60 * 60 * 1000;
          currMon = (new Date(yestDay).getMonth() + 1) < 10 ? '0' + (new Date(yestDay).getMonth() + 1) : new Date(yestDay).getMonth() + 1;
          currDay = new Date(yestDay).getDate() < 10 ? '0' + new Date(yestDay).getDate() : new Date(yestDay).getDate();
          day = new Date(yestDay).getFullYear() + '-' + currMon + '-' + currDay;
        }
        let config = {
          title: '供应商订单',
          id: 'supplierOrder',
          href: '/scm-chain-portal-vue/#/supplierorder?time=' + day
        };
        // top.window.addTab(config);
        this.$router.push({path: '/supplierorder', query: {time: day}});
      },
      // 发货单数量
      toOutboundOrderList(id) {
        let currMon = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
        let currDay = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
        let day = new Date().getFullYear() + '-' + currMon + '-' + currDay;
        if (id === 2) {
          let yestDay = new Date().getTime() - 24 * 60 * 60 * 1000;
          currMon = (new Date(yestDay).getMonth() + 1) < 10 ? '0' + (new Date(yestDay).getMonth() + 1) : new Date(yestDay).getMonth() + 1;
          currDay = new Date(yestDay).getDate() < 10 ? '0' + new Date(yestDay).getDate() : new Date(yestDay).getDate();
          day = new Date(yestDay).getFullYear() + '-' + currMon + '-' + currDay;
        }
        let config = {
          title: '发货通知单管理',
          id: 'orderList',
          href: '/scm-chain-portal-vue/#/shippenotice?time=' + day
        };
        // top.window.addTab(config);
        this.$router.push({path: '/shippenotice', query: {time: day}});
      }
      // 销售商品数量（件）
      // 销售SKU数量（种）
    }
  };
</script>
<style lang="stylus" scoped>
.businesskanban
  .left
    width 250px
    line-height 100px
    font-size 25px
    text-align center
    display inline-block
    vertical-align top
    background rgba(24, 144, 255, 1)
    color rgb(255, 255, 255)
  .right
    width 1340px
    display inline-block
    vertical-align top
    .item
      width 220px
      display inline-block
      margin-bottom 5px
      vertical-align top
      font-size 18px
      background rgba(210, 240, 255, 1);
      color #1890FF;
      line-height 50px
      text-align center
      .active
        cursor pointer
</style>

<template>
  <div class="manage">
    <el-container>
      <el-header v-if="isShow">
        <el-row>
          <!-- <el-col :span="2" class="brand">
            <img class="logo" src="./logo.png" alt="">
            <span>泰然集团</span>
          </el-col> -->
          <el-col :span="24">
            <el-menu :default-active="route" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" class="el-menu-demo" mode="horizontal" router>
              <!-- 基础信息 -->
              <el-submenu index="1">
                <template slot="title">基础信息</template>
                <el-menu-item index="/brandmanage">品牌管理</el-menu-item>
                <el-menu-item index="/propmanage">属性管理</el-menu-item>
                <el-menu-item index="/classifymanage">分类管理</el-menu-item>
              </el-submenu>
              <!-- 企业购模块 -->
              <!-- <el-submenu index="1">
                <template slot="title">企业购</template>
                <el-submenu index="1-1">
                  <template slot="title">订单管理</template>
                  <el-menu-item index="/ordermanage">订单列表</el-menu-item>
                </el-submenu>
                <el-submenu index="1-2">
                  <template slot="title">商品管理</template>
                  <el-menu-item index="/goodmanage">商品列表</el-menu-item>
                </el-submenu>
                <el-submenu index="1-3">
                  <template slot="title">小泰集市</template>
                  <el-menu-item index="/mymarket"> 供应中心</el-menu-item>
                </el-submenu>
                <el-submenu index="1-4">
                  <template slot="title">计划与策略</template>
                  <el-menu-item index="/planandstragy">定价计划</el-menu-item>
                </el-submenu>
                <el-submenu index="1-5">
                  <template slot="title">分销商</template>
                  <el-menu-item index="/distributormanage">分销商管理</el-menu-item>
                  <el-menu-item index="/distributoraccred">分销商授权</el-menu-item>
                </el-submenu>
                <el-submenu index="1-6">
                  <template slot="title">供应商</template>
                  <el-menu-item index="/supplier">供应商授权</el-menu-item>
                </el-submenu>
                <el-submenu index="1-7">
                  <template slot="title">商品映射</template>
                  <el-menu-item index="/shopMapManage">商品映射列表</el-menu-item>
                </el-submenu>
                <el-submenu index="1-8">
                  <template slot="title">发货单管理</template>
                  <el-menu-item index="/invoiceManage">发货单管理</el-menu-item>
                </el-submenu>
              </el-submenu> -->
              <!-- 商品管理 -->
              <el-submenu index="2">
                <template slot="title">商品管理</template>
                <el-menu-item index="/goodsgroup">商品组管理</el-menu-item>
                <el-menu-item index="/minegoods">自采商品管理</el-menu-item>
                <el-menu-item index="/undertakesgood">代发商品管理</el-menu-item>
                <el-menu-item index="/goodsquery">商品查询</el-menu-item>
              </el-submenu>
              <!-- 库存管理 -->
              <el-submenu index="9">
                <template slot="title">库存管理</template>
                <el-menu-item index="/goodsstocklist">商品库存查询</el-menu-item>
                <el-menu-item index="/stocksetting">库存设置</el-menu-item>
              </el-submenu>
              <!-- 供应商管理 -->
              <el-submenu index="3">
                <template slot="title">供应商管理</template>
                <el-menu-item index="/supplierManage">供应商管理</el-menu-item>
                <el-menu-item index="/supplierapply">供应商申请</el-menu-item>
                <el-menu-item index="/supplierapplyaudit">供应商申请审批</el-menu-item>
              </el-submenu>
              <!-- 采购管理 -->
              <el-submenu index="4">
                <template slot="title">采购管理</template>
                <el-submenu index="4-1">
                  <template slot="title">采购管理</template>
                  <el-menu-item index="/purchasesgroup">采购组管理</el-menu-item>
                  <el-menu-item index="/purchaseordermanage">采购单管理</el-menu-item>
                  <el-menu-item index="/purchaseorderaudit">采购单审核</el-menu-item>
                  <el-menu-item index="/warenoticordermanage">入库通知单管理</el-menu-item>
                </el-submenu>
                <el-submenu index="4-2">
                  <template slot="title">退货管理</template>
                  <el-menu-item index="/purchreturnordermanage">采购退货单管理</el-menu-item>
                  <el-menu-item index="/purchreturnordeaudit">采购退货单审核</el-menu-item>
                  <el-menu-item index="/returnorderout">退货出库通知单</el-menu-item>

                </el-submenu>
              </el-submenu>
              <!-- 退货流程 -->
              <el-submenu index="5">
                  <template slot="title">退货管理</template>
                  <el-menu-item index="/afterSale">售货单列表</el-menu-item>
                  <el-submenu index="5-2">
                    <template slot="title">退货入库单管理</template>
                    <el-menu-item index="/returnreceipt">退货入库单列表</el-menu-item>
                  </el-submenu>
              </el-submenu>
              <!-- 直营管理 -->
              <el-submenu index="6">
                <template slot="title">直营管理</template>
                <el-menu-item index="/directordermanage">订单管理</el-menu-item>
                <el-menu-item index="/supplierorder">供应商订单</el-menu-item>
                <el-menu-item index="/shippenotice">发货通知单管理</el-menu-item>
                <el-menu-item index="/directexcepmanage">拆单异常管理</el-menu-item>
              </el-submenu>
              <!-- 仓储管理 -->
              <el-submenu index="7">
                <template slot="title">仓储管理</template>
                <el-submenu index="7-1">
                  <template slot="title">仓库信息管理</template>
                  <el-menu-item index="/storeinfomanage">仓库信息管理</el-menu-item>
                  <el-menu-item index="/logisticsmanage">物流公司管理</el-menu-item>
                </el-submenu>
                <el-submenu index="7-2">
                  <template slot="title">仓间调拨管理</template>
                  <el-menu-item index="/transordermanage">调拨单管理</el-menu-item>
                  <el-menu-item index="/transorderaudit">调拨单审核</el-menu-item>
                  <el-menu-item index="/transorderwarehouseout">调拨出库通知单</el-menu-item>
                  <el-menu-item index="/transorderwarehousein">调拨入库通知单</el-menu-item>
                </el-submenu>
              <!-- 业务设置 -->
                <el-submenu index="7-3">
                  <template slot="title">其他出入库</template>
                  <el-menu-item index="/othermanage">其他出入库管理</el-menu-item>
                  <el-menu-item index="/otheraudit">其他出入库审核</el-menu-item>
                  <el-menu-item index="/otherwarehousein">其他入库通知单</el-menu-item>
                  <el-menu-item index="/otherwarehouseout">其他出库通知单</el-menu-item>
                </el-submenu>
              </el-submenu>
              <!-- 报表管理 -->
              <el-submenu index="8">
                <template slot="title">报表管理</template>
                <el-menu-item index="/inventoryreport">库存报表</el-menu-item>
              </el-submenu>
              <!-- 业务设置 -->
              <el-submenu index="10">
                <template slot="title">业务设置</template>
                <el-menu-item index="/shipwarehousematch">发货仓库匹配</el-menu-item>
              </el-submenu>
              <!-- 业务设置 -->
              <el-submenu index="12">
                <template slot="title">业务看板</template>
                <el-menu-item index="/businesskanbanopage">业务看板</el-menu-item>
              </el-submenu>
              <!-- 系统管理 -->
              <el-submenu index="11">
                <template slot="title">系统管理</template>
                <el-menu-item index="/dictionarymanage">字典管理</el-menu-item>
                <el-menu-item index="/resourcemanage">资源管理</el-menu-item>
                <el-menu-item index="/wmsresourcemanage">WMS资源管理</el-menu-item>
                <el-menu-item index="/developmentcompen">开发补偿</el-menu-item>
                <el-menu-item index="/warehouseconfigmanage">仓库配置管理</el-menu-item>
              </el-submenu>
              <!-- 业务设置 -->
              <el-submenu index="13">
                <template slot="title">财务报表</template>
                <el-menu-item index="/JDfinancialmanage">京东代发财务管理</el-menu-item>
                <el-menu-item index="/OILreport">粮油代发报表</el-menu-item>
              </el-submenu>
              <el-submenu index="14">
                <template slot="title">权限管理</template>
                <el-menu-item index="/SCMauthoriza">授权管理</el-menu-item>
                <el-menu-item index="/WMSauthoriza">WMS授权管理</el-menu-item>
              </el-submenu>
              <el-submenu index="15">
                <template slot="title">技术后台管理</template>
                <el-menu-item index="/linemanage">业务线管理</el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-tabs v-if="isShow" v-model="editableTabsValue2" @tab-click="handleClick" type="card" :closable="editableTabs2.length > 1" @tab-remove="removeTab">
          <el-tab-pane v-for="(item, index) in editableTabs2" :key="index" :label="item.title" :name="item.name"></el-tab-pane>
        </el-tabs>
        <router-view/>
      </el-main>
    </el-container>

  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'manage',
  data() {
    return {
      isShow: true, // 提交时改为false, 本地测试用true
      isRemove: true,
      editableTabsValue2: '',
      editableTabs2: []
    };
  },
  mounted() {
    console.log(55);
  },
  watch: {
    $route(o, n) {
      if (o.path === n.path) {
        window.location.reload();
      }
    }
  },
  computed: {
    route() {
      let router = `/${this.$route.path.split('/')[1]}`;
      if (this.isRemove) {
        this.addTab(router);
      } else {
        this.isRemove = true;
      }
      console.log('editableTabs2:', this.editableTabs2);
      return router;
    }
  },
  methods: {
    // getData() {
    //   this.GET('/wms-web/logisticsCorporation/enabled').then(res => {
    //     console.log('GET: ', res);
    //   });
    // },
    handleClick(tab, event) {
      this.$router.push(tab.name);
    },
    // 增加路由路径到tab
    addTab(router) {
      console.log(this.editableTabs2);
      let obj = {
        title: this.$route.meta.title,
        name: router
      };
      let isAdd = true;
      this.editableTabs2.forEach(item => {
        if (item.name === router) {
          isAdd = false;
        }
      });
      if (isAdd) {
        this.editableTabs2.push(obj);
        this.editableTabsValue2 = router;
      } else {
        this.editableTabsValue2 = router;
      }
    },
    removeTab(targetName) {
      this.isRemove = false;
      console.log(targetName);
      if (this.editableTabs2.length > 1) {
        this.editableTabs2.forEach((item, i) => {
          if (item.name === targetName) {
            console.log(i);
            this.editableTabs2.splice(i, 1);
            console.log(this.editableTabs2);
          }
        });
        this.editableTabsValue2 = this.editableTabs2[this.editableTabs2.length - 1].name;
        this.$router.push(this.editableTabsValue2);
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
img
  display: inline-block
.el-header
  background: #545c64
  .logo
    padding-top: 6px
  .brand
    font-size: 12px
    color: #ffffff
    line-height: 60px
    text-align: center
  .logo_name
    display: inline-block
    line-height: 60px
    vertical-align: top
    padding-left: 10px
</style>

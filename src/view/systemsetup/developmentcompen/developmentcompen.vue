<template>
  <!-- 开发补偿 -->
  <div class="developmentcompen">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="对账日期：" size="mini">
            <el-date-picker v-model="searchParams.date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="searchFormData">查询</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表单 -->
    <el-form :model="kingdeeParams"  label-width="125px"  size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="金蝶订单编号：" size="mini">
            <el-input v-model="kingdeeParams.code" placeholder="请输入订单号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="金蝶订单类型：" size="mini">
            <el-select v-model="kingdeeParams.orderType" placeholder="请选择">
              <el-option
                v-for="item in orderTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="kingdeeFormData">查询</el-button>
            <el-button type="default" icon="circle-cross" @click="resetKingdee">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'developmentcompen',
  data() {
    return {
      orderTypeList: [
        {
          id: 'outBound',
          name: '销售出库单'
        },
        {
          id: 'saleReturn',
          name: '销售退货单'
        },
        {
          id: 'otherOutOrder',
          name: '其他出库单'
        },
        {
          id: 'otherInOrder',
          name: '其他入库单'
        },
        {
          id: 'allocateOut',
          name: '调拨出库单'
        },
        {
          id: 'allocateIn',
          name: '调拨入库单'
        },
        {
          id: 'warehouse',
          name: '仓库同步'
        },
        {
          id: 'supplier',
          name: '供应商同步'
        },
        {
          id: 'customer',
          name: '客户同步'
        },
        {
          id: 'adjustIn',
          name: '调整入库'
        },
        {
          id: 'adjustOut',
          name: '调整出库'
        },
        {
          id: 'purchaseIn',
          name: '采购入库'
        },
        {
          id: 'purchaseReturn',
          name: '采购退货'
        }
      ],
      kingdeeParams: {
        code: '',
        orderType: ''
      },
      searchParams: {
        date: ''
      }
    };
  },
  created() {
    let currentDay = new Date();
    let month = (currentDay.getMonth() * 1 + 1).toString().length > 1 ? (currentDay.getMonth() * 1 + 1) : ('0' + (currentDay.getMonth() * 1 + 1));
    this.searchParams.date = currentDay.getFullYear() + '-' + month + '-' + currentDay.getDate();
  },
  methods: {
    getCompletionOrder() {
      this.$AXIOS.POST('bill/completionOrder', this.searchParams).then(res => {
        if (res.appcode === '1') {
          this.$utils.messagetip.successTip(res.databuffer);
        }
      });
    },
    getKingdeeOrder() {
      this.$AXIOS.GET('kingDee/retry/develop', this.kingdeeParams).then(res => {
        if (res.appcode === '1') {
          this.$utils.messagetip.successTip(res.databuffer);
        }
      });
    },
    searchFormData() {
      if (!this.searchParams.date) {
        this.$utils.messagetip.warningTip('请先选择对账日期！');
        return;
      }
      this.getCompletionOrder();
    },
    kingdeeFormData() {
      if (!this.kingdeeParams.code) {
        this.$message({
          type: 'warning',
          message: '请输入要补偿的订单号！'
        });
        return;
      }
      if (!this.kingdeeParams.orderType) {
        this.$message({
          type: 'warning',
          message: '请输入要补偿的订单类型！'
        });
        return;
      }
      this.getKingdeeOrder();
    },
    resetForm() {
      this.searchParams.date = '';
    },
    resetKingdee() {
      this.kingdeeParams.code = '';
      this.kingdeeParams.orderType = '';
    }
  }
};
</script>
<style lang="stylus" scoped>
</style>

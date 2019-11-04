<template>
  <!-- 仓库配置管理 -->
  <div class="warehouseconfigmanage">
    <el-row :gutter="20">
      <el-col :span="6">
        <span class="tip_red">仓库名称：</span>
        <el-select v-model="warehouseCode" placeholder="请选择" size="mini" @change='checkWarehouse' filterable>
          <el-option v-for="item in warehourseList" :key="item.code" :label="item.warehouseName" :value="item.code">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <span class="tip_red">仓库编码：</span>
        <el-input v-model="wmsWarehouseCode" placeholder="请输入内容" size="mini" style="width: auto"></el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <span class="tip_red">仓库类型：</span>
        <el-radio v-model="warehouseSourceType" label="QM">奇门</el-radio>
        <el-radio v-model="warehouseSourceType" label="JD">京东</el-radio>
        <el-radio v-model="warehouseSourceType" label="TRC">自营</el-radio>
        <el-radio v-model="warehouseSourceType" label="MD">门店</el-radio>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12" style="margin-bottom: 28px">
        <span style="padding-left: 10px" >业务类型：</span>
        <el-checkbox-group v-model="checkList" style="display: inline-block;">
          <el-checkbox label="0">库存盘点</el-checkbox>
          <el-checkbox label="1">正品转残品</el-checkbox>
          <el-checkbox label="2">残品转正品</el-checkbox>
          <el-checkbox label="3">库存转化</el-checkbox>
          <el-checkbox label="4">系统原因</el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <span class="tip_red">是否已对接商品信息通知接口：</span>
        <el-radio v-model="isNoticeWarehouseItems" label="1">是</el-radio>
        <el-radio v-model="isNoticeWarehouseItems" label="0">否</el-radio>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <span class="tip_red">是否已对接货主信息通知接口：</span>
        <el-radio v-model="isNoticeSuccess" label="1">是</el-radio>
        <el-radio v-model="isNoticeSuccess" label="0">否</el-radio>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <div style="text-align: center">
          <el-button type="primary" size="mini" @click="save">保存</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'warehouseconfigmanage',
  data() {
    return {
      checkList: [], // 业务类型
      warehouseCode: '',
      wmsWarehouseCode: '',
      warehouseSourceType: '',
      isNoticeSuccess: '',
      isNoticeWarehouseItems: '',
      warehourseList: [],
      id: ''
    };
  },
  created() {
    this.getWarehourseList();
  },
  methods: {
    getWarehourseList() {
      this.$AXIOS.LISTGET('/system/warehouseConfig').then(res => {
        this.warehourseList = res.result;
      });
    },
    putWarehouseConfig() {
      let params = {
        wmsWarehouseCode: this.wmsWarehouseCode,
        warehouseSourceType: this.warehouseSourceType,
        isNoticeSuccess: this.isNoticeSuccess,
        isNoticeWarehouseItems: this.isNoticeWarehouseItems,
        accessBusinessType: this.checkList.join()
      };
      this.$AXIOS.PUT('/system/warehouseConfig/' + this.id, params).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        this.getWarehourseList();
      });
    },
    save() {
      if (!this.warehouseCode) {
        this.$utils.messagetip.warningTip('请选择仓库');
        return;
      }
      if (!this.wmsWarehouseCode) {
        this.$utils.messagetip.warningTip('请输入仓库编码');
        return;
      }
      if (!this.warehouseSourceType) {
        this.$utils.messagetip.warningTip('请选择仓库类型');
        return;
      }
      this.putWarehouseConfig();
    },
    checkWarehouse(val) {
      this.wmsWarehouseCode = '';
      this.warehouseSourceType = '';
      this.isNoticeSuccess = '';
      this.isNoticeWarehouseItems = '';
      this.id = '';
      let warehourseObj = {};
      this.warehourseList.forEach(item => {
        if (item.code === val) {
          warehourseObj = item;
        }
      });
      this.wmsWarehouseCode = warehourseObj.wmsWarehouseCode ? warehourseObj.wmsWarehouseCode.toString() : '';
      this.warehouseSourceType = (warehourseObj.warehouseSourceType === 'QM' || warehourseObj.warehouseSourceType === 'JD' || warehourseObj.warehouseSourceType === 'TRC' || warehourseObj.warehouseSourceType === 'MD') ? warehourseObj.warehouseSourceType.toString() : '';
      this.isNoticeSuccess = (warehourseObj.isNoticeSuccess === 0 || warehourseObj.isNoticeSuccess === 1) ? warehourseObj.isNoticeSuccess.toString() : '';
      this.isNoticeWarehouseItems = (warehourseObj.isNoticeWarehouseItems === '0' || warehourseObj.isNoticeWarehouseItems === '1') ? warehourseObj.isNoticeWarehouseItems.toString() : '';
      this.checkList = warehourseObj.accessBusinessType ? warehourseObj.accessBusinessType.split(',') : [];
      this.id = warehourseObj.id;
      console.log(this.checkList);
      console.log(this.warehouseSourceType);
      console.log(this.isNoticeSuccess);
      console.log(this.isNoticeWarehouseItems);
      console.log(this.id);
    }
  }
};
</script>
<style lang="stylus" scoped>
</style>

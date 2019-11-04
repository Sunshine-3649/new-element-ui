<template>
  <div class="freezeaddoreidt">
    <p style="line-height: 30px;padding-left: 22px">{{eventCode === 'add' ? '新增活动' : '修改活动'}}</p>
    <!-- 表单 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-form :model="searchParams" :rules="rules" ref="searchParams" label-width="125px" class="search_form" size="medium">
        <!-- 第0行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="活动编号：" size="mini">
              {{searchParams.eventCode ? searchParams.eventCode : '保存后系统自动生成'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="20">
          <el-col :span="12">
            <el-form-item label="活动名称：" prop="eventName" size="mini">
              <el-input type="text" v-model.trim="searchParams.eventName" :disabled="searchParams.eventSource == '0'" placeholder="" :maxlength="500"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="20">
          <el-col :span="12">
            <el-form-item label="活动渠道：" prop="eventChannelCode" size="mini">
              <el-select v-model="searchParams.eventChannelCode" :disabled="searchParams.eventSource == '0'" filterable placeholder="请选择">
                <el-option v-for="item in eventChannelCodeList" :key="item.sellCode" :label="item.sellName" :value="item.sellCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="开始时间：" prop="startTime" size="mini">
              <el-date-picker
                v-model="searchParams.startTime"
                type="datetime"
                format='yyyy-MM-dd HH:mm:ss'
                value-format='yyyy-MM-dd HH:mm:ss'
                placeholder="选择开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结束时间：" prop="endTime" size="mini">
              <el-date-picker
                v-model="searchParams.endTime"
                type="datetime"
                format='yyyy-MM-dd HH:mm:ss'
                value-format='yyyy-MM-dd HH:mm:ss'
                placeholder="选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row :span="20">
          <el-col :span="12">
            <el-form-item label="备注：" size="mini">
              <el-input type="textarea" v-model.trim="searchParams.remark" placeholder="" :maxlength="500"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card">
        <el-button  type="primary" size="mini"  @click="addGoods"> + 添加商品<i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <el-table v-show="tableDataList.length > 0" class="price_list" :data="tableDataList" style="width: 100%;margin-top:15px;" border>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="skuCode" label="SKU编号" align="center"></el-table-column>
          <el-table-column prop="skuName" label="SKU名称" align="center"></el-table-column>
          <el-table-column prop="specInfo" label="规格" align="center" ></el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center" ></el-table-column>
          <el-table-column :render-header="renderHeader2"  prop="availableInventory" label="当前“正品_可用库存”,（仅指支持发货仓库的可用库存）"  align="center" ></el-table-column>
          <el-table-column prop="frozenNumOfFinished" label="已冻结数量" align="center"></el-table-column>
          <el-table-column :render-header="renderHeader"  prop="frozenNum" label="本次冻结数量,（解冻请输入负数）"  align="center"  label-class-name="isadjuststyle">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.frozenNum" :maxlength='10' placeholder="" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" v-if="!scope.row.frozenNumOfFinished && !scope.row.frozenNum" @click="deleteBtn(scope.$index)">删除</el-button>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
    </el-card>
    <!--添加商品非库存转化-->
    <el-dialog title="选择商品" :visible.sync="isShow" width="550px" :close-on-click-modal='false' :show-close='true'>
      <el-form label-width="0" class="search_form" size="medium">
        <el-row :span="20">
          <el-col>
            <div style="margin-bottom: 5px;">请输入需要冻结商品的SKU编号或条形码（多个请用英文“,”分割）：</div>
            <el-form-item label="" size="mini">
              <el-input type="textarea"  placeholder="" v-model.trim="skuOrBarCode" @keydown.native="listenKeyDown($event)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button type="primary"  icon="circle-cross" size="mini" @click="funSetGoods">确定</el-button>
            <el-button  size="mini" type="primary" @click="isShow = false">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>


    <div class="btn_group">
      <el-button type="primary" size="mini"  @click="submitAuditBtn()" :disabled="isSubmit">保存</el-button>
      <el-button size="mini" @click="back">返回</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'freezeaddoreidt',
    data() {
      return {
        eventCode: this.$route.params.id,
        isSubmit: false,
        skuOrBarCode: '',
        tableDataList: [],
        isShow: false,
        eventChannelCodeList: [], // 活动渠道
        id: '',
        searchParams: {
          eventCode: '',
          eventName: '',
          remark: '',
          eventChannelCode: '',
          endTime: '',
          startTime: ''
        },
        rules: {
          eventName: [
            { required: true, message: '请输入活动名称！', trigger: 'blur' }
          ],
          eventChannelCode: [
            { required: true, message: '请选择活动渠道！', trigger: 'change' }
          ],
          startTime: [
            { required: true, message: '请选择开始时间！', trigger: 'change' }
          ],
          adjustInventoryObject: [
            { required: true, message: '请选择结束时间！', trigger: 'change' }
          ]
        }
      };
    },
    watch: {
    },
    created() {
      this.getWarehouseList();
      // if (this.$route.params.id !== 'add') {
      //   this.getSearchParams();
      // }
    },
    methods: {
      renderHeader(createElement, { column, _self }) { // 表头重置
        const label = column.label;
        const labelArr = label.split(',');
        return createElement(
          'span', [
            createElement('span', {
              attrs: { type: 'text' }
            }, [labelArr[0]]),
            createElement('p', {
              attrs: { type: 'text', style: 'color:#f00;line-height:20px;' }
            }, [labelArr[1] || ''] )
          ]
        );
      },
      renderHeader2(createElement, { column, _self }) { // 表头重置
        const label = column.label;
        const labelArr = label.split(',');
        return createElement(
          'span', [
            createElement('span', {
              attrs: { type: 'text' }
            }, [labelArr[0]]),
            createElement('p', {
              attrs: { type: 'text', style: 'line-height:20px;' }
            }, [labelArr[1] || ''] )
          ]
        );
      },
      // 获取信息
      getSearchParams() {
        this.$AXIOS.GET('/eventFrozen/eventFrozenDetail/' + this.eventCode).then(res => {
          this.searchParams = res.result;
          if (this.searchParams.detailList && this.searchParams.detailList.length) {
            this.searchParams.detailList.forEach(item => {
              item.frozenNum = 0;
            });
          }
          this.tableDataList = res.result.detailList;
        });
      },
      // 提交审核
      submitAudit(id, params) {
        this.$confirm( `您确认要提交审核吗?`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$AXIOS.JSONPOST('/stockadjust/saveOrSubmit/' + id, params).then(res => {
              this.$message({
                type: 'success',
                message: res.databuffer
              });
              setTimeout(() => {
                this.$router.push({ path: '/stockadjustlist' });
              }, 20);
            }).finally(() => {
                this.isSubmit = false;
            });
          })
        .catch(() => {
            this.isSubmit = false;
            this.$message({
            type: 'info',
            message: `已取消!`
          });
        });
      },

      // 仓库下拉列表
      getWarehouseList() {
        this.$AXIOS.GET('/eventFrozen/getSellChannelByType').then(res => {
          this.eventChannelCodeList = res.result;
          // this.resetTableDataList(this.searchParams.adjustWarehouseCode);
          if (this.$route.params.id !== 'add') {
            this.id = this.$route.params.id;
            this.searchParams.id = this.$route.params.id;
            this.getSearchParams();
          }
        });
      },
      // 添加商品
      addGoods() {
        console.log(this.searchParams.startTime);
        if (!this.searchParams.eventName) {
          this.$message({
            type: 'warning',
            message: '请输入活动名称！'
          });
          return;
        };
        if (!this.searchParams.eventChannelCode) {
          this.$message({
            type: 'warning',
            message: '请选择活动渠道！'
          });
          return;
        };
        if (!this.searchParams.startTime) {
          this.$message({
            type: 'warning',
            message: '请选择开始时间！'
          });
          return;
        };
        if (!this.searchParams.endTime) {
          this.$message({
            type: 'warning',
            message: '请选择结束时间！'
          });
          return;
        };
        this.isShow = true;
        this.skuOrBarCode = '';
      },
      // 根据sku或者条形码添加商品或者老sku替换新的sku
      funSetGoods() {
        if (!this.skuOrBarCode) {
          this.$message({
            type: 'warning',
            message: '请输入需要冻结商品的SKU编号或条形码!'
          });
          return;
        };
        let arr = [];
        this.tableDataList.forEach(item => {
          arr.push(item.skuCode);
        });
        let params = {
          eventCode: this.eventCode === 'add' ? '' : this.eventCode,
          skuList: this.skuOrBarCode,
          existList: arr.join()
        };
        this.$AXIOS.POST('/eventFrozen/getSkuInfo', params).then(res => {
          this.tableDataList = [...this.tableDataList, ...res.result];
        }).finally(() => {
          this.isShow = false;
        });
      },
      // 提交审核按钮以及保存
      submitAuditBtn() {
        if (!this.searchParams.eventName) {
          this.$message({
            type: 'warning',
            message: '请输入活动名称！'
          });
          return;
        };
        if (!this.searchParams.eventChannelCode) {
          this.$message({
            type: 'warning',
            message: '请选择活动渠道！'
          });
          return;
        };
        if (!this.searchParams.startTime) {
          this.$message({
            type: 'warning',
            message: '请选择开始时间！'
          });
          return;
        };
        if (!this.searchParams.endTime) {
          this.$message({
            type: 'warning',
            message: '请选择结束时间！'
          });
          return;
        };
        if (!this.tableDataList.length) {
          this.$message({
            type: 'warning',
            message: '请先添加商品！'
          });
          return;
        }
        let skuCode = '';
        let isTrue = false;
        this.tableDataList.forEach(item => {
          if (!item.frozenNumOfFinished && item.frozenNum < 0 && !isTrue) {
            skuCode = item.skuCode;
            isTrue = true;
          }
        });
        if (isTrue) {
          this.$message({
            type: 'warning',
            message: `SKU编号为【${skuCode}】不支持解冻！`
          });
          return;
        }
        this.searchParams.detailList = JSON.stringify(this.tableDataList);
        if (this.eventCode === 'add') {
          this.saveEvent();
        } else {
          this.updateEvent();
        }
        console.log('object');
      },
      saveEvent() {
        this.$AXIOS.POST('/eventFrozen/saveEvent', this.searchParams).then(res => {
          this.$router.push({ path: '/stocksetting', query: {activeName: 2} });
          this.$message({
            type: 'success',
            message: res.databuffer
          });
        });
      },
      updateEvent() {
        this.$AXIOS.POST('/eventFrozen/updateEvent/' + this.eventCode, this.searchParams).then(res => {
          this.$router.push({ path: '/stocksetting', query: {activeName: 2} });
          this.$message({
            type: 'success',
            message: res.databuffer
          });
        });
      },
      deleteBtn(i) {
        this.tableDataList.splice(i, 1);
      },
      // 返回按钮
      back() {
        this.$router.push({ path: '/stocksetting', query: {activeName: 2} });
      },
      listenKeyDown(e) { // 回车事件监听
        if (e.keyCode === 13) {
          e.preventDefault();
          this.skuOrBarCode = this.skuOrBarCode + '\n';
        }
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .freezeaddoreidt
    .oringinDiv
      span
        padding:2px 10px;
      .targatSkuCode
        display:inline-block;
        border-left: 1px solid #ebeef5;
        width: 150px;
        text-align: center;
      .el-input
        width: 50%
    .add-more-item
      margin-top:28px;
    .btn_group
      margin-top: 15px;
      text-align: center;
      margin-bottom: 15px;
    .result
      text-align: center
      .icon
        font-size: 80px
      p
        line-height: 40px
    .upload-demo
      text-align: center
    .btn
      color: blue
      cursor: pointer
</style>
<style lang='stylus'>
  .freezeaddoreidt
    .price_list
      div.isadjuststyle::before
        content: '*';
        padding-right: 5px;
        color: #f00;
</style>

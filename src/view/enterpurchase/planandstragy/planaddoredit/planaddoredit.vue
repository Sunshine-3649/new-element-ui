<template>
  <div class="planaddoredit">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>计划信息</span>
        <!-- <span @click="operateDialogVisibleTable = true" style="float: right; padding: 3px 0" type="text">操作日志</span> -->
      </div>
      <section class="info">
        <el-row :span="20" style="line-height: 28px;">
          <el-col :span="2" style="text-align: right;">

          </el-col>
          <el-col :span="8">
            <el-form :inline="true">
              <span style="color:red;position: relative;top:10px;">*</span>
              <el-form-item label="计划名称：">
                <el-input  v-model="pricePlanName" placeholder="请输入计划名称" size="mini"></el-input>
              </el-form-item>
              <el-form-item>
                   名称不可重复，最多限输入15字
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </section>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>计划规则</span>
      </div>
      <section class="info">
        <p>
          <span class="title">计划类型：</span>
          <el-radio style="" v-model="isSetting" label="1">基于商品设置</el-radio>
        </p>
      </section>
    </el-card>
    <!-- <h3 class="name">销售属性信息</h3> -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <third-select :clear="clear" v-on:shopId="shopId"></third-select>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品名称：" size="mini">
            <el-input v-model.trim="searchParams.itemsName" placeholder="输入商品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="id === 'add' ? searchPlan(searchParams) : searchPlanEdit(searchParams)">搜索</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm()">清空条件</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="planReditTable">
      <el-table @cell-click="cellClick" :data="tableData.objects" border>
        <el-table-column label="一级类目" prop="firstCategoryName" width="150" align="center"></el-table-column>
        <el-table-column label="二级类目" prop="secondCategoryName" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="三级类目" prop="thirdCategoryName" align="center"></el-table-column>
        <el-table-column label="品牌" prop="brandName" align="center"></el-table-column>
        <el-table-column label="商品名称" prop="name" align="center"></el-table-column>
        <el-table-column label="SPU编号" prop="spuCode" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="toggleSupplyStatus(scope.$index, scope.row)">查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <el-row class="paging">
      <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNumber" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.recordTotal">
      </el-pagination>
    </el-row>
    <!-- 按钮组 -->
    <div class="btn">
      <el-button @click="keepData" size="mini" type="primary">保存</el-button>
      <el-button size="mini" @click="goBack">取消</el-button>
    </div>

    <!-- 列表详情内表格展示 -->
    <el-dialog id="SKUDataTable" :before-close="noChange" center title="明细"  width="80%"  :visible.sync="dialogTableVisible">
      <el-table :data="activeTableData" border>
        <el-table-column label="SKU名称" prop="skuName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="销售属性" prop="specInfo" width="150" align="center"></el-table-column>
        <el-table-column label="SKU编码" prop="skuCode" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="商品条码" prop="barCode" align="center"></el-table-column>
        <el-table-column label="折扣率(大于0,最多保留4位小数)" prop="address" align="center">
          <template slot-scope="scope">
              <el-input placeholder="" size="mini" type="text" v-model.trim="scope.row.discountRate" ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="加价金额(最多保留2位小数)" prop="address" align="center">
            <template slot-scope="scope">
              <el-input size="mini" type="text" v-model.trim="scope.row.priceIncreaseAmount" ></el-input>
            </template>
        </el-table-column>
        <el-table-column label="分销价(大于0,最多保留2位小数)" prop="address" align="center">
            <template slot-scope="scope">
              <el-input size="mini" type="text" v-model.trim="scope.row.distributorPrice " ></el-input>
            </template>
        </el-table-column>
      </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirm()" size="mini" >确 定</el-button>
          <el-button size="mini" @click="closeDialog">重 置</el-button>
        </span>
    </el-dialog>

    <!-- 操作日志弹窗 -->
    <el-dialog title="操作日志" :visible.sync="operateDialogVisibleTable" width="80%" >
       <operate-table v-on:closeOperate="closeOperate" v-if="operateParams.entityId"  :params="operateParams"></operate-table>
    </el-dialog>
  </div>
</template>

<script>

import thirdSelect from '../../../../components/select';

let pricePlanName = '';  // 计划名称
let pricePlanNoChangeData = '';


export default {
  name: 'planaddoredit',
  components: { thirdSelect },
  data() {
    return {
      dialogTableVisible: false, // 明细弹窗
      operateDialogVisibleTable: false, // 操作日志弹窗
      operateParams: {
          entityType: 'BusiDistributor',
          entityId: ''
      },
      firstCateList: [], // 类目一级列表
      secondCateList: {
        list: [],
        disabled: true
      }, // 类目二级列表
      thirdCateList: {
        list: [],
        disabled: true
      }, // 类目三级列表
      shopCategory: {}, // 商品分类
      searchParams: {   // 搜索商品类目
        firstCategoryId: '',
        secondCategoryId: '',
        thirdCategoryId: '',
        itemsName: '',
        planId: '',
        pageSize: 10,
        pageNumber: 1,
        recordTotal: 0
      },
      pricePlanName: '', // 计划名称
      isSetting: '1',
      options: [], // 三级联动选项
      selectedOptions: [],
      clear: false,
      tableData: [], // 商品列表数据
      dialogData: [], // 商品明细的数据
      id: this.$route.params.id,  // 获取从列表页传过来的参数
      activeTableData: '',  // 选中列表项数据
      pricePlanNoChangeData: ''
    };
  },
  methods: {
    shopId(id) { // 子组件传送数据到父组件
      for (let data in this.searchParams) {
        for (let item in id) {
            if (item === data) {
              this.searchParams[data] = id[item];
            }
        }
      }
    },
    // 深拷贝
    deepClone(obj) {
         let obg1 = JSON.stringify(obj);
         let objClone = JSON.parse(obg1);
         return objClone;
    },
    cellClick(row, column, cell, event) {
        this.activeTableData = row.pricePlanSkuVOS;
        this.pricePlanNoChangeData = this.deepClone(row.pricePlanSkuVOS);
    },
    // 定价计划明细弹窗关闭前事件
    noChange() {
        this.dialogTableVisible = false;
        this.pricePlanNoChangeData.forEach((item, index) => {  // 赋值为原来没修改的数据
            this.activeTableData.forEach((item1, index1) => {
                for (let obj in item) {
                    for (let obj1 in item1) {
                        if ( index === index1 && obj === obj1) {
                            item1[obj1] = item[obj];
                        }
                    }
                }
            });
        });
    },
    // 关闭查看日志弹窗
    closeOperate() {
        this.operateDialogVisibleTable = false;
    },
    // 新增，搜索，初始化数据
    initDataList(data) {
      this.GET('/busiPricePlan/selectItemsPage', data).then( res => {
          this.tableData = res.body;
          this.searchParams.recordTotal = res.body.recordTotal;
      });
    },
    // 新增的搜索
    searchPlan() {
        this.searchParams.pageNumber = 1;
        this.initDataList(this.searchParams);
    },
    // 编辑的搜索
    searchPlanEdit() {
         this.searchParams.pageNumber = 1;
         this.editInitData(this.searchParams);
    },
    // 编辑初始化数据
    editInitData(data) {
       this.GET('/busiPricePlan/queryPricePlanDetail', data).then( res => {
          this.tableData = res.body.itemsBaseVO;
          pricePlanName = this.pricePlanName = res.body.pricePlanVO.pricePlanName;  // 计划名称
          this.searchParams.recordTotal = res.body.itemsBaseVO.recordTotal;
       });
    },
    // 获取商品分类列表
    initShopList(data) {
         return this.GET('/category/queryCategory', data);
    },
    // 重置搜索条件
    resetForm() {
      this.clear = true;
      for (let data in this.searchParams) {
        if (data === 'pageSize' || data === 'pageNumber' || data === 'recordTotal' || data === 'planId') {
            continue;
        } else {
          this.searchParams[data] = '';
        }
      }
      if (this.id === 'add') {
          this.initDataList(this.searchParams);
      } else {
          this.editInitData(this.searchParams);
      }
    },
    // 保存数据
    keepData() {
      let arr = [];

      for (let i = 0; i < this.tableData.objects.length; i++) {
          if (this.tableData.objects[i].pricePlanSkuVOS.length) {
            for (let j = 0; j < this.tableData.objects[i].pricePlanSkuVOS.length; j++) {
              if (this.tableData.objects[i].pricePlanSkuVOS[j].updateTime) {
                 this.tableData.objects[i].pricePlanSkuVOS[j].updateTime = null;  // 更新时间置空
              }
              if (this.tableData.objects[i].pricePlanSkuVOS[j].createTime) {
                 this.tableData.objects[i].pricePlanSkuVOS[j].createTime = null;  // 新建时间置空
              }
              arr.push(this.tableData.objects[i].pricePlanSkuVOS[j]);
            }
          }
      }

      if ( !this.pricePlanName ) {
          this.$message.warning('计划名称不能为空');
      } else if (this.pricePlanName.length > 15) {
           this.$message.warning('计划名称长度不能超过15字');
      } else {
          if (pricePlanName === this.pricePlanName) {  // 编辑时名称不一样校验
                this.addOrUpdata(arr);
            } else {
                this.GET('/busiPricePlan/verifyPricePlanName/' + this.pricePlanName).then(res => {
                    this.addOrUpdata(arr);
                });
            }
      }
    },
    // 编辑或新增接口
    addOrUpdata(arr) {
      if (this.id === 'add') {
          let data = {
              busiPricePlan: {
                pricePlanName: this.pricePlanName,
                pricePlanType: 0
              },
              busiPricePlanSkusList: arr
          };
          this.POST('/busiPricePlan/insertPricePlan', data).then(res => {
              this.$message.success('新增计划成功!');
              setTimeout(() => {
                this.$router.push({path: '/planandstragy'});
              }, 1000);
          });
      } else {
        let data = {
              busiPricePlan: {
                pricePlanName: this.pricePlanName,
                pricePlanType: 0,
                id: this.id
              },
              busiPricePlanSkusList: arr
          };
        this.POST('/busiPricePlan/updatePricePlan', data).then(res => {
            this.$message.success('修改计划成功!');
            setTimeout(() => {
              this.$router.push({path: '/planandstragy'});
            }, 1000);
        });
      }
    },
    // 验证名字
    checkName() {
        this.GET('/busiPricePlan/verifyPricePlanName/' + this.pricePlanName).then(res => {
          console.log(res);
        });
    },
    // 查看表格每一行的明细
    checkRowDetail() {
      this.dialogTableVisible = true;
    },
    // 页码条数改变
    changeSize(val) {
        this.searchParams.pageSize = val;
        if ( this.id === 'add') {
            this.initDataList(this.searchParams);
        } else {
            this.editInitData(this.searchParams);
        }
    },
    // 当前页码改变
    changeNumber(val) {
        this.searchParams.pageNumber = val;
        if ( this.id === 'add') {
            this.initDataList(this.searchParams);
        } else {
            this.editInitData(this.searchParams);
        }
    },
    // 改变供应状态
    toggleSupplyStatus(index, row) {
      this.dialogData = row.pricePlanSkuVOS;
      this.dialogTableVisible = true;
    },
    // 取消
    goBack() {
      this.$router.go(-1);
    },
    // 确认校验格式
    confirm() {
       let num = -1; let index = '';
       let parent = document.getElementById('SKUDataTable');
       for (let i = 0; i < this.activeTableData.length; i++) {
           if (!this.discountChecked(this.activeTableData[i])) {
               num = i;
               index = 0;
               break;
           } else if (!this.increaseChecked(this.activeTableData[i])) {
               num = i;
               index = 1;
               break;
           } else if (!this.distributChecked(this.activeTableData[i])) {
               num = i;
               index = 2;
               break;
           }
       }

       if (num > -1) {
           let item = parent.getElementsByClassName('el-table__row')[num];
           let input = item.getElementsByTagName('input')[index];
           input.focus();
       } else {
           this.dialogTableVisible = false;
       }
    },
    // 关闭弹窗的事件 同时清空用户填的数据 防止被保存
    closeDialog() {
         this.$confirm('此操作将会清空你所输入的值，确定清空？', '提示 ', {
             type: 'warning'
         })
          .then(_ => {
            this.activeTableData.map((item, index) => {
                item.discountRate = '';
                item.priceIncreaseAmount = '';
                item.distributorPrice = '';
            });
          })
          .catch(_ => {});
    },
    // 折扣率校验
    discountChecked(obj) {
        let flag = false;
        let str = obj.discountRate + '';
        let reg = new RegExp(/^\d+(?=\.{0,1}\d+$|$)/); // 判断输入格式去可以去掉eE-+符号
        if ( str === '' || str === 'null') { // 空可以输入
            flag = true;
        }
        // console.log(reg.test(str), str);
        if ( !reg.test(str)) {
            if (!flag) {
                this.$message.warning('SKU为[' + obj.skuCode + ']的折扣率的格式输入不正确');
            }
        } else {
            if (str > 0) {
                if ( str.indexOf('.') > -1) {  // 判断是否有小数
                    let length = str.split('.')[1].length;
                    if (length <= 4) {
                        flag = true;
                    } else {
                        this.$message.warning('SKU为[' + obj.skuCode + ']的折扣率最多只能保留4位小数');
                    }
                } else {
                    flag = true;
                }
            } else {
                this.$message.warning('SKU为[' + obj.skuCode + ']的折扣率不能小于或等于0');
            }
        }
        return flag;
    },
    // 加价金额的校验
    increaseChecked(obj) {
        let flag = false;
        let str = obj.priceIncreaseAmount + '';
        let reg = /^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/; // 判断0小数负数和正数
        if ( reg.test(str)) {
            if ( str.indexOf('.') > -1) {
                 let length = str.split('.')[1].length;
                if (length <= 2) {
                    flag = true;
                } else {
                    this.$message.warning('SKU为[' + obj.skuCode + ']的加价金额最多只能保留2位小数');
                }
            } else {
                flag = true;
            }
        } else {
            if (str === '' || str === 'null' || str.indexOf('.') > -1) {
                flag = true;
            } else {
                this.$message.warning('SKU为[' + obj.skuCode + ']的加价金额格式输入不正确');
            }
        }
        return flag;
    },
    // 分销价的校验
    distributChecked(obj) {
        let flag = false;
        let str = obj.distributorPrice + '';  // 将数据转化为字符串
        let reg = new RegExp(/^\d+(?=\.{0,1}\d+$|$)/); // 判断输入格式去可以去掉eE-+符号

        if ( str === '' || str === 'null') { // 空可以输入
            flag = true;
        }

        if ( !reg.test(str)) {
            if (!flag) {
                this.$message.warning('SKU为[' + obj.skuCode + ']的分销价的格式输入不正确');
            }
        } else {
            if (str > 0) {
                if ( str.indexOf('.') > -1) {  // 判断是否有小数
                    let length = str.split('.')[1].length;
                    if (length <= 2) {
                        flag = true;
                    } else {
                        this.$message.warning('SKU为[' + obj.skuCode + ']的分销价最多只能保留2位小数');
                    }
                } else {
                    flag = true;
                }
            } else {
                this.$message.warning('SKU为[' + obj.skuCode + ']的分销价不能小于或等于0');
            }
        }
        return flag;
    }

  },
  mounted: function() {
    this.initShopList({level: '1'}).then(res => {
      this.firstCateList = res.body;
    });

    if (this.id === 'add') {  // 新增
       this.initDataList(this.searchParams);
    } else {
       this.searchParams.planId = this.id;
       this.editInitData(this.searchParams);
    }
  }
};
</script>

<style lang="stylus" scoped>
.planaddoredit
  font-size: 12px
  .box-card
    margin-bottom: 15px
  .info
    p
      line-height: 26px
      .title
        font-weight: 700
  .btn
    text-align: center
    line-height: 60px
    background-color: rgb(242, 242, 242)
  .paging
    text-align: right
    margin-top: 15px
    margin-bottom: 15px
  .name
    font-weight: 700
    line-height: 40px
    padding-left: 20px
    background-color: rgb(242, 242, 242)
  .main_images
    margin-top: 30px
    margin-bottom: 15px
    .title
      text-align: right
      line-height: 40px
      font-weight: 500
  .planReditTable
    font-size 12px
    .thead
       background-color #f5f7fa
    ul
      display flex
      text-align center
      li
        width 10%
        height 40px
        line-height 40px
      li:nth-child(4)
        width 30%
      li:nth-child(5)
        width 20%
      li:nth-child(6)
        width 20%
</style>
<style scoped>
    .el-radio{
        cursor: auto;
    }
</style>

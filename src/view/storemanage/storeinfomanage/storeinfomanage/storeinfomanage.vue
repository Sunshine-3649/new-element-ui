<template>
  <div class="storeinfomanage">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="仓库名称：" size="mini">
            <el-input v-model.trim="searchParams.name" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="仓库状态：" size="mini">
            <el-select v-model="searchParams.isValid" filterable placeholder="请选择">
              <el-option v-for="item in storeTypeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="运营性质-运营类型：" size="mini">
            <el-select v-model="searchParams.operationalNature" filterable placeholder="请选择" style="width: 40%">
              <el-option v-for="item in operationalNatureList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <el-select v-show="searchParams.operationalNature === '1'" v-model="searchParams.operationalType" filterable placeholder="请选择" style="width: 40%">
              <el-option v-for="item in operationalTypeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="searchFormData">查询</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 分页 -->
    <el-row type="flex" justify="space-between">
      <el-col>
        <el-button type="primary" size="mini" @click="toAddOrEdit('add')"> + 新增仓库</el-button>
      </el-col>
      <el-row class="paging">
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-row>
    </el-row>
    <!-- 表格tableData -->
    <el-table ref="multipleTable" :data="tableDataList" highlight-current-row border tooltip-effect="dark">
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="仓库编号" prop="code" align="center"></el-table-column>
      <el-table-column label="仓库名称" prop="warehouseName" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div style="white-space: pre">{{scope.row.warehouseName}}</div>
        </template>
      </el-table-column>
      <el-table-column label="仓库类型" prop="warehouseTypeCode" align="center">
        <template slot-scope="scope">
          {{checkedType('warehouseType', scope.row.warehouseTypeCode)}}
        </template>
      </el-table-column>
      <el-table-column label="运营性质-运营类型" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{checkedOperationalType(scope.row.operationalType, scope.row.operationalNature)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="SKU数量" prop="skuNum" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="货主仓库状态" prop="ownerWarehouseState" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.operationalNature === '1'">通知成功</div>
          <div v-else>{{scope.row.ownerWarehouseState}}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="isValid" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.isValid === '1'">启用</div>
          <div v-else-if="scope.row.isValid === '0'" style="color: orange;">停用</div>
        </template>
      </el-table-column>
      <el-table-column label="是否接受退货" prop="isSupportReturn" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.isSupportReturn === 1">是</div>
          <div v-else-if="scope.row.isSupportReturn === 0" >否</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createOperator" align="center"></el-table-column>
      <el-table-column label="最近更新时间" prop="updateTime" align="center"></el-table-column>
      <el-table-column label="货主管理" prop="operationalNature" align="center">
        <template slot-scope="scope">
          <div class="btn" v-if="scope.row.operationalNature === '0'" @click="toOwnermanage(scope.row)">货主管理</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="商品管理" prop="submitTime" align="center">
        <template slot-scope="scope">
          <div class="btn" @click="toCommonmanage(scope.row)">商品管理</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="toAddOrEdit(scope.row.id)">编辑</el-button>
          <el-button type="text" size="mini" @click="toggleIsValid(scope.row.id, scope.row.isValid)">{{ scope.row.isValid === '1' ? '停用' : '启用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'storeinfomanage',
  data() {
    return {
      tableDataList: [], // 列表
      searchParams: {
        name: '', // 仓库名称
        isValid: '', // 仓库状态
        operationalNature: '', // 运营性质-运营类型
        operationalType: '', // 运营性质-运营类型
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }, // 请求参数
      totalCount: 0, // 总页码
      storeTypeList: [
        {
          id: '',
          name: '全部'
        },
        {
          id: '1',
          name: '启用'
        },
        {
          id: '0',
          name: '停用'
        }
      ],
      operationalNatureList: [
        {
          id: '',
          name: '全部'
        },
        {
          id: '0',
          name: '第三方仓库'
        },
        {
          id: '1',
          name: '自营仓库'
        }
      ],
      operationalTypeList: [
        {
          id: '',
          name: '全部'
        },
        {
          id: '0',
          name: '纯仓库'
        },
        {
          id: '1',
          name: '门店仓（普通门店）'
        },
        {
          id: '2',
          name: '门店仓（无人门店）'
        }
      ]
    };
  },
  created() {
    this.initDataList();
  },
  methods: {
    // 获取审核列表数据
    initDataList() {
      if (this.searchParams.operationalNature === '0') {
        this.searchParams.operationalType = '';
      }
      this.$AXIOS.LISTGET('/system/warehousePage', this.searchParams).then(res => {
        this.tableDataList = res.result;
        this.totalCount = res.totalCount;
        if (this.tableDataList && this.tableDataList.length) {
          setTimeout(() => {
            this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
          }, 20);
        }
      });
    },
    // 切换状态btn
    updateState(id, isValid) {
      this.$AXIOS.PUT('/system/warehouse/updateState/' + id, {isValid}, true).then(res => {
        if (res.appcode === '1') {
          this.initDataList();
          this.$utils.messagetip.successTip(res.databuffer);
        }
      });
    },
    toggleIsValid(id, isValid) {
      let isResult = '';
      if (isValid === '1') {
        isResult = '停用';
      } else {
        isResult = '启用';
      }
      this.$confirm(`您确认要${isResult}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateState(id, isValid);
        }).catch(() => {
          this.$utils.messagetip.infoTip('已取消');
        });
    },
    // 筛选条件
    searchFormData() {
      this.searchParams.pageSize = 10;
      this.searchParams.pageNo = 1;
      this.searchParams.start = 0;
      this.initDataList();
    },
    // 重置搜索条件
    resetForm() {
      this.searchParams = {
        name: '', // 仓库名称
        isValid: '', // 仓库状态
        operationalNature: '', // 运营性质-运营类型
        operationalType: '', // 运营性质-运营类型
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1 // 默认第一页
      }; // 请求参数
      this.initDataList();
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.start = 0;
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = val;
      this.initDataList();
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.start = (val - 1) * this.searchParams.pageSize;
      this.searchParams.pageNo = val;
      this.initDataList();
    },
    // 字典翻译仓库
    checkedType(type, val) {
      return this.$utils.querydiction(type, val);
    },
    // 运营性质-运营类型翻译
    checkedOperationalType(type, nuture) {
      let typeStr = '';
      let nutureStr = '';
      if (nuture === '0') {
          nutureStr = '第三方仓库';
      } else if (nuture === '1') {
          nutureStr = '自营仓库';
      }

      if (type === '0') {
          typeStr = '-纯仓库';
      } else if (type === '1') {
          typeStr = '-门店仓(普通门店)';
      } else if (type === '2') {
          typeStr = '-门店仓(无人店)';
      }
      return nutureStr + typeStr;
    },
    toOwnermanage(row) {
    window.sessionStorage.owner_data = JSON.stringify(row);
      this.$router.push({path: '/storeinfomanage/ownermanage', query: row});
    },
    toCommonmanage(row) {
      window.sessionStorage.common_data = JSON.stringify(row);
      this.$router.push({path: '/storeinfomanage/commonmanaged', query: row});
    },
    // 跳转到新增或编辑仓库页面
    toAddOrEdit(val) {
      if (val === 'add') {
        this.$router.push({path: '/storeinfomanage/storeinfoaddoredit/' + val, query: {isadd: 1}});
      } else {
        this.$router.push({path: '/storeinfomanage/storeinfoaddoredit/' + val, query: {isadd: 0}});
      }
    },
    // 跳转审核页面
    toPurchaseDetail(id, flag, status) {
      this.$router.push(
        {
          path: '/purchaseorderaudit/purchaseauditdetail/' + id,
          query: {
            flag,
            isAuditStatus: status
          }
        }
      );
    }
  }
};
</script>
<style lang="stylus" scoped>
.storeinfomanage
  .tab_group
    margin-top: 15px
  .demo-table-expand
    font-size: 0
  .demo-table-expand label
    width: 90px
    color: #99a9bf
  .demo-table-expand .el-form-item
    padding-left: 55px
    box-sizing: border-box
    margin-right: 0
    margin-bottom: 0
    width: 50%
  .btn
    cursor pointer
    color blue
  .paging
    text-align: right
    margin-top: 15px
</style>

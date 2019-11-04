<template>
  <div class="inventoryreport">
    <!-- 特殊查询入库 -->
    <div class="group_btn">
      <span class="btn" @click="toSpecWarehouSereport">特殊查询>></span>
    </div>
    <div class="fixtab">
      <div class="fixbtn">
        <span style="line-height: 28px">年份：</span>
        <el-select v-model="value" placeholder="请选择" size="mini" @change='selectChange'>
          <el-option v-for="item in yearList" :key="item.id" :label="item.id" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="全部" name="0"></el-tab-pane>
        <el-tab-pane label="第一季度" name="1"></el-tab-pane>
        <el-tab-pane label="第二季度" name="2"></el-tab-pane>
        <el-tab-pane label="第三季度" name="3"></el-tab-pane>
        <el-tab-pane label="第四季度" name="4"></el-tab-pane>
      </el-tabs>
    </div>

    <ul class="list" v-if="tableDataList && tableDataList.length > 0 && tableDataList.length <= 12">
      <li class="item" v-for="(item, i) in tableDataList" :key="i">
        <div class="left">
          <span>●&nbsp;</span>{{item.id}}月</div>
        <div class="right" v-if="item.warehouseList && item.warehouseList.length">
          <span class="tag btn text_hide" v-for="(subItem, j) in item.warehouseList" :key="j" @click="toSpecialQuery(item.id, subItem)">
            <el-tooltip v-if="subItem.warehouseName.length > 13" class="item" effect="dark" :content="subItem.warehouseName" placement="top">
              <span>{{subItem.warehouseName}}</span>
            </el-tooltip>
            <span v-else>{{subItem.warehouseName}}</span>
          </span>
        </div>
        <div class="right" v-else-if="item.current">
          <span class="tag isRed">生成中...</span>
        </div>
        <div class="right" v-else-if="!item.current">
          <span class="tag">暂无数据...</span>
        </div>
      </li>
    </ul>
    <div v-else>暂无数据</div>
  </div>
</template>
<script>
export default {
  name: 'inventoryreport',
  data() {
    return {
      value: '', // 选中的年份
      quarterList1: [], // 第一季度
      quarterList2: [], // 第二季度
      quarterList3: [], // 第三季度
      quarterList4: [], // 第四季度
      yearList: [], // 年份下拉列表
      activeName: '', // 切换的tab
      result: [], // 返回的数据
      tableDataList: []
    };
  },
  created() {
    this.value = new Date().getFullYear();
    this.getInitDataList();
    this.getList();
  },
  methods: {
    getInitDataList() {
      this.result = [];
      this.$AXIOS.LISTGET('/report/pageList/' + this.value).then(res => {
        let result = res.result;
        result.forEach((item, i) => {
          let currIndex = i + 1 < 10 ? '0' + (i + 1) : i + 1;
          let obj = { id: currIndex, warehouseList: item };
          this.result.push(obj);
        });
        if (this.result.length < 12) {
          let currIndex = this.result.length + 1;
          currIndex = currIndex < 10 ? '0' + currIndex : currIndex;
          let obj = { id: currIndex, current: 1 };
          this.result.push(obj);
        }
        this.quarterList1 = this.result.splice(0, 3);
        this.quarterList2 = this.result.splice(0, 3);
        this.quarterList3 = this.result.splice(0, 3);
        this.quarterList4 = this.result.splice(0, 3);
        this.tableDataList = [...this.quarterList1, ...this.quarterList2, ...this.quarterList3, ...this.quarterList4];
        this.tableDataList.reverse();
        // console.log(this.result);
        // console.log(this.quarterList1);
        // console.log(this.quarterList2);
        // console.log(this.quarterList3);
        // console.log(this.quarterList4);
        // console.log(this.result);
      });
    },
    getList() {
      let curYear = new Date().getFullYear();
      for (let i = 2018; i <= curYear; i++) {
        let obj = { id: i };
        this.yearList.push(obj);
      }
    },
    handleClick(tab, event) {
      if (this.activeName === '1') {
        this.tableDataList = [...this.quarterList1];
      } else if (this.activeName === '2') {
        this.tableDataList = [...this.quarterList2];
      } else if (this.activeName === '3') {
        this.tableDataList = [...this.quarterList3];
      } else if (this.activeName === '4') {
        this.tableDataList = [...this.quarterList4];
      } else {
        this.tableDataList = [...this.quarterList1, ...this.quarterList2, ...this.quarterList3, ...this.quarterList4];
      }
      this.tableDataList.reverse();
    },
    // 跳转特殊查询
    toSpecWarehouSereport() {
      this.$router.push({ path: '/inventoryreport/specwarehousereport', query: {isadd: 1} });
    },
    // 跳转具体仓库查询
    toSpecialQuery(month, warehouseObj) {
      this.$router.push({
        name: 'specialquery',
        params: {
          year: this.value,
          month,
          warehouseName: warehouseObj.warehouseName,
          warehouseCode: warehouseObj.warehouseCode
        }
      });
    },
    selectChange(val) {
      if (val) {
        this.getInitDataList();
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.inventoryreport
  .group_btn
    text-align: right
    line-height: 30px
  .fixtab
    position: relative
    left: 0
    top: 0
  .fixbtn
    z-index: 100
    position: absolute
    right: 0
    top: 0
  .isRed
    color: red
  .btn
    cursor: pointer
    color: blue
  .list
    .item
      margin-top: 15px
      .left, .right
        display: inline-block
        vertical-align: top
      .left
        width: 4%
        text-align: center
        padding: 15px 0
      .right
        width: 95%
        padding: 0 20px 15px 20px
        border: solid 1px #000
      .tag
        width 195px
        display: inline-block
        padding-right: 5px
        text-align: center
        margin-top: 15px
        border-right: solid 1px #000
        box-sizing: border-box
        &:last-child
          border: none
</style>

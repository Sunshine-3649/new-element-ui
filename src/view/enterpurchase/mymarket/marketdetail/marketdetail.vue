<template>
  <div class="marketdetail">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="dialogTableVisible = true">操作日志</el-button>
      </div>
      <section class="info">
        <p>
          <span class="title">商品类目：</span>
          <span class="desc">美妆个护 > 面部护肤 > 面膜</span>
        </p>
        <p>
          <span class="title">商品名称：</span>
          <span class="desc"></span>
        </p>
        <p>
          <span class="title">商品状态：</span>
          <span class="desc">690102</span>
        </p>
        <p>
          <span class="title">商品品牌：</span>
          <span class="desc">12345646</span>
        </p>
        <p>
          <span class="title">SPU编号：</span>
          <span class="desc">0.1kg</span>
        </p>
        <p>
          <span class="title">货号：</span>
          <span class="desc">5555555</span>
        </p>
        <p>
          <span class="title">商品重量：</span>
          <span class="desc">0.1kg</span>
        </p>
        <p>
          <span class="title">生产商</span>
          <span class="desc">华为科技有限公司</span>
        </p>
        <p>
          <span class="title">是否具有保质期管理：</span>
          <span class="desc">是</span>
        </p>
      </section>
    </el-card>
    <el-card class="box-card">
      <section class="info">
        <p>
          <span class="title">国产/进口：</span>
          <span class="desc">国产</span>
        </p>
        <p>
          <span class="title">品牌国：</span>
          <span class="desc">中国/港澳台</span>
        </p>
        <p>
          <span class="title">备注</span>
          <span class="desc">-</span>
        </p>
        <p>
          <span class="title">添加时间：</span>
          <span class="desc">2018-05-03 12:00:00</span>
        </p>
      </section>
    </el-card>
    <h3 class="name">销售属性信息</h3>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" align="center">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column prop="name" label="SKU名称" align="center"></el-table-column>
      <el-table-column prop="address" label="SKU编号" align="center"></el-table-column>
      <el-table-column prop="address" label="规格" align="center"></el-table-column>
      <el-table-column prop="address" label="商品条码" align="center"></el-table-column>
      <el-table-column prop="address" label="供应状态" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="toggleSupplyStatus(scope.$index, scope.row)">停止供应</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 主图 -->
    <el-row class="main_images">
      <el-col :span="2" class="title">
        主图：
      </el-col>
      <el-col :span="3" v-for="(o, index) in 2" :key="o" :offset="index > 0 ? 1 : 0" class="content">
        <el-card :body-style="{ padding: '0px' }">
          <img src="./logo.png" class="image">
        </el-card>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button type="primary">下载所有主图</el-button>
      </el-col>
    </el-row>
    <!-- 规格图 -->
    <el-row class="main_images">
      <el-col :span="2" class="title">
        规格图：
      </el-col>
      <el-col :span="3" v-for="(o, index) in 2" :key="o" :offset="index > 0 ? 1 : 0" class="content">
        <el-card :body-style="{ padding: '0px' }">
          <img src="./logo.png" class="image">
        </el-card>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button type="primary">下载所有规格图</el-button>
      </el-col>
    </el-row>
    <!-- 描述图 -->
    <el-row class="main_images">
      <el-col :span="2" class="title">
        描述图：
      </el-col>
      <el-col :span="8">
        <el-tabs v-model="port" type="card" @tab-click="togglePort">
          <el-tab-pane label="电脑端" name="first"></el-tab-pane>
          <el-tab-pane label="移动端" name="second"></el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-row class="main_images">
      <el-col :span="2" class="title">
        &nbsp;
      </el-col>
      <el-col :span="3" v-for="(o, index) in 2" :key="o" :offset="index > 0 ? 1 : 0" class="content">
        <el-card :body-style="{ padding: '0px' }">
          <img src="./logo.png" class="image">
        </el-card>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button type="primary">下载所有描述图</el-button>
      </el-col>
    </el-row>
    <!-- 停止供应 -->
    <div class="btn">
      <el-button type="primary">停止供应</el-button>
    </div>
    <!-- 操作日志列表 -->
    <el-dialog title="操作日志" :visible.sync="dialogTableVisible">
      <el-table :data="tableData" border>
        <el-table-column label="序号" prop="date" width="150" align="center"></el-table-column>
        <el-table-column label="动作" prop="name" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="项目" prop="address" align="center"></el-table-column>
        <el-table-column label="操作时间" prop="address" align="center"></el-table-column>
        <el-table-column label="备注" prop="address" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'marketdetail',
  data() {
    return {
      port: 'first',
      dialogTableVisible: false, // 操作日志列表显示
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    };
  },
  methods: {
    // 改变供应状态
    toggleSupplyStatus() {},
    // 切换移动端和桌面端显示
    togglePort() {}
  }
};
</script>

<style lang="stylus" scoped>
.marketdetail
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
    .img_wrapper
      width: 100px
      height: 100px
      margin: 0 auto
      overflow: hidden
    .content
      margin-bottom 20px
</style>

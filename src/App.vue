<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
};
</script>

<style lang="stylus" >
#app
  min-width: 1690px
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: #606266
  font-size: 12px
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button
    -webkit-appearance: none !important;
  // .input_def
  //   .el-input--mini
  //     width 193px
  .cell
    line-height: 32px
  .el-table .cell
    line-height: 32px
  .el-table td, .el-table th
    padding: 1px
  .el-table th
    background: rgb(245, 247, 250)
    color: #606266
  .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell
    padding-left: 0px
    padding-right: 0
  .el-table-column--selection .cell
    padding-right: 0
  .tab_wapper .el-row
    padding: 0
  .el-col-6
    min-height: 47px
  .tip_red::before
    content: '*'
    padding-right: 5px
    color: #ff0000
  .text_hide
    overflow: hidden /* 自动隐藏文字 */
    text-overflow: ellipsis /* 文字隐藏后添加省略号 */
    white-space: nowrap /* 强制不换行 */
  .el-dialog
    width: 70%
  .area-selectable-list .area-select-option.selected
    color: #409EFF
  .area-select.medium
    min-width: 85px
    max-width: 130px
    width 44%
  .area-select span.area-selected-trigger
    padding: 0
    padding-left: 8px !important
  .area-select
    height auto
  .el-card
    overflow visible
</style>
<style>
/* .requreRed  thead tr th:nth-child(10) div::before {
  content: '*';
  padding-right: 5px;
  color: #ff0000;
} */
.requreRed  thead tr th:nth-child(1) div::before {
  content: '*';
  padding-right: 5px;
  color: #ff0000;
}
.requreRed  thead tr th:nth-child(11) div::before {
  content: '*';
  padding-right: 5px;
  color: #ff0000;
}

.minegood_add thead tr th:nth-child(3) div::before,
.minegood_add thead tr th:nth-child(4) div::before,
.minegood_add thead tr th:nth-child(5) div::before,
.minegood_add thead tr th:nth-child(6) div::before,
.minegood_add thead tr th:nth-child(7) div::before,
.minegood_add thead tr th:nth-child(2) div::before {
  content: '*';
  padding-right: 5px;
  color: #ff0000;
}
.minegood_redit thead tr th:nth-child(3) div::before,
.minegood_redit thead tr th:nth-child(4) div::before,
.minegood_redit thead tr th:nth-child(5) div::before,
.minegood_redit thead tr th:nth-child(6) div::before,
.minegood_redit thead tr th:nth-child(7) div::before,
.minegood_redit thead tr th:nth-child(8) div::before {
  content: '*';
  padding-right: 5px;
  color: #ff0000;
}

 .place input::-webkit-input-placeholder {
    /* placeholder颜色  */
    color: red;
    /* placeholder字体大小  */
    font-size: 18px;
    /* placeholder位置  */
    text-align: center;
}
.requreRed  .el-radio__label{
    display: none
}
.el-tabs__nav div:first-child span{
    display: none;
}
.el-tabs__item{
    height:35px!important;
    line-height: 35px!important;
}
</style>


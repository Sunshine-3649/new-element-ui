<template>
  <div class="propaddoredit">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>基本信息</span>
        <el-button
          v-if="id && id !== 'add'"
          style="float: right; padding: 3px 0"
          type="text"
          @click="openOperateDialog"
        >操作日志</el-button>
      </div>
      <el-form
        :model="form"
        label-width="125px"
        class="search_form"
        size="mini"
      >
        <!-- 第一行 -->
        <el-row :span="24">
          <el-col :span="7">
            <el-form-item
              label="属性名称："
              :rules="[{ required: true, message: '属性名称不能为空', trigger: 'blur' }]"
              size="mini"
            >
              <el-input
                v-model.trim="form.name"
                placeholder="不超过10个字符"
                maxlength="10"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label="排序："
              :rules="[{ required: true, message: '排序不能为空', trigger: 'blur' }]"
              type="number"
              size="mini"
            >
              <el-input
                v-model.trim="form.sort"
                placeholder=""
                maxlength="4"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row :span="24">
          <el-col :span="14">
            <el-form-item
              label="属性描述："
              size="mini"
            >
              <el-input
                v-model.trim="form.description"
                placeholder="不超过20个字符"
                maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="属性类型："
              :rules="[{ required: true, message: '属性类型不能为空', trigger: 'blur' }]"
              size="mini"
            >
              <el-select
                v-model="form.typeCode"
                filterable
                placeholder="请选择"
                :disabled="id>0"
              >
                <el-option
                  v-for="item in typeCodeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="20">
          <el-col :span="10">
            <el-form-item
              label="属性值类型："
              size="mini"
            >
              <el-radio-group
                @change="propChange"
                v-model="form.valueType"
                :disabled="id>0"
              >
                <el-radio label="0">文字</el-radio>
                <el-radio label="1">图片</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-loading='isLoadeding'>
          <el-row :span="20">
            <el-col :span="14">
              <el-form-item
                label="属性值："
                :rules="[{ required: true}]"
                size="mini"
              >
                <el-table
                  ref="multipleTable"
                  :data="tableDataList.slice((searchParams.pageNo-1)*searchParams.pageSize,searchParams.pageNo*searchParams.pageSize)"
                  highlight-current-row
                  border
                  tooltip-effect="dark"
                >
                  <el-table-column
                    type="index"
                    label="序号"
                    width="55"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    label="属性值名称"
                    prop="name"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-input
                        v-model.trim="scope.row.value"
                        placeholder=""
                        :disabled="scope.row.id>0"
                        maxlength="30"
                        @change="checkValueName(scope.row.value)"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="form.valueType=='1'"
                    label="属性图片"
                    prop="name"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-upload
                        v-if="scope.row.picture==''"
                        class="upload-demo"
                        name="Filedata"
                        :ref="'upload'+scope.$index"
                        :action="uploadUrl"
                        :before-upload='beforeUpload'
                        :on-preview='onPreview'
                        :on-success="uploadSuccess"
                        list-type="text"
                      >
                        <el-button
                          @click="uploadCurrent(scope.$index)"
                          size="mini"
                          type="text"
                        >点击上传</el-button>
                      </el-upload>
                      <ul v-if="scope.row.picUrl">
                        <li>
                          <img
                            style="width:50px; padding:5px 10px 5px 0;"
                            @click="handlePreview(scope.row.picUrl)"
                            :src="scope.row.picUrl"
                          />
                          <el-button
                            @click="deleteCurrentImg(scope.$index, scope.row)"
                            size="mini"
                            type="text"
                          >删除</el-button>
                        </li>
                      </ul>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        @click="moveUpPropValue(scope.row,scope.$index)"
                        size="mini"
                      >上移</el-button>
                      <el-button
                        type="text"
                        @click="moveDownPropValue(scope.row,scope.$index)"
                        size="mini"
                      >下移</el-button>
                      <el-button
                        type="text"
                        @click="delPropValue(scope.row,scope.$index)"
                        size="mini"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label-width="5px"
                label=""
                size="mini"
              >
                <el-button
                  type="primary"
                  size="mini"
                  @click="toAddOrEdit(null)"
                > + 添加属性值</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 分页 -->
          <el-row
            :span="14"
            v-if="tableDataList.length>searchParams.pageSize"
            justify="space-between"
          >
            <el-col :span="6">
            </el-col>
            <el-col :span="10">
              <el-row class="paging">
                <el-pagination
                  @size-change="changeSize"
                  @current-change="changeNumber"
                  :current-page="searchParams.pageNo"
                  :page-sizes="[5, 10, 20, 50, 100]"
                  :page-size="searchParams.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="searchParams.totalCount"
                >
                </el-pagination>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <el-row :span="20">
          <el-col :span="10">
            <el-form-item
              label="属性状态："
              size="mini"
            >
              <el-radio-group
                @change="propChangeStatus"
                v-model="form.isValid"
              >
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="20">
          <el-col :span="15">
            <el-form-item
              label=""
              size="mini"
            >
              <div style="text-align: center; margin-top:20px;">
                <el-button
                  size="mini"
                  @click="savePropAddOrEdit"
                  :loading="isLoading"
                  type="primary"
                >保存</el-button>
                <el-button
                  size="mini"
                  @click="back"
                  type=""
                >返回</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 查看上传图片弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="40%"
    >
      <img :src="dialogImg" />
    </el-dialog>
    <!-- 操作日志弹窗 -->
    <el-dialog
      title="操作日志"
      :visible.sync="isLogInfo"
      width="80%"
    >
      <el-table
        :data="logInfoList"
        style="width: 100%"
        border
        height="400"
      >
        <el-table-column
          prop="operation"
          label="动作"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="operator"
          label="操作人"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="operateTimeString"
          label="操作时间"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
        >
          <template slot-scope='scope'>
            <div v-html='scope.row.remark'></div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-col class='paging'>
        <el-pagination
          @size-change="logChangeSize"
          @current-change="logChangeNumber"
          :current-page="operateParams.pageNo"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="operateParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="logCount"
        >
        </el-pagination>
      </el-col>
      <div style="margin: 15px; text-align: center;">
        <el-button
          type="primary"
          size="mini"
          @click="isLogInfo = false"
        >关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'propaddoredit',
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入属性值'));
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass');
        }
        callback();
      }
    };
    return {
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        entityType: 'Property',
        entityId: ''
      }, // 日志
      logCount: 0, // 日志总条数
      logInfoList: [], // 日志列表
      isLogInfo: false, // 日志弹窗
      isLoadeding: false, // 上传按钮
      uploadUrl: '/scm-web/qinniu/upload/supply',
      uploadIndex: '',
      dialogVisible: false,
      dialogImg: '',
      searchParams: {
        start: 0, // 默认参数
        pageSize: 10, // 默认10条
        pageNo: 1, // 默认第一页
        totalCount: 0
      },
      form: {
        id: '',
        name: '',
        sort: '0',
        description: '',
        typeCode: '',
        valueType: '0',
        isValid: '1',
        gridValue: ''
      },
      rules: {
        propValue: [{ validator: validatePass, trigger: 'blur' }]
      },
      tableDataList: [],
      tempTableDataList: [],
      tableDelDataList: [],
      typeCodeList: this.$utils.querydiction('propertyType'),
      id: this.$route.params.id,
      errors: {},
      isLoading: false
    };
  },
  created() {
    this.initDataList();
  },
  watch: {},
  methods: {
    initDataList() {
      if (this.id !== 'add') {
        this.$AXIOS.LISTGET('/category/property/' + this.id).then(res => {
          this.form.id = res.result.id;
          this.form.name = res.result.name;
          this.form.sort = res.result.sort;
          this.form.description = res.result.description;
          this.form.typeCode = res.result.typeCode;
          this.form.valueType = res.result.valueType;
          this.form.isValid = res.result.isValid;
          // this.getBatchUrl();
        });
        this.$AXIOS
          .LISTGET('/category/propertyValues/search?propertyId=' + this.id)
          .then(res => {
            this.tableDataList = res.result;
            this.searchParams.totalCount = this.tableDataList.length;
            this.tableDataList.map((item, index) => {
              if (!item.status) {
                item.status = 0;
                item.sort = index;
                item.source = 0;
                item.sortStatus = 0;
              }
            });
            this.getBatchUrl();
          });
        this.operateParams.entityId = this.id;
      }
    },
    openOperateDialog() {
      this.getLogInfo();
      this.isLogInfo = true;
    },
    // 获取日志信息
    getLogInfo() {
      this.$AXIOS.LISTGET('/logInfoPage', this.operateParams).then(res => {
        this.logInfoList = res.result;
        this.logCount = res.totalCount;
      });
    },
    // 页码条数改变
    logChangeSize(val) {
      this.operateParams.start = 0;
      this.operateParams.pageNo = 1;
      this.operateParams.pageSize = val;
      this.getLogInfo();
    },
    // 当前页码改变
    logChangeNumber(val) {
      this.operateParams.pageNo = val;
      this.operateParams.start = (val - 1) * this.operateParams.pageSize;
      this.getLogInfo();
    },
    propChange() {
      this.tableDataList = [];
    },
    propChangeStatus() {},
    changeSize(val) {
      this.searchParams.start = 0;
      this.searchParams.pageNo = 1;
      this.searchParams.pageSize = val;
    },
    changeNumber(val) {
      this.searchParams.start = (val - 1) * this.searchParams.pageSize;
      this.searchParams.pageNo = val;
    },
    toAddOrEdit() {
      this.tableDataList.unshift({
        value: '',
        sort: 0,
        status: 1,
        picture: '',
        picUrl: ''
      });
      this.searchParams.totalCount = this.tableDataList.length;
      this.changeNumber(1);
    },
    savePropAddOrEdit() {
      let isChecked = false;
      if (this.form.name === '') {
        this.$utils.messagetip.warningTip('属性名称不能为空');
        return;
      }
      let numReg = /^[0-9]+$/;
      if (this.form.sort === '') {
        this.$utils.messagetip.warningTip('排序值不能为空');
        return;
      }
      if (this.form.sort !== '' && !numReg.test(this.form.sort)) {
        this.$utils.messagetip.warningTip('排序值只能为0和正整数');
        return;
      }
      if (this.form.typeCode === '') {
        this.$utils.messagetip.warningTip('属性类型不能为空');
        return;
      }

      if (this.tableDataList.length < 1) {
        this.$utils.messagetip.warningTip('属性值不能为空，请添加属性值');
        return;
      }
      this.tableDataList.map((item, index) => {
        item.sort = index;
        if (this.form.valueType === '1' && item.picture === '') {
          isChecked = true;
          this.$utils.messagetip.warningTip('属性值名称' + item.value + '，未上传属性图片');
          return false;
        }
        if (this.form.valueType === '0' && item.value === '') {
          isChecked = true;
          this.$utils.messagetip.warningTip('属性值名称不能为空');
          return false;
        }
        if (!item.id) {
          let c = 0;
          this.tableDataList.forEach(subItem => {
            if (item.value === subItem.value) {
              c++;
            }
          });
          if (c > 1) {
            this.$utils.messagetip.warningTip('属性值名称' + item.value + '重复');
            isChecked = true;
            return false;
          }
        }
      });
      if (isChecked) return;
      this.form.gridValue = JSON.stringify(
        this.tableDataList.concat(this.tableDelDataList)
      );
      this.isLoading = true;
      if (this.id !== 'add') {
        this.$AXIOS
          .PUT('/category/property/' + this.id, this.form)
          .then(res => {
            this.$utils.messagetip.successTip(res.databuffer);
            setTimeout(() => {
              this.$router.push({ path: '/propmanage' });
            }, 20);
          }).finally(() => {
            this.isLoading = false;
          });
      } else {
        this.$AXIOS.POST('/category/property', this.form).then(res => {
          this.$utils.messagetip.successTip(res.databuffer);
          setTimeout(() => {
            this.$router.push({ path: '/propmanage' });
          }, 20);
        }).finally(() => {
          this.isLoading = false;
        });
      }
    },
    back() {
      this.$router.push({ path: '/propmanage' });
    },
    moveUpPropValue(dataRow, index) {
      let pageIndex = this.searchParams.pageSize * ( this.searchParams.pageNo - 1 ) + index;
      if (pageIndex === 0) {
        this.$utils.messagetip.infoTip('已经到顶了!');
      } else {
        this.tempTableDataList = [].concat(this.tableDataList);
        let temp = this.tempTableDataList[pageIndex - 1];
        this.tempTableDataList[pageIndex - 1] = this.tempTableDataList[pageIndex];
        this.tempTableDataList[pageIndex] = temp;
        this.tableDataList = [].concat(this.tempTableDataList);
        this.tempTableDataList = [];
      }
    },
    moveDownPropValue(dataRow, index) {
      let pageIndex = this.searchParams.pageSize * ( this.searchParams.pageNo - 1 ) + index;
      if (pageIndex === this.tableDataList.length - 1) {
        this.$utils.messagetip.infoTip('已经到底了!');
      } else {
        this.tempTableDataList = [].concat(this.tableDataList);
        let temp = this.tempTableDataList[pageIndex + 1];
        this.tempTableDataList[pageIndex + 1] = this.tempTableDataList[pageIndex];
        this.tempTableDataList[pageIndex] = temp;
        this.tableDataList = [].concat(this.tempTableDataList);
        this.tempTableDataList = [];
      }
    },
    delPropValue(dataRow, index) {
      this.$confirm(`您确认要删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let delIndex = this.searchParams.pageSize * ( this.searchParams.pageNo - 1 ) + index;
          this.tableDataList.splice(delIndex, 1);
          this.searchParams.totalCount = this.tableDataList.length;
          let pageNumber = Math.ceil(this.searchParams.totalCount / this.searchParams.pageSize);
          if (this.searchParams.totalCount % this.searchParams.pageSize === 0 && (this.searchParams.pageNo !== pageNumber)) {
            console.log('0000000');
            this.changeNumber(this.searchParams.pageNo - 1);
          }
          if (dataRow.id) {
            dataRow.status = 3;
            this.tableDelDataList.push(dataRow);
          }
        })
        .catch(() => {
          this.$utils.messagetip.infoTip('已取消!');
        });
    },
    getBatchUrl() {
      let filenameArray = [];
      let tempObj = {};
      this.tableDataList.map((item, index) => {
        if (item.picture) {
          filenameArray.push(item.picture);
          tempObj[item.picture] = index;
        }
      });
      if (filenameArray.length < 1) {
        return false;
      }
      let params = { thumbnail: '0', fileNames: filenameArray.join(',') };
      this.$AXIOS.LISTGET('/qinniu/urls', params).then(res => {
        res.result.forEach(item => {
          this.tableDataList[tempObj[item.fileKey]].picUrl = item.url;
        });
      });
    },
    uploadCurrent(index) {
      this.isLoadeding = false;
      this.uploadIndex =
        (this.searchParams.pageNo - 1) * this.searchParams.pageSize + index;
    },
    // 图片删除
    deleteCurrentImg(index, rowData) {
      rowData.picUrl = '';
      rowData.picture = '';
    },
    beforeUpload(file) {
      let fileFormat = file.type;
      if (
        fileFormat === 'image/png' ||
        fileFormat === 'image/jpg' ||
        fileFormat === 'image/jpeg' ||
        fileFormat === 'image/PBG' ||
        fileFormat === 'image/bmp'
      ) {
        if (file.size > 1024 * 1024 * 3) {
          this.$utils.messagetip.warningTip('文件大小不能大于3M');
          return false;
        }
        if (file.size <= 0) {
          this.$utils.messagetip.warningTip('文件大小不能等于0kb');
          return false;
        }
      } else {
        this.$utils.messagetip.warningTip('文件类型只能为.png,.jpg,.jpeg,.bmp');
        return false;
      }
      this.isLoadeding = true;
      console.log(this.isLoadeding);
    },
    onPreview() {
      this.isLoadeding = false;
      console.log(this.isLoadeding);
    },
    // 图片上传成功
    uploadSuccess(res, index) {
      this.tableDataList[this.uploadIndex].picture = res.key;
      this.tableDataList[this.uploadIndex].picUrl = res.url;
      this.isLoadeding = false;
      console.log(this.isLoadeding);
    },
    handlePreview(file) {
      // 点击查看上传的图片
      this.dialogVisible = true;
      this.dialogImg = file;
    },
    checkValueName(val) {
      let count = 0;
      this.tableDataList.map((item, index) => {
        if (item.value === val) {
          count++;
        }
      });
      if (count > 1) {
        this.$utils.messagetip.warningTip('属性名称' + val + '重复');
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.propaddoredit
  .title
    padding: 10px
    background-color: #f5f7fa
  .paging
    margin-top: 15px
    text-align: right
</style>

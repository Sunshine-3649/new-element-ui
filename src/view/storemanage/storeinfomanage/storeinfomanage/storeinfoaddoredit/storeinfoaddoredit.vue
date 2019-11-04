<template>
  <div class="storeinfoaddoredit">
    <!-- 表单 -->
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>基本信息</span>
        <el-button v-if="id && id !== 'add'" style="float: right; padding: 3px 0" type="text" @click="openOperateDialog">操作日志</el-button>
      </div>
      <el-form
        :model="searchParams"
        :rules="rules"
        ref="searchParams"
        label-width="125px"
        class="search_form"
        size="medium"
      >
        <!-- 第一行 -->
        <el-row :span="22" v-if="this.$route.params.id !== 'add'">
          <el-col :span="7">
            <el-form-item
              label="仓库编号："
              prop="code"
              size="mini"
            >
              <el-input
                v-model.trim="searchParams.code"
                maxlength="100"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第一行 -->
        <el-row :span="22">
          <el-col :span="7">
            <el-form-item
              label="仓库名称："
              prop="warehouseName"
              size="mini"
            >
              <el-input
                v-model.trim="searchParams.warehouseName"
                maxlength="32"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="22">
          <el-col :span="7">
            <el-form-item
              prop="senderProvince"
              label="所在地："
              size="mini"
            >
            <el-cascader
                :options="cityOptions"
                v-model="selected"
                filterable
                separator="-"
                placeholder="请选择省,市,区"
                @change="handleCityChange">
            </el-cascader>
              <!-- senderProvince, senderCity -->
              <!-- <area-select
                v-model="selected"
                :level='2'
                :data="pcaa"
              ></area-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label="详细地址："
              prop="address"
              size="mini"
            >
              <el-input
                v-model.trim="searchParams.address"
                maxlength="128"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="22">
          <el-col :span="7">
            <el-form-item
              label="仓库联系人："
              prop="warehouseContact"
              size="mini"
            >
              <el-input
                v-model.trim="searchParams.warehouseContact"
                maxlength="30"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label="仓库联系方式："
              prop="warehouseContactNumber"
              size="mini"
            >
              <el-input
                v-model.trim="searchParams.warehouseContactNumber"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="22">
          <el-col :span="7">
            <el-form-item
              label="运单发件人手机号："
              prop="senderPhoneNumber"
              size="mini"
            >
              <el-input
                v-model.trim="searchParams.senderPhoneNumber"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <span style="color: #cccccc;line-height: 28px;">&nbsp;&nbsp;&nbsp;说明：指物流运单上的发件人移动电话</span>
          </el-col>
        </el-row>
        <el-row :span="22">
          <el-col :span="7">
            <el-form-item
              label="仓库类型："
              prop="warehouseTypeCode"
              size="mini"
            >
              <el-select
                v-model="searchParams.warehouseTypeCode"
                filterable
                @change="warehouseChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in transportFeeDestIdList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label="仓库等级："
              prop="warehouseGrade"
              size="mini"
            >
              <el-select
                v-model="searchParams.warehouseGrade"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in warehouseGradeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label="是否支持清关："
              prop="isCustomsClearance"
              size="mini"
              v-if="searchParams.warehouseTypeCode === 'bondedWarehouse'"
            >
              <el-select
                v-model="searchParams.isCustomsClearance"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in isCustomsClearanceList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第四行 -->
        <el-row :span="22">
          <el-col :span="7">
            <el-form-item
              label="运营性质："
              prop="operationalNature"
              size="mini"
            >
              <el-select
                v-model="searchParams.operationalNature"
                filterable
                placeholder="请选择"
                :disabled="this.$route.params.id !== 'add'"
              >
                <el-option
                  v-for="item in operationalNatureList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              label="运营类型："
              prop="operationalType"
              size="mini"
            >
              <el-select
                v-model="searchParams.operationalType"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in operationalTypeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" v-if="searchParams.operationalType === '1' || searchParams.operationalType === '2'">
            <el-form-item
              label="门店仓对应销售渠道："
              prop="storeCorrespondChannel"
              size="mini"
            >
              <el-select
                v-model="searchParams.storeCorrespondChannel"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in storeCorrespondChannelList"
                  :key="item.sellCode"
                  :label="item.sellName"
                  :value="item.sellCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="22">
          <el-col :span="14">
            <el-form-item
              label="备注："
              prop="warehouseRemark"
              size="mini"
            >
              <el-input
                v-model.trim="searchParams.warehouseRemark"
                type="textarea"
                :rows="3"
                placeholder=""
                maxlength="512"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="22">
          <el-col :span="7">
            <el-form-item
              label="接收退货："
              prop="isSupportReturn"
              size="mini"
            >
              <el-radio-group v-model="searchParams.isSupportReturn">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="22">
          <el-col :span="7">
            <el-form-item
              label="状态："
              prop="isValid"
              size="mini"
            >
              <el-radio-group v-model="searchParams.isValid">
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="btn_group">
      <el-button
        size="mini"
        type="primary"
        @click="getWarehouseList"
        :disabled="isClick"
      >保存</el-button>
      <el-button
        size="mini"
        @click="back"
      >返回</el-button>
    </div>
     <!-- 操作日志弹窗 -->
    <el-dialog title="操作日志" :visible.sync="isLogInfo" width="80%">
      <el-table :data="logInfoList" style="width: 100%" border height="400">
        <el-table-column prop="operation" label="动作" align="center"></el-table-column>
        <el-table-column prop="operator" label="操作人" align="center"></el-table-column>
        <el-table-column prop="operateTimeString" label="操作时间" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center">
          <template slot-scope='scope'>
            <div v-html='scope.row.remark'></div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-col class='paging'>
        <el-pagination @size-change="logChangeSize" @current-change="logChangeNumber" :current-page="operateParams.pageNo" :page-sizes="[5, 10, 20, 50, 100]" :page-size="operateParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="logCount">
        </el-pagination>
      </el-col>
      <div style="margin: 15px; text-align: center;">
        <el-button type="primary" size="mini" @click="isLogInfo = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { pca, pcaa } from 'area-data'; // v5 or higher
import returnreceiptVue from '../../../../aftersalemanage/returnreceipt/returnreceipt.vue';
export default {
  name: 'storeinfoaddoredit',
  data() {
    return {
      isClick: false, // 保存按钮点击
      operateParams: {
        start: 0,
        pageNo: 1,
        pageSize: 10,
        entityType: 'WarehouseInfo',
        entityId: ''
      }, // 日志
      logCount: 0, // 日志总条数
      logInfoList: [], // 日志列表
      isLogInfo: false, // 日志弹窗
      id: '', // 主键
      selected: [],
      transportFeeDestIdList: [
        {
          name: '全部',
          value: ''
        },
        {
          name: '普通仓库',
          value: 'normalWarehouse'
        },
        {
          name: '门店仓',
          value: 'storeWarehouse'
        },
        {
          name: '保税仓',
          value: 'bondedWarehouse'
        },
        {
          name: '海外仓',
          value: 'overseaWarehouse'
        }
      ], // 仓库类型列表
      warehouseGradeList: [], // 仓库等级列表
      operationalNatureList: [
        {
          name: '请选择',
          value: ''
        },
        {
          name: '第三方仓库',
          value: '0'
        },
        {
          name: '自营仓库',
          value: '1'
        }
      ], // 运营性质列表
      operationalTypeList: [
        {
          name: '请选择',
          value: ''
        },
        {
          name: '纯仓库',
          value: '0'
        },
        {
          name: '门店仓(普通门店)',
          value: '1'
        },
        {
          name: '门店仓(无人店)',
          value: '2'
        }
      ], // 运营类型列表
      isCustomsClearanceList: [
        {
          name: '是',
          value: 1
        },
        {
          name: '否',
          value: 0
        }
      ], // 是否支持清关
      storeCorrespondChannelList: [], // 门店仓对应销售渠道列表
      searchParams: {
        code: '', // 仓库编号
        warehouseName: '', // 仓库名称
        address: '', // 详细地址
        warehouseContact: '', // 仓库联系人
        warehouseContactNumber: '', // 仓库联系方式
        senderPhoneNumber: '', // 运单发件人手机号
        warehouseTypeCode: '', // 仓库类型
        warehouseGrade: '', // 仓库等级
        operationalNature: '', // 运营性质
        operationalType: '', // 运营类型
        isCustomsClearance: '', // 是否支持清关
        isSupportReturn: 0, // 是否支持退货
        storeCorrespondChannel: '', // 门店仓对应销售渠道
        warehouseRemark: '', // 备注
        isValid: '1' // 启停用
      },
      rules: {
        warehouseName: [
          { required: true, message: '仓库名称不能为空！', trigger: 'blur' }
        ],
        senderProvince: [
          { required: true, message: '所在地不能为空！', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '详细地址不能为空！', trigger: 'blur' }
        ],
        warehouseContact: [
          { required: true, message: '仓库联系人不能为空！', trigger: 'blur' }
        ],
        warehouseContactNumber: [
          { required: true, message: '仓库联系方式不能为空！', trigger: 'blur' }
        ],
        warehouseTypeCode: [
          { required: true, message: '请选择仓库类型！', trigger: 'blur' }
        ],
        warehouseGrade: [
          { required: true, message: '请选择仓库等级！', trigger: 'blur' }
        ],
        operationalNature: [
          { required: true, message: '请选择运营性质！', trigger: 'blur' }
        ],
        operationalType: [
          { required: true, message: '请选择运营类型！', trigger: 'blur' }
        ],
        isCustomsClearance: [
          { required: true, message: '请选择是否支持清关！', trigger: 'blur' }
        ],
        isSupportReturn: [
          { required: true, message: '请选择接收退货！', trigger: 'blur' }
        ],
        storeCorrespondChannel: [
          { required: true, message: '请选择门店仓对应销售渠道！', trigger: 'blur' }
        ],
        isValid: [{ required: true, message: '请选择状态！', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.warehouseGradeList = this.$utils.querydiction('warehouseGrade');
    console.log(this.$utils.querydiction('warehouseGrade'));
    // 初始化城市列表
    let citys = window.localStorage.city ? JSON.parse(window.localStorage.city) : '';
    this.cityOptions = citys.map(item => {
        return {
            label: item.text,
            value: item.id,
            children: item.children
            ? item.children.map((item1, index1, now1) => {
                    return {
                        label: item1.text,
                        value: item1.id,
                        children: item1.children
                        ? item1.children.map((item2, index2, now2) => {
                                return {
                                    label: item2.text,
                                    value: item2.id
                                };
                            })
                        : ''
                    };
                })
            : ''
        };
    });
    //  this.cityOptions.unshift({
    //     label: '省份',
    //     value: '',
    //     children: [{
    //         label: '城市',
    //         value: '',
    //         children: [{
    //             label: '地区',
    //             value: ''
    //         }]
    //     }]
    // });
    this.getStoreCorrespondChannelList(); // 获取销售渠道
  },
  filters: {
    tofixed(val) {
      let num = val.toString();
      if (num.indexOf('.') > -1 && num.split('.')[1].length > 4) {
        num = Number(num).toFixed(4);
        return num;
      }
      return num;
    }
  },
  methods: {
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
    // 查询仓库
    getWarehouseList() {
      if (this.selected && this.selected.length) {
        this.searchParams.province = this.selected[0];
        this.searchParams.city = this.selected[1];
        this.searchParams.area = this.selected[2];
      }
      if (!this.searchParams.warehouseName) {
        this.$utils.messagetip.warningTip('仓库名称不能为空！');
        return;
      }
      if (this.selected && !this.selected.length) {
        this.$utils.messagetip.warningTip('所在地不能为空！');
        return;
      }
      if (!this.searchParams.address) {
        this.$utils.messagetip.warningTip('详细地址不能为空！');
        return;
      }
      if (!this.searchParams.warehouseContact) {
        this.$utils.messagetip.warningTip('仓库联系人不能为空！');
        return;
      }
      if (!this.searchParams.warehouseContactNumber) {
        this.$utils.messagetip.warningTip('仓库联系方式不能为空！');
        return;
      }
      let numReg = /^[0-9]+$/;
      let typeReg = /^(0\d{2,3}-?\d{7,8}$)|((((1[0-9][0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$)/;
      if (!typeReg.test(this.searchParams.warehouseContactNumber)) {
        this.$utils.messagetip.warningTip('仓库联系方式格式不正确！');
        return;
      }
      if (this.searchParams.senderPhoneNumber) {
        if (!typeReg.test(this.searchParams.senderPhoneNumber)) {
          this.$utils.messagetip.warningTip('运单发件人手机号格式不正确！');
          return;
        }
      }
      if (!this.searchParams.warehouseTypeCode) {
        this.$utils.messagetip.warningTip('请选择仓库类型！');
        return;
      }
      if (!this.searchParams.warehouseGrade) {
        this.$utils.messagetip.warningTip('请选择仓库等级！');
        return;
      }
      if (!this.searchParams.operationalNature) {
        this.$utils.messagetip.warningTip('请选择运营性质！');
        return;
      }
      if (!this.searchParams.operationalType) {
        this.$utils.messagetip.warningTip('请选择运营类型！');
        return;
      }
      if (this.searchParams.warehouseTypeCode === 'bondedWarehouse') {
        if (this.searchParams.isCustomsClearance === '' || this.searchParams.isCustomsClearance === null) {
          this.$utils.messagetip.warningTip('请选择是否支持清关！');
          return;
        }
      }
      // if (this.searchParams.operationalNature === '1') {
        if (this.searchParams.isSupportReturn === '' || this.searchParams.isSupportReturn === null) {
          this.$utils.messagetip.warningTip('请选择接收退货！');
          return;
      }
      // }

      if (this.searchParams.operationalType === '1' || this.searchParams.operationalType === '2') {
        if (!this.searchParams.storeCorrespondChannel) {
          this.$utils.messagetip.warningTip('请选择门店仓对应销售渠道！');
          return;
        }
      }

      if (this.searchParams.isValid === '' || this.searchParams.isValid === null) {
        this.$utils.messagetip.warningTip('请选择状态！');
        return;
      }
      this.isClick = true;
      this.$AXIOS.GET('/system/warehouse', {name: this.searchParams.warehouseName}).then(res => {
        if (this.searchParams.code) {
          this.updateSave();
        } else {
          this.save();
        }
      });
    },
    // 新增仓库保存
    save() {
      this.$AXIOS.POST('/system/warehouse', this.searchParams, true).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        this.$router.push({ path: '/storeinfomanage' });
      }).finally(() => {
        this.isClick = false;
      });
    },
    // 更新仓库
    updateSave() {
      this.$AXIOS.PUT('/system/warehouse/' + this.id, this.searchParams, true).then(res => {
        this.$utils.messagetip.successTip(res.databuffer);
        this.$router.push({ path: '/storeinfomanage' });
      }).finally(() => {
        this.isClick = false;
      });
    },
    // 销售渠道
    getStoreCorrespondChannelList() {
      this.$AXIOS.GET('/system/salesChannel').then(res => {
        this.storeCorrespondChannelList = res.result;
        if (this.$route.params.id !== 'add') {
          this.id = this.$route.params.id;
          this.getSearchParams();
          this.operateParams.entityId = this.id;
        }
      });
    },
    // 获取采购单信息
    getSearchParams() {
      this.$AXIOS.GET('/system/warehouse/' + this.id).then(res => {
        this.searchParams = res.result;
        // if (this.searchParams.purchaseGroupCode) {
        //   this.getPurchasePersonIdList(this.searchParams.purchaseGroupCode);
        // }
        // 判断当前销售渠道是否为门店
        let isTrue = false;
        this.storeCorrespondChannelList.forEach(item => {
          if (item.sellCode === this.searchParams.storeCorrespondChannel) {
            isTrue = true;
          }
        });
        if (!isTrue && this.searchParams.storeCorrespondChannel && this.searchParams.operationalType !== '0') {
          this.$utils.messagetip.warningTip('门店仓对应的销售渠道类型已更改，请重新选择');
          this.searchParams.storeCorrespondChannel = '';
        }
        if (this.searchParams.isSupportReturn !== 1) {
          this.searchParams.isSupportReturn = 0;
        }
        if (this.searchParams.warehouseTypeCode === 'storeWarehouse') {
          this.operationalNatureList = [
            {
              name: '请选择',
              value: ''
            },
            {
              name: '自营仓库',
              value: '1'
            }
          ];
          this.operationalTypeList = [
            {
              name: '请选择',
              value: ''
            },
            {
              name: '门店仓(普通门店)',
              value: '1'
            },
            {
              name: '门店仓(无人店)',
              value: '2'
            }
          ];
        } else {
          this.operationalNatureList = [
            {
              name: '请选择',
              value: ''
            },
            {
              name: '第三方仓库',
              value: '0'
            },
            {
              name: '自营仓库',
              value: '1'
            }
          ];
          this.operationalTypeList = [
            {
              name: '请选择',
              value: ''
            },
            {
              name: '纯仓库',
              value: '0'
            }
          ];
          this.searchParams.operationalType = '0';
        }
        if (this.searchParams.warehouseTypeCode !== 'storeWarehouse' && this.searchParams.operationalNature === '0') {
          this.transportFeeDestIdList = [
            {
              name: '全部',
              value: ''
            },
            {
              name: '普通仓库',
              value: 'normalWarehouse'
            },
            {
              name: '保税仓',
              value: 'bondedWarehouse'
            },
            {
              name: '海外仓',
              value: 'overseaWarehouse'
            }
          ];
        }
        // 城市列表
        if (this.searchParams.province) {
          this.selected = [
            this.searchParams.province,
            this.searchParams.city,
            this.searchParams.area
          ];
        }
      });
    },
    // 运营性质改变
    operationChange(val) {
      if (val === '1') {
        this.searchParams.isSupportReturn = 0;
      } else {
        this.searchParams.isSupportReturn = '';
      }
    },
    // 仓库类型更改
    warehouseChange(val) {
      if (this.$route.params.id === 'add') {
        this.searchParams.operationalNature = '';
      }
      if (val === 'storeWarehouse') {
        this.operationalTypeList = [
          {
            name: '请选择',
            value: ''
          },
          {
            name: '门店仓(普通门店)',
            value: '1'
          },
          {
            name: '门店仓(无人店)',
            value: '2'
          }
        ];
        this.operationalNatureList = [
          {
            name: '请选择',
            value: ''
          },
          {
            name: '自营仓库',
            value: '1'
          }
        ];
        this.searchParams.operationalNature = '1';
        this.searchParams.operationalType = '';
        this.searchParams.isCustomsClearance = '';
        this.searchParams.isSupportReturn = 0;
      } else {
        this.operationalTypeList = [
          {
            name: '请选择',
            value: ''
          },
          {
            name: '纯仓库',
            value: '0'
          }
        ];
        this.operationalNatureList = [
          {
            name: '请选择',
            value: ''
          },
          {
            name: '第三方仓库',
            value: '0'
          },
          {
            name: '自营仓库',
            value: '1'
          }
        ];
        this.searchParams.operationalType = '0';
      }
    },
    // 供应商的省市区
    handleCityChange(val) {
        this.searchParams.province = val[0];
        this.searchParams.city = val[1];
        this.searchParams.area = val[2];
    },
    // 返回按钮
    back() {
      this.$router.push({ path: '/storeinfomanage' });
    }
  }
};
</script>
<style lang="stylus" scoped>
.storeinfoaddoredit
  .btn_group
    width 50%
    margin-top: 15px
    text-align: center
  .tip
    width: 80%
    line-height: 30px
    margin: 10px 0
    background-color: yellow
    color: red
    text-align: center
    margin: 0 auto
  .paging
    margin: 15px 0
    text-align: right
</style>
<style lang='stylus'>
.storeinfoaddoredit
  .el-form-item__label
    width 141px !important
  .el-form-item__content
    margin-left 141px !important
</style>


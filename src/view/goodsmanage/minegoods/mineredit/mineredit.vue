
<template>
  <div class="mineaddoredit">
      <div>
          <span>编辑商品</span>
          <span @click="operateTable" style="float:right; color:#409EFF; cursor:pointer">操作日志</span>

      </div>
      <div class="title">SPU信息</div>
        <el-form :model="searchParams" :rules="serachRules" label-width="145px" size="medium">
            <el-row :span="20">
                <el-form-item label="商品SPU编号：" prop="" size="mini">
                   {{searchParams.spuCode}}
                </el-form-item>
            </el-row>
            <el-row :span="20">
                <el-col :span="7">
                    <el-form-item label="商品名称：" required prop="" size="mini">
                        <el-input v-model="searchParams.name"  placeholder="不超过200个字"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="所属类目：" required prop="" size="mini">
                        <el-input disabled v-model="searchParams.categoryName"  placeholder=""></el-input>
                    </el-form-item>
                    <!-- <category-select required isThird v-on:selectResult="selectResult" ></category-select> -->
                </el-col>
                <el-col :span="7">
                    <el-form-item label="所属品牌：" required prop="" size="mini">
                        <el-select v-model="searchParams.brandId" filterable placeholder="请选择">
                            <el-option
                                v-for="(item, index) in brandNameOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="20">
                <el-col :span="7">
                    <el-form-item label="贸易类型：" required  prop=""  size="mini">
                        <el-select v-model="searchParams.tradeType" filterable placeholder="请选择">
                            <el-option
                                v-for="item in tradeTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item   label="商品货号："  size="mini">
                        <el-input type="text" maxlength="30" v-model="searchParams.itemNo"  placeholder="不超过30个字符"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="生产商："  size="mini">
                        <el-input maxlength="30" v-model="searchParams.producer"  placeholder="不超过30个字符"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="20">
                <el-form-item required prop="" label="商品类别："  size="mini">
                    <el-select v-model="searchParams.itemType" filterable placeholder="请选择：">
                        <el-option
                            v-for="item in itemTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row :span="20">
                <el-col :span="10">
                    <el-form-item label="商品主图："  size="mini">
                        <el-upload
                            ref="upload"
                            class="upload-demo"
                            action="/scm-web/qinniu/upload/goods"
                            :on-preview="handlePreview"
                            name="Filedata"
                            :file-list="reditMainPicture"
                            list-type="picture-card"
                            :on-remove="onRemove"
                            :on-success="onSuccess"
                            :before-upload="beforeUpload"
                            multiple
                            :limit="5"
                            :on-exceed="handleExceed">
                            <i class="el-icon-plus"></i>
                            <!-- <el-button size="mini"  type="primary">点击上传</el-button> -->
                            <div slot="tip" class="el-upload__tip">注：最多限传5张，单张限4MB以内，支持JPG,PNG,BMP格式</div>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="20">
                <el-col :span="6">
                    <el-form-item label="是否具有保质期管理：" required prop=""  size="mini">
                        <el-radio-group @change="qualityChange" v-model="searchParams.isQuality">
                            <el-radio label="1" >是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col v-show="searchParams.isQuality == 1" :span="60">
                    <el-form-item  label="保质期天数(天)：" required prop=""  size="mini">
                        <el-input @change="qualityDayFilter(searchParams.qualityDay)" maxlength="16" v-model.number="searchParams.qualityDay" type="text" placeholder=""></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="20">
                <el-col :span="20">
                    <el-form-item label="备注："  size="mini">
                        <el-input maxlength="1500" v-model="searchParams.remark" type="textarea" placeholder="不超过1500个字符"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

         <div class="title">商品信息</div>
         <el-form size="small" class="" label-width="145px">
            <el-card style="margin:20px 0 20px 0;" class="box-card">
                <div slot="header">
                    <span>自然属性</span>
                </div>
                <el-form-item v-for="(data, index) in propertyOptions" required prop="" :key="index" :label="data.name+'：'">
                    <el-select  v-model="data.value" filterable placeholder="请选择">
                        <el-option
                            v-for="(item, index1) in data.list"
                            @click.native="activeSelectNature(item,index, data)"
                            :key="index1"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-card>
            <el-card>
                <div slot="header">
                    <span>采购属性</span>
                </div>
                <el-form-item  v-for="(data, index) in checkedAttributes" :key="index"  :label="data.name+'：'">
                    <el-checkbox-group v-model="selectCheck" @change="handleChecked">
                        <el-checkbox :disabled="disableArr.indexOf(childData.value) > -1" @change="handleCheckedChild(childData, index)" v-for="(childData, index1) in data.list" :key="index1" :label="childData.value">
                            <el-input :maxlength="100" v-show="selectCheck.indexOf(childData.value) > -1"    @input="handleCheckedChild(childData, index, data.totalStr)" :disabled="disableArr.indexOf(childData.value) === -1 && selectCheck.indexOf(childData.value) == -1 "  style="width:80px;" v-model="childData.label" size="mini" >
                                <!-- {{ childData.label }} -->
                            </el-input>
                            <span v-show="selectCheck.indexOf(childData.value) == -1">{{ childData.label }}</span>
                            <img style="width:28px; height:28px;" v-if="childData.pictrueSource" :src="childData.pictrueSource"/>
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-card>
            <el-card  style="margin:20px 0 20px 0;">
                <div slot="header">
                    <span>规格信息</span>
                </div>
                 <el-table class="minegood_redit" id="tableMain" :data="tableData" border style="width: 100%">
                     <el-table-column align="center" prop="normName"  label="规格" > </el-table-column>
                     <el-table-column align="center" prop="skuCode"  label="sku编号" > </el-table-column>
                     <el-table-column align="center" prop="skuName"  label="SKU名称" >
                         <template slot-scope="scope">
                                <el-input maxlength="200" v-model.trim="scope.row.skuName" type="text" size="mini"></el-input>
                         </template>
                     </el-table-column>
                     <el-table-column class="a1" align="center" prop="barCode"  label="条形码" >
                         <template slot-scope="scope">
                                <el-input maxlength="64" @change="keyupBarcode(scope.row, scope.$index, 1)" v-model.trim="scope.row.barCode" type="text" size="mini"></el-input>
                         </template>
                     </el-table-column>
                     <!-- <el-table-column align="center" prop="marketPrice2"  label="参考市场价(元)" >
                         <template slot-scope="scope">
                             <el-input v-model="scope.row.marketPrice2" maxlength="10" type="text" size="mini">{{ scope.row }}</el-input>
                         </template>
                     </el-table-column> -->
                     <el-table-column align="center" prop="marketUnit"  label="销售单位" :render-header="renderHeader" >
                         <template slot-scope="scope">
                           <el-select v-model="scope.row.marketUnit" filterable placeholder="请选择" size="mini">
                              <el-option v-for="item in marketUnitList" :key="item.value" :label="item.name" :value="item.value">
                              </el-option>
                            </el-select>
                         </template>
                    </el-table-column>
                     <el-table-column align="center" prop="minPackingQuantity"  label="最小装箱数"  >
                         <template slot-scope="scope">
                             <el-input maxlength="13" v-model="scope.row.minPackingQuantity" type="text" size="mini"></el-input>
                         </template>
                    </el-table-column>
                     <el-table-column align="center" prop="minOrderQuantity"  label="最小起订量"  >
                         <template slot-scope="scope">
                             <el-input maxlength="13" v-model="scope.row.minOrderQuantity" type="text" size="mini"></el-input>
                         </template>
                    </el-table-column>
                     <el-table-column align="center" prop="minDemandQuantity"  label="最小要货量"  >
                         <template slot-scope="scope">
                             <el-input maxlength="13" v-model="scope.row.minDemandQuantity" type="text" size="mini"></el-input>
                         </template>
                    </el-table-column>
                     <el-table-column align="center" prop="weight2"  label="重量(KG)"  >
                         <template slot-scope="scope">
                             <el-input maxlength="13" v-model="scope.row.weight2" type="text" size="mini"></el-input>
                         </template>
                    </el-table-column>
                     <el-table-column align="center" prop="picture"  label="图片(最多三张)" >
                         <template slot-scope="scope">
                             <el-upload
                                v-if="scope.row.pictureArr.length < 3"
                                :ref="'upload'+scope.$index"
                                class="upload-demo"
                                action="/scm-web/qinniu/upload/goods"
                                :on-preview="handlePreview"
                                name="Filedata"
                                :file-list="[]"
                                :on-remove="tableOnRemove"
                                :on-success="tableOnSuccess"
                                list-type="picture"
                                :before-upload="beforeUpload"
                                multiple
                                :limit="3"
                                :on-exceed="tableHandleExceed">
                                <el-button  @click="uploadCurrent(scope.row.pictureArr, scope.$index)" type="text">点击上传</el-button>
                            </el-upload>
                            <ul>
                                 <li  v-for="(data, index) in scope.row.pictureArr" :key="index">
                                     <img  style="width:50px; padding:5px 10px 5px 0;" :src="imgSourceUrl+data"/> <el-button  @click="deleteCurrentImg(scope.$index, data)" size="mini" type="text">删除</el-button>
                                 </li>
                             </ul>
                         </template>
                    </el-table-column>
                     <el-table-column  align="center" prop="isValid"  label="状态">
                         <template slot-scope="scope">
                              <el-checkbox true-label="1" false-label="0" v-model="scope.row.isValid">启用</el-checkbox>
                         </template>
                     </el-table-column>
                 </el-table>
            </el-card>

         </el-form>

        <el-dialog :visible.sync="dialogVisibleImg">
            <img width="100%" :src="'https://scm.trc.com/'+dialogImageUrl" alt="">
        </el-dialog>
        <!-- 操作日志弹窗 -->
        <el-dialog title="操作日志" :visible.sync="dialogVisibleTable" width="80%">
            <operate-table v-on:closeOperate="closeOperate"  v-if="operateParams.entityId" :url="'/logInfoPage'" :params="operateParams" ></operate-table>
        </el-dialog>

         <div style="text-align: center; padding: 20px 0 ;">
             <el-button size="mini" :disabled="disabledBtn" @click="keepData" type="primary">保存</el-button>
             <el-button size="mini" @click="back" >取消</el-button>
         </div>
  </div>
</template>
<script>
import operateTable from '@/components/operateTable';
import categorySelect from '@/components/mainSystemSelect';
  export default {
    name: 'mineaddoredit',
    data() {
        return {
            marketUnitList: this.$utils.querydiction('marketUnit'), // 单位列表
            serachRules: {
                barCode: [
                    {required: true, message: '请输入商品条形码', trigger: 'blur'}
                ]
            },
            radio: 1,
            operateParams: {   // 日志所需参数
                entityId: '',
                entityType: 'Items',
                operateType: '1'
            },
            dialogVisibleTable: false,
            dialogVisibleImg: false, // 查看主图弹窗
            dialogImageUrl: '', // 主图地址
            searchParams: {
                spuCode: '', // spu编号
                name: '', // 商品名称
                categoryId: '', // 分类ID
                brandId: '', // 品牌id
                tradeType: '', // 贸易类型
                itemNo: '', // 商品货号
                producer: '', // 生产商
                pictrue: '', // 商品主图路径
                categoryName: '', // 商品类目
                remark: '', // 备注
                mainPicture: '', // 主图
                marketPrice2: '', // 市场价
                weight: '', // 重量
                isQuality: '0', // 是否有保质期管理 0-没有，1-有
                qualityDay: '', // 质保天数，isQuality为1时，不能为空
                itemType: '' // 0-小泰良品，1-非小泰良品，2-代销商品
            },
            shopStatus: [{  // 商品状态
                value: '',
                label: '全部'
            }, {
                value: '0',
                label: '停用'
            }, {
                value: '1',
                label: '启用'
            }],
            itemTypeOptions: [{
                value: '0',
                label: '小泰良品（自销）'
            }, {
                value: '1',
                label: '非小泰良品（自销）'
            }, {
                value: '2',
                label: '代销商品'
            }],
            tradeTypeOptions: [{
                value: 'normalTrade',
                label: '一般贸易'
            }, {
                value: 'seaBuy',
                label: '海淘'
            }, {
                value: 'crossBorderInBond',
                label: '跨境保税'
            }, {
                value: 'overseasDirectMail',
                label: '海外直邮'
            }],
            id: '', // 商品id
            imgSourceUrl: 'https://scm.trc.com/',
            disabledBtn: false,
            goodSpucode: this.$route.params.id, // 编辑商品spucode
            noChangeData: [], // 未改动的数据
            checkList: [], // 采购属性
            propertyOptions: [], // 自然属性集合
            fileListShow: [], // 主图地址集合
            reditMainPicture: [], // 编辑商品组图
            brandNameOptions: [], // 所属品牌集合
            checkedAttributes: [], // 采购属性选择
            selectCheck: [], // 采购属性选择
            selectNameArr: [], // 采购属性名称的集合
            num: [],
            temTableData: [], // 暂时选中采购的数据
            tableData: [], // 规格信息
            tableCope: [],  // 不准改变的数据
            selectArr: [],
            naturePropertys: [], // 最后所选择的自然属性集合
            salesPropertys: [], // 采购属性
            totalLength: 0, // 上次条数
            currentLength: 0, // 当前条数
            tableImgCurrent: '', // 当前变革上传的索引
            selectTotalLength: '', // 所选采购属性的条数
            disableArr: [],
            contectId: []
        };
    },
    mounted: function() {
        this.goodInitRedit();
    },
    components: {
        categorySelect,
        operateTable
    },
    methods: {
        qualityChange(row) {
            if (row === '0') {
                this.searchParams.qualityDay = '';
            }
        },
        qualityDayFilter(row) {  // 保质期过滤
            let reg = /^([1-9]\d*|[0]{1,1})$/;
            if (!reg.test(row)) {
                this.searchParams.qualityDay = row = '';
                this.$utils.messagetip.warningTip('保质期天数请填写有效数字！');
            }
        },
        operateTable() {
            this.dialogVisibleTable = true;
        },
        closeOperate() {
            this.dialogVisibleTable = false;
        },
        // 编辑初始化
        goodInitRedit() {
            this.$AXIOS.GET('/goods/goods/spuCode/' + this.goodSpucode).then(res => {
                if (res.result.items.errorMsg) this.$utils.messagetip.errorTip(res.result.items.errorMsg);

                for (let i in this.searchParams) {
                    for (let j in res.result.items) {
                        if (i === j) {
                            this.searchParams[i] = res.result.items[j];
                        }
                    }
                }
                this.operateParams.entityId = res.result.items.id;
                this.categoryList(res.result.items.categoryId, res.result.items);
                // this.propertyList(res.result.items.categoryId, res.result.itemNatureProperys);
                res.result.itemNatureProperys.map((item, index) => {  // 初始化自然属性
                    let flag = true;
                    let value = null;

                    for (let i = 0; i < this.propertyOptions.length; i++) {
                        if (item.propertyId === this.propertyOptions[i].propertyId) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        let arr = {};
                        arr.name = item.propertyName;
                        arr.propertyId = item.propertyId;
                        arr.list = [{
                            label: '请选择',
                            value: ''
                        }];
                        arr.value = value;

                        this.propertyOptions.push(arr);
                    }
                });

                res.result.itemNatureProperys.map((item, index) => {
                    for (let i = 0; i < this.propertyOptions.length; i++) {
                        if (this.propertyOptions[i].propertyId === item.propertyId) {
                            if (item.isSelected === '1') {
                                 this.propertyOptions[i].value = item.propertyValueId;
                            }
                            this.propertyOptions[i].list.push({
                                value: item.propertyValueId,
                                label: item.propertyValue,
                                propertyId: item.propertyId
                            });
                        }
                    }
                });

                res.result.itemSalesProperies.map(item => {  // 初始化采购属性
                    let flag = true;
                    if (this.selectCheck.indexOf(item.propertyValueId) === -1 && item.isSelected === '1') {
                        this.selectCheck.push(item.propertyValueId);
                        this.disableArr.push(item.propertyValueId);
                    }

                    for (let i = 0; i < this.checkedAttributes.length; i++) {
                        if (item.propertyId === this.checkedAttributes[i].propertyId) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        this.checkedAttributes.push({
                            name: item.propertyName,
                            list: [],
                            propertyId: item.propertyId,
                            propertySort: item.propertySort,
                            totalStr: []
                        });
                    }
                });

                res.result.itemSalesProperies.map((item, index) => {
                    for (let i = 0; i < this.checkedAttributes.length; i++) {
                        if (this.checkedAttributes[i].propertyId === item.propertyId) {
                            this.checkedAttributes[i].list.push({
                                value: item.propertyValueId,
                                label: item.propertyValueName,
                                parName: this.checkedAttributes[i].name,
                                pictrueSource: item.picUrl,
                                pictrue: item.picture,
                                propertyId: item.propertyId,
                                propertySort: this.checkedAttributes[i].propertySort
                            });
                            this.noChangeData.push({
                                value: item.propertyValueId,
                                label: item.propertyValueName,
                                parName: this.checkedAttributes[i].name,
                                pictrueSource: item.picUrl,
                                pictrue: item.picture,
                                propertyId: item.propertyId,
                                propertySort: this.checkedAttributes[i].propertySort
                            });
                            this.checkedAttributes[i].totalStr.push(item.propertyValueName);
                        }
                    }
                });

                this.id = res.result.items.id;
                res.result.skus.map(item => {
                    item.oldBarcode = JSON.parse(JSON.stringify(item.barCode));
                    let arr = item.propertyValueId.split(',').map(Number);
                    let sortArr = arr.sort(function(a, b) {
                          if (a > b) {
                             return 1;
                         } else if (a < b) {
                             return -1;
                         } else {
                             return 0;
                         }
                    });
                    this.tableData.push({
                        normName: item.specInfo,
                        flagId: sortArr.join('pqx_'),
                        skuName: item.skuName,
                        barCode: item.barCode,
                        skuCode: item.skuCode,
                        marketPrice2: item.marketPrice2,
                        marketUnit: item.marketUnit ? item.marketUnit.toString() : '',
                        minPackingQuantity: item.minPackingQuantity,
                        minOrderQuantity: item.minOrderQuantity,
                        minDemandQuantity: item.minDemandQuantity,
                        weight2: item.weight2,
                        picture: '',
                        pictureArr: item.picture ? item.picture.split(',') : [],
                        isValid: item.isValid,
                        oldBarcode: JSON.parse(JSON.stringify(item.barCode)),
                        sortStatus: 0,
                        source: 0,
                        propertyValueId: sortArr.join(','),
                        propertyValue: item.propertyValue
                    });
                });


                this.reduceNum(res.result.itemSalesProperies, this.checkedAttributes);

                res.result.itemNatureProperys.map((item, index) => {
                    if (item.isSelected === '1') {
                        let obj = {};
                        obj[item.propertyId] = {
                            propertyId: item.propertyId,
                            propertyValueId: item.propertyValueId,
                            propertyValue: item.propertyValue
                        };
                        this.naturePropertys.push(obj);
                    }
                });
                console.log(this.naturePropertys, 11);
                if (res.result.items.mainPicture) {
                    let arr = res.result.items.mainPicture.split(',');
                    this.reditMainPicture = arr.map(item => {
                        this.fileListShow.push(item);
                        return {
                            url: this.imgSourceUrl + item,
                            key: item
                        };
                    });
                }
            });
        },
        reduceNum(cur, tol) {  // 拼凑num
            let obj = [];
            let arrId = [];
            cur.map((item, index) => {
                if (arrId.indexOf(item.propertyValueId) === -1 && item.isSelected === '1') {
                    arrId.push(item.propertyValueId);
                }
            });
            setTimeout(() => {
                let numkeys = [];
                for (let i = 0; i < tol.length; i++) {
                    let list = tol[i].list;
                    for (let j = 0; j < list.length; j++) {
                        if (arrId.indexOf(list[j].value) > -1) {
                            if (numkeys.indexOf(i + '') > -1) {
                                for (let k = 0; k < this.num.length; k++) {
                                    for (let obj in this.num[k]) {
                                        if (obj === i + '') {
                                            this.num[k][obj].push(list[j]);
                                        }
                                    }
                                }
                            } else {
                                let curr = {};
                                curr[i] = [list[j]];
                                this.num.push(curr);
                                numkeys.push(i + '');
                            }
                        }
                    }
                }
                this.concatSelect();
            }, 500);
        },
        handlePreview(row) {
            this.dialogImageUrl = row.response.key;
            this.dialogVisibleImg = true;
        },
        onRemove(data) {
            if (data.response) {
                this.fileListShow.splice(this.fileListShow.indexOf(data.response.key), 1);
            } else {
                this.fileListShow.splice(this.fileListShow.indexOf(data.key), 1);
            }
        },
        onSuccess(data) {
            this.fileListShow.push(data.key);
        },
        beforeUpload(file) {
            let fileFormat = file.type;
            if (fileFormat === 'image/png' || fileFormat === 'image/jpg' || fileFormat === 'image/jpeg' || fileFormat === 'image/PBG' || fileFormat === 'image/bmp') {
                if (file.size > 1024 * 1024 * 4 ) {
                    this.$utils.messagetip.warningTip('文件大小不能大于4M');
                    return false;
                }
            } else {
                this.$utils.messagetip.warningTip('文件类型只能为.png,.jpg,.bmp');
                return false;
            }
        },
        handleExceed(data) {
            this.$utils.messagetip.warningTip('最多上传5张图片');
        },
        tableOnSuccess(res, index) {
            for (let i = 0; i < this.tableData.length; i++) {
                if (i === this.tableImgCurrent) {
                    // this.tableData[i].pictureArr.push({ key: res.key, url: res.url });
                    this.tableData[i].pictureArr.push(res.key);
                }
            }
            this.$refs['upload' + this.tableImgCurrent].clearFiles();
        },
        deleteCurrentImg(index, res) {
            let obj = this.tableData[index].pictureArr;
            for (let j = 0; j < obj.length; j++) {
                if (obj[j].key === res.key) {
                    obj.splice(j, 1);
                    break;
                }
            };
        },
        tableOnRemove(res, val) {

        },
        tableHandleExceed(data) {
            this.$utils.messagetip.warningTip('最多上传3张图片');
        },
        uploadCurrent(str, index) {
            if (str.length === 3) {
                this.$utils.messagetip.warningTip('最多上传3张图片');
                return;
            }
            this.tableImgCurrent = index;
        },
        handleChecked(str) {

        },
        changeValue(value) {

        },
        handleCheckedChild(obj, index, cur) {
            // if (cur && cur.indexOf(obj.label) > -1) {
            //     this.$utils.messagetip.warningTip(obj.label + '属性已被使用');
            //     return false;
            // }
            if (this.num.length) {
                let flag = true;
                for (let i = 0; i < this.num.length; i++) {
                    let flag1 = true;
                    for (let cu in this.num[i]) {
                        let arrChild = this.num[i][cu];
                        if (cu * 1 === index) {
                            flag = false;
                            for (let j = 0; j < arrChild.length; j++) {
                                if (arrChild[j].value === obj.value) {
                                    flag1 = false;
                                }
                                if (this.selectCheck.indexOf(arrChild[j].value) === -1) {
                                    arrChild.splice(j, 1);
                                }
                            }
                            if (flag1) arrChild.push(obj);
                        }
                    }
                }
                if (flag) {
                    let obj1 = {};
                    obj1[index] = [obj];
                    this.num.push(obj1);
                    flag = false;
                }
            } else {
                let curr = {};
                curr[index] = [obj];
                this.num.push(curr);
            }
            this.selectArr = [];
            this.selectNameArr = [];
            this.salesPropertys = [];
            this.concatSelect();
            this.printResult(this.Zuhe(this.selectArr));
        },
        concatSelect() {
            let num = 0;
            for (let i = 0; i < this.num.length; i++) {
                let arr = [];
                let labelArr = [];
                let saleArr = [];
                for (let obj in this.num[i]) {
                    if (this.num[i][obj].length) {
                        num++;
                        for (let j = 0; j < this.num[i][obj].length; j++) {
                            let current = this.num[i][obj][j];

                            arr.push(current.parName + ':' + current.label + 'pqx@' + current.value * 1);
                            this.selectNameArr.push(current.label);
                            saleArr.push({
                                propertyId: current.propertyId,
                                propertyName: current.parName,
                                propertySort: current.propertySort,
                                propertyValueId: current.value,
                                propertyValue: current.label,
                                sort: '0',
                                picture: current.picture ? current.picture : ''
                            });
                        }
                    }
                }
                this.selectArr.push(arr);
                this.salesPropertys = this.salesPropertys.concat(saleArr);
            }
           this.selectTotalLength = num;
        },
        printResult(result) {
            // console.log(result, 1);
            if (result && result.length) {
                this.contectId = [];
                for (let i = 0; i < result.length; i++) {  // 进行id的排序
                    let arr = result[i].split('pqx@')[1].split('pqx_').map(Number);
                    let sortArr = arr.sort(function(a, b) {
                          if (a > b) {
                             return 1;
                         } else if (a < b) {
                             return -1;
                         } else {
                             return 0;
                         }
                    });
                    if (result[i].indexOf('|') > -1) {
                        let name = [];
                        let valueArr = result[i].split('|');
                        valueArr[valueArr.length - 1] = valueArr[valueArr.length - 1].split('pqx@')[0];
                        for (let j = 0; j < valueArr.length; j++) {
                            name.push(valueArr[j].split(':')[1]);
                        }
                        result[i] = name.join(',') + 'pqx&' + result[i].split('pqx@')[0] + 'pqx@' + sortArr.join('pqx_');
                    } else {
                        let valueName = result[i].split('pqx@')[0].split(':')[1];
                        result[i] = valueName + 'pqx&' + result[i].split('pqx@')[0] + 'pqx@' + sortArr.join('pqx_');
                    }
                    this.contectId.push(result[i].split('pqx@')[1]);
                }
                // console.log(result, 2);
                for (let i = 0, len = result.length; i < len; i++) {
                    let flag = true;
                    let flagId = null;
                    let resId = result[i].split('pqx@')[1];
                    let resArr = resId.indexOf('pqx_') > -1 ? resId.split('pqx_') : [ resId ];
                    let resArrLength = resArr.length;
                    resArr.splice(resArr.length - 1, 1);
                    let newId = resArr.join('pqx_');

                    for (let j = 0; j < this.tableData.length; j++) {
                        let tableId = this.tableData[j].flagId;
                        let tableArr = this.tableData[j].flagId.split('pqx_');
                        if (resArrLength > tableArr.length || resArrLength < tableArr.length) {
                            tableId = resId;
                        }
                        if (resId === tableId) {
                            this.tableData[j].normName = result[i].split('pqx@')[0].split('pqx&')[1];
                            this.tableData[j].flagId = resId;
                            this.tableData[j].propertyValue = result[i].split('pqx&')[0];
                            this.tableData[j].propertyValueId = resId.split('pqx_').join(',');
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        this.tableData.push({
                            normName: result[i].split('pqx@')[0].split('pqx&')[1],
                            flagId: result[i].split('pqx@')[1],
                            skuName: this.searchParams.name,
                            barCode: '',
                            marketPrice2: '',
                            weight2: '',
                            picture: '',
                            pictureArr: [],
                            isValid: '1',
                            sortStatus: 0,
                            source: 1,
                            propertyValueId: resId.split('pqx_').join(','),
                            propertyValue: result[i].split('pqx&')[0]
                        });
                    }
                }
                let newTable = [];
                for (let j = 0; j < this.tableData.length; j++) {
                    let tableId = this.tableData[j].flagId;
                    if (this.contectId.indexOf(tableId) > -1) {
                        newTable.push(this.tableData[j]);
                    }
                };


                this.tableData = newTable;
            } else {
                this.tableData = [];
            }
        },
        removeArr(dx) {

        },
        addNewType(heads, choices) {
            let result = [];
            for (let i = 0, len = heads.length; i < len; i++) {
                if (choices.length) {
                    for (let j = 0, lenj = choices.length; j < lenj; j++) {
                        // let id = heads[i].split('@')[1] * 1 + choices[j].split('@')[1] * 1;
                        let _id = heads[i].split('pqx@')[1] + 'pqx_' + choices[j].split('pqx@')[1];
                        let headName = heads[i].split('pqx@')[0];
                        let choiceName = choices[j].split('pqx@')[0];
                        result.push( headName + ' | ' + choiceName + 'pqx@' + _id);
                    }
                }
            }

            return result;
        },
        Zuhe() {
            let arr = [];
            let heads;
            for (let i = 0; i < arguments[0].length; i++) {
                if (arguments[0][i].length) {
                    arr.push(arguments[0][i]);
                }
            }
            this.currentLength = arr.length ? arr.length : 0;
            heads = arr[0];
            for (let i = 1, len = arr.length; i < len; i++) {
                if (arr[i]) {
                    heads = this.addNewType(heads, arr[i]);
                }
            }
            return heads;
        },
        // 自然属性选择事件
        activeSelectNature(arr, index, data) {
            if (this.naturePropertys.length) {
                let flag = true;
                for (let i = 0; i < this.naturePropertys.length; i++) {
                    let curr = this.naturePropertys[i];
                    for (let obj in curr) {
                        if (arr.propertyId === obj * 1 && arr.value) {
                            flag = false;
                            curr[obj] = {};
                            curr[obj] = {
                                propertyId: arr.propertyId,
                                propertyValueId: arr.value,
                                propertyValue: arr.label,
                                isValid: 1
                            };
                        } else if (data.propertyId === obj * 1 && !arr.value) {
                            this.naturePropertys.splice(i, 1);
                            break;
                        }
                    }
                }
                if (flag && arr.value) {
                    let obj = {};
                    obj[arr.propertyId] = {
                        propertyId: arr.propertyId,
                        propertyValueId: arr.value,
                        propertyValue: arr.label,
                        isValid: 1
                    };
                    this.naturePropertys.push(obj);
                }
            } else {
                if (arr.value) {
                    let obj = {};
                    obj[arr.propertyId] = {
                        propertyId: arr.propertyId,
                        propertyValueId: arr.value,
                        propertyValue: arr.label,
                        isValid: 1
                    };
                    this.naturePropertys.push(obj);
                }
            }
            console.log( this.naturePropertys, 3);
        },
        // 保存数据
        keepData() {
          console.log(this.naturePropertys);
            if (!this.checkSKUName()) {
                return false;
            }
            if (!this.searchParams.name) {
                this.$utils.messagetip.warningTip('请输入商品名称');
            } else if (!this.searchParams.categoryId) {
                this.$utils.messagetip.warningTip('请选择商品类目');
            } else if (!this.searchParams.brandId) {
                this.$utils.messagetip.warningTip('请选择所属品牌');
                return;
            } else if (!this.searchParams.tradeType) {
                this.$utils.messagetip.warningTip('请选择贸易类型');
                return;
            } else if (this.searchParams.itemType === '') {
                this.$utils.messagetip.warningTip('请选择商品类别');
                return;
            } else if (this.searchParams.isQuality === '1' && !this.searchParams.qualityDay) {
                this.$utils.messagetip.warningTip('你已勾选商品保质期，请填写保质期天数');
                return;
            } else if (!this.naturePropertys.length && this.propertyOptions.length) {
                this.$utils.messagetip.warningTip('请选择自然属性');
                return;
            } else if (this.naturePropertys.length !== this.propertyOptions.length) {
                this.$utils.messagetip.warningTip('请选择自然属性');
                return;
            } else if (!this.tableData.length) {
                this.$utils.messagetip.warningTip('商品SKU信息不能为空!');
                return;
            } else if (!this.checkSKUData()) {
                return;
            }
            let data = this.searchParams;
            if (this.fileListShow.length) {
                data.mainPicture = this.fileListShow.join(',');
            } else {
                data.mainPicture = '';
            }
                data.updateSalesPropertylist = [];
                data.purchasePropery = this.selectCheck;
                data.naturePropertys = [];
                data.salesPropertys = this.salesPropertys.length ? JSON.stringify(this.salesPropertys) : [];
            if (this.tableData.length) {
                this.tableData.map(item => {
                    let imgArr = [];
                    if (item.pictureArr.length) {
                        for (let i = 0; i < item.pictureArr.length; i++) {
                            imgArr.push(item.pictureArr[i]);
                        }
                    }

                    if (imgArr.length) {
                        item.picture = imgArr.join(',');
                    }
                });

                data.skusInfo = JSON.stringify(this.tableData);
            } else {
                data.skusInfo = [];
            }
            for (let i = 0; i < this.naturePropertys.length; i++) {
                for (let obj in this.naturePropertys[i]) {
                    data.naturePropertys.push(this.naturePropertys[i][obj]);
                }
            }

            data.naturePropertys = data.naturePropertys.length ? JSON.stringify(data.naturePropertys) : [];
            this.checkedAttributes.map((item, index) => {
                item.list.map((item1) => {
                    for (let i = 0; i < this.noChangeData.length; i++) {
                        if (item1.value === this.noChangeData[i].value && item1.label !== this.noChangeData[i].label) {
                            data.updateSalesPropertylist.push(item1);
                        }
                    }
                });
            });
            data.updateSalesPropertylist = data.updateSalesPropertylist.length ? JSON.stringify(data.updateSalesPropertylist) : [];
            data.updateFlagForSale = data.updateSalesPropertylist.length ? 1 : 0;
            this.disabledBtn = true;
            this.$AXIOS.PUT('/goods/goods/' + this.id, data).then(res => {
                this.$utils.messagetip.successTip(res.databuffer);
                setTimeout(() => {
                    this.$router.push({path: '/minegoods'});
                }, 500);
            }).finally(res => {
                this.disabledBtn = false;
            });
        },
        // 检验采购属性的唯一性
        checkSKUName() {
            let flag = true;
            if (this.selectTotalLength < this.checkedAttributes.length) {
                this.$utils.messagetip.warningTip('每条采购属性必须选择一项');
                return false;
            }
            this.checkedAttributes.map(item => {
                let obj = {
                    name: item.name,
                    value: [],
                    num: 0,
                    label: ''
                };
                for (let i = 0; i < item.list.length; i++) {
                    if (obj.value.indexOf(item.list[i].label) > -1) {
                        obj.num += 1;
                        obj.label = item.list[i].label;
                    }
                    obj.value.push(item.list[i].label);
                }
                if (obj.num > 0) {
                    this.$utils.messagetip.warningTip(`${obj.name}的${obj.label}属性已被使用，请重新修改此属性`);
                    flag = false;
                }
            });
            return flag;
        },
        // 校验SKU信息
        checkSKUData() {
            let parent = document.getElementById('tableMain');
            let regexp = new RegExp(/^[0-9a-zA-Z-#,]+$/); // 条形码验证
            let priceReg = new RegExp(/(^[0-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/); // 市场价验证
            let weightReg = new RegExp(/(^[0-9](\d+)?(\.\d{1,3})?$)|(^\d\.\d{1,3}$)/); // 重量验证
            let numReg2 = /^[0-9]+$/;
            let index = -1;
            let num = '';
            for (let i = 0; i < this.tableData.length; i++) {
                let current = this.tableData[i];
                if (!current.skuName) {
                    index = i;
                    num = 0;
                    this.$utils.messagetip.warningTip('SKU名称不能为空');
                    break;
                }
                if (!current.barCode) {
                    index = i;
                    num = 1;
                    this.$utils.messagetip.warningTip('条形码不能为空');
                    break;
                } else if (current.barCode && current.barCode.indexOf(',') > -1) {
                    index = i;
                    num = 1;
                    this.$utils.messagetip.warningTip('不支持输入多个条形码');
                } else if (!regexp.test(current.barCode)) {
                    index = i;
                    num = 1;
                    this.$utils.messagetip.warningTip('条形码格式错误');
                    break;
                } else if (!current.marketUnit) {
                    index = i;
                    num = 1;
                    this.$utils.messagetip.warningTip('请选择销售单位');
                    break;
                } else if (!current.minPackingQuantity) {
                    index = i;
                    num = 1;
                    this.$utils.messagetip.warningTip('最小装箱数不能为空或者为0');
                    break;
                } else if (!numReg2.test(current.minPackingQuantity)) {
                    index = i;
                    num = 1;
                    this.$utils.messagetip.warningTip('最小装箱数只能为正整数');
                    break;
                } else if (!current.minOrderQuantity) {
                    index = i;
                    num = 1;
                    this.$utils.messagetip.warningTip('最小起订量不能为空或者为0');
                    break;
                } else if (!numReg2.test(current.minOrderQuantity)) {
                    index = i;
                    num = 1;
                    this.$utils.messagetip.warningTip('最小起订量只能为正整数');
                    break;
                } else if (!current.minDemandQuantity) {
                    index = i;
                    num = 1;
                    this.$utils.messagetip.warningTip('最小要货量不能为空或者为0');
                    break;
                } else if (!numReg2.test(current.minDemandQuantity)) {
                    index = i;
                    num = 1;
                    this.$utils.messagetip.warningTip('最小要货量只能为正整数');
                    break;
                }
                // if (current.marketPrice2 && !priceReg.test(current.marketPrice2)) {
                //     index = i;
                //     num = 2;
                //     this.$utils.messagetip.warningTip('参考市场价格式输入错误,需输入大于等于0的最多为两位小数的数字');
                // }
                if (current.weight2 && !weightReg.test(current.weight2)) {
                    index = i;
                    num = 3;
                    this.$utils.messagetip.warningTip('重量格式输入错误,需输入大于等于0的最多为三位小数的数字');
                }
            }
            if (index > -1) {
                let item = parent.getElementsByClassName('el-table__row')[index];
                let input = item.getElementsByTagName('input')[num];
                input.focus();
                return false;
            } else {
                return true;
            }
        },
        renderHeader(h, { column, $index }) {
          return [
            column.label,
            h(
              'el-tooltip',
              {
                props: {
                  content: (function() {
                    let label = column.label;
                    return '件（当商品为单个时），套（当商品为套件时）';
                  })(),
                  placement: 'top'
                }
              },
              [
                h('span', {
                  class: {
                    'el-icon-info': true
                  }
                })
              ]
            )
          ];
        },
        /**
         * @param row 当前列对象
         * @param index 为规格信息列表的索引
         * @param i 为当前列的第几个input
         */
        keyupBarcode(row, index, i) {
            let regexp = new RegExp(/^[0-9a-zA-Z-#,]+$/);
            let parent = document.getElementById('tableMain');
            let code = row.barCode;
            let codeArr = row.barCode.split(',');
            let flag = false;
            let tmp = [];
            codeArr.forEach(function(item) {
                (codeArr.indexOf(item) !== codeArr.lastIndexOf(item) && tmp.indexOf(item) === -1) && tmp.push(item);
            });
            if (!code) {
                flag = true;
                this.$utils.messagetip.warningTip('条形码不能为空');
            } else if (code && code.indexOf(',') > -1) {
                flag = true;
                this.$utils.messagetip.warningTip('不支持输入多个条形码');
            } else if (tmp.length) {
                this.$utils.messagetip.warningTip('同时存在相同的条形码, 请重新输入');
                row.barCode = row.oldBarcode;
                flag = true;
            } else if (regexp.test(code)) {
                this.$AXIOS.POST('/goods/checkBarcodeOnly', {barCode: code, isValid: row.isValid, skuCode: row.skuCode}).then(res => {

                }, error => {
                   if (error) {
                        setTimeout(() => {
                            row.barCode = '';
                        }, 500);
                       flag = true;
                   }
                });
            } else {
               flag = true;
               this.$utils.messagetip.warningTip('条形码格式错误');
            }
            if (flag) {
                let item = parent.getElementsByClassName('el-table__row')[index];
                let input = item.getElementsByTagName('input')[i];
                input.focus();
            }
        },
        back() {
            this.$router.push({
                name: 'minegoods'
            });
        },
        // 查询分类关联品牌
        categoryList(id, str) {
            let data = {
                isValid: 1,
                categoryId: id
            };
            let flag = true;
            this.$AXIOS.GET('/category/categoryBrands', data).then(res => {
                if ( res.result ) {
                    for (let i = 0; i < res.result.length; i++) {
                        if (str.brandId === res.result[i].brandId) {
                            flag = false;
                            break;
                        }
                    }
                    this.brandNameOptions = res.result.map((item, index) => {
                        return {
                            value: item.brandId,
                            label: item.brandName
                        };
                    });
                    if (flag) {
                        this.brandNameOptions.push({
                            label: str.brandName,
                            value: str.brandId
                        });
                    }
                } else {
                    if (str) {
                        this.brandNameOptions.push({
                            label: str.brandName,
                            value: str.brandId
                        });
                    } else {
                        this.brandNameOptions = [];
                    }
                }
            });
        },
        // 所属类目选择
        selectResult(res) {
            this.searchParams.categoryId = res.categoryId;
            this.propertyOptions = [];
            this.checkedAttributes = [];
            this.categoryList(res.categoryId);
            this.propertyList(res.categoryId);
        },
        // 获取属性
        propertyList(id, row) {
            this.$AXIOS.GET('/goods/itemsCategoryProperty/' + this.goodSpucode + '/' + id).then(res => {
                let arrId = [];
                res.result.map((item, index) => {
                    arrId.push(item.propertyId);
                    if (item.typeCode === 'natureProperty' && item.isValid !== '0') {
                        let arr = {};
                        arr.name = item.name;
                        arr.propertyId = item.propertyId;
                        arr.list = [];
                        arr.value = '';
                        for (let i = 0; i < row.length; i++) {  // 自然属性初始化赋值
                            if (row[i].propertyName === item.name) {
                                arr.value = row[i].propertyValueId;
                                break;
                            }
                        }
                        this.propertyOptions.push(arr);
                    } else if (item.typeCode === 'purchaseProperty' && item.isValid !== '0') {
                        this.checkedAttributes.push({
                            name: item.name,
                            list: [],
                            propertyId: item.propertyId,
                            propertySort: item.propertySort
                        });
                    }
                });
                let strId = arrId.join(',');
                if (strId) {
                    this.categoryListInit(strId, arrId);
                }
            });
        },
        // 获取sku关联的名称
        categoryListInit(id, arrId) {
            this.$AXIOS.GET('/goods/propertyValues/multiIdsSearch', {propertyIds: id, spuCode: this.searchParams.spuCode}).then(res => {
                res.result.map((item, index) => {
                    for (let i = 0; i < this.propertyOptions.length; i++) {
                        if (item.propertyId === this.propertyOptions[i].propertyId ) {
                            this.propertyOptions[i].list.push({
                                value: item.id,
                                label: item.value,
                                propertyId: item.propertyId
                            });
                        }
                    }

                    for (let i = 0; i < this.checkedAttributes.length; i++) {
                        if (item.propertyId === this.checkedAttributes[i].propertyId && item.isValid !== '0') {
                            this.checkedAttributes[i].list.push({
                                value: item.id,
                                label: item.value,
                                parName: this.checkedAttributes[i].name,
                                pictrueSource: item.picUrl,
                                pictrue: item.picture,
                                propertyId: item.propertyId,
                                propertySort: this.checkedAttributes[i].propertySort
                            });
                            this.noChangeData.push({
                                value: item.id,
                                label: item.value,
                                parName: this.checkedAttributes[i].name,
                                pictrueSource: item.picUrl,
                                pictrue: item.picture,
                                propertyId: item.propertyId,
                                propertySort: this.checkedAttributes[i].propertySort
                            });
                        }
                    }
                });
                this.propertyOptions.map(item => {
                    item.list.unshift({
                        label: '请选择',
                        value: ''
                    });
                });
            });
        }
    }
  };
</script>
<style lang="stylus" scoped>
    .mineaddoredit
        .title
            padding 10px
            margin 10px 0
            background-color #f5f7fa
        .tip_red1.el-form-item::before
          content '*'
          color #ff0000
          position relative
          right -15px
          bottom -25px

</style>

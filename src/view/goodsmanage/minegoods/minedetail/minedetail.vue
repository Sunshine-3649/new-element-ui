
<template>
  <div class="mineaddoredit">
      <div>
          <span>商品详情</span>
          <span @click="operateTable" style="float:right; color:#409EFF; cursor:pointer">操作日志</span>

      </div>
      <div class="title">SPU信息</div>
        <el-form :model="searchParams" :rules="serachRules" label-width="145px" size="medium">
            <el-row :span="20">
                <el-col :span="7">
                    <el-form-item label="商品SPU编号：" prop="" size="mini">
                        {{searchParams.spuCode}}
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="状态：" prop="" size="mini">
                        <span style="color:#409EFF"> {{searchParams.isValid == 1 ? '启用' : '停用'}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="20">
                <el-col :span="7">
                    <el-form-item label="商品名称："  prop="" size="mini">
                        {{ searchParams.name }}
                        <!-- <el-input disabled v-model="searchParams.name"  placeholder="不超过200个字"></el-input> -->
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="所属类目："  prop="" size="mini">
                        {{ searchParams.categoryName }}
                        <!-- <el-input disabled v-model="searchParams.categoryName"  placeholder=""></el-input> -->
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="所属品牌："  prop="" size="mini">
                        {{ searchParams.brandName }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="20">
                <el-col :span="7">
                    <el-form-item label="贸易类型："   prop=""  size="mini">
                        <span v-show="searchParams.tradeType === 'normalTrade'"> 一般贸易 </span>
                        <span v-show="searchParams.tradeType === 'seaBuy'">海淘 </span>
                        <span v-show="searchParams.tradeType === 'crossBorderInBond'"> 跨境保税 </span>
                        <span v-show="searchParams.tradeType === 'overseasDirectMail'"> 海外直邮 </span>
                        <!-- <el-select disabled v-model="searchParams.tradeType" filterable placeholder="请选择">
                            <el-option
                                v-for="item in tradeTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select> -->
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item   label="商品货号："  size="mini">
                        {{ searchParams.itemNo }}
                        <!-- <el-input disabled  v-model="searchParams.itemNo"  placeholder=""></el-input> -->
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="生产商："  size="mini">
                        {{ searchParams.producer }}
                        <!-- <el-input disabled v-model="searchParams.producer"  placeholder="不超过20个字符"></el-input> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="20">
                <el-form-item  prop="" label="商品类别："  size="mini">
                    <span v-show="searchParams.itemType === '0'">小泰良品（自销）</span>
                    <span v-show="searchParams.itemType === '1'">非小泰良品（自销）</span>
                    <span v-show="searchParams.itemType === '2'">代销商品</span>
                </el-form-item>
            </el-row>
            <el-row :span="20">
                <el-col :span="10">
                    <el-form-item label="商品主图："  size="mini">
                      <span v-for="(data, index) in reditMainPicture" :key="index">
                        <a v-if="data.url.indexOf('http') < 0" :href="imgSourceUrl + data.url" target='_blank' >
                          <img style="width:60px;margin-right:10px;"  :src="imgSourceUrl + data.url"/>
                        </a>
                        <a v-else :href="data.url" target='_blank' >
                          <img style="width:60px;margin-right:10px;" :src="data.url"/>
                        </a>
                      </span>

                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="20">
                <el-col :span="6">
                    <el-form-item label="是否具有保质期管理："  prop=""  size="mini">
                        <span v-show="searchParams.isQuality == '1'">是</span>
                        <span v-show="searchParams.isQuality == '0'">否</span>
                    </el-form-item>
                </el-col>
                <el-col v-show="searchParams.isQuality == 1" :span="60">
                    <el-form-item  label="保质期天数(天)：" required prop=""  size="mini">
                        {{ searchParams.qualityDay }}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="20">
                <el-col :span="20">
                    <el-form-item label="备注："  size="mini">
                        <span style=" word-break:break-all">
                            {{ searchParams.remark }}
                        </span>
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
                <div v-if='isProductCenter'>
                  <el-form-item v-for="(data, index) in resultData.itemNatureProperys" :key="index" :label="data.propertyName+'：'">
                    {{ data.propertyValue }}
                  </el-form-item>
                </div>
                <div v-else v-for="(data, index) in resultData.itemNatureProperys" :key="index">
                  <el-form-item v-if="data.isSelected == 1" :label="data.propertyName+'：'" >
                     <span >{{ data.propertyValue }}</span>
                   </el-form-item>
                 </div>

            </el-card>
            <!-- <el-card>
                <div slot="header">
                    <span>采购属性</span>
                </div>
                <el-form-item  v-for="(data, index) in checkedAttributes" :key="index"  :label="data.name+'：'">
                    <el-checkbox-group v-model="selectCheck" @change="handleChecked">
                        <el-checkbox :disabled="disableArr.indexOf(childData.value) > -1" @change="handleCheckedChild(childData, index)" v-for="(childData, index1) in data.list" :key="index1" :label="childData.value">
                            <el-input @input="handleCheckedChild(childData, index)" :disabled="disableArr.indexOf(childData.value) === -1 && selectCheck.indexOf(childData.value) == -1 "  style="width:80px;" v-model="childData.label" size="mini" >
                            </el-input>
                            <img style="width:28px; height:28px;" v-if="childData.pictrueSource" :src="childData.pictrueSource"/>
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-card> -->
            <el-card  style="margin:20px 0 20px 0;">
                <div slot="header">
                    <span>规格信息</span>
                </div>
                 <el-table class="minegoods" id="tableMain" :data="tableData" border style="width: 100%">
                     <el-table-column align="center" type="index"  label="序号" > </el-table-column>
                     <el-table-column align="center" prop="normName"  label="规格" > </el-table-column>
                     <el-table-column align="center" prop="spuCode"  label="sku编号" > </el-table-column>
                     <el-table-column align="center" prop="skuName"  label="SKU名称" >
                     </el-table-column>
                     <el-table-column class="a1" align="center" prop="barCode"  label="条形码" >
                     </el-table-column>
                     <!-- <el-table-column align="center" prop="marketPrice2"  label="参考市场价(元)" >
                     </el-table-column> -->
                     <el-table-column align="center" prop="marketUnit"  label="销售单位" :render-header="renderHeader" >
                       <template slot-scope="scope">
                         <div>
                           {{checkdUnit('marketUnit', scope.row.marketUnit)}}
                         </div>
                       </template>
                    </el-table-column>
                     <el-table-column align="center" prop="minPackingQuantity"  label="最小装箱数"  >
                    </el-table-column>
                     <el-table-column align="center" prop="minOrderQuantity"  label="最小起订量"  >
                    </el-table-column>
                     <el-table-column align="center" prop="minDemandQuantity"  label="最小要货量"  >
                    </el-table-column>
                     <el-table-column align="center" prop="weight2"  label="重量(KG)"  >
                    </el-table-column>
                     <el-table-column align="center" prop="picture"  label="图片" >
                         <template slot-scope="scope">
                            <ul>
                                 <li  v-for="(data, index) in scope.row.pictureArr" :key="index">
                                     <img  style="width:50px; padding:5px 10px 5px 0;" v-if="data.indexOf('http') < 0" :src="imgSourceUrl + data"/>
                                     <img  style="width:50px; padding:5px 10px 5px 0;" v-else :src="data"/>
                                 </li>
                             </ul>
                         </template>
                    </el-table-column>
                     <el-table-column  align="center" prop="isValid"  label="状态">
                         <template slot-scope="scope">
                             <span v-if="scope.row.isValid == 1">启用</span>
                             <span v-else>停用</span>
                         </template>
                     </el-table-column>
                 </el-table>
            </el-card>

         </el-form>
        <!-- 操作日志弹窗 -->
        <el-dialog title="操作日志" :visible.sync="dialogVisibleTable" width="80%">
            <operate-table v-on:closeOperate="closeOperate"  v-if="operateParams.entityId" :url="'/logInfoPage'" :params="operateParams" ></operate-table>
        </el-dialog>

         <div style="text-align: center; padding: 20px 0 ;">
             <el-button v-if="searchParams.updateAuth == 1 && !supShow" size="mini" type="primary" @click="toMineRedit()" >编辑</el-button>
             <el-button size="mini" @click="back" >返回</el-button>
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
          isProductCenter: true, //
            serachRules: {
                barCode: [
                    {required: true, message: '请输入商品条形码', trigger: 'blur'}
                ]
            },
            radio: 1,
            dialogVisibleTable: false,
            operateParams: {   // 日志所需参数
                entityId: '',
                entityType: 'Items',
                operateType: '1'
            },
            searchParams: {
                spuCode: '', // spu编号
                isValid: '', // 商品状态
                name: '', // 商品名称
                categoryId: '', // 分类ID
                brandId: '', // 品牌id
                tradeType: '', // 贸易类型
                itemNo: '', // 商品货号
                producer: '', // 生产商
                pictrue: '', // 商品主图路径
                categoryName: '', // 商品类目
                brandName: '', // 品牌名称
                remark: '', // 备注
                mainPicture: '', // 主图
                marketPrice: '', // 市场价
                updateAuth: '', // 组长权限
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
            resultData: '',
            id: '', // 商品id
            imgSourceUrl: 'https://scm.trc.com/',
            supShow: '',
            backLastRouter: this.$route.query.backLastRouter,
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
            disableArr: [],
            contectId: []

        };
    },
    mounted: function() {
        this.supShow = this.$route.query.supShow;
        this.goodInitRedit();
    },
    components: {
        categorySelect,
        operateTable

    },
    methods: {
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
        checkdUnit(type, value) {
          let str = '';
          if (value) {
            str = this.$utils.querydiction(type, value);
          }
          return str;
        },
        operateTable() {
            this.dialogVisibleTable = true;
        },
        closeOperate() {
            this.dialogVisibleTable = false;
        },
        // 编辑初始化
        goodInitRedit() {
          let url = '';
          if (this.$route.params.flag) {
            url = '/goods/productCenter/spuCode/';
            this.isProductCenter = true;
          } else {
            url = '/goods/goods/spuCode/';
            this.isProductCenter = false;
          }
            this.$AXIOS.GET(url + this.goodSpucode).then(res => {
                if (res.result.items.errorMsg) this.$utils.messagetip.errorTip(res.result.items.errorMsg);
                this.resultData = res.result;
                for (let i in this.searchParams) {
                    for (let j in res.result.items) {
                        if (i === j) {
                            this.searchParams[i] = res.result.items[j];
                        }
                    }
                }
                this.operateParams.entityId = res.result.items.id;
                // this.categoryList(res.result.items.categoryId);
                // this.propertyList(res.result.items.categoryId, res.result.itemNatureProperys);
                this.id = res.result.items.id;
                res.result.skus.map(item => {
                    let flagId = (item.propertyValueId && item.propertyValueId.indexOf(',') > -1) ? item.propertyValueId.split(',').join('-') : '';
                    this.tableData.push({
                        normName: item.specInfo,
                        flagId: item.specInfo + '@' + flagId,
                        skuName: item.skuName,
                        barCode: item.barCode,
                        spuCode: item.skuCode,
                        marketPrice2: item.marketPrice2,
                        marketUnit: item.marketUnit,
                        minPackingQuantity: item.minPackingQuantity,
                        minOrderQuantity: item.minOrderQuantity,
                        minDemandQuantity: item.minDemandQuantity,
                        weight2: item.weight2,
                        picture: '',
                        pictureArr: item.picture ? item.picture.split(',') : [],
                        isValid: item.isValid,
                        sortStatus: 0
                    });
                });
                this.reduceNum(res.result.itemSalesProperies, this.checkedAttributes);
                res.result.itemSalesProperies.map(item => {  // 默认选中的属性
                    if (this.selectCheck.indexOf(item.propertyValueId) === -1) {
                        this.selectCheck.push(item.propertyValueId);
                        this.disableArr.push(item.propertyValueId);
                    }
                });
                res.result.itemNatureProperys.map((item, index) => {

                });
                if (res.result.items.mainPicture) {
                    let arr = (res.result.items.mainPicture && res.result.items.mainPicture.indexOf(',') > -1 ) ? res.result.items.mainPicture.split(',') : [res.result.items.mainPicture];
                    this.reditMainPicture = arr.map(item => {
                        this.fileListShow.push(item);
                        return {
                            url: item,
                            key: item
                        };
                    });
                    console.log(this.reditMainPicture);
                }
            });
        },
        reduceNum(cur, tol) {  // 拼凑num
            let obj = [];
            let arrId = [];
            cur.map((item, index) => {
                if (arrId.indexOf(item.propertyValueId) === -1) {
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
        toMineRedit() {
           this.$router.push({
               name: 'mineredit',
               params: {
                   id: this.goodSpucode
               }
           });
        },
        handlePreview() {},
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
                if (file.size > 1024 * 1024 * 3 ) {
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
        handleCheckedChild(obj, index) {
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
            for (let i = 0; i < this.num.length; i++) {
                let arr = [];
                let labelArr = [];
                let saleArr = [];

                for (let obj in this.num[i]) {
                    if (this.num[i][obj].length) {
                        for (let j = 0; j < this.num[i][obj].length; j++) {
                            let current = this.num[i][obj][j];

                            arr.push(current.parName + ':' + current.label + '@' + current.value);
                            // this.contectId.push(current.value + '');
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
        },
        printResult(result) {
             if (result && result.length) {
                this.contectId = [];
                result.map(item => {
                    let id = item.split('@')[1] + '';
                    this.contectId.push(id);
                });
                for (let i = 0, len = result.length; i < len; i++) {
                        let flag = true;
                        let resId = result[i].split('@')[1];
                        for (let j = 0; j < this.tableData.length; j++) {
                            let tableId = this.tableData[j].flagId.split('@')[1];
                            if (resId === tableId ) {
                                this.tableData[j].normName = result[i].split('@')[0];
                                flag = false;
                                break;
                            }
                        }
                        if (flag) {
                            this.tableData.push({
                                normName: result[i].split('@')[0],
                                flagId: result[i],
                                skuName: '',
                                barCode: '',
                                marketPrice2: '',
                                weight2: '',
                                picture: '',
                                pictureArr: [],
                                isValid: '1',
                                sortStatus: 0,
                                source: 1,
                                propertyValueId: resId.split('-').join(','),
                                propertyValue: this.selectNameArr.length ? this.selectNameArr.join(',') : ''
                            });
                        }
                    }
                    let newTable = [];
                    for (let j = 0; j < this.tableData.length; j++) {
                        let tableId = this.tableData[j].flagId.split('@')[1];
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
                        let id = heads[i].split('@')[1] + '-' + choices[j].split('@')[1];
                        let headName = heads[i].split('@')[0];
                        let choiceName = choices[j].split('@')[0];
                        result.push(headName + ' | ' + choiceName + '@' + id);
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
        activeSelectNature(arr, index) {
            console.log(arr);
            if (this.naturePropertys.length) {
                let flag = true;
                for (let i = 0; i < this.naturePropertys.length; i++) {
                    let curr = this.naturePropertys[i];
                    for (let obj in curr) {
                        if (index === obj * 1) {
                            flag = false;
                            curr[obj] = {};
                            curr[obj] = {
                                propertyId: arr.propertyId,
                                propertyValueId: arr.value,
                                propertyValue: arr.label
                            };
                        }
                    }
                }
                if (flag) {
                    let obj = {};
                    obj[arr.propertyId] = {
                        propertyId: arr.propertyId,
                        propertyValueId: arr.value,
                        propertyValue: arr.label
                    };
                    this.naturePropertys.push(obj);
                }
            } else {
                let obj = {};
                obj[arr.propertyId] = {
                    propertyId: arr.propertyId,
                    propertyValueId: arr.value,
                    propertyValue: arr.label
                };
                this.naturePropertys.push(obj);
                console.log(this.naturePropertys);
            }
        },
        // 保存数据
        keepData() {
            console.log(this.noChangeData, this.checkedAttributes);

            //  console.log(data.ProperyForItemForm);
            if (!this.searchParams.name) {
                this.$utils.messagetip.warningTip('请输入商品名称');
                return;
            } else if (!this.searchParams.categoryId) {
                this.$utils.messagetip.warningTip('请选择商品类目');
                return;
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
                            imgArr.push(item.pictureArr[i].key);
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
        // 校验SKU信息
        checkSKUData() {
            let parent = document.getElementById('tableMain');
            let regexp = new RegExp(/^[0-9a-zA-Z-#,]+$/);
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
                } else if (!regexp.test(current.barCode)) {
                    index = i;
                    num = 1;
                    this.$utils.messagetip.warningTip('条形码格式错误');
                    break;
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
        /**
         * @param row 当前列对象
         * @param index 为规格信息列表的索引
         * @param i 为当前列的第几个input
         */
        keyupBarcode(row, index, i) {
            let regexp = new RegExp(/^[0-9a-zA-Z-#,]+$/);
            let parent = document.getElementById('tableMain');
            let code = row.barCode;
            let flag = false;
            if (!code) {
                flag = true;
                this.$utils.messagetip.warningTip('条形码不能为空');
            } else if (regexp.test(code)) {
                this.$AXIOS.POST('/goods/checkBarcodeOnly', {barCode: code, isValid: row.isValid}).then(res => {

                }, error => {
                   if (error) {
                       row.barCode = '';
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
            if (this.backLastRouter) {
                this.$router.go(-1);
            } else {
                this.$router.push({path: '/minegoods'});
            }
        },
        // 查询分类关联品牌
        categoryList(id) {
            let data = {
                isValid: 1,
                categoryId: id
            };

            this.$AXIOS.GET('/category/categoryBrands', data).then(res => {
                if ( res.result ) {
                    this.brandNameOptions = res.result.map((item, index) => {
                        return {
                            value: item.brandId,
                            label: item.brandName
                        };
                    });
                } else {
                    this.brandNameOptions = [];
                }
            });
        },
        // 所属类目选择
        selectResult(res) {
            this.searchParams.categoryId = res.categoryId;
            this.propertyOptions = [];
            this.checkedAttributes = [];
            // this.categoryList(res.categoryId);
            // this.propertyList(res.categoryId);
        },
        // 获取属性
        propertyList(id, row) {
            this.$AXIOS.GET('/category/categoryProperty/' + id).then(res => {
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
                                console.log(i, row[i], 99);
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
                        if (item.propertyId === this.propertyOptions[i].propertyId) {
                            this.propertyOptions[i].list.push({
                                value: item.id,
                                label: item.value,
                                propertyId: item.propertyId
                            });
                        }
                    }

                    for (let i = 0; i < this.checkedAttributes.length; i++) {
                        if (item.propertyId === this.checkedAttributes[i].propertyId) {
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
                console.log(this.checkedAttributes, 'checkedAttributes');
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
</style>

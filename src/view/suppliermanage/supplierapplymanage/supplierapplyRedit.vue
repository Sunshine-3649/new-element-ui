
<template>
    <div class="supplierapplyadd">
        <div style="padding: 10px 0">
          <span>供应商编辑</span>
          <span @click="operateTable" style="float:right; color:#409EFF; cursor:pointer">操作日志</span>
        </div>
        <div class="title"> 基本信息</div>
        <el-form style="margin-top:20px"  label-width="125px" ref="queryForm" size="medium">
            <el-row>
                <el-form-item label="供应商编号："  size="mini">
                    {{ this.searchParams.supplierCode }}
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="供应商性质：" required size="mini">
                    <el-row>
                        <el-col :span="4">
                            <el-radio-group  v-model="searchParams.supplierKindCode">
                                <el-radio label="purchase">采购</el-radio>
                                <el-radio label="oneAgentSelling">代发</el-radio>
                            </el-radio-group>
                        </el-col>
                        <el-col v-show="searchParams.supplierKindCode == 'oneAgentSelling'" :span="5">
                            <el-form-item label="供应商接口ID：" required size="mini">
                                <el-input v-model="searchParams.supplierInterfaceId" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="供应商类型：" required size="mini">
                    <el-radio-group  v-model="searchParams.supplierTypeCode">
                        <el-radio label="internalSupplier">国内供应商</el-radio>
                        <el-radio label="overseasSupplier">海外供应商</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="可见业务线：" required size="mini">
                    <el-checkbox-group v-model="channel">
                        <el-checkbox v-for="(data, index) in checkListOptions" :key="index" :label="data.code">{{ data.name }}</el-checkbox>
                    </el-checkbox-group>
                    <div>
                        <span style="color:red">说明：</span>勾选了的业务线能看到此供应商信息,未勾选的不可见
                    </div>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="供应商名称：" required size="mini">
                    <el-input maxlength="50" v-model="searchParams.supplierName" style="width:250px;" placeholder=""> </el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="供应商简称："  size="mini">
                    <el-input maxlength="10" v-model="searchParams.supplierShortCall" style="width:250px;" placeholder=""> </el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="联系人：" required size="mini">
                    <el-input maxlength="20" v-model="searchParams.contact" style="width:250px;" placeholder=""> </el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="联系人电话：" required size="mini">
                    <el-input maxlength="20" @change="checkPhone('phone')" v-model="searchParams.phone" style="width:250px;" placeholder=""> </el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item v-if="searchParams.supplierTypeCode == 'internalSupplier'" label="省份-城市-地区：" size="mini">
                    <el-cascader
                        :options="cityOptions"
                        v-model="selectedCityOptions"
                        filterable
                        separator="-"
                        placeholder="请选择省,市,区"
                        @change="handleCityChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item v-else label="所在国家：" required  size="mini">
                    <el-select v-model="searchParams.country" filterable placeholder="请选择国家">
                        <el-option
                        v-for="item in countryOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="详细地址：" required size="mini">
                    <el-input maxlength="150" v-model="searchParams.address" style="width:500px;" placeholder=""> </el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item v-if="searchParams.supplierTypeCode == 'internalSupplier'" label="证件类型：" :required="searchParams.supplierKindCode == 'purchase'" size="mini">
                    <el-radio-group v-model="searchParams.certificateTypeId">
                        <el-radio label="normalThreeCertificate">普通三证</el-radio>
                        <el-radio label="multiCertificateUnion">多证合一</el-radio>
                    </el-radio-group>
                    <div class="tableMain">
                        <ul class="head">
                            <li>证件类型</li>
                            <li>证件号</li>
                            <li>证件有效期</li>
                            <li>证件图片</li>
                        </ul>
                        <ul v-if="searchParams.certificateTypeId == 'normalThreeCertificate'" class="main">
                            <li  :class="searchParams.supplierKindCode == 'purchase' ? 'required' : ''">营业执照</li>
                            <li>
                                <el-input maxlength="32" v-model="searchParams.businessLicence" style="width:80%" placeholder=""></el-input>
                            </li>
                            <li>
                                <el-date-picker @change="checkDate('businessLicenceStartDate', 'businessLicenceEndDate')"  v-model="searchParams.businessLicenceStartDate" style="width: 45%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  type="date" placeholder="选择开始日期"></el-date-picker>
                                <el-date-picker @change="checkDate('businessLicenceStartDate', 'businessLicenceEndDate')" v-model="searchParams.businessLicenceEndDate" style="width: 45%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"   type="date" placeholder="选择结束日期"></el-date-picker>
                            </li>
                            <li>
                                <div v-if="!searchParams.businessLicencePic">
                                    <el-upload name="Filedata" ref="upload1" :action="uploadUrl" :limit="1" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG," :before-upload="beforeUpload" :on-success="multiUploadSuccess1" :on-preview="handlePreview" :on-remove="handleRemove">
                                        <el-button @click="uploadImgFlag('upload1')"  type="text" size="mini">上传</el-button>
                                    </el-upload>
                                </div>
                                <div v-else>
                                    <a target="_blank" :href="showImg1">
                                        <img style="width:40px;" :src="showImg1" />
                                    </a>
                                    <span @click="deleteImg('upload1')" style="color:#409EFF; cursor:pointer"> 删除 </span>
                                </div>
                            </li>
                        </ul>
                        <ul  v-if="searchParams.certificateTypeId == 'normalThreeCertificate'" class="main">
                            <li :class="searchParams.supplierKindCode == 'purchase' ? 'required' : ''">组织机构代码证</li>
                            <li>
                                <el-input maxlength="18" v-model="searchParams.organRegistraCodeCertificate" style="width:80%" placeholder=""></el-input>
                            </li>
                            <li>
                                <el-date-picker  @change="checkDate('organRegistraStartDate', 'organRegistraEndDate')" v-model="searchParams.organRegistraStartDate" style="width: 45%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  type="date" placeholder="选择开始日期"></el-date-picker>
                                <el-date-picker  @change="checkDate('organRegistraStartDate', 'organRegistraEndDate')" v-model="searchParams.organRegistraEndDate" style="width: 45%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"   type="date" placeholder="选择结束日期"></el-date-picker>
                            </li>
                            <li>
                                <div v-if="!searchParams.organRegistraCodeCertificatePic">
                                    <el-upload name="Filedata" ref="upload2" :action="uploadUrl" :limit="1" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG," :before-upload="beforeUpload" :on-success="multiUploadSuccess2" :on-preview="handlePreview" :on-remove="handleRemove">
                                        <el-button @click="uploadImgFlag('upload2')"   type="text" size="mini">上传</el-button>
                                    </el-upload>
                                </div>
                                <div v-else>
                                    <a target="_blank" :href="showImg2">
                                        <img style="width:40px;" :src="showImg2" />
                                    </a>
                                    <span @click="deleteImg('upload2')" style="color:#409EFF; cursor:pointer"> 删除 </span>
                                </div>
                            </li>
                        </ul>
                        <ul v-if="searchParams.certificateTypeId == 'normalThreeCertificate'" class="main">
                            <li :class="searchParams.supplierKindCode == 'purchase' ? 'required' : ''">税务登记证</li>
                            <li>
                                <el-input maxlength="32" v-model="searchParams.taxRegistrationCertificate" style="width:80%" placeholder=""></el-input>
                            </li>
                            <li>
                                <el-date-picker @change="checkDate('taxRegistrationStartDate', 'taxRegistrationEndDate')" v-model="searchParams.taxRegistrationStartDate" style="width: 45%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  type="date" placeholder="选择开始日期"></el-date-picker>
                                <el-date-picker @change="checkDate('taxRegistrationStartDate', 'taxRegistrationEndDate')" v-model="searchParams.taxRegistrationEndDate" style="width: 45%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"   type="date" placeholder="选择结束日期"></el-date-picker>
                            </li>
                            <li>
                                <div v-if="!searchParams.taxRegistrationCertificatePic">
                                    <el-upload name="Filedata" ref="upload3" :action="uploadUrl" :limit="1" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG," :before-upload="beforeUpload" :on-success="multiUploadSuccess3" :on-preview="handlePreview" :on-remove="handleRemove">
                                        <el-button @click="uploadImgFlag('upload3')"  type="text" size="mini">上传</el-button>
                                    </el-upload>
                                </div>
                                <div v-else>
                                    <a target="_blank" :href="showImg3">
                                        <img style="width:40px;" :src="showImg3" />
                                    </a>
                                    <span @click="deleteImg('upload3')" style="color:#409EFF; cursor:pointer"> 删除 </span>
                                </div>
                            </li>
                        </ul>
                        <ul v-if="searchParams.certificateTypeId == 'multiCertificateUnion'"  class="main">
                            <li :class="searchParams.supplierKindCode == 'purchase' ? 'required' : ''">多证合一</li>
                            <li>
                                <el-input maxlength="18" v-model="searchParams.multiCertificateCombineNo" style="width:80%" placeholder=""></el-input>
                            </li>
                            <li>
                                <el-date-picker @change="checkDate('multiCertificateStartDate', 'multiCertificateEndDate')" v-model="searchParams.multiCertificateStartDate" style="width: 45%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  type="date" placeholder="选择开始日期"></el-date-picker>
                                <el-date-picker @change="checkDate('multiCertificateStartDate', 'multiCertificateEndDate')" v-model="searchParams.multiCertificateEndDate" style="width: 45%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"   type="date" placeholder="选择结束日期"></el-date-picker>
                            </li>
                            <li>
                                <div v-if="!searchParams.multiCertificateCombinePic">
                                    <el-upload name="Filedata" ref="upload4" :action="uploadUrl" :limit="1" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG," :before-upload="beforeUpload" :on-success="multiUploadSuccess4" :on-preview="handlePreview" :on-remove="handleRemove">
                                        <el-button @click="uploadImgFlag('upload4')"  type="text" size="mini">上传</el-button>
                                    </el-upload>
                                </div>
                                <div v-else>
                                    <a target="_blank" :href="showImg4">
                                        <img style="width:40px;" :src="showImg4" />
                                    </a>
                                    <span @click="deleteImg('upload4')" style="color:#409EFF; cursor:pointer"> 删除 </span>
                                </div>
                            </li>
                        </ul>
                        <ul  class="main">
                            <li :class="searchParams.supplierKindCode == 'purchase' ? 'required' : ''">法人身份证</li>
                            <li>
                                <el-input maxlength="32" @change="checkLegalPersonId" v-model="searchParams.legalPersonIdCard" style="width:80%" placeholder=""></el-input>
                            </li>
                            <li>
                                <el-date-picker @change="checkDate('idCardStartDate', 'idCardEndDate')"  v-model="searchParams.idCardStartDate" style="width: 45%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  type="date" placeholder="选择开始日期"></el-date-picker>
                                <el-date-picker @change="checkDate('idCardStartDate', 'idCardEndDate')"  v-model="searchParams.idCardEndDate" style="width: 45%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"   type="date" placeholder="选择结束日期"></el-date-picker>
                            </li>
                            <li>
                                <template v-if="!searchParams.legalPersonIdCardPic1">
                                    <el-upload name="Filedata" style="height:30px; line-height:30px;" ref="upload5" :action="uploadUrl" :limit="1" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG," :before-upload="beforeUpload" :on-success="multiUploadSuccess5" :on-preview="handlePreview" :on-remove="handleRemove">
                                        <el-button @click="uploadImgFlag('upload5')"  type="text" size="mini">上传正面</el-button>
                                        <!-- <span> 上传正面</span> -->
                                    </el-upload>
                                </template>
                                <template v-if="!searchParams.legalPersonIdCardPic2">
                                    <el-upload name="Filedata" style="height:30px; line-height:30px;" ref="upload6" :action="uploadUrl" :limit="1" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG," :before-upload="beforeUpload" :on-success="multiUploadSuccess6" :on-preview="handlePreview" :on-remove="handleRemove">
                                         <el-button @click="uploadImgFlag('upload6')"  type="text" size="mini">上传反面</el-button>
                                         <!-- <span> 上传反面</span> -->
                                    </el-upload>
                                </template>
                                <template style="height:30px">
                                    <span  style="line-height:28px;color:#409EFF; cursor:pointer" v-if="searchParams.legalPersonIdCardPic1">
                                        <a target="_blank" :href="showImg5">
                                            <img style="width:40px;" :src="showImg5" />
                                        </a>
                                        <span @click="deleteImg('upload5')">删除</span>
                                    </span>
                                    <span  style="line-height:28px;color:#409EFF; cursor:pointer" v-if="searchParams.legalPersonIdCardPic2">
                                        <a target="_blank" :href="showImg6">
                                            <img style="width:40px;" :src="showImg6" />
                                        </a>
                                        <span @click="deleteImg('upload6')">删除</span>
                                    </span>
                                </template>
                            </li>
                        </ul>
                    </div>
                    <span>注：以上图片支持JPG、JPEG、BMP、PNG格式，大小不超过3M。</span>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="备注："  size="mini">
                    <el-input maxlength="300" v-model="searchParams.remark" style="width:500px;" type="textarea" placeholder=""> </el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="是否生效：" required size="mini">
                    <el-radio-group v-model="searchParams.isValid">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-row>
        </el-form>
        <div class="title"> 其他信息</div>
        <el-tabs style="margin-top:20px;" type="border-card">
            <el-tab-pane label="代理类目">
                <el-button @click="addCategory" v-if="isAddCategory" style="margin-bottom:10px" type="primary" size="mini">
                    添加类目
                </el-button>
                <el-form v-else label-width="120px;">
                    <el-row :span="24">
                        <el-col :span="10">
                            <category url='productCenter/category/tree' :clear="clear"  v-on:selectResult="selectResult"></category>
                        </el-col>
                        <el-col :span="3">
                            <el-button :disabled="currentCategory.length < 1" @click="confirmAddCategory" size="mini" type="primary"> 确定添加 </el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <el-table  :data="tableDataCategory" border >
                    <el-table-column label="序号"  type="index" width="100" align="center"></el-table-column>
                    <el-table-column label="类目名称(一级二级三级)" prop="categoryName"  align="center"></el-table-column>
                    <el-table-column label="操作" prop="" width="100" align="center">
                        <template slot-scope="scope">
                            <el-button @click="categoryDelete(scope.row,scope.$index)" type="text">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="代理品牌">
                <el-button @click="addBrand(true)" style="margin-bottom:10px" type="primary" size="mini">
                    添加品牌
                </el-button>
                <el-table v-loading="isUploaded" element-loading-background="rgba(0, 0, 0, 0.3)" class="supplierTableBrand" id="supplierTableBrand"  :data="currentBrand" border >
                    <el-table-column label="品牌名称"  prop="brandName"  align="center"></el-table-column>
                    <el-table-column label="所属分类" prop="categoryNames"  align="center"></el-table-column>
                    <el-table-column label="代理资质" prop=""  align="center">
                        <template slot-scope="scope">
                            <el-select size="mini" v-model="scope.row.proxyAptitudeId" placeholder="请选择">
                                <el-option
                                    v-for="item in proxyAptitude"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="代理有效期(开始和截止)" prop="proxyAptitudeStartDate"  align="center">
                        <template slot-scope="scope">
                            <el-date-picker  @change="checkBrandTime(scope.row.proxyAptitudeStartDate, scope.row.proxyAptitudeEndDate, scope.$index)" size="mini" v-model="scope.row.proxyAptitudeStartDate" style="width: 45%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  type="date" placeholder="选择开始日期"></el-date-picker>
                            <el-date-picker  @change="checkBrandTime(scope.row.proxyAptitudeStartDate, scope.row.proxyAptitudeEndDate, scope.$index)" size="mini" v-model="scope.row.proxyAptitudeEndDate" style="width: 45%" format="yyyy-MM-dd" value-format="yyyy-MM-dd"   type="date" placeholder="选择结束日期"></el-date-picker>
                        </template>
                    </el-table-column>
                    <el-table-column label="资质证明(最多三张)" prop=""  align="center">
                        <template slot-scope="scope">
                            <el-upload
                                v-if="scope.row.pictureArr.length < 3"
                                class="upload-demo"
                                name="Filedata"
                                :ref="'upload'+scope.$index"
                                :before-upload="beforeUpload1"
                                :action="uploadUrl"
                                :on-preview="handlePreview"
                                :on-remove="handleRemoveBrand"
                                :on-success="brandUploadSuccess"
                                :file-list="[]"
                                list-type="picture">
                                <el-button   @click="uploadCurrent(scope.row.pictureArr, scope.$index)" size="mini" type="text">点击上传</el-button>
                            </el-upload>
                            <ul>
                                <li v-for="(data, index) in scope.row.pictureArr" :key="index">
                                    <a target="_blank" :href="data.url">
                                        <img style="width:50px; padding:5px 10px 5px 0;" :src="data.url"/>
                                    </a>
                                    <el-button @click="deleteCurrentImg(scope.$index, data)"  size="mini" type="text">删除</el-button>
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
                    <el-table-column width="60" label="操作" prop=""  align="center">
                        <template slot-scope="scope">
                            <el-button @click="currentBrandDelete(scope.row, scope.$index)"  type="text">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="财务信息">
                <el-form label-width="125px" :inline="true" size="mini">
                    <el-form-item label="开户行：" required >
                        <el-input maxlength="50" v-model="searchParams.depositBank" style="width:250px; margin-right:30px;" placeholder=""> </el-input>
                    </el-form-item>
                    <el-form-item label="银行账号：" required >
                        <el-input maxlength="30" v-model="searchParams.bankAccount" style="width:250px;" placeholder=""> </el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="售后信息">
                <el-form label-width="125px" size="mini">
                    <el-form-item label="退货省市区：" required >
                        <el-cascader
                            :options="cityOptions"
                            v-model="returnSaleSelectedCityOptions"
                            separator="-"
                            placeholder="请选择省,市,区"
                            filterable
                            @change="returnSaleHandleCityChange">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="退货地址：" required >
                        <el-input maxlength="150" v-model="searchParams.goodsReturnAddress"  style="width:250px;" placeholder=""> </el-input>
                    </el-form-item>
                    <el-form-item label="退货联系人：" required >
                        <el-input maxlength="20" v-model="searchParams.goodsReturnContactPerson" style="width:250px;" placeholder=""> </el-input>
                    </el-form-item>
                    <el-form-item label="退货联系电话：" required >
                        <el-input maxlength="20" @change="checkPhone('goodsReturnPhone')" v-model="searchParams.goodsReturnPhone" style="width:250px;" placeholder=""> </el-input>
                    </el-form-item>
                    <el-form-item label="退货策略："  >
                        <el-input maxlength="1500" v-model="searchParams.goodsReturnStrategy" type="textarea" style="width:500px;" placeholder=""> </el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <div style="text-align: center;padding: 20px 0 ;">
            <el-button @click="keepSupplierData"  size="mini" type="primary">保存</el-button>
            <el-button @click="back" size="mini" type="">返回</el-button>
        </div>

        <el-dialog :close="closeSelectBrand" title="选择品牌" :visible.sync="dialogTableVisibleBrand">
            <el-row :span="24">
                <el-col :span="6">
                    <el-input v-model.trim="searchBrandNmae" size="mini"></el-input>
                </el-col>
                <el-col :span="3">
                    <el-button @click="searchBrandResult" type="primary" size="mini">查询</el-button>
                </el-col>
            </el-row>
            <div class="brand_warp">
                <ul class="brand_ul">
                    <li  v-for="(data, index) in tableDataBrand" :key="index">
                        <el-checkbox  @change="addBrandSelect(data)" >{{ data.brandName }}</el-checkbox>
                    </li>
                    <div class="null" v-if="!tableDataBrand.length">暂无品牌</div>
                </ul>
            </div>

            <div class="current_select" style="min-height:80px;margin: 20px 0">
                <el-row :span="24">
                    <el-col style="font-weight:800" :span="2">
                        当前选择：
                    </el-col>
                    <el-col :span="20">
                         <span v-for="(data, index) in temporaryStorageData" :key="index">
                             <!-- {{ currentBrand }} -->
                             <template v-if="temporaryStorageData.length && index == temporaryStorageData.length-1">
                                 {{ data.brandName }}
                             </template>
                             <template v-else>
                                 {{ data.brandName+',' }}
                             </template>
                         </span>
                    </el-col>
                </el-row>
            </div>
            <div style="text-align:center; margin-top 20px">
                <el-button @click="keepSelectBrand" :disabled="disabledBtn" size="mini" type="primary">保存</el-button>
                <el-button @click="closeSelectBrand"  size="mini" type="">关闭</el-button>
            </div>
        </el-dialog>
        <!-- 操作日志弹窗 -->
        <el-dialog title="操作日志" :visible.sync="dialogVisibleOperate" width="80%">
            <operate-table v-on:closeOperate="closeOperate"  v-if="operateParams.entityId" :url="'/logInfoPage'" :params="operateParams" ></operate-table>
        </el-dialog>
    </div>
</template>

<script>
import category from '@/components/supplierCateSelect';
import operateTable from '@/components/operateTable';
export default {
    data() {
        return {
            uploadUrl: '/scm-web/qinniuPrivate/upload/supply',
            imgSource: 'https://scm.trc.com/',
            id: '',
            dialogTableVisibleBrand: false,
            dialogVisibleOperate: false,
            isAddCategory: true,
            clear: false, // 清除代理类目
            radio: '',
            supperlierCode: this.$route.params.id, // 供应商code
            operateParams: {
                entityId: '',
                entityType: 'Supplier',
                operateType: '1'
            },
            searchParams: {
                supplierCode: this.$route.params.id,
                supplierKindCode: 'purchase', // 供应商性质
                supplierInterfaceId: '', // 供应商接口ID
                supplierTypeCode: 'internalSupplier', // 供应商类型
                supplierName: '', // 供应商名称
                supplierShortCall: '', // 供应商简称
                contact: '', // 联系人
                phone: '', // 联系人电话
                province: '', // 省份
                city: '', // 城市
                area: '', // 地区
                address: '', // 详细地址
                certificateTypeId: 'normalThreeCertificate', // 证件类型
                remark: '', // 备注
                isValid: '1', // 是否生效
                country: '', // 国家
                businessLicencePic: '', // 营业执照图片
                businessLicence: '', // 营业执照证件号
                businessLicenceStartDate: '', // 营业执照开始日期
                businessLicenceEndDate: '', // 营业执照结束日期
                organRegistraCodeCertificate: '', // 组织机构代码证
                organRegistraCodeCertificatePic: '', // 组织机构代码证图片
                organRegistraStartDate: '', // 组织机构代码证有效期开始日期
                organRegistraEndDate: '', // 组织机构代码证有效期结束日期
                taxRegistrationCertificate: '', // 税务登记证
                taxRegistrationCertificatePic: '', // 税务登记证图片
                taxRegistrationStartDate: '', // 税务登记证有效期开始日期
                taxRegistrationEndDate: '', // 税务登记证有效期结束日期
                multiCertificateCombineNo: '', // 多证合一号
                multiCertificateCombinePic: '', // 多证合一图片
                multiCertificateStartDate: '', // 多证合一开始时间
                multiCertificateEndDate: '', // 多证合一结束时间
                legalPersonIdCardPic1: '', // 法人身份证正面图片地址
                legalPersonIdCardPic2: '', // 法人身份证反面图片地址
                legalPersonIdCard: '', // 法人身份证编号
                idCardStartDate: '', // 省份证开始时间
                idCardEndDate: '', // 省份证结束时间
                depositBank: '', // 开户行
                bankAccount: '', // 银行账号
                saleProvince: '', // 退货省份
                saleCity: '', // 退货城市
                saleArea: '', // 退货地区
                goodsReturnAddress: '', // 退货详细地址
                goodsReturnContactPerson: '', // 退货联系人
                goodsReturnPhone: '', // 退货联系人电话
                goodsReturnStrategy: '' // 退货策略
            },
            countryOptions: [],
            cityOptions: [],
            selectedCityOptions: [], // 供应商的省市区
            returnSaleSelectedCityOptions: [], // 退货商省市区
            channel: [],
            checkListOptions: [],
            tableDataCategory: [],
            tableDataBrand: [],
            currentBrand: [], // 品牌列表
            searchBrandNmae: '',
            currentCategory: [], // 所选当前分类
            uploadFlag: '', //
            proxyAptitude: [{
                label: '品牌方',
                value: 'brandSubdivision'
            }, {
                label: '一级代理',
                value: 'firstAgent'
            }, {
                label: '二级代理',
                value: 'secondAgent'
            }, {
                label: '网络总代理',
                value: 'netGeneralAgent'
            }, {
                label: '其他',
                value: 'others'
            }],
            tableImgCurrent: 0, // 当前品牌的索引
            isUploaded: false,
            temporaryStorageData: [], // 勾选的数据 暂存的
            brandPageData: {
                pageSize: 10,
                pageNo: 1
            },
            deleteBrandDataRedit: [], // 这里很坑的 编辑时删除的品牌数据放到这里 最后提交是再跟最后的品牌数据合并
            noChangeBrandData: [],
            disabledBtn: false, // 防止多次点击按钮
            showImg1: '', // 上传成功后营业执照缩略图
            showImg2: '', // 上传成功后组织机构缩略图
            showImg3: '', // 上传成功后税务证件缩略图
            showImg4: '', // 上传成功后多证合一证件缩略图
            showImg5: '', // 上传成功后身份证件正面证件缩略图
            showImg6: ''  // 上传成功后身份证件反面证件缩略图
        };
    },
    components: {
        category,
        operateTable
    },
    mounted: function() {
        this.initCountry();
        this.initCheckList();
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
        this.initSupplierData();
        this.cityOptions.unshift({
           label: '省份',
           value: '',
           children: [{
               label: '城市',
               value: '',
               children: [{
                   label: '地区',
                   value: ''
               }]
           }]
       });
    },
    methods: {
        checkDate(start, end) {
            let s = new Date(this.searchParams[start]).getTime();
            let e = new Date(this.searchParams[end]).getTime();
            if (e < s) {
                this.searchParams[start] = '';
                this.searchParams[end] = '';
                this.$message.warning('结束日期不得小于开始日期');
            }
        },
        checkBrandTime(start, end, index) {
            let s = new Date(start).getTime();
            let e = new Date(end).getTime();
             if (e < s) {
                for (let i = 0; i < this.currentBrand.length; i++) {
                    if (index === i) {
                        this.currentBrand[i].proxyAptitudeStartDate = '';
                        this.currentBrand[i].proxyAptitudeEndDate = '';
                        break;
                    }
                }
                this.$message.warning('结束日期不得小于开始日期');
            }
        },
        back() {
            this.$router.push({
                name: 'supplierManage'
            });
        },
        // 操作日志弹窗
        operateTable() {
            this.dialogVisibleOperate = true;
        },
        // 关闭日志弹窗
        closeOperate() {
            this.dialogVisibleOperate = false;
        },
        // 关闭选择品牌弹窗
        closeSelectBrand() {
            this.dialogTableVisibleBrand = false;
            this.temporaryStorageData = [];
        },
        // 校验手机号
        checkPhone(row) {
            let regexp = new RegExp(/^(((1[0-9][0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/); // 手机好吗格式
            let telReg = /^0\d{2,3}-?\d{7,8}$/; // 电话号码格式
            if (!regexp.test(this.searchParams[row]) && !telReg.test(this.searchParams[row])) {
                this.searchParams[row] = '';
                this.$message.warning('手机或电话号码格式错误,请重新填写');
            }
        },
        // 校验身份证号
        checkLegalPersonId() {
            let reg = /^\d{15}|(\d{17}(\d|x|X))$/;
            if (!reg.test(this.searchParams.legalPersonIdCard)) {
                this.$message.warning('法人身份证号格式错误,请重新填写');
                this.searchParams.legalPersonIdCard = '';
            }
        },
        // 初始化供应商
        initSupplierData() {
            this.$AXIOS.GET('/supplier/supplier/' + this.supperlierCode).then(res => {
                let data = {
                    thumbnail: '0',
                    fileNames: []
                };
                // if (res.result.certificate) {
                //     this.showImg1 = this.imgSource + res.result.certificate.businessLicencePic;
                //     this.showImg2 = this.imgSource + res.result.certificate.organRegistraCodeCertificatePic;
                //     this.showImg3 = this.imgSource + res.result.certificate.taxRegistrationCertificatePic;
                //     this.showImg4 = this.imgSource + res.result.certificate.multiCertificateCombinePic;
                //     this.showImg5 = this.imgSource + res.result.certificate.legalPersonIdCardPic1;
                //     this.showImg6 = this.imgSource + res.result.certificate.legalPersonIdCardPic2;
                // }
                this.id = this.operateParams.entityId = res.result.supplier.id;
                for (let i in this.searchParams) {
                    if (res.result.certificate) {
                        for (let j in res.result.certificate) {
                            if (i === j) {
                                this.searchParams[i] = res.result.certificate[j];
                            }
                        }
                    }

                    for (let j in res.result.supplier) {
                        if (i === j) {
                            this.searchParams[i] = res.result.supplier[j];
                        }
                    }
                    for (let j in res.result.supplierFinancialInfo) {
                        if (i === j) {
                            this.searchParams[i] = res.result.supplierFinancialInfo[j];
                        }
                    }
                    for (let j in res.result.supplierAfterSaleInfo) {
                        if (i === j) {
                            this.searchParams[i] = res.result.supplierAfterSaleInfo[j];
                        }
                    }
                }
                if (res.result.certificate) {
                    for (let obj in res.result.certificate) {
                        if (obj === 'businessLicencePic' && res.result.certificate[obj]) {
                            data.fileNames.push(res.result.certificate[obj]);
                        } else if (obj === 'legalPersonIdCardPic1' && res.result.certificate[obj]) {
                            data.fileNames.push(res.result.certificate[obj]);
                        } else if (obj === 'legalPersonIdCardPic2' && res.result.certificate[obj]) {
                            data.fileNames.push(res.result.certificate[obj]);
                        } else if (obj === 'multiCertificateCombinePic' && res.result.certificate[obj]) {
                            data.fileNames.push(res.result.certificate[obj]);
                        } else if (obj === 'organRegistraCodeCertificatePic' && res.result.certificate[obj]) {
                            data.fileNames.push(res.result.certificate[obj]);
                        } else if (obj === 'taxRegistrationCertificatePic' && res.result.certificate[obj]) {
                            data.fileNames.push(res.result.certificate[obj]);
                        }
                    }
                }
                if (data.fileNames.length) {
                    data.fileNames = data.fileNames.join(',');
                    this.$AXIOS.GET('/qinniuPrivate/urls', data).then(res => {
                        res.result.map(item => {
                            if (item.fileKey === this.searchParams.businessLicencePic) {
                                this.showImg1 = item.url;
                            }
                            if (item.fileKey === this.searchParams.organRegistraCodeCertificatePic) {
                                this.showImg2 = item.url;
                            }
                            if (item.fileKey === this.searchParams.taxRegistrationCertificatePic) {
                                this.showImg3 = item.url;
                            }
                            if (item.fileKey === this.searchParams.multiCertificateCombinePic) {
                                this.showImg4 = item.url;
                            }
                            if (item.fileKey === this.searchParams.legalPersonIdCardPic1) {
                                this.showImg5 = item.url;
                            }
                            if (item.fileKey === this.searchParams.legalPersonIdCardPic2) {
                                this.showImg6 = item.url;
                            }
                        });
                    });
                }
                this.selectedCityOptions = [res.result.supplier.province, res.result.supplier.city, res.result.supplier.area];
                this.returnSaleSelectedCityOptions = [res.result.supplierAfterSaleInfo.saleProvince, res.result.supplierAfterSaleInfo.saleCity, res.result.supplierAfterSaleInfo.saleArea];
                res.result.supplierChannelRelations.map((item, index) => {
                    this.channel.push(item.channelId + '-' + item.channelCode);
                });
            });
            // 初始化类目
            this.$AXIOS.LISTGET('/supplier/supplierCategorys', {supplierCode: this.supperlierCode, start: 0, pageIndex: 0}).then(res => {
                this.tableDataCategory = res;
            });
            // 初始化品牌
            this.$AXIOS.GET('/supplier/supplierBrands', {supplierCode: this.supperlierCode}).then(res => {
                res.result.map(item => {
                    item.categoryNames = item.categoryName;
                    item.pictureArr = [];
                    item.proxyAptitudeStartDate = this.timeChange(item.proxyAptitudeStartDate);
                    item.proxyAptitudeEndDate = this.timeChange(item.proxyAptitudeEndDate);
                    item.source = 0;
                    item.status = 2;
                    if (item.aptitudePic) {
                        let imgArr = item.aptitudePic.split(',');
                        this.$AXIOS.GET('/qinniuPrivate/urls', {thumbnail: '0', fileNames: item.aptitudePic}).then(res => {
                            res.result.map(item1 => {
                                item.pictureArr.push({
                                    key: item1.fileKey,
                                    url: item1.url
                                });
                            });
                        });
                    }
                });
                this.currentBrand = res.result;
            });
        },
        // 供应商保存
        keepSupplierData() {
            if (this.checkSupplierData()) {
                // this.filterKeepData();
                let data = this.searchParams;
                data.channel = this.channel.length ? this.channel.join(',') : '';
                if (this.tableDataCategory.length) {
                    data.supplierCetegory = JSON.stringify(this.tableDataCategory);
                } else {
                    data.supplierCetegory = [];
                }
                this.currentBrand = this.currentBrand.concat(this.deleteBrandDataRedit);

                if (this.currentBrand.length) {
                    this.currentBrand.map(item => {
                        item.proxyAptitudeStartDate = new Date(item.proxyAptitudeStartDate).getTime();
                        item.proxyAptitudeEndDate = new Date(item.proxyAptitudeEndDate).getTime();
                        let imgArr = [];
                        if (item.pictureArr.length) {
                            for (let i = 0; i < item.pictureArr.length; i++) {
                                imgArr.push(item.pictureArr[i].key);
                            }
                        }
                        if (imgArr.length) item.aptitudePic = imgArr.join(',');
                    });
                    data.supplierBrand = JSON.stringify(this.currentBrand);
                } else {
                    data.supplierBrand = [];
                }
                this.disabledBtn = true;
                this.$AXIOS.PUT('/supplier/supplier/' + this.id, data).then(res => {
                    this.$utils.messagetip.successTip(res.databuffer);
                    this.$router.push({
                        name: 'supplierManage'
                    });
                }).finally(res => {
                    this.disabledBtn = false;
                });
            }
        },
        // 保存数据过滤
        filterKeepData() {
            if (this.searchParams.supplierKindCode === 'purchase') {
                this.searchParams.supplierInterfaceId = '';
            }
            if (this.searchParams.supplierTypeCode === 'internalSupplier') {
                this.searchParams.country = '';
            } else if (this.searchParams.supplierTypeCode === 'overseasSupplier') {
                this.searchParams.province = '';
                this.searchParams.city = '';
                this.searchParams.area = '';
            }
            if (this.searchParams.certificateTypeId === 'normalThreeCertificate') {
                this.searchParams.multiCertificateCombineNo = '';
                this.searchParams.multiCertificateStartDate = '';
                this.searchParams.multiCertificateEndDate = '';
                this.searchParams.multiCertificateCombinePic = '';
            } else if (this.searchParams.certificateTypeId === 'multiCertificateUnion') {
                this.searchParams.businessLicence = '';
                this.searchParams.businessLicencePic = '';
                this.searchParams.businessLicenceStartDate = '';
                this.searchParams.businessLicenceEndDate = '';
                this.searchParams.organRegistraCodeCertificate = '';
                this.searchParams.organRegistraCodeCertificatePic = '';
                this.searchParams.organRegistraStartDate = '';
                this.searchParams.organRegistraEndDate = '';
                this.searchParams.taxRegistrationCertificate = '';
                this.searchParams.taxRegistrationCertificatePic = '';
                this.searchParams.taxRegistrationStartDate = '';
                this.searchParams.taxRegistrationEndDate = '';
            }
        },
        // 校验保存的数据
        checkSupplierData() {
            // else if (this.searchParams.supplierTypeCode === 'internalSupplier' && !this.searchParams.province) {
            //     this.$message.warning('请选择省份,城市,地区');
            //     return false;
            // }
            if (this.searchParams.supplierKindCode === 'oneAgentSelling' && !this.searchParams.supplierInterfaceId) {
                this.$message.warning('请填写供应商接口ID');
                return false;
            } else if (!this.channel.length) {
                this.$message.warning('请至少选择一条业务线');
                return false;
            } else if (!this.searchParams.supplierName) {
                this.$message.warning('请填写供应商名称');
                return false;
            } else if (!this.searchParams.contact) {
                this.$message.warning('请填写联系人');
                return false;
            } else if (!this.searchParams.phone) {
                this.$message.warning('请输入联系人电话');
                return false;
            } else if (this.searchParams.supplierTypeCode === 'overseasSupplier' && !this.searchParams.country) {
                this.$message.warning('请选择所在国家');
                return false;
            } else if (!this.searchParams.address) {
                this.$message.warning('请输入详细地址');
               return false;
            }
            if (this.searchParams.supplierTypeCode === 'internalSupplier') {
                if (this.searchParams.certificateTypeId === 'normalThreeCertificate' && this.searchParams.supplierKindCode === 'purchase') {
                    if (!this.searchParams.businessLicence) {
                        this.$message.warning('请输入营业执照证件号');
                        return false;
                    } else if (!this.searchParams.businessLicenceStartDate || !this.searchParams.businessLicenceEndDate) {
                        this.$message.warning('请选择营业执照的有效日期');
                        return false;
                    } else if (!this.searchParams.businessLicencePic) {
                        this.$message.warning('请上传营业执照证件图片');
                        return false;
                    } else if (!this.searchParams.organRegistraCodeCertificate) {
                        this.$message.warning('请输入组织机构证件号');
                        return false;
                    } else if (!this.searchParams.organRegistraStartDate || !this.searchParams.organRegistraEndDate) {
                        this.$message.warning('请选择组织机构的有效日期');
                        return false;
                    } else if (!this.searchParams.organRegistraCodeCertificatePic) {
                        this.$message.warning('请上传组织机构证件图片');
                        return false;
                    } else if (!this.searchParams.taxRegistrationCertificate) {
                        this.$message.warning('请上传税务登记证号');
                        return false;
                    } else if (!this.searchParams.taxRegistrationStartDate || !this.searchParams.taxRegistrationEndDate) {
                        this.$message.warning('请选择税务登记证的有效日期');
                        return false;
                    } else if (!this.searchParams.taxRegistrationCertificatePic) {
                        this.$message.warning('请上传税务登记证件图片');
                        return false;
                    } else if (!this.searchParams.legalPersonIdCard) {
                        this.$message.warning('请输入法人身份证号');
                        return false;
                    } else if (!this.searchParams.idCardStartDate || !this.searchParams.idCardEndDate) {
                        this.$message.warning('请选择法人身份证的有效日期');
                        return false;
                    } else if (!this.searchParams.legalPersonIdCardPic1) {
                        this.$message.warning('请上传法人身份证正面图片');
                        return false;
                    } else if (!this.searchParams.legalPersonIdCardPic2) {
                        this.$message.warning('请上传法人身份证反面图片');
                        return false;
                    }
                } else if (this.searchParams.certificateTypeId === 'multiCertificateUnion' && this.searchParams.supplierKindCode === 'purchase') {
                    if (!this.searchParams.multiCertificateCombineNo) {
                        this.$message.warning('请输入多证合一证件号');
                        return false;
                    } else if (!this.searchParams.multiCertificateStartDate || !this.searchParams.multiCertificateEndDate) {
                        this.$message.warning('请选择多证合一的有效日期');
                        return false;
                    } else if (!this.searchParams.multiCertificateCombinePic) {
                        this.$message.warning('请选择多证合一证件图片');
                        return false;
                    } else if (!this.searchParams.legalPersonIdCard) {
                        this.$message.warning('请输入法人身份证号');
                        return false;
                    } else if (!this.searchParams.idCardStartDate || !this.searchParams.idCardEndDate) {
                        this.$message.warning('请选择法人身份证的有效日期');
                        return false;
                    } else if (!this.searchParams.legalPersonIdCardPic1) {
                        this.$message.warning('请上传法人身份证正面图片');
                        return false;
                    } else if (!this.searchParams.legalPersonIdCardPic2) {
                        this.$message.warning('请上传法人身份证反面图片');
                        return false;
                    }
                }
            }
            if (!this.currentBrand.length) {
                this.$message.warning('供应商代理品牌不能为空');
                return false;
            } else {
                let parent = document.getElementById('supplierTableBrand');
                let index = -1;
                let num = '';

                for (let i = 0; i < this.currentBrand.length; i++) {
                    if (!this.currentBrand[i].proxyAptitudeId) {
                        index = i;
                        num = 0;
                        this.$message.warning('代理资质不能为空');
                        break;
                    }
                    if (!this.currentBrand[i].proxyAptitudeStartDate ) {
                        index = i;
                        num = 1;
                        this.$message.warning('资质有效时间不能为空');
                        break;
                    }
                    if ( !this.currentBrand[i].proxyAptitudeEndDate) {
                        index = i;
                        num = 2;
                        this.$message.warning('资质有效时间不能为空');
                        break;
                    }
                    if (!this.currentBrand[i].pictureArr.length) {
                        index = i;
                        num = 5;
                        this.$message.warning('资质图片不能为空');
                        break;
                    }
                }
                if (index > -1) {
                    let item = parent.getElementsByClassName('el-table__row')[index];
                    let input = item.getElementsByTagName('input')[num];
                    input.focus();
                    return false;
                }
            }
            if (!this.searchParams.depositBank || !this.searchParams.bankAccount) {
                this.$message.warning('请补充完财务信息再保存');
                return false;
            }
            if (!this.searchParams.saleProvince || !this.searchParams.goodsReturnAddress || !this.searchParams.goodsReturnContactPerson || !this.searchParams.goodsReturnPhone) {
                this.$message.warning('请补充完售后信息再保存');
                return false;
            }
            return true;
        },
        // 选怎属性后的结果
        selectResult(val) {
            this.currentCategory = val;
        },
        // 查询品牌
        searchBrandResult() {
            this.brandPageData.pageNo = 1;
            this.tableDataBrand = [];
            this.brandScrollAjax();
            setTimeout(() => {
                this.brandScroll();
            }, 20);
        },
        // 添加品牌
        addBrand(flag) {
            this.dialogTableVisibleBrand = true;
            this.brandScrollAjax(flag);
            setTimeout(() => {
                this.brandScroll();
            }, 200);
        },
        brandScrollAjax(flag = null) {
            let arr = [];
            this.tableDataCategory.map(item => {
                arr.push(item.categoryId);
            });
            if (!arr.length) {
                this.$message.warning('请先添加供应商代理分类!');
                return;
            }
            if (flag) {
                this.searchBrandNmae = '';
                this.tableDataBrand = [];
                this.brandPageData.totalCount = 0;
                this.brandPageData.pageNo = 1;
            }
            let brandIds = [];
            for (let i = 0; i < this.currentBrand.length; i++) {
                brandIds.push(this.currentBrand[i].brandId);
            }
            let data = {
                categoryId: arr.join(','),
                brandName: this.searchBrandNmae,
                brandIds: brandIds.length ? brandIds.join(',') : '',
                pageSize: this.brandPageData.pageSize,
                pageNo: this.brandPageData.pageNo
            };
            this.isScroll = false;
            this.$AXIOS.GET('/category/newCategoryBrands', data).then(res => {
                res.result.list.map(item => {
                    item.pictureArr = [];
                    item.aptitudePic = '';
                    item.brandId = item.productCenterBrandId;
                    item.categoryId = item.productCenterCategoryId;
                    this.tableDataBrand.push(item);
                });
                this.brandPageData.totalCount = res.result.totalCount;
                this.isScroll = true;
            });
        },
        brandScroll() {
            let dom = document.querySelector('.brand_warp');
            let childDom = document.querySelector('.brand_ul');
            dom.onscroll = () => {
                let scollTop = dom.scrollTop;
                let offsetHeight = dom.offsetHeight;
                let childOffsetHeight = childDom.offsetHeight + 22;
                let height = scollTop / (childOffsetHeight - offsetHeight);
                if (height > 0.7 && this.isScroll) {
                    this.brandPageData.pageNo++;
                    this.brandScrollAjax();
                }
                // console.log(scollTop, childOffsetHeight, height);
                if (this.tableDataBrand.length === this.brandPageData.totalCount) {
                    dom.onscroll = null;
                    this.$utils.messagetip.successTip('已加载全部品牌');
                }
            };
        },
        // 删除品牌
        currentBrandDelete(row, index) {
            this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                for (let i = 0; i < this.currentBrand.length; i++) {
                    if (i === index) {
                        this.currentBrand[i].status = 3;
                        if (!this.currentBrand[i].isPush) {
                            this.deleteBrandDataRedit.push(this.currentBrand[i]);
                        }
                        this.currentBrand.splice(i, 1);
                        break;
                    }
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 获取品牌数据的方法
        initBrandData(data) {

        },
        // 勾选品牌
        addBrandSelect(cur) {
            let flag = true;
            for (let i = 0; i < this.temporaryStorageData.length; i++) {
                if (cur.brandId === this.temporaryStorageData[i].brandId) {
                    flag = false;
                    this.temporaryStorageData.splice(i, 1);
                    i--;
                }
            }
            if (flag) {
                cur.source = 1;
                cur.status = 1;
                cur.isPush = true;
                this.temporaryStorageData.push(cur);
            }
        },
        // 保存勾选的品牌
        keepSelectBrand() {
            for (let i = 0; i < this.temporaryStorageData.length; i++) {
                let flag = true;
                for (let j = 0; j < this.currentBrand.length; j++) {
                    if (this.temporaryStorageData[i].brandId === this.currentBrand[j].brandId) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    this.currentBrand.push(this.temporaryStorageData[i]);
                }
            }
            this.temporaryStorageData = [];
            this.dialogTableVisibleBrand = false;
        },
        // 确认添加的类目
        confirmAddCategory() {
            for (let j = 0; j < this.currentCategory.length; j++) {
                this.$AXIOS.GET('/supplier/checkCategoryBrandValidStatus/' + this.currentCategory[j].categoryId).then(res => {
                    let flag = true;
                    for (let i = 0; i < this.tableDataCategory.length; i++) {
                        if (this.tableDataCategory[i].categoryId === this.currentCategory[j].categoryId * 1) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        this.tableDataCategory.push(this.currentCategory[j]);
                        this.clear = true;
                        setTimeout(() => {
                            this.clear = false;
                            this.currentCategory = '';
                        }, 200);
                    } else {
                        this.$message.warning('该分类已存在');
                        this.currentCategory = '';
                        // this.clear = true;
                    }
                });
            }
        },
        // 删除类目
        categoryDelete(row, index) {
            let flag = true;
            for (let i = 0; i < this.currentBrand.length; i++ ) {
                let arr = this.currentBrand[i].categoryIds.split(',');
                if (arr.indexOf(row.categoryId + '') > -1) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                this.tableDataCategory.splice(index, 1);
            } else {
                this.$message.warning('该类目下还存在代理品牌，请先删除代理品牌');
            }
        },
        addCategory() {
            this.isAddCategory = false;
        },
        // 供应商商性质
        purchaseChange(val) {
            if (val === 'purchase') {
                this.searchParams.supplierInterfaceId = '';
            }
        },
        // 采购性质
        supplierChange(val) {
            if (val === 'internalSupplier') {
                this.searchParams.country = '';
            } else if (val === 'overseasSupplier') {
                this.searchParams.province = '';
                this.searchParams.city = '';
                this.searchParams.area = '';
            }
        },
        deleteImg(str) {
            if (str === 'upload1') {
                this.searchParams.businessLicencePic = '';
                this.showImg1 = '';
            } else if (str === 'upload2') {
                this.searchParams.organRegistraCodeCertificatePic = '';
                this.showImg2 = '';
            } else if (str === 'upload3') {
                this.searchParams.taxRegistrationCertificatePic = '';
                this.showImg3 = '';
            } else if (str === 'upload4') {
                this.searchParams.multiCertificateCombinePic = '';
                this.showImg4 = '';
            } else if ( str === 'upload5') {
                this.searchParams.legalPersonIdCardPic1 = '';
                this.showImg5 = '';
            } else if (str === 'upload6') {
                this.searchParams.legalPersonIdCardPic2 = '';
                this.showImg6 = '';
            }
        },
       multiUploadSuccess1(res) {
            this.$refs['upload1'].clearFiles();
            this.searchParams.businessLicencePic = res.key;
            this.$AXIOS.GET('/qinniuPrivate/download', {fileName: res.key}).then(res => {
                this.showImg1 = res.result;
            });
        },
        multiUploadSuccess2(res) {
            this.$refs['upload2'].clearFiles();
            this.searchParams.organRegistraCodeCertificatePic = res.key;
            this.$AXIOS.GET('/qinniuPrivate/download', {fileName: res.key}).then(res => {
                this.showImg2 = res.result;
            });
        },
        multiUploadSuccess3(res) {
            this.$refs['upload3'].clearFiles();
            this.searchParams.taxRegistrationCertificatePic = res.key;
            this.$AXIOS.GET('/qinniuPrivate/download', {fileName: res.key}).then(res => {
                this.showImg3 = res.result;
            });
        },
        multiUploadSuccess4(res) {
            this.$refs['upload4'].clearFiles();
            this.searchParams.multiCertificateCombinePic = res.key;
            this.$AXIOS.GET('/qinniuPrivate/download', {fileName: res.key}).then(res => {
                this.showImg4 = res.result;
            });
        },
        multiUploadSuccess5(res) {
            this.$refs['upload5'].clearFiles();
            this.searchParams.legalPersonIdCardPic1 = res.key;
            this.$AXIOS.GET('/qinniuPrivate/download', {fileName: res.key}).then(res => {
                this.showImg5 = res.result;
            });
        },
        multiUploadSuccess6(res) {
            this.$refs['upload6'].clearFiles();
            this.searchParams.legalPersonIdCardPic2 = res.key;
            this.$AXIOS.GET('/qinniuPrivate/download', {fileName: res.key}).then(res => {
                this.showImg6 = res.result;
            });
        },
        uploadImgFlag(str) {
            this.uploadFlag = str;
        },
        // 图片上传之前事件 防止用户上传超过范围的文件
        beforeUpload(file) {
            let fileFormat = file.type;
            if (fileFormat === 'image/png' || fileFormat === 'image/jpg' || fileFormat === 'image/jpeg' || fileFormat === 'image/PBG' || fileFormat === 'image/bmp') {
                if (file.size > 1024 * 1024 * 3 ) {
                    this.$message.warning('文件大小不能大于3M');
                    return false;
                }
            } else {
                this.$message.warning('文件类型只能为.png,.jpg,.jpeg,.bmp');
                return false;
            }
        },
        beforeUpload1(file) {
            let fileFormat = file.type;
            if (fileFormat === 'image/png' || fileFormat === 'image/jpg' || fileFormat === 'image/jpeg' || fileFormat === 'image/PBG' || fileFormat === 'image/bmp') {
                if (file.size > 1024 * 1024 * 3 ) {
                    this.$message.warning('文件大小不能大于3M');
                    return false;
                }
            } else {
                this.$message.warning('文件类型只能为.png,.jpg,.jpeg,.bmp');
                return false;
            }
            this.isUploaded = true;
        },
        handlePreview() {

        },
        // 删除上传图片事件
        handleRemove() {
        },
        handleRemoveBrand() {

        },
        uploadCurrent(row, index) {
            if (row.length === 3) {
                this.$message.warning('最多上传3张图片');
                return;
            }
            this.tableImgCurrent = index;
        },
        // 品牌图片上传成功
        brandUploadSuccess(res, index) {
            this.$AXIOS.GET('/qinniuPrivate/download', {fileName: res.key}).then(data => {
                for (let i = 0; i < this.currentBrand.length; i++) {
                    if (i === this.tableImgCurrent) {
                        this.currentBrand[i].pictureArr.push({ key: res.key, url: data.result });
                    }
                }
                setTimeout(() => {
                    this.$refs['upload' + this.tableImgCurrent].clearFiles();
                    this.isUploaded = false;
                }, 500);
            });
        },
        // 品牌图片删除
         deleteCurrentImg(index, res) {
            let obj = this.currentBrand[index].pictureArr;
            for (let j = 0; j < obj.length; j++) {
                if (obj[j].key === res.key) {
                    obj.splice(j, 1);
                    break;
                }
            };
        },
        // 供应商的省市区
        handleCityChange(val) {
            this.searchParams.province = val[0];
            this.searchParams.city = val[1];
            this.searchParams.area = val[2];
        },
        // 退货商省市区
        returnSaleHandleCityChange(val) {
            this.searchParams.saleProvince = val[0];
            this.searchParams.saleCity = val[1];
            this.searchParams.saleArea = val[2];
        },
        // 业务线初始化
        initCheckList() {
            this.$AXIOS.LISTGET('/system/channels').then(res => {
                this.checkListOptions = res.result.map((item, index) => {
                    // this.channel.push(index + 1 + '-' + item.code);
                    return {
                        code: index + 1 + '-' + item.code,
                        name: item.name
                    };
                });
            });
        },
        // 初始化国家
        initCountry() {
            this.$AXIOS.GET('/select/country').then(res => {
                this.countryOptions = res.result.map(item => {
                    return {
                        label: item.name,
                        value: item.value
                    };
                });
            });
        },
        timeChange(obj) {
            let date = new Date(obj);
            let y = 1900 + date.getYear();
            let m = '0' + (date.getMonth() + 1);
            let d = '0' + date.getDate();
            return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length);
        }
    }
};
</script>

<style lang="stylus" scoped>
    .supplierapplyadd
        .title
           background-color rgba(64,158,255,.1)
           color #333
           padding 10px
           font-size 14px
        .tableMain
            border solid 1px #c2c2c2
            margin 15px 0
            .head
               display flex
               text-align center
               font-weight 800
               li
                  width 25%
                  padding 10px 0
                  border-bottom  solid 1px #c2c2c2
                  border-right   solid 1px #c2c2c2
            .main
               display flex
               text-align center
               justify-content center
               align-items center
               li
                  width 25%
                  border-bottom  solid 1px #c2c2c2
                  border-right   solid 1px #c2c2c2
                  min-height 60px
                  line-height 60px
                .required::before
                    content: '*';
                    padding-right: 5px;
                    color: #ff0000;
        .brand_warp
            height 300px
            overflow-y scroll
            border solid 1px #dcdfe6
            padding 10px
            li
                padding 10px 0
            .null
                width 60px
                height 13px
                position absolute
                margin auto
                left 0
                right 0
                top 0
                bottom 0


</style>

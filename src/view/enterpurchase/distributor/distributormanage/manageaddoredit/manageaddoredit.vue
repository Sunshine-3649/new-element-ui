<template>
    <div class="manageaddoredit">
        <el-form :model="searchParams" :rules="rules" ref="ruleForm" size="mini" label-width="120px" class="demo-ruleForm">
            <!-- 基本信息 -->
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>基本信息</span>
                </div>
                <section class="info">
                    <el-row v-show="id == 'add' ? false : true" :span="20">
                        <el-col :span="6">
                            <el-form-item label="登录账号：">
                                {{searchParams.loginAccount}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                        </el-col>
                    </el-row>
                    <el-row :span="20">
                        <el-col :span="6">
                            <el-form-item label="公司全称：" prop="companyName">
                                <el-input placeholder="请输入公司名称(最多限输入32字)" size="mini" v-model="searchParams.companyName"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="4">
            <el-input v-model="inputVal" placeholder="请输入内容" size="mini"></el-input>
          </el-col> -->
                        <!-- <el-col :span="4">
            请填写6-32个字
          </el-col> -->
                    </el-row>
                    <el-row :span="20">
                        <el-col :span="6">
                            <el-form-item label="公司简称：" prop="companyAbbreviation">
                                <el-input placeholder="请输入公司简称(最多限输入10字)" size="mini" v-model="searchParams.companyAbbreviation"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="4">
            <el-input v-model="inputVal" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="4">
            请填写2-10个字
          </el-col> -->
                    </el-row>
                </section>
            </el-card>
            <!-- 联系信息 -->
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>联系信息</span>
                </div>
                <section class="info">
                    <el-row :span="20">
                        <el-col :span="6" style="margin-bottom:25px;">
                            <span style="color: red; position:relative; left: 41px; top:22px; font-size:12px;">*</span>
                            <el-form-item label="公司地区：" prop="city">
                                <el-cascader placeholder="请选择公司地区" separator="-" :options="cityArr" v-model="selected" @change="citySelectChange"></el-cascader>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="4">
            <el-input v-model="inputVal" placeholder="请输入内容" size="mini"></el-input>
          </el-col> -->
                    </el-row>
                    <el-row :span="20">
                        <el-col :span="6" style="margin-bottom:25px;">
                            <el-form-item style="" label="详细地址：" prop="address">
                                <el-input type="textarea" v-model="searchParams.address" placeholder="请输入公司详细地址(最多限输入50字)"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="4">
            <el-input type="textarea" :rows="2" v-model="inputVal" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="4">
            请填写2-50个字
          </el-col> -->
                    </el-row>
                    <el-row :span="20" style="line-height: 38px;">
                        <el-col :span="6" style="text-align: right;">
                            <el-form-item label="联系人：" prop="contact">
                                <el-input placeholder="请输入联系人(最多限输入10字)" size="mini" v-model="searchParams.contact"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="4">
            <el-input v-model="inputVal" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="4">
            请填写2-4个字
          </el-col> -->
                    </el-row>
                    <el-row :span="20" style="line-height: 38px;">
                        <el-col :span="6" style="text-align: right;">
                            <el-form-item label="手机号码：" prop="mobile">
                                <el-input  placeholder="请输入手机号码" size="mini" v-model.number="searchParams.mobile"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="4">
            <el-input v-model="inputVal" placeholder="请输入内容" size="mini"></el-input>
          </el-col>-->
                        <el-col style="font-size:12px;" :span="6">
                            手机号码及固定电话，至少填写一项
                        </el-col>
                    </el-row>
                    <el-row :span="20" style="line-height: 38px;">
                        <!-- <el-col style="text-align: right; padding-right:12px; width:120px;">
                            固定电话：
                        </el-col> -->
                        <el-col :span="4">
                             <el-form-item label="固定电话：" prop="phone">
                                <el-input v-model="searchParams.phone" placeholder="固定电话" size="mini"></el-input>
                            </el-form-item>
                        </el-col>
                         <!-- <el-col :span="10">
                            <el-col :span="4">
                                <el-input v-model="inputVal" placeholder="区号" size="mini"></el-input>
                            </el-col>
                            <el-col :span="1" style="text-align: center;">
                                -
                            </el-col>
                            <el-col :span="6">
                                <el-input v-model="inputVal" placeholder="电话号码" size="mini"></el-input>
                            </el-col>
                            <el-col :span="1" style="text-align: center;">
                                -
                            </el-col>
                            <el-col :span="6">
                                <el-input v-model="inputVal" placeholder="分机号" size="mini"></el-input>
                            </el-col>
                        </el-col>  -->
                    </el-row>
                </section>
            </el-card>
            <!-- 开票信息 -->
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>开票信息</span>
                </div>
                <section class="info">
                    <el-row :span="20" style="line-height: 38px;">
                        <el-col :span="6" style="text-align: right;">
                            <el-form-item label="单位名称：" prop="invoiceTitle">
                                <el-input placeholder="请输入单位名称(最多限输入50字)" size="mini" v-model="searchParams.invoiceTitle"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="4">
            <el-input v-model="inputVal" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="4">
            请填写6-32个字
          </el-col> -->
                    </el-row>
                    <el-row :span="20" style="line-height: 38px;">
                        <el-col :span="6" style="text-align: right;">
                            <el-form-item label="纳税人识别号：" prop="invoiceTaxpayerIdentifiNumber">
                                <el-input placeholder="请输入纳税人识别号(最多限输入32字)" size="mini" v-model="searchParams.invoiceTaxpayerIdentifiNumber"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="4">
            <el-input v-model="inputVal" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="4">
            限32个字以内
          </el-col> -->
                    </el-row>
                    <el-row :span="20" style="line-height: 38px;">
                        <el-col :span="6" style="text-align: right;">
                            <el-form-item label="地址：" prop="invoiceAddress">
                                <el-input placeholder="请输入开户行地址(最多限输入50字)" size="mini" v-model="searchParams.invoiceAddress"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="4">
            <el-input v-model="inputVal" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="4">
            请填写2-50个字
          </el-col> -->
                    </el-row>
                    <el-row :span="20" style="line-height: 38px;">
                        <el-col :span="6" style="text-align: right;">
                            <el-form-item label="电话：" prop="invoicePhone">
                                <el-input placeholder="请输入开户行电话" size="mini" v-model="searchParams.invoicePhone"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="4">
            <el-input v-model="inputVal" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="4">
            请填写20个字以内
          </el-col> -->
                    </el-row>
                    <el-row :span="20" style="line-height: 38px;">
                        <el-col :span="6" style="text-align: right;">
                            <el-form-item label="银行卡号：" prop="invoiceBankAccount">
                                <el-input placeholder="请输入开户行卡号(最多限输入32字)" size="mini" v-model="searchParams.invoiceBankAccount"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="4">
            <el-input v-model="inputVal" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="4">
            请填写32个字以内
          </el-col> -->
                    </el-row>
                    <el-row :span="20" style="line-height: 38px;">
                        <el-col :span="6" style="text-align: right;">
                            <el-form-item label="开户行：" prop="invoiceBank">
                                <el-input placeholder="请输入开户行(最多限输入50字)" size="mini" v-model="searchParams.invoiceBank"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="4">
            <el-input v-model="inputVal" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="4">
            请填写2-50个字
          </el-col> -->
                    </el-row>
                </section>
            </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>资质信息</span>
            </div>
            <div class="radio">
            <el-radio-group @change="selectChange" v-model="radio">
                <el-radio  label="1">普通证件</el-radio>
                <el-radio  label="2">多证合一</el-radio>
            </el-radio-group>
        </div>
        <!-- 表格 -->
        <div class="msgWrap">
            <ul class="head">
                <li>证件类型</li>
                <li>证件号</li>
                <li style="text-align:center">证件有效期</li>
                <li>证件图片</li>
            </ul>
            <div v-if="radio == 1">
                <ul class="body">
                    <li>营业执照</li>
                    <li>
                         <el-form-item style="margin-left:0" prop="businessLicence">
                            <el-input v-model="searchParams.businessLicence" type="text" placeholder="请输入证件号(最多限输入32字)"></el-input>
                         </el-form-item>
                    </li>
                    <li>
                        <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="searchParams.businessLicenceIsLongtime === '1'" v-model="searchParams.businessLicenceStartDate" type="date" placeholder="选择开始日期"></el-date-picker>
                        <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="searchParams.businessLicenceIsLongtime === '1'" v-model="searchParams.businessLicenceEndDate" type="date" placeholder="选择结束日期"></el-date-picker>
                        <el-checkbox style="padding-left:10px;" true-label="1" false-label="0" @change="businessSelect" v-model="searchParams.businessLicenceIsLongtime">长期</el-checkbox>
                    </li>
                    <li>
                        <div v-show="!searchParams.businessLicencePic">
                            <el-upload ref="upload1" :action="uploadUrl" :limit="1" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG," :before-upload="beforeUpload" :on-success="businessUploadSuccess" :on-preview="handlePreview" :on-remove="handleRemove('businessLicencePic')">
                                <el-button type="text" size="mini">上传</el-button>
                            </el-upload>
                        </div>
                        <div class="showImg" v-show="searchParams.businessLicencePic">
                            <img @click="handlePreview(showImg1)" :src="showImg1"/>
                            <el-button  type="text" @click="deleteImg('businessLicencePic')" size="mini">删除</el-button>
                        </div>
                    </li>
                </ul>
                <ul class="body">
                    <li>组织机构代码证</li>
                    <li>
                        <el-form-item prop="organRegistraCodeCertificate">
                            <el-input v-model="searchParams.organRegistraCodeCertificate" type="text" placeholder="请输入证件号(最多限输入32字)"></el-input>
                         </el-form-item>
                    </li>
                    <li>
                        <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="searchParams.organRegistraIsLongtime === '1'" v-model="searchParams.organRegistraStartDate" type="date" placeholder="选择开始日期"></el-date-picker>
                        <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="searchParams.organRegistraIsLongtime === '1'" v-model="searchParams.organRegistraEndDate" type="date" placeholder="选择结束日期"></el-date-picker>
                        <el-checkbox @change="organizationSelect" true-label="1" false-label="0" style="padding-left:10px;" v-model="searchParams.organRegistraIsLongtime">长期</el-checkbox>
                    </li>
                    <li>
                        <div v-show="!searchParams.organRegistraCodeCertificatePic">
                            <el-upload ref="upload2" :action="uploadUrl"  :limit="1" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG," :before-upload="beforeUpload" :on-success="organUploadSuccess" :on-preview="handlePreview" :on-remove="handleRemove('organRegistraCodeCertificatePic')">
                                <el-button type="text" size="mini">上传</el-button>
                            </el-upload>
                        </div>
                         <div class="showImg" v-show="searchParams.organRegistraCodeCertificatePic">
                            <img @click="handlePreview(showImg2)" :src="showImg2"/>
                            <el-button type="text" @click="deleteImg('organRegistraCodeCertificatePic')" size="mini">删除</el-button>
                        </div>
                    </li>
                </ul>
                <ul class="body">
                    <li>税务登记证</li>
                    <li>
                        <el-form-item prop="taxRegistrationCertificate">
                            <el-input v-model="searchParams.taxRegistrationCertificate" type="text" placeholder="请输入证件号(最多限输入32字)"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="searchParams.taxRegistrationIsLongtime === '1'" v-model="searchParams.taxRegistrationStartDate" type="date" placeholder="选择开始日期"></el-date-picker>
                        <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="searchParams.taxRegistrationIsLongtime === '1'" v-model="searchParams.taxRegistrationEndDate" type="date" placeholder="选择结束日期"></el-date-picker>
                        <el-checkbox @change="taxSelect" true-label="1" false-label="0" style="padding-left:10px;" v-model="searchParams.taxRegistrationIsLongtime">长期</el-checkbox>
                    </li>
                    <li>
                        <div v-show="!searchParams.taxRegistrationCertificatePic">
                            <el-upload ref="upload3" :action="uploadUrl" :limit="1" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG," :before-upload="beforeUpload" :on-success="taxUploadSuccess" :on-preview="handlePreview" :on-remove="handleRemove('taxRegistrationCertificatePic')">
                                <el-button type="text" size="mini">上传</el-button>
                            </el-upload>
                        </div>
                        <div class="showImg" v-show="searchParams.taxRegistrationCertificatePic">
                            <img @click="handlePreview(showImg3)" :src="showImg3"/>
                            <el-button type="text" @click="deleteImg('taxRegistrationCertificatePic')" size="mini">删除</el-button>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-else>
                <ul class="body">
                    <li>多证合一</li>
                    <li>
                        <el-form-item prop="multiCertificateCombineNo">
                            <el-input v-model="searchParams.multiCertificateCombineNo" type="text" placeholder="请输入证件号(最多限输入32字)"></el-input>
                        </el-form-item>
                    </li>
                    <li>
                        <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="searchParams.multiCertificateIsLongtime === '1'" v-model="searchParams.multiCertificateStartDate" type="date" placeholder="选择开始日期"></el-date-picker>
                        <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="searchParams.multiCertificateIsLongtime === '1'" v-model="searchParams.multiCertificateEndDate" type="date" placeholder="选择结束日期"></el-date-picker>
                        <el-checkbox @change="setCardSelect" true-label="1" false-label="0" style="padding-left:10px;" v-model="searchParams.multiCertificateIsLongtime">长期</el-checkbox>
                    </li>
                    <li>
                        <div v-show="!searchParams.multiCertificateCombinePic">
                            <el-upload ref="upload4" :action="uploadUrl" :limit="1" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG," :before-upload="beforeUpload" :on-success="multiUploadSuccess" :on-preview="handlePreview" :on-remove="handleRemove('multiCertificateCombinePic')">
                                <el-button  type="text" size="mini">上传</el-button>
                            </el-upload>
                        </div>
                        <div class="showImg" v-show="searchParams.multiCertificateCombinePic">
                            <img style="" @click="handlePreview(showImg4)" :src="showImg4"/>
                            <el-button type="text" @click="deleteImg('multiCertificateCombinePic')" size="mini">删除</el-button>
                        </div>
                    </li>
                </ul>
            </div>

            <ul class="body">
                <li>法人身份证</li>
                <li>
                    <el-form-item prop="legalPersonIdCard">
                        <el-input v-model="searchParams.legalPersonIdCard" type="text" placeholder="请输入证件号(最多限输入32字)"></el-input>
                    </el-form-item>
                </li>
                <li>
                    <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="searchParams.idCardIsLongtime === '1'" v-model="searchParams.idCardStartDate" type="date" placeholder="选择开始日期"></el-date-picker>
                    <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="searchParams.idCardIsLongtime === '1'" v-model="searchParams.idCardEndDate" type="date" placeholder="选择结束日期"></el-date-picker>
                    <el-checkbox true-label="1" false-label="0" style="padding-left:10px;" v-model="searchParams.idCardIsLongtime">长期</el-checkbox>
                </li>
                <li style="display:flex; justify-content: center">
                    <div v-show="!searchParams.legalPersonIdCardPic1">
                        <el-upload ref="upload5" :action="uploadUrl" :limit="1" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG," :before-upload="beforeUpload" :on-success="legaluploadSuccess1" :on-preview="handlePreview" :on-remove="handleRemove('legalPersonIdCardPic1')">
                            <el-button  type="text" size="mini">上传正面</el-button>
                        </el-upload>
                    </div>
                    <div class="showImg" v-show="searchParams.legalPersonIdCardPic1">
                        <img @click="handlePreview(showImg5)" :src="showImg5"/>
                        <el-button type="text" @click="deleteImg('legalPersonIdCardPic1')" size="mini">删除</el-button>
                    </div>

                    <div v-show="!searchParams.legalPersonIdCardPic2">
                        <el-upload ref="upload6" :action="uploadUrl" :limit="1" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG," :before-upload="beforeUpload" :on-success="legaluploadSuccess2" :on-preview="handlePreview" :on-remove="handleRemove('legalPersonIdCardPic2')">
                            <el-button  type="text" size="mini">上传反面</el-button>
                        </el-upload>
                    </div>
                    <div class="showImg" v-show="searchParams.legalPersonIdCardPic2">
                        <img @click="handlePreview(showImg6)" :src="showImg6"/>
                        <el-button type="text" @click="deleteImg('legalPersonIdCardPic2')" size="mini">删除</el-button>
                    </div>
                </li>
            </ul>
        </div>
        <el-row style="padding:10px 0;" :span="20">注：以上图片支持JPG、JPEG、BMP、PNG格式，大小不超过3M。</el-row>
         <el-row style="padding:10px 0;" :span="20">
             <el-col :span="10">
                 <el-form-item label-width="50px" label="备注：">
                    <el-input placeholder="请输入备注"  type="textarea" v-model="searchParams.memo"></el-input>
                </el-form-item>
             </el-col>
         </el-row>
        </el-card>

        </el-form>
        <!-- 按钮组 -->
        <div class="btn">
            <el-button @click="submitForm('ruleForm')" type="primary" size="mini">{{ id === "add" ? '保存' : '保存修改' }}</el-button>
            <el-button @click="back" type="primary" size="mini">取消</el-button>
        </div>

        <!-- 查看上传图片弹窗 -->
        <el-dialog :visible.sync="dialogVisible" width="40%">
            <img :src="dialogImg" />
        </el-dialog>
    </div>
</template>

<script>
import cityData from 'components/selectCity'; // 城市选择数据


let editCompanyName = '';  // 编辑的时候同时没改公司名称的时候防止去验证公司名称
let editCompanyAbbreviation = ''; // 编辑的时候同时没改公司简称的时候防止去验证公司简称

export default {
  name: 'manageaddoredit',
  data() {
    return {
      rules: {
        companyName: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('请输入公司全称'));
              }
              if (value.length > 32) {
                return callback(new Error('最多限输入32字'));
              } else {
                  if (value === editCompanyName) {
                      callback();
                  } else {
                      this.GET('/busiDistributor/checkCompanyName/1/' + value).then(
                        res => {
                            if (res.body === 'true') {
                                callback();
                            } else if (res.body === 'false') {
                               return callback(new Error('名称不可重复'));
                            }
                        }
                    );
                  }
              }
            },
            trigger: 'blur',
            required: true
          }
        ],
        companyAbbreviation: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('请输入公司简称'));
              }
              if (value.length > 10) {
                return callback(new Error('最多限输入10字'));
              } else {
                  if (value === editCompanyAbbreviation) {
                      callback();
                  } else {
                    this.GET('/busiDistributor/checkCompanyName/2/' + value).then(
                        res => {
                            if (res.body === 'true') {
                                callback();
                            } else if (res.body === 'false') {
                                return callback(new Error('名称不可重复'));
                            }
                        }
                    );
                 }
              }
            },
            trigger: 'blur',
            required: true
          }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 1, max: 50, message: '最多限输入50字', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { min: 1, max: 10, message: '最多限输入10字', trigger: 'blur' }
        ],
        mobile: [
            {
                validator: (rule, value, callback) => {
                    let re = new RegExp(/^(((1[0-9][0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/);// 判断手机号码格式//判断正整数/[1−9]+[0−9]∗]∗/
                    if (value && !re.test(value)) {
                        return callback(new Error('手机号码格式错误'));
                    } else {
                        callback();
                    }
                },
                trigger: 'blur'
            }
        ],
        phone: [
            {
                validator: (rule, value, callback) => {
                    let re = new RegExp(/^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/);// 验证固定电话格式//判断正整数/[1−9]+[0−9]∗]∗/
                    if (value && !re.test(value)) {
                        return callback(new Error('固定电话号码格式错误'));
                    } else if (value && !re.test(value)) {
                        return callback(new Error('最多限输入20字'));
                    } else {
                        callback();
                    }
                },
                trigger: 'blur'
            }
        ],
        invoiceTitle: [
          { required: true, message: '请输入开票单位名称', trigger: 'blur' },
          { min: 1, max: 32, message: '最多限输入50字', trigger: 'blur' }
        ],
        invoiceTaxpayerIdentifiNumber: [
          { required: true, message: '请输入纳税人识别号', trigger: 'blur' },
          { min: 1, max: 32, message: '最多限输入32字', trigger: 'blur' }
        ],
        invoiceAddress: [
          { required: true, message: '请输入开票地址', trigger: 'blur' },
          { min: 1, max: 50, message: '最多限输入50字', trigger: 'blur' }
        ],
        invoiceBankAccount: [
            {
                required: true,
                validator: (rule, value, callback) => {
                    let re = new RegExp(/^[0-9]*$/);// 银行账号格式//判断正整数/[1−9]+[0−9]∗]∗/
                    if (!value) {
                        return callback(new Error('请输入开户行账号'));
                    } else if (value && !re.test(value)) {
                        return callback(new Error('银行账号格式错误'));
                    } else if (value && value.length > 32) {
                        return callback(new Error('最多限输入32字'));
                    } else {
                         callback();
                    }
                },
                trigger: 'blur'
            }
        ],
        invoiceBank: [
          { required: true, message: '请输入开票开户行', trigger: 'blur' },
          { min: 1, max: 50, message: '最多限输入50字', trigger: 'blur' }
        ],
        invoicePhone: [
          {
              validator: (rule, value, callback) => {
                    let re = new RegExp(/^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/);// 验证固定电话格式 即可输入电话号码也可输入固定电话
                    if (!value) {
                        return callback(new Error('请输入电话号码'));
                    } else if (value && !re.test(value)) {
                        return callback(new Error('电话号码格式错误'));
                    } else if (value && value.length > 20 ) {
                        return callback(new Error('最多限输入20字'));
                    } else {
                        callback();
                    }
                },
                trigger: 'blur',
                required: true
          }
        ],
        // city: [{ required: true, message: '请选择城市', trigger: 'blur' }],
        businessLicence: [
          { required: true, message: '请输入证件号', trigger: 'blur' },
          { min: 1, max: 32, message: '最多限输入32字', trigger: 'blur' }
        ],
        organRegistraCodeCertificate: [
          {required: true, message: '请输入证件号', trigger: 'blur'},
          { min: 1, max: 32, message: '最多限输入32字', trigger: 'blur' }
        ],
        taxRegistrationCertificate: [
          {required: true, message: '请输入证件号', trigger: 'blur'},
          { min: 1, max: 32, message: '最多限输入32字', trigger: 'blur' }
        ],
        multiCertificateCombineNo: [
          {required: true, message: '请输入证件号', trigger: 'blur'},
          { min: 1, max: 32, message: '最多限输入32字', trigger: 'blur' }
        ],
        legalPersonIdCard: [
             {
              validator: (rule, value, callback) => {
                    let re = new RegExp(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/);// 身份证验证
                    if (!value) {
                        return callback(new Error('请输入证件号'));
                    } else if (value && !re.test(value)) {
                        return callback(new Error('身份证号码格式错误'));
                    } else if (value && value.length > 32) {
                        return callback(new Error('最多限输入32字'));
                    } else {
                        callback();
                    }
                },
                trigger: 'blur',
                required: true
            }
        ],
        data: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ]
      },
      cityArr: cityData,
      selected: ['浙江', '杭州', '滨江'], // 城市选择数组
      labelWidth: '150px',
      dialogVisible: false, // 判断弹窗显隐的字段
      value6: '',
      inputVal: '',
      value1: '',
      checked: false,
      uploadUrl: '/chain-web/qiniu/upload/distributor', // 上传地址
      searchParams: {
        loginAccount: '', // 登录账号
        companyAbbreviation: '', // 公司简称
        companyName: '', // 公司全称
        area: '', // 所在区
        city: '', // 市区
        province: '', // 省
        country: '中国', // 国家
        address: '', // 详细地址
        contact: '', // 联系人
        mobile: '', // 联系人电话
        phone: '', // 联系人电话（固定电话）
        invoiceTitle: '', // 开票单位名称
        invoiceTaxpayerIdentifiNumber: '', // 纳税人识别号
        invoiceAddress: '', // 开票地址
        invoicePhone: '', // 开票电话
        invoiceBankAccount: '', // 发票银行账号
        invoiceBank: '', // 开票开户行
        businessLicence: '', // 营业执照证件号
        businessLicenceIsLongtime: '0',
        businessLicencePic: '', // 营业执照图片
        businessLicenceStartDate: '', // 营业执照开始日期
        businessLicenceEndDate: '', // 营业执照结束日期
        organRegistraCodeCertificate: '', // 组织机构代码证
        organRegistraIsLongtime: '0',
        organRegistraCodeCertificatePic: '', // 组织机构代码证图片
        organRegistraStartDate: '', // 组织机构代码证有效期开始日期
        organRegistraEndDate: '', // 组织机构代码证有效期结束日期
        taxRegistrationCertificate: '', // 税务登记证
        taxRegistrationIsLongtime: '0',
        taxRegistrationCertificatePic: '', // 税务登记证图片
        taxRegistrationStartDate: '', // 税务登记证有效期开始日期
        taxRegistrationEndDate: '', // 税务登记证有效期结束日期
        multiCertificateCombineNo: '', // 多证合一号
        multiCertificateIsLongtime: '0',
        multiCertificateCombinePic: '', // 多证合一图片
        multiCertificateStartDate: '', // 多证合一有效期开始日期
        multiCertificateEndDate: '', // 多证合一有效期结束日期
        legalPersonIdCard: '', // 法人身份证编号
        idCardIsLongtime: '0',
        idCardStartDate: '', // 法人省份证有效期开始日期
        idCardEndDate: '', // 法人身份证有效期结束日期
        legalPersonIdCardPic1: '', // 法人身份证正面图片地址
        legalPersonIdCardPic2: '', // 法人身份证反面图片地址
        memo: '' // 备注
      },
      radio: '1', // 单选框 默认是普通证件
      uploadFlag: true,
      currentImg: '', // 选择上传的证件
      positiveAndNegative: '', // 省份证正反面
      dialogImg: '',
      tableData: [],
      id: this.$route.params.id, // 判断是编辑还是新增
      showImg1: '', // 上传成功后营业执照缩略图
      showImg2: '', // 上传成功后组织机构缩略图
      showImg3: '', // 上传成功后税务证件缩略图
      showImg4: '', // 上传成功后多证合一证件缩略图
      showImg5: '', // 上传成功后身份证件正面证件缩略图
      showImg6: ''  // 上传成功后身份证件反面证件缩略图
    };
  },
  computed: {},
  methods: {
    businessUploadSuccess(val) {
        this.searchParams.businessLicencePic = val.body.key;
        this.showImg1 = val.body.artworkUrl;
        this.$refs.upload1.clearFiles();
    },
    organUploadSuccess(val) {
        this.searchParams.organRegistraCodeCertificatePic = val.body.key;
        this.showImg2 = val.body.artworkUrl;
        this.$refs.upload2.clearFiles();
    },
    taxUploadSuccess(val) {
        this.searchParams.taxRegistrationCertificatePic = val.body.key;
        this.showImg3 = val.body.artworkUrl;
        this.$refs.upload3.clearFiles();
    },
    multiUploadSuccess(val) {
        this.searchParams.multiCertificateCombinePic = val.body.key;
        this.showImg4 = val.body.artworkUrl;
        this.$refs.upload4.clearFiles();
    },
    legaluploadSuccess1(val) {
         this.searchParams.legalPersonIdCardPic1 = val.body.key;
         this.showImg5 = val.body.artworkUrl;
         this.$refs.upload5.clearFiles();
    },
    legaluploadSuccess2(val) {
         this.searchParams.legalPersonIdCardPic2 = val.body.key;
         this.showImg6 = val.body.artworkUrl;
         this.$refs.upload6.clearFiles();
    },
    // 图片上传之前事件 防止用户上传超过范围的文件
    beforeUpload(file) {
        let fileFormat = file.type;
        if (fileFormat === 'image/png' || fileFormat === 'image/jpg' || fileFormat === 'image/jpeg' || fileFormat === 'image/PBG' || fileFormat === 'image/bmp') {
            if (file.size > 1024 * 1024 * 3 ) {
                this.$utils.messagetip.warningTip('文件大小不能大于3M');
                return false;
            }
        } else {
            this.$utils.messagetip.warningTip('文件类型只能为.png,.jpg,.jpeg,.bmp');
            return false;
        }
    },
    // 普通证件和多证合一证见
    selectChange(val) {
        // if (val === '1') {
        //     this.clearMultiple();
        // } else if (val === '2') {
        //     this.clearOrdinary();
        // }
    },
    // 返回上一级
    back() {
        this.$router.go(-1);
    },
    // 删除图片
    deleteImg(str) {
        this.searchParams[str] = '';
    },
    citySelectChange(val) {
      // 城市选择赋值
      this.searchParams.province = val[0];
      this.searchParams.city = val[1];
      this.searchParams.area = val[2];
    },
    businessSelect(val) {
      // 营业执照的证件有效期是否长期
      if (val === '0') {
        this.business.disable = false;
      } else if (val === '1') {
        this.searchParams.businessLicenceStartDate = '';
        this.searchParams.businessLicenceEndDate = '';
      }
    },
    organizationSelect(val) {
      // 组织机构的证件有效期是否长期
      if (val === '0') {
        this.organization.disable = false;
      } else if (val === '1') {
        this.searchParams.organRegistraStartDate = '';
        this.searchParams.organRegistraEndDate = '';
      }
    },
    taxSelect(val) {
        // 税务的证件有效期是否长期
        if (val === '0') {
            this.tax.disable = false;
        } else if (val === '1') {
            this.searchParams.taxRegistrationStartDate = '';
            this.searchParams.taxRegistrationEndDate = '';
        }
    },
    setCardSelect(val) {
        // 多证合一的证件有效期是否长期
        if (val === '0') {
            this.setCard.disable = false;
        } else if (val === '1') {
            this.searchParams.taxRegistrationStartDate = '';
            this.searchParams.taxRegistrationEndDate = '';
        }
    },
    handleRemove(file, fileList) {

    },
    handlePreview(file) { // 点击查看上传的图片
      this.dialogVisible = true;
      this.dialogImg = file;
    },
    clearFile(str) {
      this.$refs.str.clearFiles();
    },
    //  表单验证事件
    submitForm(formName) {
        if (!this.searchParams.province) {
            this.$utils.messagetip.warningTip('请选择公司地址');
            return;
        } else if (!this.searchParams.phone && !this.searchParams.mobile) {
            this.$utils.messagetip.warningTip('联系人手机号码和固定电话需必填一项');
            return;
        }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.keepData();
        } else {
          return false;
        }
      });
    },
    // 提交多证合一时清空普通证件的的数据
    clearOrdinary() {
        this.searchParams.businessLicence = ''; // 营业执照证件号
        this.searchParams.businessLicenceIsLongtime = '';
        this.searchParams.businessLicencePic = ''; // 营业执照图片
        this.searchParams.businessLicenceStartDate = ''; // 营业执照开始日期
        this.searchParams.businessLicenceEndDate = '';// 营业执照结束日期
        this.searchParams.organRegistraCodeCertificate = '';// 组织机构代码证
        this.searchParams.organRegistraIsLongtime = '';
        this.searchParams.organRegistraCodeCertificatePic = ''; // 组织机构代码证图片
        this.searchParams.organRegistraStartDate = ''; // 组织机构代码证有效期开始日期
        this.searchParams.organRegistraEndDate = ''; // 组织机构代码证有效期结束日期
        this.searchParams.taxRegistrationCertificate = ''; // 税务登记证
        this.searchParams.taxRegistrationIsLongtime = '';
        this.searchParams.taxRegistrationCertificatePic = ''; // 税务登记证图片
        this.searchParams.taxRegistrationStartDate = ''; // 税务登记证有效期开始日期
        this.searchParams.taxRegistrationEndDate = ''; // 税务登记证有效期结束日期
    },
    // 提交普通证件时清空多证合一证件的数据
    clearMultiple() {
        this.searchParams.multiCertificateCombineNo = ''; // 多证合一号
        this.searchParams.multiCertificateIsLongtime = '';
        this.searchParams.multiCertificateCombinePic = ''; // 多证合一图片
        this.searchParams.multiCertificateStartDate = ''; // 多证合一有效期开始日期
        this.searchParams.multiCertificateEndDate = ''; // 多证合一有效期结束日期
    },
    // 新增分销商
    keepData() {
      if (this.radio === '1') {
        // 普通证件
        if (this.searchParams.businessLicenceIsLongtime === '0') {
            if (!this.searchParams.businessLicenceStartDate || !this.searchParams.businessLicenceEndDate) {
                this.$utils.messagetip.warningTip('营业执照证件有效期时间不能为空');
                return;
            } else if (!this.searchParams.businessLicencePic ) {
                this.$utils.messagetip.warningTip('请上传营业执照图片');
                return;
            }
        } else {
            if (!this.searchParams.businessLicencePic ) {
                this.$utils.messagetip.warningTip('请上传营业执照图片');
                return;
            }
        }
        if (this.searchParams.organRegistraIsLongtime === '0') {
            if (!this.searchParams.organRegistraStartDate || !this.searchParams.organRegistraEndDate) {
                this.$utils.messagetip.warningTip('组织机构证件有效期时间不能为空');
                return;
            } else if (!this.searchParams.organRegistraCodeCertificatePic ) {
                this.$utils.messagetip.warningTip('请上传组织机构执照图片');
                return;
            }
        } else {
            if (!this.searchParams.organRegistraCodeCertificatePic ) {
                this.$utils.messagetip.warningTip('请上传组织机构执照图片');
                return;
            }
        }
        if (this.searchParams.taxRegistrationIsLongtime === '0') {
            if (!this.searchParams.taxRegistrationStartDate || !this.searchParams.taxRegistrationEndDate) {
                this.$utils.messagetip.warningTip('税务登记证件有效期时间不能为空');
                return;
            } else if (!this.searchParams.taxRegistrationCertificatePic ) {
                this.$utils.messagetip.warningTip('请上传税务登记执照图片');
                return;
            }
        } else {
            if (!this.searchParams.taxRegistrationCertificatePic ) {
                this.$utils.messagetip.warningTip('请上传税务登记执照图片');
                return;
            }
        }
      } else if (this.radio === '2') {
        // 多证合一
        if (this.searchParams.multiCertificateIsLongtime === '0') {
            if (!this.searchParams.multiCertificateStartDate || !this.searchParams.multiCertificateEndDate) {
                this.$utils.messagetip.warningTip('多证合一证件有效期时间不能为空');
                return;
            } else if (!this.searchParams.multiCertificateCombinePic ) {
                this.$utils.messagetip.warningTip('请上传多证合一执照图片');
                return;
            }
        } else {
            if (!this.searchParams.multiCertificateCombinePic ) {
                this.$utils.messagetip.warningTip('请上传多证合一执照图片');
                return;
            }
        }
      }
      // 身份证证件
      if (this.searchParams.idCardIsLongtime === '0') {
            if (!this.searchParams.idCardStartDate || !this.searchParams.idCardEndDate) {
                this.$utils.messagetip.warningTip('法人身份证件有效期时间不能为空');
                return;
            } else if (!this.searchParams.legalPersonIdCardPic1 || !this.searchParams.legalPersonIdCardPic2 ) {
                this.$utils.messagetip.warningTip('请上传法人身份证图片');
                return;
            }
        } else {
            if (!this.searchParams.legalPersonIdCardPic1 || !this.searchParams.legalPersonIdCardPic2) {
                this.$utils.messagetip.warningTip('请上传法人身份证件图片');
                return;
            }
        }

        // 判断是选择的是多证合一还是普通证件 同时清空相应的数据
        if (this.radio === '1') {
            this.clearMultiple();
        } else if (this.radio === '2') {
            this.clearOrdinary();
        }
      this.POST(
        '/busiDistributor/saveOrEditDistributor',
        this.searchParams
      ).then(res => {
        if ( this.id === 'add') {
            this.$utils.messagetip.successTip('新建分销商成功!');
        } else {
            this.$utils.messagetip.successTip('修改成功');
        }
        setTimeout(() => {
            this.$router.push({path: '/distributormanage'});
        }, 1000);
      });
    },
    // 编辑初始化数据
    initDataList(data) {
        this.GET(`/busiDistributor/queryDistributorDetails/${data}`).then( res => {
            let body = res.body;
            this.searchParams = body;
            editCompanyName = body.companyName;
            editCompanyAbbreviation = body.companyAbbreviation;
            this.selected = [body.province, body.city, body.area];
            // 缩略图赋值
            this.showImg1 = body.domain + '/' + body.businessLicencePic;
            this.showImg2 = body.domain + '/' + body.organRegistraCodeCertificatePic;
            this.showImg3 = body.domain + '/' + body.taxRegistrationCertificatePic;
            this.showImg4 = body.domain + '/' + body.multiCertificateCombinePic;
            this.showImg5 = body.domain + '/' + body.legalPersonIdCardPic1;
            this.showImg6 = body.domain + '/' + body.legalPersonIdCardPic2;
            if (body.multiCertificateCombinePic) {
                this.radio = '2';
            } else {
                this.radio = '1';
            }
        });
    }
  },
  mounted: function() {
      if (this.id !== 'add') {
          this.initDataList(this.id);
      }
  }
};
</script>

<style lang="stylus" scoped>
.manageaddoredit
    font-size: 14px;
    .box-card
        margin-bottom: 15px;
    .info
        p
            line-height: 26px;
            .title
                font-weight: 700;
    .btn
        text-align: center;
        line-height: 60px;
        background-color: rgb(242, 242, 242);
    .name
        font-weight: 700;
        font-size: 18px;
        line-height: 40px;
        padding-left: 20px;
        background-color: rgb(242, 242, 242);
        margin-top: 15px;
    .radio
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
    .main_images
        margin-top: 30px;
        margin-bottom: 15px;
        .title
            text-align: right;
            line-height: 40px;
            font-size: 22px;
            font-weight: 500;
    .tactics
        line-height: 60px;
        padding-left: 20px;
    .msgWrap
        border: 1px solid #ebeef5;
        border-bottom: 0;
        margin: 10px 0;
        ul
            display: flex;
            border-bottom: 1px solid #ebeef5;
            align-items: center;
            li
                width: 22%;
                text-align: center;
                border-right: 1px solid #ebeef5;
                min-height: 45px;
                line-height: 45px;
            li:nth-child(3)
                width: 33%;
                text-align: left;
                padding-left: 10px;
            li.uploadLi
                display: flex;
                justify-content: center;
                align-items: center;
        ul.head
            height: 40px;
            line-height: 40px;
    .showImg
        img
           width: 40px
           cursor: pointer
           max-height: 40px;

</style>
<style>
    .body .el-form-item__content{
        margin-left: 0!important
    }
</style>


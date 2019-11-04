<template>
    <div>
        <el-row>
            <el-col>
                <el-form-item :required="isRequired" label="所属类目：" size="mini">
                    <el-col :span="6">
                        <el-select v-model="firstCategoryId" filterable placeholder="请选择" @change="firstCateChange">
                            <el-option  v-for="(item, index) in firstCateList" :key="index" :label="item.name" :value="item.id" @click.native="emitThird ? '' : initRow(item, 'firstData')">
                            </el-option>
                        </el-select>
                        </el-col>
                        <el-col :span="6">
                        <el-select v-model="secondCategoryId" :disabled="isFirstLevel" @change="secondCateChange" filterable placeholder="请选择">
                            <el-option v-for="(item, index) in secondCateList" :key="index" :label="item.name" :value="item.id" @click.native="emitThird ? '' : initRow(item, 'secondData')">
                            </el-option>
                        </el-select>
                        </el-col>
                        <el-col :span="8">
                        <el-select multiple v-model="thirdCategoryId"  :disabled="isSecondLevel"  @change="thirdCateChange"  filterable placeholder="请选择">
                            <el-option v-for="(item, index)  in thirdCateList" :key="index" :label="item.name" :value="item.id" @click.native="initRow(item, 'thirdData')">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    props: {
        url: {
            type: String,
            default: '/productCenter/category/tree'
        },
        clear: {
            // 是否要清空条件
            type: Boolean,
            default: false
        },
        isThird: {
            type: Boolean
        },
        required: {
            type: [String, Boolean],
            default: false
        }
    },
    data() {
        return {
            api: this.url, // 类目请求地址
            categoryLevel: '', // 类目等级
            categoryId: '', // 所选类目id
            categoryName: '', // 所选类目名字
            firstCateList: [], // 类目一级列表
            secondCateList: [], // 类目二级列表
            thirdCateList: [], // 类目三级列表
            isFirstLevel: true, // 关联二级菜单是否禁用
            isSecondLevel: true, // 关联三级菜单是否禁用
            firstCategoryId: '', // 第一级选中菜单
            secondCategoryId: '',  // 第二级选中菜单
            thirdCategoryId: [], // 第三级选中菜单
            emitThird: this.isThird, // 是否选中第三级菜单才返回数据
            isRequired: this.required, // 是否是必填项
            categorySelectedData: [],
            firstData: '',
            secondData: '',
            thirdData: []
        };
    },
    mounted: function() {
        this.initCateData({parentId: '', isRecursive: false}).then( res => {
            this.firstCateList = [];
            // this.firstCateList = res.result;
            res.result.map(item => {
                if (item.isValid === '1') {
                    this.firstCateList.push(item);
                }
            });
        });
    },
    methods: {
        // 获取全部类目事件
        initCateData(val) {
            return this.$AXIOS.GET(this.api, val);
        },
        firstCateChange(val) {
            this.categoryId = val;
            this.categoryLevel = 1;
            this.isSecondLevel = true;
            this.initCateData({parentId: val, isRecursive: false}).then( res => {
                this.secondCateList = [];
                this.secondCategoryId = '';
                this.thirdCategoryId = [];
                this.thirdData = [];
                res.result.map(item => {
                    if (item.isValid === '1') {
                        this.secondCateList.push(item);
                    }
                });
                // this.secondCateList = res.result;
                this.isFirstLevel = false;
            });
        },
        secondCateChange(val, row) {
            this.categoryId = val;
            this.categoryLevel = 2;
            this.initCateData({parentId: val, isRecursive: false}).then( res => {
                this.thirdCateList = [];
                this.thirdCategoryId = [];
                this.thirdData = [];
                res.result.map(item => {
                    if (item.isValid === '1') {
                        this.thirdCateList.push(item);
                    }
                });
                // this.thirdCateList = res.result;
                this.isSecondLevel = false;
            });
        },
        thirdCateChange(val, row) {
            setTimeout(() => {
                if (this.thirdCategoryId.length) {
                    for (let i = 0; i < this.thirdData.length; i++) {
                        if ( this.thirdCategoryId.indexOf(this.thirdData[i].categoryId) === -1) {
                            this.thirdData.splice(i, 1);
                            i--;
                        }
                    }
                } else {
                    this.thirdData = [];
                }
                this.emit();
            }, 20);
        },
        initRow(data, str) {
           if (str === 'thirdData') {
               this.thirdData.push({
                   categoryId: data.id,
                   categoryCode: data.categoryCode,
                   categoryName: `${this.firstData.categoryName}-${this.secondData.categoryName}-${data.name}`
               });
           } else {
               this[str] = {
                    categoryId: data.id,
                    categoryCode: data.categoryCode,
                    categoryName: data.name
                };
           }
        },
        emit() {
            this.$emit('selectResult', this.thirdData);
        }
    },
    watch: {
        clear(now, old) {
            if (now) {
                for (let obj in this.$data) {
                    if (obj === 'api') {
                        continue;
                    } else if (obj === 'isFirstLevel' || obj === 'isSecondLevel') {
                        this.$data[obj] = true;
                    } else {
                        this.$data[obj] = '';
                    }
                }
                this.$data.isRequired = false;
                this.initCateData({parentId: '', isRecursive: false}).then( res => {
                    this.firstCateList = res.result;
                });
            }
        }
    }
};
</script>

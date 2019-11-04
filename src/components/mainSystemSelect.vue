<template>
    <div>
        <el-row>
            <el-col>
                <el-form-item :required="isRequired" label="所属类目：" size="mini">
                    <el-col :span="8">
                        <el-select v-model="firstCategoryId" filterable placeholder="请选择" @change="firstCateChange">
                            <el-option  v-for="item in firstCateList" :key="item.id" :label="item.name" :value="item.id" @click.native="emitThird ? '' : initRow(item)">
                            </el-option>
                        </el-select>
                        </el-col>
                        <el-col :span="8">
                        <el-select v-model="secondCategoryId" :disabled="isFirstLevel" @change="secondCateChange" filterable placeholder="请选择">
                            <el-option v-for="item in secondCateList" :key="item.id" :label="item.name" :value="item.id" @click.native="emitThird ? '' : initRow(item)">
                            </el-option>
                        </el-select>
                        </el-col>
                        <el-col :span="8">
                        <el-select v-model="thirdCategoryId"  :disabled="isSecondLevel"  @change="thirdCateChange"  filterable placeholder="请选择">
                            <el-option v-for="item in thirdCateList" :key="item.id" :label="item.name" :value="item.id" @click.native="initRow(item)">
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
            type: [String, Boolean]
        },
        isNoFilter: {
            // 是否要过滤
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            // isNoFilter: this.isNoFilter, // isValid
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
            thirdCategoryId: '', // 第三级选中菜单
            emitThird: this.isThird, // 是否选中第三级菜单才返回数据
            isRequired: this.required // 是否是必填项
        };
    },
    mounted: function() {
      console.log(this.isNoFilter);
        this.initCateData({parentId: '', isRecursive: false}).then( res => {
             this.firstCateList = [];
              if (this.isNoFilter) {
                res.result.map(item => {
                  if (item.isValid === '1') {
                      this.firstCateList.push(item);
                  }
                });
              } else {
                res.result.map(item => {
                  this.firstCateList.push(item);
                });
              }
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
                this.thirdCategoryId = '';
                // this.secondCateList = res.result;
                res.result.map(item => {
                    if (item.isValid === '1') {
                        this.secondCateList.push(item);
                    }
                });
                this.isFirstLevel = false;
            });
        },
        secondCateChange(val, row) {
            this.categoryId = val;
            this.categoryLevel = 2;
            this.initCateData({parentId: val, isRecursive: false}).then( res => {
                this.thirdCategoryId = '';
                this.thirdCateList = [];
                // this.thirdCateList = res.result;
                res.result.map(item => {
                    if (item.isValid === '1') {
                        this.thirdCateList.push(item);
                    }
                });
                this.isSecondLevel = false;
            });
        },
        thirdCateChange(val, row) {
            this.categoryId = val;
            this.categoryLevel = 3;
        },
        initRow(data) {
           this.categoryName = data.name;
           this.emit();
        },
        emit() {
            let data = {
                categoryId: this.categoryId,
                categoryLevel: this.categoryLevel,
                categoryName: this.categoryName,
                flag: false
            };
            this.$emit('selectResult', data);
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
                    } else if (obj === 'isRequired' ) {
                         this.$data[obj] = false;
                    } else {
                        this.$data[obj] = '';
                    }
                }
                this.emit();
                this.initCateData({parentId: '', isRecursive: false}).then( res => {
                    this.firstCateList = res.result;
                });
            }
        }
    }
};
</script>

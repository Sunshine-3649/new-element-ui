<template>
    <div>
        <el-row>
            <el-col>
                <el-form-item label="商品类目：" prop="allocateOutOrderCode" size="mini">
                    <el-col :span="8">
                        <el-select v-model="searchParams.first.id" filterable placeholder="请选择" @change="firstCateChange">
                            <el-option v-for="item in searchParams.first.list" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="searchParams.second.id" :disabled="searchParams.second.disabled" @change="secondCateChange" filterable placeholder="请选择">
                            <el-option v-for="item in searchParams.second.list" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="searchParams.third.id" :disabled="searchParams.third.disabled" filterable placeholder="请选择" @change="thirdCateChange">
                            <el-option v-for="item in searchParams.third.list" :key="item.id" :label="item.name" :value="item.id">
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
      // 接口地址
      type: String,
      default: '/category/queryCategory'
    },
    clear: {
      // 是否要清空条件
      type: [Boolean, Number]
    }
  },
  data() {
    return {
      searchParams: {
        first: { id: '', list: [], disabled: false },
        second: { id: '', list: [], disabled: true },
        third: { id: '', list: [], disabled: true }
      },
      api: this.url
    };
  },
  methods: {
    CateChange(data) {
      return this.GET(this.api, data);
    },
    firstCateChange(value) {
      // 第一个选择框被选择事件
      if (value) {
        this.searchParams.second.disabled = false;
        this.searchParams.second.id = '';
        this.searchParams.third.id = '';
        this.CateChange({ level: '2', parentId: value }).then(res => {
          this.searchParams.second.list = res.body;
        });
      }
      this.emit();
    },
    secondCateChange(value) {
      // 第二个选择框被选择事件
      if (value) {
        this.searchParams.third.id = '';
        this.searchParams.third.disabled = false;
        this.CateChange({ level: '3', parentId: value }).then(res => {
          this.searchParams.third.list = res.body;
        });
      }
      this.emit();
    },
    thirdCateChange() {
      // 第三个选择框被选择事件
      this.emit();
    },
    emit() {
      // 传递数据到父组件
      let data = {
        firstCategoryId: this.searchParams.first.id,
        secondCategoryId: this.searchParams.second.id,
        thirdCategoryId: this.searchParams.third.id
      };
      this.$emit('shopId', data);
    }
  },
  mounted: function() {
    this.CateChange({ level: 1 }).then(res => {
      this.searchParams.first.list = res.body;
    });
  },
  watch: {
    clear: function(now, old) {
      // 清空条件的flag
      if (now > 0 || now) {
        for (let item in this.searchParams) {
          for (let data in this.searchParams[item]) {
            if (data === 'list') {
              this.searchParams[item][data] = [];
            } else if (data === 'id') {
              this.searchParams[item][data] = '';
            } else if (data === 'disabled') {
              this.searchParams[item][data] = true;
            }
          }
        }
        this.emit();
        this.CateChange({ level: 1 }).then(res => {
          this.searchParams.first.list = res.body;
        });
      }
    }
  }
};
</script>


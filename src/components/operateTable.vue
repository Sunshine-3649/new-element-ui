<template>
    <div>
        <el-table :data="data" border style="width: 100%">
            <el-table-column align="center"  type="index" label="序号"   width="50"></el-table-column>
            <el-table-column align="center"  prop="operation"  label="动作"  width="180">
            </el-table-column>
            <el-table-column align="center" prop="operator" label="操作人"  width="180"> </el-table-column>
            <el-table-column align="center" :prop="operateTime" label="操作时间"> </el-table-column>
            <el-table-column align="center" label="备注">
              <template slot-scope="scope">
                <div v-html="scope.row.remark"></div>
              </template>
            </el-table-column>
        </el-table>
        <el-pagination style="text-align:right; padding:20px 0;" @size-change="changeSize" @current-change="changeNumber" :current-page="operateParams.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="operateParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
        </el-pagination>
        <div v-if="!isDialog" style="text-align:center;">
            <el-button @click="closeOperate"  size="mini" type="primary"> 关闭 </el-button>
        </div>
    </div>
</template>

<script>


export default {
    props: {
        params: {
            type: Object
        },
        isRefresh: {
            type: [Number, String]
        },
        url: {
            type: String,
            default: '/logInformation/logInformationPage'  // 默认是企业购的操作日志地址
        },
        entityId: {
            type: [String, Number]
        }
    },
    data() {
        return {
            data: [],
            api: this.url,
            refresh: this.isRefresh,
            operateParams: {
                pageSize: 10,
                start: 0,
                pageNumber: 1,
                pageNo: 1,
                entityType: this.params.entityType,
                entityId: this.params.entityId
            },
            isDialog: this.entityId,
            totalSize: 0, // 总条数
            operateTime: this.url === '/logInformation/logInformationPage' ? 'operateTime' : 'operateTimeString'
        };
    },
    watch: {
        isRefresh(now, old) {
            if (now > 0) {
                this.dataInit(this.operateParams);
            }
        },
        entityId(now, old) {
            this.operateParams.entityId = now;
            this.dataInit(this.operateParams);
        }
    },
    methods: {
        changeSize(val) {
            this.operateParams.pageSize = val;
            this.dataInit(this.operateParams);
        },
        changeNumber(val) {
            this.operateParams.pageNumber = this.operateParams.pageNo = val;
            this.dataInit(this.operateParams);
        },
        dataInit(data) {
            if (this.api === '/logInformation/logInformationPage') {
                this.GET(this.api, data).then(res => {
                    this.data = res.body.objects;
                    this.totalSize = res.body.recordTotal;
                });
            } else {
                let _data = data;
                if (this.params.operateType) {

                } else {
                    _data.operateType = 0;
                }
                this.$AXIOS.LISTGET(this.api, _data).then(res => {
                    this.data = res.result;
                    this.totalSize = res.totalCount;
                });
            }
        },
        closeOperate() {
            this.$emit('closeOperate');
        }
    },
    mounted: function() {
        this.dataInit(this.operateParams);
    }
};
</script>


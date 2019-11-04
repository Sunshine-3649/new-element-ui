<template>
    <div class="uploadWrap">
        <el-dialog :visible.sync='dialogVisible' width="30%">
            <el-upload
                ref="upload"
                class="upload-demo"
                drag
                :limit="fileNumber"
                :action="uploadUrl"
                :on-change="handleChange"
                :before-upload="beforeUpload"
                :on-success="uploadSuccess"
                :file-list="fileList">
                <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip"> {{ tips }} </div>
            </el-upload>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        fileUploadUrl: {
            type: String,
            default: '/chain-web/busiPricePlan/importAnalyzeData'
        },
        uploadDialog: {
            type: Boolean,
            default: false
        },
        tip: {
            type: String,
            default: '只能上传jpg/png文件，且不超过500kb'
        },
        // '.jpg,.jpeg,.png,.JPG,.JPEG,.PBG'
        acceptFormat: {
            type: [String],
            required: false
        },
        limitSize: { // 文件大小
            type: [Number, String],
            required: false
        },
        limitNmber: {  // 文件条数
            type: [Number, String],
            required: false
        },
        clear: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dialogVisible: this.uploadDialog, // 浮窗显示和隐藏
            uploadUrl: this.fileUploadUrl, // 上传地址
            tips: this.tip, // 上传提示
            limitFormat: this.acceptFormat,  // 上传格式
            fileSize: this.limitSize, // 文件的大小
            fileNumber: this.limitNmber, // 允许上传文件的条数
            clearFiles: this.clear, // 是否可以清除文件列表
            fileList: []
        };
    },
    methods: {
        handleChange() {},
        // 上传到服务器之前的事件
        beforeUpload(file) {
            let size = file.size;
            let formatArr = this.acceptFormat ? this.acceptFormat.split(',') : false;  // 分离出限制的格式
            let selectFileFormat = '.' + file.name.split('.')[1];  // 取出文件的上传类型
            if (this.limitFormat && this.limitFormat.indexOf(selectFileFormat) === -1) {  // 限制文件格式
                this.$utils.messagetip.warningTip('上传的文件格式不对');
                return false;
            }
            if (size > this.fileSize * 1024 * 1024) { // 限制文件大小
                this.$utils.messagetip.warningTip(`上传的文件大小不得超过${this.limitSize}M`);
                return false;
            }
        },
        // 上传到服务器成功事件
        uploadSuccess(file) {
            this.$emit('getFile', file);
        }
    }
};
</script>
<style scoped>
  .uploadWrap{
      text-align: center
  }
</style>

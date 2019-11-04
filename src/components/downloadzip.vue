<template>
  <div class="downloadzip">
    <el-button type="primary" size="mini" :disabled="!this.imgList.length" @click="handleBatchDownload">
      <slot></slot>
    </el-button>
  </div>
</template>
<script>
import axios from 'axios';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

const getFile = url => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      responseType: 'arraybuffer'
    })
      .then(data => {
        resolve(data.data);
      })
      .catch(error => {
        reject(error.toString());
      });
  });
};

export default {
  name: 'downloadzip',
  data() {
    return {};
  },
  props: {
    imgList: {
      type: Array,
      require: true,
      default: function() {
        return [];
      }
    },
    name: {
      type: String,
      default: '文件下载'
    },
    domain: {
      type: String,
      default: 'https://scm.trc.com/'
    }
  },
  methods: {
    handleBatchDownload() {
      const data = this.imgList;
      console.log(data);
      const zip = new JSZip();
      const cache = {};
      const promises = [];
      data.forEach(item => {
        const promise = getFile(this.domain + '/' + item).then(data => {
          // 下载文件, 并存成ArrayBuffer对象
          let arrNameList = item.split('/');
          let fileName = arrNameList[arrNameList.length - 1]; // 获取文件名
          zip.file(fileName, data, { binary: true }); // 逐个添加文件
          cache[fileName] = data;
        });
        promises.push(promise);
      });

      Promise.all(promises).then(() => {
        zip.generateAsync({ type: 'blob' }).then(content => {
          // 生成二进制流
          FileSaver.saveAs(content, this.name + '.zip'); // 利用file-saver保存文件
        });
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
</style>

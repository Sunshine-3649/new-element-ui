import axios from 'axios';
let querydiction = function(typeCode, value) {
  let query = localStorage.queryArr ? JSON.parse(localStorage.queryArr) : getDict();
  if (query && !query.length) {
    // 获取字典接口
    axios.get('/scm-web/metadata/dict').then(res => {
      localStorage.queryArr = JSON.stringify(res.data);
      query = res.data;
    });
  }
  if (value === '' || value === null || value === undefined) {
    let dict = [];
    query.forEach(item => {
      if (item.typeCode === typeCode) {
        dict.push({ name: item.name, value: item.value });
      }
    });
    return dict;
  } else {
    let name = '';
    query.forEach(item => {
      if (item.typeCode === typeCode && item.value === (value + '')) {
        name = item.name;
      }
    });
    return name;
  }
};
function getDict() {

}
// 外部调用
// console.log(this.$utils.querydiction('BusiSupplierSkusStatus', '1'));
export default querydiction;


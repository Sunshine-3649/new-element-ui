import axios from 'axios';
let queryaddress = function(province, city, area) {
  let query = localStorage.addressArr ? JSON.parse(localStorage.addressArr) : getDict();
  if (query && !query.length) {
    // 获取字典接口
    axios.get('/scm-web/metadata/address').then(res => {
      localStorage.addressArr = JSON.stringify(res.data);
      query = res.data;
    });
  }
  let addressNames = [];
  if (province) {
    query.forEach(element => {
      if (province === element.id) {
        addressNames.push(element.text);
        if (city) {
          element.children.forEach(item => {
            if (city === item.id) {
              addressNames.push(item.text);
              if (area) {
                item.children.forEach(n => {
                  if (area === n.id) {
                    addressNames.push(n.text);
                  }
                });
              }
            }
          });
        }
      }
    });
  }
  return addressNames;
};
function getDict() {

}
// 外部调用
// console.log(this.$utils.querydiction('BusiSupplierSkusStatus', '1'));
export default queryaddress;


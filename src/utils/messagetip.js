import { Message } from 'element-ui';

function successTip(msg) {
  Message({
    type: 'success',
    showClose: true,
    message: msg
  });
}
function warningTip(msg) {
  Message({
    type: 'warning',
    showClose: true,
    message: msg
  });
}
function errorTip(msg) {
  Message({
    type: 'error',
    showClose: true,
    message: msg
  });
}
function infoTip(msg) {
  Message({
    type: 'info',
    showClose: true,
    message: msg
  });
}
let messagetip = {
  successTip,
  warningTip,
  errorTip,
  infoTip
};
export default messagetip;

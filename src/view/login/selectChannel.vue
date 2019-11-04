<template>
  <div class="channel-page">
    <div class="channel-con">
      <p class="tip">系统检测到您从属多条业务线，请先选择数据权限</p>
      <ul class="list">
        <li v-for="(item,index) in warehouse" :key="'channel'+index" @click="setWarehouse(item.channelCode)">
          <span>{{item.channelName}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import * as selectChannelApi from '@/api/selectChannel';

  export default {
    data() {
      return {
         warehouse: []
      };
    },
    beforeCreate: function() {
        selectChannelApi.getWarehouse().then(res => {
            if (res.result[0].userType === 'overallUser') {
                selectChannelApi.getHtml().then(htmlRes => {
                    selectChannelApi.getuserName().then(res => {
                        window.sessionStorage.userName = res.result;
                        this.$store.dispatch('selectChannel/setPermission', htmlRes.result);
                        window.sessionStorage.menuConfig = JSON.stringify(htmlRes.result);
                        this.$router.push({path: '/businesskanbanopage', query: {keepAlive: true}});
                    });
                });
            } else {
                this.warehouse = res.result;
                this.$store.dispatch('selectChannel/setChannels', res.result);
                if (res.result.length === 1) {
                    this.setWarehouse(res.result[0].channelCode);
                }
            }
        });
    },
    created() {

    },
    computed: {

    },
    methods: {
        setWarehouse(channelCode) {
            selectChannelApi.confirmUser(channelCode).then(res => {
                document.cookie = 'SESSION=' + res.result + ';path=/;';
                this.$utils.messagetip.successTip(res.databuffer);
                window.sessionStorage.currentChannel = channelCode;

                selectChannelApi.getHtml().then(htmlRes => {
                    this.$store.dispatch('selectChannel/setPermission', htmlRes.result);
                    window.sessionStorage.menuConfig = JSON.stringify(htmlRes.result);
                    selectChannelApi.getuserName().then(nameRes => {
                        window.sessionStorage.userName = nameRes.result;
                        this.$router.push({path: '/businesskanbanopage', query: {keepAlive: true}});
                    });
                });
            });
        }
    }
};
</script>

<style lang="less" scoped="">
  .channel-page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 16px;
    background-color: #3e3e56;
    .channel-con {
      width: 1100px;
      margin: 250px auto 0;
      .tip {
        color: #fff;
        font-weight: bold;
        text-align: center;
      }
      ul {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        li {
          width: 250px;
          height: 150px;
          align-items: center;
          display: flex;
          justify-content: center;
          // line-height: 150px;
          background: #fff;
          text-align: center;
          border-radius: 5px;
          margin-top: 32px;
          cursor: pointer;
        }
        li:hover{
          color: #f60
        }
      }
    }
  }
</style>

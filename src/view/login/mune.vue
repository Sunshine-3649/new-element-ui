<template>
    <div class="mune">
        <div class="header">
            <div class="right_wrap">
                <span class="tip"><img src="../../assets/logo.png">泰然SCM</span>
                <div class="mune_warp">
                    <!-- <sildeMune v-on:changeRoute="routes" :activeRoute = defaultActive></sildeMune> -->
                    <newNav :currentRoute="defaultActive" v-on:changeRoute="routes"></newNav>
                </div>
                <div class="select_warehouse">
                    <span v-if="this.currentWareHouse">当前业务线：</span>
                    <el-select v-if="this.currentWareHouse" style="width: 150px; padding: 0 5px;" size="mini" @change="selectChannel"  v-model="currentWareHouse" filterable placeholder="请选择">
                        <el-option v-for="item in wareHouseList" :key="item.value" :label="item.channelName" :value="item.channelCode">
                        </el-option>
                    </el-select>
                    <span style="padding:0 10px;max-width: 250px;" class="text_hide">欢迎，{{ userName }}</span>
                    <div @click="loginOut" style="cursor:pointer;width: 30px" class="login_out">退出</div>
                </div>
            </div>
        </div>

        <div class="main" id="main">
            <muneTab v-on:changeRoute="routes"></muneTab>
            <transition name="fade">
                <!-- <router-view  ></router-view>  -->
                <keep-alive    :include="includeKeepAlive">
                    <router-view ></router-view>
                </keep-alive>
            </transition>
        </div>
    </div>
</template>

<script>
import * as selectChannelApi from '@/api/selectChannel';
import newNav from '../slideMune/newNav';
import sildeMune from '../slideMune/slideMune';
import muneTab from '../slideMune/muneTab';
import axios from 'axios';
export default {
    name: 'mune',
    provide() {
        return {
            reload: this.reload
        };
    },
    components: {
        sildeMune,
        muneTab,
        newNav
    },
    data() {
        return {
            wareHouseList: this.$store.state.selectChannel.channels, // 读取业务线
            currentWareHouse: window.sessionStorage.currentChannel, // 当前所选业务线
            userName: window.sessionStorage.userName,
            defaultActive: '',
            keepAlive_flag: '',
            isRouterAlive: true
            // currentCode: window.sessionStorage.currentChannel
        };
    },
    created: function() {
        console.log(this.wareHouseList, this.currentWareHouse, 'mune');
        let routeSplit = this.$route.path.split('/');
        this.defaultActive = `/${routeSplit[1]}`;
    },
    activated: function() {

    },
    updated: function() {

    },
    watch: {
    },
    computed: {
        keepAlive() {
            // let keepArr = [];
            // let muneTabList = this.$store.state.selectChannel.muneTabList;
            // muneTabList.forEach((item, index) => {
            //     keepArr.push(item.route);
            // });
            // console.log(this.$store.state.selectChannel.iskeepAlive, 'store');
            // return this.$store.state.selectChannel.iskeepAlive;
        },
        includeKeepAlive() {
            // let muneTabList = this.$store.state.selectChannel.muneTabList;
            // let arr = muneTabList.map((item, index) => item.name).join();
            // console.log(arr, muneTabList, 7);
            // return arr;
            // console.log(this.$store.state.selectChannel.keepAliveArr, this.$route);
            return this.$store.state.selectChannel.keepAliveArr.join();
        }
    },
    methods: {
        reload() {
            this.isRouterAlive = false;
            this.$nextTick(() => {
                this.isRouterAlive = true;
            });
        },
        selectChannel(code) {
            window.sessionStorage.currentChannel = code;
            selectChannelApi.confirmUser(code).then(res => {
                selectChannelApi.getHtml().then(htmlRes => {
                this.$store.dispatch('selectChannel/setPermission', htmlRes.result);
                window.sessionStorage.menuConfig = JSON.stringify(htmlRes.result);
                let routeSplit = this.$route.path.split('/');
                if (routeSplit.length > 2) {
                  this.$router.go(-1);
                } else {
                  this.$router.go(0);
                }
            });
            });
        },
        routes(route) {
            // this.defaultActive = route;
            this.defaultActive = route.route;
        },
        loginOut() {
            this.$confirm('是否退出登录？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // this.$AXIOS.POST('/account/user/logout/').then(res => {
                    this.$AXIOS.GET('api/clearSession/').then(res => {
                        // if ( window.location.origin.indexOf('tairanmall.com') !== -1 ) {
                        //     let redirectUrl = window.location.origin + '/#/SelectChannel';
                        //     window.location.href = 'http://passport.tairanmall.com/login?redirectUrl=' + redirectUrl;
                        // } else {
                            window.location.href = '/scm/index.html#/login';
                        // }
                        window.sessionStorage.clear();
                    });
                // });
            }).catch(() => {
              this.$utils.messagetip.infoTip('已取消');
            });
        }
    }
};
</script>

<style lang="less" scoped>
.header{
    // position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    background-color: #324057;
    color: #fff;
    .mune_warp{
        flex: 1
    }
    .right_wrap{
        display: flex;
        justify-content: space-between;
        .select_warehouse{
            display: flex;
            max-width: 460px;
            justify-content: space-between;
        }
    }
    .tip{
        font-size: 16px;
        letter-spacing: 2px;
        width: 180px;
        img{
          width: 30px;
          vertical-align: middle;
          margin-right: 5px;
        }
    }
 }
// .slide_wrap{
//     width: 200px;
//     height: 100vh;
//     overflow-y: scroll;
// }
.main {
    padding: 10px 20px 0 20px;
}
</style>



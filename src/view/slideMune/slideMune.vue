<template>
    <div class="silde_mune">
        <el-menu
            background-color="#324057"
            text-color="#fff"
            active-text-color="#409eff"
            mode="horizontal"
            router
            :default-active="activeRoute"
            :default-openeds="defaultOpeneds"
            @select="selectRoute"
        >
            <el-submenu :title="data.oneTitle" v-if="data.oneTitle" v-for="(data) in permissionRoute" :key="data.oneTitleCode" :index="data.oneTitleCode+''" >
                <template slot="title">
                    <!-- <i class="el-icon-location"></i> -->
                    <span>{{ data.oneTitle }}</span>
                </template>
                <el-menu-item-group>
                    <template slot="title"></template>
                    <el-menu-item v-for="(route, index1) in data.oneRoute" :index="route.path" :key="index1">
                        {{ route.meta.title }}
                    </el-menu-item>
                    <el-submenu v-if="secondData.route.length"  v-for="(secondData) in data.secondRoute" :key="secondData.secondTitleCode" :index="secondData.secondTitleCode+''">
                        <template slot="title">{{ secondData.secondTitle }}</template>
                        <el-menu-item v-for="(thirdData, thirdIndex) in secondData.route" :key="thirdIndex" :index="thirdData.path">{{ thirdData.meta.title }}</el-menu-item>
                    </el-submenu>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>
<script>
import muneTitle from '../../api/muneTitle';
import returnreceiptVue from '../aftersalemanage/returnreceipt/returnreceipt.vue';

export default {
    name: 'mune',
    props: {
        activeRoute: {
            type: String
        }
    },
    data() {
        return {
            isPermission: sessionStorage.getItem('menuConfig') ? JSON.parse(sessionStorage.getItem('menuConfig')) : [], // 获取权限列表
            permissionRoute: [],  // 权限路由
            defaultOpeneds: [], // 默认展开的模块
            rotes: []
        };
    },
    beforeCreate: function() {

    },
    created: function() {
        this.getPermission(this.isPermission);
    },
    computed: {
        getMuneTab() {
            return this.$store.state.selectChannel.muneTabList;
        }
    },
    watch: {
        activeRoute() {

        }
    },
    methods: {
        selectRoute(index, route, mune) {
            let text = mune.$slots.default[0].text;
            this.$emit('changeRoute', index);
            this.$store.dispatch('selectChannel/setKeepalive', false);
            this.$store.dispatch('selectChannel/setMuneTab', {
                title: text,
                route: index
            });
        },
        getPermission(arr) {
            let router = this.$router.options.routes[4].children;
            arr.forEach((item) => {
                let json = {};
                let commonCode = []; // 一级和二级共有的模块集合
                json['oneTitle'] = muneTitle(item.parentCode);
                json['oneTitleCode'] = item.parentCode;
                json['oneRoute'] = [];
                // this.defaultOpeneds.push(item.parentCode + '');

                if (item.menuNodeList) {  // 无三级菜单
                    json['secondRoute'] = [];
                    item.menuNodeList.forEach((item1, index) => {
                        commonCode.push(item1.parentCode);
                        commonCode = commonCode.concat(item1.codeList);

                        if (item.codeList.indexOf(item1.parentCode) > -1) {
                            let secondRouteJson = {
                                secondTitleCode: item1.parentCode,
                                secondTitle: '', // 二级菜单标题
                                route: []
                            };
                            router.forEach((item2, index2) => {
                                secondRouteJson.secondTitle = muneTitle(item1.parentCode);
                                // if (this.defaultOpeneds.indexOf(item1.parentCode + '') === -1) {
                                //     this.defaultOpeneds.push(item1.parentCode + '');
                                // }
                                if (item1.codeList.indexOf(item2.meta.code) > -1) {
                                    secondRouteJson.route.push(item2);
                                }
                            });
                            json['secondRoute'].push(secondRouteJson);
                        }
                    });
                }

                router.forEach((rouitem1, index1) => {
                    if (item.codeList && item.codeList.indexOf(rouitem1.meta.code) > -1 && commonCode.indexOf(rouitem1.meta.code) === -1) {
                        json['oneRoute'].push(rouitem1);
                    }
                });

                this.permissionRoute.push(json);
            });
        }
    }
};
</script>

<style lang="less" scoped>
    // .silde_mune{
    //     width: 200px;
    //     height: 100vh;
    //     position: fixed;
    //     top: 60px;
    //     left: 0;
    //     background-color:#304156;
    //     overflow-y: scroll;
    //     z-index: 100
    // }
    .silde_mune::-webkit-scrollbar{
        width:0;

    }
    .el-menu{
        border: none!important;
    }
    .el-submenu__title{

    }
    .el-menu-item{
        font-size: 12px;
    }
</style>

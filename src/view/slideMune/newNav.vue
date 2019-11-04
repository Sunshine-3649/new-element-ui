<template>
    <div class="nav">
        <ul  class="nav_wrap">
            <li v-if="mune.oneTitle" @mouseleave="hideMune(index)"  :class="{ 'active': muneShow_Flag == index, 'current': searchCurrent(mune)  }"  @mouseover="showMune(index)" v-for="(mune, index) in permissionRoute" :key="index">
                {{ mune.oneTitle }} <i class="el-icon-arrow-down icon"></i>
                <dl  class="second" >
                    <dd  class="nothird" v-if="mune.oneRoute" >
                        <div :class="{'current': currentRoute == oneRoute.path}" @click="pushRoute(oneRoute, index, index1)" v-for="(oneRoute, index1) in mune.oneRoute" :key="oneRoute.path" :path="oneRoute.path">{{ oneRoute.meta.title}}</div>
                    </dd>
                    <dd   class="third" v-if="mune.secondRoute" v-for="(secondData, index2) in mune.secondRoute" :key="index2">
                        <p class="third_wrap"><span>{{ secondData.secondTitle }}</span><i class="el-icon-arrow-right icon"></i></p>
                        <div>
                            <span :class="{'current': currentRoute == thirdData.path}" @click="pushRoute(thirdData, index, index3)" v-for="(thirdData, index3) in secondData.route" :key="thirdData.path" :path="thirdData.path">{{ thirdData.meta.title }}</span>
                        </div>
                    </dd>
                </dl>
            </li>
        </ul>
    </div>
</template>

<script>
import muneTitle from '../../api/muneTitle';
import returnreceiptVue from '../aftersalemanage/returnreceipt/returnreceipt.vue';
export default {
    name: 'newNav',
    props: ['currentRoute'],
    inject: ['reload'],
    data() {
        return {
            isPermission: sessionStorage.getItem('menuConfig') ? JSON.parse(sessionStorage.getItem('menuConfig')) : [], // 获取权限列表
            permissionRoute: [],  // 权限路由
            muneShow_Flag: '-1',  // 当前展开菜单索引
            current_Route: this.currentRoute
        };
    },
    created: function() {
        this.getPermission(this.isPermission);
    },
    watch: {},
    methods: {
        searchCurrent(obj) {
            let str = JSON.stringify(obj);
            if (str.indexOf(this.currentRoute) > -1) {
                return true;
            }
        },
        showMune(index) {
            this.muneShow_Flag = index;
        },
        hideMune(index) {
            this.muneShow_Flag = -1;
        },
        pushRoute(route, index, index1) {
            let text = route.meta.title;
            this.$emit('changeRoute', {route: route.path, title: text});
            // this.$store.dispatch('selectChannel/setKeepalive', {
            //     title: route.meta.title,
            //     route: route.path,
            //     name: route.name
            // });

            this.$router.push({path: route.path, query: {reload: false}});
        },
        getPermission(arr) {
            let router = this.$router.options.routes[4].children;
            arr.forEach((item) => {
                let json = {};
                let commonCode = []; // 一级和二级共有的模块集合
                json['oneTitle'] = muneTitle(item.parentCode) ? muneTitle(item.parentCode).title : '';
                json['oneTitleCode'] = item.parentCode;
                json['oneRoute'] = [];
                json['sortId'] = muneTitle(item.parentCode) ? muneTitle(item.parentCode).sortId : '';
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
            this.permissionRoute.sort((a, b) => a.sortId - b.sortId ); // 对菜单进行排序
            this.$store.dispatch('selectChannel/setPermission', this.permissionRoute);
            console.log(this.permissionRoute);
        }
    }
};
</script>

<style lang="less" scoped>
    .nav_wrap{
        background-color: rgb(50, 64, 87);
        color: #ffffff;
        height: 60px;
        line-height: 60px;
        padding: 0 15px;
        display: flex;
        font-size: 14px;
        .current{
            color: rgb(64, 158, 255);
        }
        .icon{
            color: #909399
        }
        li.active{
            // background-color: #ffffff;
            color: rgb(64, 158, 255);
        }
        li.current{
            // background-color: #ffffff;
            color: rgb(64, 158, 255);
        }
        li.active .second{
            display: block;
        }
        li.current .current{
            color:  rgb(64, 158, 255);
        }
        li{
            cursor: pointer;
            position: relative;
            transition: 0.3s;
            // width: 90px;
            padding: 0 15px;
            text-align: center;
            .second{
                line-height: 20px;
                position: absolute;
                display: none;
                font-size: 12px;
                left: 0;
                top: 60px;
                z-index: 101;
                color: #666;
                padding:  5px 10px 8px 10px;
                background-color: #ffffff;
                min-width: 250px;
                // width: 300px;
                text-align: left;
                border: 1px solid #ccc;
                // border-top: none;
                box-shadow: 1px 2px 1px rgba(0,0,0,.1);
                dd{

                    padding-bottom: 10px;
                }
                dd:last-child{
                    padding-bottom: 0;
                }
                .nothird{
                    display: flex;
                    color: #666;
                    flex-wrap: wrap;
                    .current{

                    }
                    div{
                        padding: 8px 15px 8px 6px;
                    }
                    div:hover{
                        color: rgb(64, 158, 255);
                    }
                }
                .third{
                    div{
                        font-size: 12px;
                        font-weight: 100;
                        padding-top: 10px;
                        padding-left: 5px;
                        span{
                            display: inline-block;
                            padding-bottom: 5px;
                            padding: 5px 2px;
                            padding-right: 8px;
                        }
                        span:hover{
                            color: rgb(64, 158, 255);
                        }
                    }
                    .third_wrap{
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        font-weight: 800;
                        .icon{
                           margin-top: 5px;
                        }
                    }
                }
            }

        }
    }
</style>

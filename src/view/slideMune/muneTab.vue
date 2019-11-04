<template>
    <div class="muneTab">
        <el-tabs :closable="routes.length > 1" @tab-remove="TabRemove"  type="card" v-model="activeRouter" @tab-click="handleClick">
            <el-tab-pane v-for="(route, index) in routes" :key="index" :label="route.title" :name="route.route"></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name: 'muneTab',
    props: {},
    data() {
        return {
            activeRouter: '',
            muneTabList: this.routes
        };
    },
    created: function() {
        let muneTabList = this.$store.state.selectChannel.muneTabList;
        let routeSplit = this.$route.path.split('/');
        if (!muneTabList.length && this.$store.getters['selectChannel/isPermission']) {
            this.$store.dispatch('selectChannel/setMuneTab', {
                title: this.$route.meta.title,
                route: `/${routeSplit[1]}`
            });
            this.activeRouter = `/${routeSplit[1]}`;
        }
    },
    watch: {

    },
    computed: {
        routes() {
            let routeSplit = this.$route.path.split('/');
            let route = {
                route: `/${routeSplit[1]}`,
                title: this.$route.meta.title
            };
            // this.activeRouter = `/${routeSplit[1]}`;
            this.$emit('changeRoute', route);
            this.activeRouter = this.$route.path;

            return this.$store.state.selectChannel.muneTabList;
        }
    },
    methods: {
        handleClick(path) {
            console.log(path, 'path');
            // console.log(this.$store.state.selectChannel.muneTabList, path, 'muneTabList');
            let query = {path: path.name, query: {keepAlive: true}};
            this.$emit('changeRoute', {route: path.name, title: path.label});
            this.$router.push(query);
        },
        TabRemove(targetName, index) {
          console.log(targetName);
          console.log(this.$store.state.selectChannel.muneTabList.length);
            this.$store.dispatch('selectChannel/setMuneTab', {route: targetName, remove: true});

            this.$store.dispatch('selectChannel/setKeepalive', { // 取消缓存 防止下次进来显示上次缓存的数据
                name: targetName.split('/')[2] ? targetName.split('/')[2] : targetName.split('/')[1],
                removeKeepAlive: true
            });
            let muneTabList = this.$store.state.selectChannel.muneTabList;
            this.$emit('changeRoute', muneTabList[muneTabList.length - 1].route);
            this.$router.push({
                path: muneTabList[muneTabList.length - 1].route,
                query: {keepAlive: true}
            });
        }
    }
};
</script>

<style lang="less" scoped>

</style>



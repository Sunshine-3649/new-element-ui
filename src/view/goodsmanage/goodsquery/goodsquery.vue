<template>
    <div class="minegoodsquery">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="自采商品" name="minegoodsquery"></el-tab-pane>
            <el-tab-pane label="一件代发商品" name="onegoodquery"></el-tab-pane>
        </el-tabs>
        <router-view></router-view>
  </div>
</template>

<script>
export default {
    name: 'goodsquery',
    data() {
        return {
            activeName: 'minegoodsquery'
        };
    },
    mounted: function() {
        this.activeName = this.$route.meta.name;
        this.handleClick(this.$route.meta);
    },
    methods: {
        handleClick(obj) {
            if (obj.name === 'onegoodquery') {
                this.$router.push({path: '/goodsquery/onegoodquery'});
            } else if (obj.name === 'minegoodsquery' ) {
                this.$router.push({path: '/goodsquery/minegoodsquery'});
            }
        }
    }
};
</script>

<style scoped>

</style>

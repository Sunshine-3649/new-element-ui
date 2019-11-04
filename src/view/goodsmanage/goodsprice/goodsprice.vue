<template>
  <div>

  </div>
</template>
<script>
export default {
  name: 'goodsprice',
  data() {
    return {};
  },
  mounted() {
    // window.location.href = 'http://https://productadmin.tairanmall.com/frontend-product-admin/login?returnUrl=%2Fpricemanage%2FselfGoodsPriceInfo';
    window.open('https://productadmin.tairanmall.com/frontend-product-admin/', '_blank');
    setTimeout(() => {
      this.TabRemove('/goodsprice');
    }, 100);
  },
  methods: {
    TabRemove(targetName) {
            this.$store.dispatch('selectChannel/setMuneTab', {route: targetName, remove: true});

            this.$store.dispatch('selectChannel/setKeepalive', { // 取消缓存 防止下次进来显示上次缓存的数据
                name: targetName.split('/')[2] ? targetName.split('/')[2] : targetName.split('/')[1],
                removeKeepAlive: true
            });
            let muneTabList = this.$store.state.selectChannel.muneTabList;
            if (muneTabList.length) {
              this.$emit('changeRoute', muneTabList[muneTabList.length - 1].route);
              this.$router.push({
                  path: muneTabList[muneTabList.length - 1].route,
                  query: {keepAlive: true}
              });
            }
        }
  }
};
</script>

<template>
  <div class="navbar-warp">
    <div class="navbar">
      <a href="http://www.txslicai.com" class="logo"><img src="../../../assets/login/logo.png" alt="唐小僧"></a> 欢迎使用唐小僧理财
      <p class="top-menu fr">
        <a target="_blank" href="http://www.txslicai.com/App-download.jsp">
          <i class="white-point icon-download"></i>下载唐小僧</a>
        <a target="_blank" href="http://www.txslicai.com/sitemap.jsp">
          <i class="white-point icon-map"></i>网站地图
        </a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  computed: {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.fr {
  float: right;
}
.navbar-warp {
  width: 100%;
  background-color: #bbb;
  .navbar {
    height: 40px;
    line-height: 40px;
    width: 1080px;
    margin: 0 auto;
    color: #fff;
    font-size: 12px;
    overflow: hidden;
    background-color: #bbb;

    .logo {
      display: inline-block;
      img {
        width: 60px;
        height: 26px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 16px;
      }
    }
    .top-menu {
      height: 40px;
      line-height: 40px;
      a {
        display: inline-block;
        height: 100%;
        margin-left: 8px;
      }
    }
    .white-point {
      display: inline-block;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 3px;
      margin-top: -1px;
    }
    .icon-download {
      background-size: 100%;
      background-image: url(../../../assets/login/a-down.png);
    }
    .icon-map {
      background-size: 100%;
      background-image: url(../../../assets/login/a-map.png);
    }
  }
}
</style>


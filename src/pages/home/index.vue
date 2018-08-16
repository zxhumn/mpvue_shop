<template>
  <view>
    <!-- 轮播图 -->
    <swiper class="slide" indicator-active-color="#ffffff" :indicator-dots="true" circular :autoplay="true" :interval="3000"
      :duration="1000">
      <block v-for="item in swiperdata" :key="item.goods_id">
        <navigator :url="item.navigator_url">
        <swiper-item>
          <image :src="item.image_src" class="slide-image" />
        </swiper-item>
      </navigator>
      </block>
    </swiper>
    <!-- 分类 -->
    <view class="category">

      <block v-for="item in catitems" :key="item.name">
        <view class="category-item">
          <navigator open-type="switchTab" url="/pages/category/main">
            <image :src="item.image_src" />
          </navigator>
        </view>
      </block>

    </view>
    <!-- 楼层 -->
    <view class="floor">
      <block v-for="(item,index) in floordata" :key="index">
        <!-- 标题 -->
        <view class="floor-top">
          <image :src="item.floor_title.image_src" />
        </view>
        <!-- 图片 -->
        <view class="floor-img">
          <view class="floor-img-left">
            <image :src="item.product_list[0].image_src" />
          </view>
          <view class="floor-img-right">
            <block v-for="(subitem,subIndex) in item.product_list" :key="subIndex">
              <view :style="{'width':subitem.image_width+'rpx'}" class="floor-img-right-item" v-if="subIndex>0">
                <image :src="subitem.image_src" />
              </view>
            </block>
          </view>
        </view>
      </block>
    </view>
    <!-- 底部提示 -->
    <view class="end-tips"> 
        <text class="iconfont icon-xiao"></text>
      <text>&nbsp;我也是有底线的哦</text>
    </view>
    <!-- 回到顶部 -->
    <view @click="goToTop" v-if="isShowToTop" class="tips">
     
        <image src="../../../static/img/arrow_top@2x.png"/>
     
        <text>顶部</text>
    </view>
  </view>
</template>
<script>
  export default {
    data() {
      return {
        swiperdata: [],
        catitems: [],
        floordata: [],
        isShowToTop:false
      }
    },
    created() {
      // 获取轮播图
      this.getSwiperData();
      // 获取分类信息
      this.getCategoryData();
      // 获取图片
      this.getFloorsData();
    },
    onPageScroll(e){
      if(e.scrollTop>80){
        if(this.isShowToTop) return;
        this.isShowToTop = true;
      }else{
        if(!this.isShowToTop) return;
        this.isShowToTop = false;
      }
    },
    methods: {
      async getSwiperData() {
        const result = await this.$axios.get('api/public/v1/home/swiperdata', {
          params: {
            ID: 1001
          },
          env: 'mp'
        })
        //    console.log(result)
        this.swiperdata = result.data.message;
      },
      async getCategoryData() {
        const result = await this.$axios.get('api/public/v1/home/catitems')
        // console.log(result)
        this.catitems = result.data.message;
      },
      async getFloorsData() {
        const result = await this.$axios.get('api/public/v1/home/floordata')
        // console.log(result)
        this.floordata = result.data.message;
      },
      goToTop(){
        wx.pageScrollTo({
          scrollTop: 0, //滚动到页面的目标位置（单位px）,
          duration: 300 //滚动动画的时长，默认300ms，单位 ms,
        });
      }
    },
   
  }

</script>
<style lang="less" scoped>
  .slide {
    width: 750rpx;
    height: 400rpx;
    &-image {
      width: 100%;
      height: 100%;
    }
  }

  .category {
    display: flex;
    margin-top: 20rpx 0rpx;
    &-item {
      height: 160rpx;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 20rpx;
      image {
        width: 120rpx;
        height: 120rpx;
      }
    }
  }

  .floor {
    &-top {
      margin-top: 20rpx;
      height: 100rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
    &-img {
      padding: 20rpx 16rpx 0rpx 16rpx;
      display: flex;
      &-left {
        width: 232rpx;
        height: 386rpx;
        image {
          width: 100%;
          height: 100%;
        }
      }
      &-right {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        &-item {
          height: 188rpx;
          width: 200rpx;
          margin:0 0 16rpx 16rpx;
          image {
            width: 100%;
            height: 100%;
          }
        }


      }
    }
  }
  .end-tips{
    display:flex;
    height:88rpx;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color:#888888;
  }
  .tips {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    right: 20rpx;
    bottom: 30rpx;
    background-color: rgba(255, 255, 255, .8);
    border-radius: 50%;
    height:50px;
    width:50px;
      image {
        width:20px;
      height:10px;
    }
    text {
      font-size: 24rpx;
      margin-top: 10rpx;
    }
  }

</style>

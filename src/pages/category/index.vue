<template>
  <view class="scroll">
    <!-- 左滚动 -->
    <scroll-view :style="{'height':(windowHeight-10)+'px'}" scroll-y class="scroll-left" @click="selectedCategory">
      <block v-for="(item,index) in categories" :key="item.cat_id">
        <view  :data-index="index" class="scroll-left-item" :class="{'scroll-left-item-active':selectedIndex===index}">
        <text :data-index="index">{{item.cat_name}}</text>
      </view>
      </block>
    </scroll-view>
    <!-- 右滚动 -->
    <scroll-view :style="{'height':(windowHeight-10)+'px'}" scroll-y v-if="categories[selectedIndex]" class="scroll-right">
      <block  v-for="item in categories[selectedIndex].children" :key="item.cat_id">
        <view class="scroll-right-items">
          <!-- 二级菜单 -->
          <view class="scroll-right-head">
            <text>{{item.cat_name}}</text>
          </view>
          <!-- 三级菜单 -->
          <view class="scroll-right-body">
          <block v-if="item.children" v-for="(subitem, subindex) in item.children" :key="subitem.cat_id">
              <view class="scroll-right-body-item">
            <image :src="subitem.cat_icon"/>
            <text>{{subitem.cat_name}}</text>
            </view>
          </block>
          </view>
         
        </view>
      </block>
    </scroll-view>
  </view>
</template>

<script>
  export default{
    data(){
      return {
        categories:[],
        selectedIndex:0,
        windowHeight:0
      }
    },
    onLoad(){
      this.getCategoriesData();
      this.windowHeight = wx.getSystemInfoSync().windowHeight;
    },
    methods:{
      async getCategoriesData(){
        const result = await this.$axios.get('api/public/v1/categories');
        result.data.message.forEach(category=>{
          category.children.forEach(subcategory=>{
            if(subcategory.children){
              subcategory.children.forEach(thirdCategory=>{
                if(thirdCategory){
                  thirdCategory.cat_icon=`${this.$axios.defaults.baseURL}${thirdCategory.cat_icon}`
                }
              })
            }
           
          })
        })
        // console.log(result)
        this.categories = result.data.message;

      },
      selectedCategory(e){
        this.selectedIndex =e.target.dataset.index;
      }

    }
  }
</script>
<style lang="less" scoped>
  .scroll {
    display: flex;
    &-left{
      width:200rpx;
      margin-top:20rpx;
      display: flex;
      flex-direction: column;
      background-color: #f4f4f4;
      &-item {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24rpx;
        color: #000000;
      width: 200rpx;
      height: 100rpx;
      &-active {
          background-color: #fff;
          position: relative;
          &::before {
            content:'';
            width:8rpx;
            height:80rpx;
            margin: 10rpx 0;
            background-color: #ff2d4a;
            position: absolute;
            top: 10rpx;
            left: 0;
          }
         
        }
        
      }
      
    }
    &-right{
      flex:1;
      &-head {
        height:80rpx;
        text-align: center;
        font-size: 24rpx;
        &::before {
          content:'/';
          color:#eeeeee;
          margin-right:20rpx;
        }
        &::after {
          content:'/';
          color:#eeeeee;
          margin-left:20rpx;
        }
      }
      &-body{
        display: flex;
        flex-wrap:wrap;
      
      &-item {
        width:33.3333333%;
        height:200rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
       
          image {
            width: 100rpx;
          height: 80rpx;
          }
          text{
          font-size: 24rpx;
          margin-top:10rpx;
        }
      }
    }
  }
  }
  
</style>

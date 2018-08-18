<template>
    <view>
        <!-- 1.0 没有数据时候的提示 -->
        <view class="empty-car" v-if="isEmpty">
          <image src="/static/img/kong.png" />
          <text class="empty-car-tips">购物车还是空的</text>
          <text class="empty-car-tips extra">快去逛逛吧~</text>
        </view>
        <!-- 2.0 有了数据之后的列表及底部的fixBar -->
        <view wx:else>
          <!-- 头部 -->
          <view class="shop-head">
            <view class="shop-head-info">
              <view class="iconfont icon-shop flex-center icon-dianpu"></view>
              <text class="shop-name">品优购生活馆</text>
            </view>
          </view>
          <!-- 商品列表 -->
          <block v-for="(item,index) in goodsList" :key="item.goods_id">
            <view class="goods-item">
              <view @tap="toggleSelect(index)" :class="['pubIcon',item.isSelected?'trueIcon':'falseIcon']">
              </view>
              <view class="goods-item-pic">
                <image :src="item.goods_small_logo" />
              </view>
              <view class="goods-item-info">
                <text class="goods-item-info-title">{{item.goods_name}}</text>
                <text class="goods-item-info-price">￥{{item.goods_price}}</text>
                <view class="goods-item-info-edit">
                  <view class="outer">
                    <view @tap="substrict(index)">-</view>
                    <view class="value"><input v-model="item.goods_number" type="number" /></view>
                    <view @tap="add(index)" class="add">+</view>
                  </view>
                  <text @tap="deleteGoods(index)">| 删除</text>
                </view>
              </view>
            </view>
          </block>
          <!-- 底部菜单栏 -->
          <view :hidden="isEmpty" class="fixed-bar">
            <view @tap="toggleAllSelect" class="allselect">
              <view :class="['pubIcon',allSelected?'trueIcon':'falseIcon']">
              </view>
              <text style="margin-left:10rpx;">全选</text>
            </view>
            <view class="statistics">
              <view>
                <text>合计：</text>
                <text style="color:#ff2d4a;font-size:30rpx;">￥{{getTotalAmount}}</text>
              </view>
              <text>包含运费</text>
            </view>
            <view @tap="goToOrder" :class="['jiesuan',getTotalCount===0?'disabled':'']">
              <text>去结算 ({{getTotalCount}})</text>
            </view>
          </view>
        </view>
      </view>
</template>

<script>
  import { getLocalGoods,updateLocalGoods,deleteLocalGoods } from '@/utils/goodsStorageTool.js';
  export default{
    data(){
      return {
        goodsList:[],
        isEmpty:false,
        allSelected:true,
      }
    },
    onShow(){
      this.getGoodsList();
    },
    methods:{
      // 获取本地存储数据
      async getGoodsList(){
        // 获取本地数据
        const localGoods = getLocalGoods();
        const ids = Object.keys(localGoods);
        // 判断本地是否有数据
        if(ids.length===0){
          this.isEmpty = true;
          return
        }
        this.isEmpty = false;
        // 通过goods_id查询
        const result =  await this.$axios.get(`api/public/v1/goods/goodslist?goods_ids=${ids.join(',')}`);
        // 添加属性
        result.data.message.forEach(goods=>{
          goods.goods_number = localGoods[goods.goods_id]
          goods.isSelected=true
        })
        // console.log(result)
        this.goodsList = result.data.message;
      }
    // 减法
    ,substrict(index){
      if(this.goodsList[index].goods_number<=1){
        return
      }
      this.goodsList[index].goods_number -=1;
      this.notify(index)
    }
    // 加法
    ,add(index){
      this.goodsList[index].goods_number+=1;
      this.notify(index)
    }
    // 更新数据
    ,notify(index){
      const goods = {
        goods_id:this.goodsList[index].goods_id,
        goods_number:this.goodsList[index].goods_number
      }
      updateLocalGoods(goods);
    }
    // 每一项是否否选中
    ,toggleSelect(index){
      this.goodsList[index].isSelected = ! this.goodsList[index].isSelected;
      this.shouldSelectAll();
    }
    // 选中所有，全选反选
    ,toggleAllSelect(){
      this.goodsList.forEach(goods=>{
        goods.isSelected = !this.allSelected;
      })
      this.allSelected = !this.allSelected;
    }
    // 是否应该全选
    ,shouldSelectAll(){
      let selectAll = true;
      for(var i=0;i<this.goodsList.length;i++){
        if(!this.goodsList[i].isSelected){
          selectAll = false;
          break;
        }        
      }
      this.allSelected =selectAll;
    }
   
    // 删除商品
    ,deleteGoods(index){
      
      wx.showModal({
        title: '提示',
        content: '你确定要删除吗？',
        confirmColor:'#ff2d4a',
        success: (res)=> {
          if (res.confirm) {
            console.log('用户点击确定')
            deleteLocalGoods(this.goodsList[index].goods_id);
            this.goodsList.splice(index,1);
            this.isEmpty = this.goodsList.length ==0;
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
     
    },
    // 去结算页
    goToOrder(){
      const ids=[];
      this.goodsList.forEach(goods=>{
        if(goods.isSelected){
        ids.push(goods.goods_id) 
      }
      });
      if(ids.length===0) return;
      // console.log(ids)
      wx.navigateTo({ url: `/pages/pay/main?ids=${ids}` });
     
    }
  }
    ,computed:{
      // 计算总数量
      getTotalCount(){
        let totalCount = 0;
        this.goodsList.forEach(goods=>{
          if(goods.isSelected){
            totalCount += goods.goods_number;
          }
        })
        return totalCount;
      },
      // 计算总金额
      getTotalAmount(){
        let totalPrice = 0;
        this.goodsList.forEach(goods=>{
          if(goods.isSelected){
            totalPrice += goods.goods_number * goods.goods_price;
          }
        })
        return totalPrice;
      }
    }
  }
</script>
<style lang="less" scoped>
    @PADDING-LEFT: 20rpx;
    .empty-car {
      display: flex;
      flex-direction: column;
      height: 500rpx;
      justify-content: center;
      align-items: center;
      image {
        width: 125rpx;
        height: 124rpx;
      }
      &-tips {
        margin-top: 30rpx;
        font-size: 28rpx;
        color: #666;
      }
    }
    .extra {
      font-size: 24rpx;
      color: #999;
    }
    .shop-head {
      background-color: #fff;
      height: 88rpx;
      display: flex;
      align-items: center;
      padding: 0 @PADDING-LEFT;
      border-bottom: 1px solid #ddd;
      &-info {
        display: flex;
        align-items: center;
        .shop-name {
          margin-left: 10rpx;
        }
      }
    }
    .goods-item {
      height: 220rpx;
      background-color: #fff;
      display: flex;
      align-items: center;
      padding-left: @PADDING-LEFT;
      border-bottom: 1px solid #eee;
      &-pic {
        width: 160rpx;
        height: 160rpx;
        margin-left: 10rpx;
        border: 1px solid #ddd;
        padding: 10rpx;
        border-radius: 5rpx;
        image {
          width: 100%;
          height: 100%;
        }
      }
      &-info {
        flex: 1;
        height: 180rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0rpx @PADDING-LEFT;
        &-title {
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        &-price {
          color: #ff2d4a;
          font-size: 30rpx;
        }
        &-edit {
          display: flex;
          justify-content: space-between;
          .outer {
            border: 1px solid #ddd;
            display: flex;
            align-items: center;
            border-radius: 5rpx;
            view {
              height: 50rpx;
              width: 50rpx;
              line-height: 50rpx;
              text-align: center;
            }
            .value {
              width: 65rpx;
              border-left: 1px solid #ddd;
            }
            .add {
              border-left: 1px solid #ddd;
            }
          }
        }
      }
    }
    .pubIcon {
      background: url(https://mcart.jiuxian.com/statics/images/cart/catIcon.png)
        no-repeat 0 0;
      background-size: 300rpx 300rpx;
      width: 55rpx;
      height: 55rpx;
    }
    .trueIcon {
      background-position: 0 -225rpx;
    }
    .falseIcon {
      background-position: -50rpx -225rpx;
    }
    .fixed-bar {
      display: flex;
      height: 98rpx;
      width: 750rpx;
      background-color: #fff;
      position: fixed;
      left: 0;
      bottom: 0;
      .allselect {
        padding-left: @PADDING-LEFT;
        width: 200rpx;
        height: 98rpx;
        display: flex;
        align-items: center;
      }
      .statistics {
        flex: 1;
        display: flex;
        // align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      .jiesuan {
        width: 200rpx;
        height: 98rpx;
        background-color: #ff2d4a;
        color: #fff;
        text-align: center;
        line-height: 98rpx;
      }
    
      .disabled {
        background-color: #ddd;
      }
    }
    </style>
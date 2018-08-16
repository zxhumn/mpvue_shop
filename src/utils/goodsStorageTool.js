const KEY = "goods";
// 查询本地存储
export const getLocalGoods = ()=>{
 return wx.getStorageSync(KEY) || {}
}
// 添加到本地存储
 export const addLocalGoods = (goods)=>{
   const localGoods =  getLocalGoods();
   if(localGoods[goods.goods_id]){
       localGoods[goods.goods_id]+= goods.goods_number;
   }else{
       localGoods[goods.goods_id]= goods.goods_number;
   }
   return wx.setStorageSync(KEY, localGoods);
 }
//  修改本地存储
export const updateLocalGoods =goods =>{
    const localGoods = getLocalGoods();
    localGoods[goods.goods_id]= goods.goods_number;
    wx.setStorageSync(KEY,localGoods);
}
// 删除本地存储
export const deleteLocalGoods = goods_id =>{
    const localGoods = getLocalGoods();
    delete localGoods[goods_id];
    wx.setStorageSync(KEY,localGoods);
}
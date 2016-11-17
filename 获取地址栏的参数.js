this.getUrlParam=function(name){//获取url参数
   var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
   var r =encodeURI(window.location).split("?")[1].match(reg);
   if(r!=null)return  unescape(r[2]); return null;
 }
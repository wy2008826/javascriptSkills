var arr=[1,2,2,5,5,5,5,5,3,3,3,4,4,4,4];

Array.prototype.uniqu2=function(){
	this.sort();
	var newArr=[];
	for(var i=0;i<this.length;i++){
		var start=this.indexOf(this[i]);
		var end=this.lastIndexOf(this[i]);
		if(start==end){
			newArr.push(this[i]);
		}
		else{
			newArr.push(this[i],this[i]);
		}
		i=end;
	}
	return newArr;
}


arr.uniqu2();

//闭包
function fun(n,o){
	console.log(o);
	return {
		fun:function(m){
			return fun(m,n);
		}
	}
}

var a=fun(0);
a.fun(1);
a.fun(2);
a.fun(3);

var b=fun(0).fun(1).fun(2).fun(3);
var c=fun(0).fun(1);
c.fun(2);
c.fun(3);
var arr=[1,2,2,5,5,5,5,5,3,3,3,4,4,4,4,{name:1},{name:1},{name:1}];

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

if(console.log("hello")){
	console.log("hello");
}
else{
	console.log("world");
}
arr.uniqu2();


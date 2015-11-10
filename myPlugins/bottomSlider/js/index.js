$(function(){
	var $container=$("#container");
	var lists=$container.find(".lists")[0];
	$container[0].addEventListener("touchstart",startHandler);
	$container[0].addEventListener("touchmove",moveHandler);
	$container[0].addEventListener("touchend",endHandler);

	var startPos;
	var movePos;
	var endPos;
	var startTime;
	var endTime;
	var transform;
	function startHandler(e){
		
		startPos=_getPos(e.touches[0]);
		startTime=e.timeStamp;
		transform=_getTransform(lists);

		//console.log(transform);
	}

	function moveHandler(e){
		movePos=_getPos(e.touches[0]);
		var disY=_getDis(movePos,startPos).disY;
		//console.log(transform);
		var y=transform.y+disY;
		_setTransform(lists,0,y,0);
	}

	function endHandler(e){
		endTime=e.timeStamp;
		var disY=_getDis(movePos,startPos).disY;
		var disTime=endTime-startTime;
		var speed=Math.abs(disY /  disTime);
		transform=_getTransform(lists);
		
		//_animate(lists,0,y,0);
	}


	function _getPos(touches){
		
		return {x:touches.clientX,y:touches.clientY};
	}

	function _getDis(movePos,startPos){
		return {disX:movePos.x-startPos.x,disY:movePos.y-startPos.y};
	}

	function _supportTransform(){
		var p=document.createElement("p");
		var sup=(p.style.transform=="undefined"?false:true);
		p=null;
		return sup;
	}

	function _getTransform(dom){
		var transform=dom.style.webkitTransform || dom.style.transform;
		if(transform==""){
			dom.style.webkitTransform="translate3d(0,0,0)";
			return {x:0,y:0,z:0};
		}
		else{
			var xyz=transform.replace(/translate3d|\(|\)/g,"").split(",");
			return {x:parseFloat(xyz[0]),y:parseFloat(xyz[1]),z:parseFloat(xyz[2])};
		}
	}
	function _setTransform(dom,x,y,z){
		dom.style.webkitTransform="translate3d("+x+"px,"+y+"px,"+z+"px)";
	}

	function _checkBoundary(wraper,inner,direction){
		var transform=_getTransform(inner);
		var status={left:false,right:false,top:false,bottom:false};
		
		if(direction=="y"){
			if(transform.y>0){
				status.tooBottom=true;
			}
		}
		
	}


	function _animate(dom,x,y,z){

	}
});

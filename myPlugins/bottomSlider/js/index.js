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

		console.log(transform);
	}

	function moveHandler(e){
		movePos=_getPos(e.touches[0]);
		var disY=_getDis(movePos,startPos).disY;
		console.log(disY);
	}

	function endHandler(e){
		endTime=e.timeStamp;
		var disY=_getDis(movePos,startPos).disY;
		var disTime=endTime-startTime;

		var speed=Math.abs(disY /  disTime);
		///console.log(e,speed);
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
			return 0;
		}
		else{
			transform.replace(/translate3d/,"")
			return transform;
		}
	}
});
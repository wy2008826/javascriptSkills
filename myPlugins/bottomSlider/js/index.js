;(function(){


	var defaultOption={
		colsScale:"1:1:1",
		rows:5,
		lineHeight:30,
		headerHeight:30,
		theme:"#f94",
		wraperClass:"MultiSlide_wraper",
		shadeClass:"multi_shade",
		contentBg:"#fafafa",
		shadeBg:"#ddd",
		hrBorder:"1px solid #f0f0f0",
		zIndex:1000,
		ulIdPrefix:"multiUl"
	};

	var MultiSlide=function(option){
		this.options=$.extend(defaultOption,option);
		this._removeMulti=function(){
			var options=this.options;
			$("."+options.shadeClass).remove();
			$("."+options.wraperClass).remove();
		
		};
		this.init();
		this.initDom();
	}

	MultiSlide.prototype={
		init:function(){

		},
		initDom:function(){
			var self=this;
			var options=this.options;
			var $wraper=$("<div></div>").attr("class",options.wraperClass);
			$wraper.css({
				borderTop:"2px solid "+options.theme,
				position:"fixed",
				width:"100%",
				left:0,
				bottom:-options.rows*options.lineHeight-options.headerHeight,
				zIndex:options.zIndex
			});
			var $header=$("<div><span class='bottom_cancel' style='float:left;margin-left:10px'>取消</span><span class='bottom_confirm' style='float:right;margin-right:10px'>确认</span></div>");

			$header.css({
				boxSizing:"border-box",
				lineHeight:"30px",
				height:options.headerHeight,
				background:"#f1f1f1"
			});


			var $content=$("<div></div>");
			var height=options.rows*options.lineHeight;
			$content.css({
				height:height,
				width:"100%",
				position:"relative",
				background:options.contentBg,
				overflow:"hidden"
			});

			var $hr=$("<p></p>").css({
				height:options.lineHeight,
				background:"#fff",
				position:"absolute",
				width:"100%",
				top:"50%",
				left:"0",
				marginTop:- options.lineHeight / 2,
				borderTop:options.hrBorder,
				borderBottom:options.hrBorder
			});
			$content.append($hr);


			var $shade=$("<div ></div>").attr("class",options.shadeClass);

			$shade.css({
				position:"fixed",
				top:0,
				left:0,
				height:"100%",
				width:"100%",
				background:options.shadeBg,
				opacity:"0.5",
				zIndex:options.zIndex-1
			});

			var colArr=options.colsScale.split(":");
			var colSum=_arrSum(colArr);

			for(var i=0;i<colArr.length;i++){
				var $ul=$("<ul></ul>").attr("id",options.ulIdPrefix+i);
				var itemWidth=(colArr[i]/colSum)*100 +"%";
				$ul.css({
					width:itemWidth,
					float:"left"
				});
				$content.append($ul);
			}


			$header.find(".bottom_cancel")[0].onclick=function(e){
				_animate($wraper[0],0,0,0,"y",undefined,self._removeMulti.bind(self));
				
			};
			$header.find(".bottom_confirm")[0].onclick=function(e){
				options.confirm(12423);
			};


			$wraper.append($header);
			$wraper.append($content);


			$("body").append($shade).append($wraper);
			_animate($wraper[0],0,-options.rows*options.lineHeight-options.headerHeight,0,"y",undefined);
			console.timeEnd("start");
		}
	};

	$.fn.MultiSlide=function(options){
		var options=$.extend(defaultOption,options);
		
		return this.each(function(index,elem){
			(function(elem){
				elem.onclick=function(e){
					var multiSlide=new MultiSlide(options);
				}
			})(elem);
		});
	};

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

		var boundary=_checkBoundary($container[0],lists,"y");
		if(boundary.top){//
			var y=0;
		}
		else if(boundary.bottom){
			var y=$container[0].offsetHeight-lists.offsetHeight;
		}
		else{

		}

		_animate(lists,0,y,0,"y",speed);
	}


	function _getPos(touches){//获取手指的屏幕位置
		return {x:touches.clientX,y:touches.clientY};
	}

	function _getDis(movePos,startPos){//两点之间的三维距离
		return {disX:movePos.x-startPos.x,disY:movePos.y-startPos.y};
	}

	function _supportTransform(){//检测transform支持
		var p=document.createElement("p");
		var sup=(p.style.transform=="undefined"?false:true);
		p=null;
		return sup;
	}

	function _getTransform(dom){//获取元素的transform属性
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
	function _setTransform(dom,x,y,z){//设置位移属性
		dom.style.webkitTransform="translate3d("+x+"px,"+y+"px,"+z+"px)";
	}

	function _checkBoundary(wraper,inner,direction){//检测边缘状态
		var transform=_getTransform(inner);
		var status={left:false,right:false,top:false,bottom:false};
		
		if(direction=="y"){
			if(inner.offsetHeight<=wraper.offsetHeight){
				status.top=true;
			}
			else{
				if(transform.y>0){
					status.top=true;
				}
				else if(transform.y<0&&(-transform.y+wraper.offsetHeight>=inner.offsetHeight)){
					status.bottom=true;
				}
			}
			
		}
		return status;
	}



	function _animate(dom,x,y,z,direction,speedDeta,callback){//执行运动动画
		var durTime=200;//运动时长
		var jump=10;//每10ms   运动间隙
		if(direction=="y"){
			var startTime=new Date()*1;
			var timer=setInterval(move,jump);

			function move(){
				
				var now=new Date()*1;
				var transform=_getTransform(dom);
				if(now-startTime<=durTime){
					var disY=y-transform.y;
					var speed=disY / (durTime-(now-startTime));
					var desY=transform.y+speed*jump;
					_setTransform(dom,transform.x,desY,transform.z);
				}
				else{
					clearInterval(timer);
					_setTransform(dom,transform.x,y,transform.z);
					if(callback){
						callback();
					}
				}
			}
		}


	}

	function _arrSum(arr){
		var sum=0;
		for(var i=0;i<arr.length;i++){
			sum+=arr[i]*1;
		}
		return sum;
	}
	
})();

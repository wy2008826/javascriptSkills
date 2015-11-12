;(function(){
	//数据列表整理后传递一个对象数组

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
		ulIdPrefix:"multiUl",
		listFontSize:"12px",
		listAlign:"center"
	};

	var MultiSlide=function(option){
		this.options=$.extend(defaultOption,option);
		this._removeMulti=function(){
			var options=this.options;
			$("."+options.shadeClass).remove();
			$("."+options.wraperClass).remove();
		
		};
		this._checkBoundary=function(wraper,inner,direction){//检测边缘状态
			var options=this.options;
			var transform=_getTransform(inner);
			var status={left:false,right:false,top:false,bottom:false};
			var halfHeight=((options.rows-1)/2)*options.lineHeight;
			
			if(transform.y>=halfHeight){
				status.top=true;
			}
			else if((transform.y+inner.offsetHeight)<=(halfHeight+options.lineHeight)){
				status.bottom=true;
			}
			console.log(transform,transform.y+inner.offsetHeight,inner);
			return status;
		}
		this.init();
		this.initDom();//初始化dom结构
		this.initLists();//填充列表数据
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
				borderBottom:options.hrBorder,
				zIndex:options.zIndex+1
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

			$shade.click(function(){
				//_animate($wraper[0],0,0,0,"y",undefined,self._removeMulti.bind(self));
			});
			var colArr=options.colsScale.split(":");
			var colSum=_arrSum(colArr);

			for(var i=0;i<colArr.length;i++){//生成ul列表
				var $ul=$("<ul></ul>").attr("id",options.ulIdPrefix+i);
				var itemWidth=(colArr[i]/colSum)*100 +"%";
				$ul.css({
					width:itemWidth,
					float:"left",
					overflow:"hidden",
					position:"relative",
					zIndex:options.zIndex+2,
					fontSize:options.listFontSize,
					textAlign:options.listAlign
				});
				$content.append($ul);
			}


			$header.find(".bottom_cancel")[0].onclick=function(e){
				_animate($wraper[0],0,0,0,"y",undefined,self._removeMulti.bind(self));
				
			};
			$header.find(".bottom_confirm")[0].onclick=function(e){
				options.confirm(12423);
			};
			$wraper[0].addEventListener("touchstart",startHandler);
			$wraper[0].addEventListener("touchmove",moveHandler);
			$wraper[0].addEventListener("touchend",endHandler);

			var startPos;
			var movePos;
			var endPos;
			var startTime;
			var endTime;
			var transform;
			var startLists;
			function startHandler(e){
				var listsId=$(e.target).parent().attr("id");
				console.log(listsId);
				startLists=$("#"+listsId)[0];

				startPos=_getPos(e.touches[0]);
				startTime=e.timeStamp;
				transform=_getTransform(startLists);

				
			}

			function moveHandler(e){
				movePos=_getPos(e.touches[0]);
				var disY=_getDis(movePos,startPos).disY;
				//console.log(transform);
				var y=transform.y+disY;
				_setTransform(startLists,0,y,0);
			}

			function endHandler(e){
				endTime=e.timeStamp;
				var disY=_getDis(movePos,startPos).disY;
				var disTime=endTime-startTime;
				var speed=Math.abs(disY /  disTime);
				transform=_getTransform(startLists);

				var boundary=self._checkBoundary($wraper[0],startLists,"y");
				var halfHeight=((options.rows-1)/2)*options.lineHeight;

				
				if(boundary.top){//
					var y=halfHeight;
				}
				else if(boundary.bottom){
					var y=-startLists.offsetHeight+halfHeight+options.lineHeight;
				}
				else{
					var y=Math.round(transform.y/options.lineHeight)*options.lineHeight;
				}

				_animate(startLists,0,y,0,"y",speed);
			}



			$wraper.append($header);
			$wraper.append($content);


			$("body").append($shade).append($wraper);
			_animate($wraper[0],0,-options.rows*options.lineHeight-options.headerHeight,0,"y",undefined);
			console.timeEnd("start");
		},
		initLists:function(){
			var self=this;
			var options=self.options;
			var colsNum=options.colsScale.split(":").length;
			for(var i=0;i<colsNum;i++){
				var ulId=options.ulIdPrefix+i;
				var y=((options.rows -1)/2)*options.lineHeight;

				if(i==0){
					fillList(data,$("#"+ulId)[0],{x:0,y:y,z:0});
				}
				else if(i==1){
					fillList(data[0].lists,$("#"+ulId)[0],{x:0,y:y,z:0});
				}
				else if(i==2){
					fillList(data[0].lists[0].lists,$("#"+ulId)[0],{x:0,y:y,z:0});
				}
				
			}


			function fillList(arr,ul,translateXYZ){
				for(var i=0;i<arr.length;i++){
					var li=document.createElement("li");
					li.innerHTML=arr[i].name;
					li.style.lineHeight=options.lineHeight+"px";
					
					if(arr[i].id){
						li.setAttribute("data-id",arr[i].id);
					}
					ul.appendChild(li);
					_setTransform(ul,0,translateXYZ.y,0);
				}
			}
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
	// $container[0].addEventListener("touchstart",startHandler);
	// $container[0].addEventListener("touchmove",moveHandler);
	// $container[0].addEventListener("touchend",endHandler);

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

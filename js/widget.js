//js在语法层面没有class关键字，在js中类通过function实现，所有类继承自object顶层对象。object顶层对象提供的帮助太少。

//在定制组件的过程中，组件之间会有一些通用的方法，将这类方法提取出来共用就是widget

//1.申明一个模块
define(['jquery'],function($){
	function Widget(){ 
		this.boundingBox=null;  //属性：最外层属性
	}
	
	//2.定义一个Widget类
	Widget.prototype={
		
		//自定义事件：on 用于绑定监听的事件
		on:function(type,handler){
			if (typeof this.handlers[type]=="undefined") {
				this.handlers[type]=[];
			}
			this.handlers[type].push(handler);
			//给事件返回this 可以在应用层使用连缀语法
			return this;
		},
		//自定义事件：fire 用于触发自定义的事件
		fire:function(type,data){
			if (this.handlers[type] instanceof Array) {
				var handlers=this.handlers[type];
				for (var i = 0; i < handlers.length; i++) {
					handlers[i](data)
				}	
			}
		},
		//方法：渲染组件
		render:function(container){
			this.handlers={};
			this.renderUI();
			this.bindUI();
			this.syncUI();
			
			$(container||document.body).append(this.boundingBox);
		},
		//方法：销毁组件
		destroy:function(){
			this.destructor();
			//off() 方法用于移除通过 on() 方法添加的事件处理程序。
			this.boundingBox.off();
			this.boundingBox.remove();
		},
		//接口：添加DOM节点
		renderUI:function(){},
		//接口：监听事件
		bindUI:function(){},
		//接口：初始化组件属性
		syncUI:function(){},
		//接口：销毁前的处理函数
		destructor:function(){},
	}
	
	//3.返回这个widget类
	return{
		Widget:Widget
	}
})
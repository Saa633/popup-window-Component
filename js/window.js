
//依赖widget  jq  jqUI
define(['widget', 'jquery', 'jqueryUI'], function(widget, $, $UI) {
	function Window() {
		this.cfg = {
			width: 500,
			height: 300,
			title: "系统消息", //标题文本
			content: "", //弹窗文本
			skinClassName: null, //皮肤类名
			
			hasCloseBtn: false, //是否有关闭按钮
			handler4CloseBtn: null, //监听关闭按钮
			
			text4AlertBtn: "确定", //确认按钮文本
			text4ConfirmBtn: "确定", //Confirm确认按钮文本
			text4CancelBtn: "取消", //Confirm取消按钮文本
			text4PromptBtn: "确定", //Prompt确认按钮文本
			
			isPromptInputPassword:false,  //输入框是否密码化
			defaultValue4PromptInput:"",   //输入框默认值
			maxlength4PromptInput:10,   //字符串最多输入长度
			
			handler4AlertBtn: null, //监听确定按钮
			handler4ConfirmBtn: null, //监听confirm确认按钮
			handler4CancelBtn: null, //监听confirm取消按钮
			handler4PromptBtn: null, //监听Prompt确认按钮
			
			hasMask: true, //是否模态
			isDraggable: true, //是否可以拖拽
			dragHandle: null, //拖拽把手
		};
	};
	
	
	//通过jq中的 extend方法继承widget的方法属性
	//$.extend() 函数用于将一个或多个对象的内容合并到目标对象。如果多个对象具有相同的属性，则后者会覆盖前者的属性值。
	// new widget.Widget()  实例化widget类
	Window.prototype = $.extend({}, new widget.Widget(), {
		//接口：添加DOM节点
		renderUI: function() {
			var footerContent="";
			switch (this.cfg.winType){
				case "alert":
					footerContent='<input class="window_alertBtn" type="button" value="' + this.cfg.text4AlertBtn + '" />'
					break;
				case "confirm":
					footerContent='<input type="button" value="' + this.cfg.text4ConfirmBtn + '" class="window_confirmBtn"/><input type="button" value="' + this.cfg.text4CancelBtn + '" class="window_cancelBtn"/>';
					break;
				case "prompt":
					this.cfg.content+='<p class="window_promptInputWrapper"><input type="'+(this.cfg.isPromptInputPassword?"password":"text")+'" value="'+this.cfg.defaultValue4PromptInput+'" maxlength="'+this.cfg.maxlength4PromptInput+'" class="window_promptInput"/></p>';
					
					footerContent='<input type="button" value="' + this.cfg.text4PromptBtn + '" class="window_promptBtn"/><input type="button" value="' + this.cfg.text4CancelBtn + '" class="window_cancelBtn"/>';
					break;
			}
			
			this.boundingBox = $(
				'<div class="window_boundingBox"><div class="window_body">' + this.cfg.content + '</div></div>'
			);
			
			if (this.cfg.winType!="common") {
				this.boundingBox.prepend('<div class="window_header">' + this.cfg.title + '</div>');
				this.boundingBox.append('<div class="window_footer">'+footerContent+'</div>');
			}
			
			//通过类名找到输入框  要放在 boundingBox 的赋值语句后面，否则找不到
			this._promptInput=this.boundingBox.find(".window_promptInput")
			
			
			//判断弹窗是否是模态的
			if(this.cfg.hasMask) {
				this._mask = $('<div class="window_mask"></div>');
				this._mask.appendTo("body");
			};
			//弹窗是否有关闭按钮
			if(this.cfg.hasCloseBtn) {
				this.boundingBox.append('<span class="window_closeBtn">X</span>');
			};
			//添加弹窗到body
			this.boundingBox.appendTo(document.body);

		},
		//接口：监听事件
		bindUI: function() {
			var that = this;

			//jq delegate() 方法为指定的元素（属于被选元素的子元素）添加一个或多个事件处理程序，并规定当这些事件发生时运行的函数。使用 delegate() 方法的事件处理程序适用于当前或未来的元素（比如由脚本创建的新元素）。
			this.boundingBox.delegate(".window_alertBtn", "click", function() {
				that.fire("alert");
				//销毁组件
				that.destroy();
			}).delegate(".window_closeBtn", "click", function() {
				that.fire("close");
				that.destroy();
			}).delegate(".window_confirmBtn", "click", function() {
				that.fire("confirm");
				that.destroy();
			}).delegate(".window_cancelBtn", "click", function() {
				that.fire("cancel");
				that.destroy();
			}).delegate(".window_promptBtn", "click", function() {
				that.fire("prompt",that._promptInput.val());
				that.destroy();
			});
			//把handler4AlertBtn 添加给自定义事件
			if(this.cfg.handler4AlertBtn) {
				this.on("alert", this.cfg.handler4AlertBtn)
			};
			if(this.cfg.handler4CloseBtn) {
				this.on("close", this.cfg.handler4CloseBtn)
			};
			if(this.cfg.handler4ConfirmBtn) {
				this.on("confirm", this.cfg.handler4ConfirmBtn)
			};
			if(this.cfg.handler4CancelBtn) {
				this.on("cancel", this.cfg.handler4CancelBtn)
			};
			if(this.cfg.handler4PromptBtn) {
				this.on("prompt", this.cfg.handler4PromptBtn)
			};

		},
		//接口：初始化组件属性
		syncUI: function() {
			this.boundingBox.css({
				width: this.cfg.width + "px",
				height: this.cfg.height + "px",
				left: (this.cfg.x || (window.innerWidth - this.cfg.width) / 2) + "px",
				top: (this.cfg.y || (window.innerHeight - this.cfg.height) / 2) + "px"
			});
			//组件是否添加了皮肤
			if(this.cfg.skinClassName) {
				this.boundingBox.addClass(this.cfg.skinClassName)
			};
			//组件是否是可拖动的
			if(this.cfg.isDraggable) {
				//draggable()方法是jquery-ui的方法
				if(this.cfg.dragHandle) {
					this.boundingBox.draggable({
						handle: this.cfg.dragHandle
					});
				} else {
					this.boundingBox.draggable();
				}
			};
		},
		//接口：销毁前的处理函数
		destructor: function() {
			
			//如果遮罩层(this._mask)存在，则移除遮罩层(this._mask)
			this._mask && this._mask.remove();
		},
		alert: function(cfg) {
			$.extend(this.cfg,cfg,{winType:"alert"});
			this.render();
			return this;
		},
		confirm: function(cfg) {
			$.extend(this.cfg,cfg,{winType:"confirm"});
			this.render();
			return this;
		},
		prompt: function(cfg) {
			$.extend(this.cfg,cfg,{winType:"prompt"});
			this.render();
			//输入框自动获得焦点
			this._promptInput.focus();
			return this;
		},
		common: function(cfg) {
			$.extend(this.cfg,cfg,{winType:"common"});
			this.render();
			return this;
		},
	});
	return {
		Window: Window
	}
})
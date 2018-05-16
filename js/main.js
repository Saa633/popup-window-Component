//首先，加载js的时候，浏览器会停止网页渲染，加载文件越多，网页失去响应的时间就会越长；
//其次，由于js文件之间存在依赖关系，因此必须严格保证加载顺序（比如上例的1.js要在2.js的前面），依赖性最大的模块一定要放到最后加载，当依赖关系很复杂的时候，代码的编写和维护都会变得困难。

//require.js的诞生，就是为了解决这两个问题

//baseUrl: "js/lib",  改变根基目录
require.config({
	//baseUrl: "js/lib",
	paths:{
		jquery:'jquery-1.12.4',
		jqueryUI:'jquery-ui',
	}
});

require(['jquery','window'],function($,w){
	$('#a').click(function(){
		var win=new w.Window().alert({
			title:"提示",
			content:"welcome!",
			width:300,
			height:150,
			y:50,
			hasCloseBtn:true,
			skinClassName:"window_skin_a",
			text4AlertBtn:"ok",
			dragHandle:".window_header",  //类名一定要加点 .
			handler4AlertBtn:function(){
				alert('you click the alert button')
			},
			handler4CloseBtn:function(){
				alert('you click the close button')
			},
		}).on("alert",function(){
			alert("连缀语法1")
		}).on("alert",function(){
			alert("连缀语法2")
		})
		
		//直接调用自定义方法alert
		win.on("alert",function(){
			alert('直接调用自定义方法alert')
		});
	});
	
	$('#b').click(function(){
		new w.Window().confirm({
			title:"系统提示",
			content:"你确定删除这个文件么？",
			width:300,
			height:150,
			y:50,
			text4ConfirmBtn: "是", 
			text4CancelBtn: "否", 
			dragHandle:".window_header",
		}).on("confirm",function(){
			alert('确定');
		}).on("cancel",function(){
			alert('取消');
		})
	})
	
	
	$('#c').click(function(){
		new w.Window().prompt({
			title:"请输入您的名字",
			content:"我们将会保密您输入的信息",
			width:300,
			height:150,
			y:50,
			text4PromptBtn: "提交", 
			text4CancelBtn: "否", 
			defaultValue4PromptInput:"李白",
			dragHandle:".window_header",
			handler4PromptBtn: function(inputValue){
				alert("您输入的内容是"+inputValue)
			},
		}).on("cancel",function(){
			alert('取消');
		})
		
	})
	
	$('#d').click(function(){
		new w.Window().common({
			content:"我只是一个单纯的弹窗",
			width:400,
			height:200,
			y:50,
			hasCloseBtn:true
		})
		
	})
	
})

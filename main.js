var shell = require('shelljs');
var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;

var currentAllNodes=null;


function sleep(milliSeconds) { 
    var startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + milliSeconds);
 };

function refreshNodes(){
	shell.exec('adb shell uiautomator dump /sdcard/dump.xml')
	shell.exec('adb pull /sdcard/dump.xml data/dump.xml')

	var xml = fs.readFileSync('data/dump.xml', 'utf8');
	var doc = new DOMParser().parseFromString(xml,'text/xml');
	currentAllNodes=doc.getElementsByTagName('node')
}

function clickByText(text){
	var views=findViewByText(text);
	if (views.length>0) {
		var bounds=views[0].getAttribute('bounds');
		result=bounds.match(/(\d+)/g);
		var x1=parseFloat(result[0]);
		var y1=parseFloat(result[1]);
		var x2=parseFloat(result[2]);
		var y2=parseFloat(result[3]);
		var centerX=x1+(x2-x1)/2;
		var centerY=y1+(y2-y1)/2;
		shell.exec('adb shell input tap '+centerX+' '+centerY)
	}
}



function clickById(id){
	var views=findViewById(id);
	if (views.length>0) {
		var bounds=views[0].getAttribute('bounds');
		result=bounds.match(/(\d+)/g);
		var x1=parseFloat(result[0]);
		var y1=parseFloat(result[1]);
		var x2=parseFloat(result[2]);
		var y2=parseFloat(result[3]);
		var centerX=x1+(x2-x1)/2;
		var centerY=y1+(y2-y1)/2;
		shell.exec('adb shell input tap '+centerX+' '+centerY)
	}
}

function findViewByText(text){
	views=new Array();
	for(var i=0;i<currentAllNodes.length;i++){
		if (currentAllNodes.item(i).getAttribute('text')==text) {
			views.push(currentAllNodes.item(i));
		}
	}
	return views;
}

function findViewById(id){
	views=new Array();
	for(var i=0;i<currentAllNodes.length;i++){
		var fullId=currentAllNodes.item(i).getAttribute('resource-id');
		var viewId=fullId.substring(fullId.indexOf('/')+1);
		if (viewId==id) {
			views.push(currentAllNodes.item(i));
		}
	}
	return views;
}
function inputText(text){
	shell.exec('adb shell input text '+text);
}
function tap(x,y){
	shell.exec('adb shell input tap '+x+' '+y)
}


function pressKey(keycode){
	shell.exec('adb shell input keyevent '+keycode)
}

function init(){
	refreshNodes()
	clickById('fr')
	refreshNodes()
	clickByText('添加朋友')
	refreshNodes()
	clickById('bx7')
	refreshNodes()
}

function add_friend(name){
	console.log("开始搜索---------------------------------------->"+name)

	clickById('h9')
	console.log("开输入---------------------------------------->"+name)
	inputText(name)
	refreshNodes()
	clickByText('搜索:'+name)
	console.log('点击搜索')
	refreshNodes()
	var views=findViewByText('添加到通讯录')
	if (views.length>0) {
		clickByText('添加到通讯录')
		refreshNodes()
		var sendBtns=findViewByText('发送')
		if (sendBtns.length>0) {
			clickByText('发送')
		}
		console.log(name+":好友申请，发送成功");
		success.push(name);
		pressKey(4)    //返回
	}else{
		var sendMsg=findViewByText('发消息');
		if (sendMsg.length>0) {
			console.log(name+":已经是好友无需再次添加");
			pressKey(4)    //返回
		}else{
			var notExist=findViewByText('该用户不存在');
			var noDisplay=findViewByText('被搜帐号状态异常，无法显示');
			if (notExist.length>0||noDisplay.length>0) {
				clickById('b2q');
				console.log(name+":用户不存在或，用户账号状态异常");
			}
		}
		failed.push(name);
	}
}


var success=new Array();
var failed=new Array();
function main(){
	init();
	var readline = require('readline');  
	var fs = require('fs');  
	var os = require('os');  
	var fRead = fs.createReadStream('data/name.txt');

	const rl = readline.createInterface({
	  input: fRead
	});
	rl.on('line', (line) => {
		add_friend(line);
	});
	rl.on('close', (line) => {
		sleep(500);
	  	pressKey(4)    //返回
	  	sleep(1000);
		pressKey(4)    //返回
		console.log('------------------------------------------');
		console.log('所有账号已处理完成,成功：'+success.length+'个，失败：'+failed.length+'个');

		console.log('添加成功的账号如下:')
		for(var i=0;i<success.length;i++){
			console.log(success[i]);
		}

		console.log('------------------------------------------');
		console.log('添加失败的账号如下:')
		for(var i=0;i<failed.length;i++){
			console.log(failed[i]);
		}
	});
	
}

main();




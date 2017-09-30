# auto_add_wechat_friends
自动批量添加微信好友


使用adb模拟点击操作手机，批量添加好友，微信号存储于data/name.txt

原理：使用uiautomator将界面xml获取到本地，对xml进行解析，然后获取view坐标进行点击

#运行环境
电脑上需配置好node.js

adb

请将其中的adb connect 127.0.0.1:5555修改为正确的可连上真机或模拟器的地址

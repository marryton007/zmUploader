项目名称： 简易文件上传系统

项目描述：
使用Nodejs和mongodb实现的一个简单的文件上传系统。

使用：
1. 软件需求
该项目使用Nodejs和mongodb做为后台，在使用前请确保已安装这上述软件。安装举例，如果主机为Ubuntu系统，敲入如下命令完成安装：

sudo apt-get install nodejs mongodb

2. 安装
先下载本项目的zip包或克隆本项目，进入到项目目录，执行命令：

npm install

3. 启动

npm start

启动完成，使用浏览器访问： http://localhost:8000

4. 注意事项：
在上传文件或获取所有上传文件信息前必须先登录。

5. API
/login      get   获取登录页面
/login      post  发送登录信息，验证登录是否成功
/logout 	      退出	
/upload		      上传，登录后自动跳转到该网页
/getall     get   获取登录用户上传的所有文件， json格式  
/deleteall  get   危险，删除用户上传所有文件并删除数据库相关记录
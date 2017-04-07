# OA
使用Yigo2.0开发的协同办公系统

安装部署说明：
1.恢复数据库：mysql的demo数据库备份文件，env.dev\livedemo-oa\dbback\oa.sql。

2.将env.dev\profiles\oa-dev\copy-to-batch.txt文件，在env.dev\profiles\oa-dev文件夹下复制改名为oa.bat，打开这个批处理文件，设置好对应的数据库链接，数据库用户名，密码，然后双击执行。

3.会在nv.dev\profiles\oa-dev文件加下自动生成，类似root@localhost-3306-oa.designer.bat的批处理文件，双击执行，就可以打开Yigo设计器。

4.打开浏览器，本机浏览器地址：http://localhost:8089/yigo/，用户名：admin，密码为空。

备注：
协同办公系统演示机地址：http://demo.bokesoft.com:50001/yigo/，用户名：001,002,003...024，密码为空。
协同办公系统GitHub地址：https://github.com/bokesoft/OA
Yigo技术支持网站地址：http://yigo.bokesoft.com/






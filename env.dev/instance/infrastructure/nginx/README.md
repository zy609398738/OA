# nginx 集成说明

## Windows 平台
在 Windows 平台下，如果仅用于开发，建议使用当前目录下集成的 `nginx for Windows` 。

## Linux 平台
### 安装 nginx (Ubuntu)
在 Ubuntu 下可以使用如下命令安装 nginx：
````
    sudo apt-get install nginx
````

安装完毕后可以使用下面的命令禁用 nginx 服务的开机自动启动：
````
    sudo service nginx stop
    sudo update-rc.d nginx disable
````

### 允许 nginx 绑定 1024 以下的端口
一般情况下普通用户是没有权限启动程序监听 1024 以下端口的，对于开发环境，可以通过设置 nginx 程序文件的属性来实现（**注意：目前在生产环境中也是这样使用的，安全性待评估**）：
````
    执行 ls -al /usr/sbin/nginx 
        -rwxr-xr-x 1 root root 873176  2月 12 00:24 /usr/sbin/nginx
    执行 sudo chmod u+s /usr/sbin/nginx
    执行 ls -al /usr/sbin/nginx
        -rwsr-xr-x 1 root root 873176  2月 12 00:24 /usr/sbin/nginx
````

**注意! 在更新 nginx 之后可能需要重新设置。**

## END

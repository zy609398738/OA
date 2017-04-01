<%@ page language="java" import="java.util.*,java.sql.*,com.zhuozhengsoft.pageoffice.*" pageEncoding="utf-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
 <head id="Head1">
    <title></title>
    <link href="css/style.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="js/jquery-1.6.min.js"></script>
    <script type="text/javascript">
	
       window.onload=function(){ 
       var refresh = function(){
        $.ajax({  
                    type : "POST",  //提交方式  
                    url : "Result.jsp?page=list",//路径  
                    //timeout:5000,
                    dataType: "text", 
                    success : function(data) {//返回数据根据结果进行相应的处理  
                         $("#Text1").val(data);
                      } 
                    
              }); 
       }
       setInterval(refresh, 1000);
   } 

       function  getText(){
		   //获取文本框的值，传递给result2.jsp
		   var  text2=document.getElementById("text2").value;	
		     $.ajax({  
                    type : "POST",  //提交方式  
                    url : "Result2.jsp?text="+text2,//路径  
                    dataType: "text", 
                    success : function(data) {//返回数据根据结果进行相应的处理  

                      } 
                    
              }); 
		   
	   }	
	   
	  
    </script>

</head>
  <%
  String userName="张三";
  session.setAttribute("userName",userName);
  session.setAttribute("FileIsOpened",false);

  %>
 <body>
    <!--header-->
    <div class="zz-headBox br-5 clearfix" align="center">
        <div class="zz-head mc">
            <!--logo-->
            <div class="logo fl">
                <a href="#">
                    <img src="images/logo.png" alt="" /></a></div>
            <!--logo end-->
            <ul class="head-rightUl fr">
                <li><a href="http://www.zhuozhengsoft.com">卓正网站</a></li>
                <li><a href="http://www.zhuozhengsoft.com/poask/index.asp">客户问吧</a></li>
                <li class="bor-0"><a href="http://www.zhuozhengsoft.com/contact-us.html">联系我们</a></li>
            </ul>
        </div>
    </div>
    <!--header end-->
    <!--content-->
    <div class="zz-content mc clearfix pd-28" align="center">
        <div class="demo mc">
            <h2 class="fs-16">
                PageOfficeLink 专题</h2>
        </div>

         <div style="margin : 10px" align="center">
           <table   style="border-collapse:separate; border-spacing:20px; ">
             <tr>
              <td>1.PageOfficeLink方式最简单的打开编辑保存文档：<a href="<%=PageOfficeLink.openWindow(request,"Word1.jsp","width=1300px;height=730px;")%>">Word1.jsp</a>
              </td>
              </tr>
             <tr>
			 <td>2.向PageOfficeLink打开的页面传递参数1：<a href="<%=PageOfficeLink.openWindow(request,"Word2.jsp?id=1","width=1300px;height=730px;")%>">Word2.jsp</a></td>
			 </tr>
             <tr>
			 <td>3.向PageOfficeLink打开的页面传递参数2：<a href="<%=PageOfficeLink.openWindow(request,"Word3.jsp","left=980px;top=200px;width=1300px;height=730px;")%>" onclick="getText()">Word3.jsp</a></td>
			 <tr>
			 <td>请输入值：
			 <input  type="text"   id="text2" value="test"/><td>
			 </tr>
			 <tr>
			 <td>4.PageOfficeLink窗口所在的页面返回参数给主页面：<a href="<%=PageOfficeLink.openWindow(request,"Word4.jsp","left=980px;top=200px;width=1300px;height=730px;")%>">Word4.jsp</a></td>
			 </tr>
			  <tr>
			 <td><p>PageOfficeLink窗口所在的页面返回参数给主页面示例说明：</br>
			           假如：我们把当前页面（index.jsp）叫做"主页面"，PageOfficeLink弹出窗口打开的页面（Word4.jsp）叫做"子页面"。</br>
			            由于PageOfficeLink是以"弹出新的IE窗口"的方式打开文档的，所以在子页面中的参数无法传递给"主页面"。</br>
					   那么如何解决此问题呢？</br>
					   PageOffice给出的解决方案是：</br>
					   &nbsp;&nbsp;&nbsp;"主页面"在session中设置一个变量值，之后"主页面"通过ajax技术不断地重复请求获取此session变量的值，PageOfficeLink弹出的"子页面"获取此session值并修改后，通过ajax技术把修改后的值重新赋值给此session变量，"主页面"很快就可以获取到更新后的session变量值。这样就实现了PageOfficeLink弹出窗口打开的"子页面"通过session传递参数给"主页面"的目的。 

				 </p>
			 </td>
			 </tr>
			 <tr>
			 <td>获取Word4.jsp页面的返回的FileIsOpened的值：<input type="text" id="Text1"/></td>
			 </tr>
           </table>
           
       </div>
       
    </div>
    
    <!--footer
    <div class="login-footer clearfix">
        Copyright &copy 2016 北京卓正志远软件有限公司</div>
    -->
</body>
</html>

<%@ page language="java" import="java.util.*" pageEncoding="gb2312"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
   <title>��¼ҳ��</title>
</head>
<body>
    <form id="form1"  action="SetHandDrawByUserName.jsp" method="post"> 
    <div style=" text-align:center;">
    <div>��ѡ���¼�û���</div><br />
    <select name="userName">
        <option selected="selected" value="zhangsan">����</option>
        <option  value="lisi">����</option>
         <option  value="wangwu">����</option>
    </select><br /><br />
    <input type="submit"  value="���ļ�" /><br /><br />
    <div style=" color:Red;">��ͬ���û���¼�����ĵ������������˵���д��ע��ֻ��ʾ��ǰ�û�����д��ע��</div>
    </div>
    </form>
</body>

</html>

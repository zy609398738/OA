<%@ page language="java" import="java.util.*" pageEncoding="gb2312"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
     <title>��¼ҳ��</title>
</head>
<body>
    <form id="form1"  action="SetDataRegionByUserName.jsp" method="post"> 
    <div style=" text-align:center;">
    <div>��ѡ���¼�û���</div><br />
    <select name="userName">
        <option selected="selected" value="zhangsan">A���ž���</option>
        <option  value="lisi">B���ž���</option>
    </select><br /><br />
    <input type="submit"  value="���ļ�" /><br /><br />
    <div style=" color:Red;">��ͬ���û���¼�����ĵ��п��Ա༭�ĵ�Ԫ������ͬ</div>
    </div>
    </form>
</body>

</html>
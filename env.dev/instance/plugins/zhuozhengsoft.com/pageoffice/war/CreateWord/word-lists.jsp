<%@ page language="java" 
	import="java.util.*, java.sql.*,java.io.*,javax.servlet.*,javax.servlet.http.*,java.text.SimpleDateFormat,java.util.Date" 
	pageEncoding="gb2312"%>
<%
if(request.getParameter("op")!=null&&request.getParameter("op").length()>0){
            Class.forName("org.sqlite.JDBC");
			String strUrl = "jdbc:sqlite:"
				+ this.getServletContext().getRealPath("demodata/") + "\\CreateWord.db";
			Connection conn = DriverManager.getConnection(strUrl);
			Statement stmt = conn.createStatement();
			ResultSet rs=stmt.executeQuery("select Max(ID) from word");
            int newID = 1;
            if (rs.next())
            {
                newID =  Integer.parseInt(rs.getString(1))+1;
            }
            rs.close();

            String fileName = "aabb" + newID + ".doc";
            String FileSubject = "�������ĵ�����";
            String getFile=(String)request.getParameter("FileSubject");
            if ( getFile!=null&&getFile.length()>0)
                FileSubject =new String(getFile.getBytes("iso-8859-1"));
                out.print(FileSubject);
            SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//�������ڸ�ʽ
			// new Date()Ϊ��ȡ��ǰϵͳʱ��
            String strsql = "Insert into word(ID,FileName,Subject,SubmitTime) values(" + newID
                + ",'" + fileName + "','" + FileSubject + "','" + df.format(new Date()) + "')";
            stmt.executeUpdate(strsql);
            stmt.close();
            conn.close();
            
            //�����ļ�
            //if(request.getParameter("action").equals("create")){
			String oldPath=getServletContext().getRealPath("CreateWord/doc/template.doc");
			String newPath=getServletContext().getRealPath("CreateWord/doc/" + fileName);
			try { 
           		int bytesum = 0; 
           		int byteread = 0; 
           		File oldfile = new File(oldPath);
           		if (oldfile.exists()) { //�ļ�����ʱ 
               		InputStream inStream = new FileInputStream(oldPath); //����ԭ�ļ� 
               		FileOutputStream fs = new FileOutputStream(newPath); 
               		byte[] buffer = new byte[1444]; 
               		int length; 
               		while ( (byteread = inStream.read(buffer)) != -1) { 
                   		bytesum += byteread; //�ֽ��� �ļ���С 
                   		System.out.println(bytesum); 
                   		fs.write(buffer, 0, byteread); 
               		} 
               		inStream.close(); 
           		} 
       		} 
      		catch (Exception e) { 
           		System.out.println("���Ƶ����ļ���������"); 
           		e.printStackTrace(); 
       		} 
		//}
  			response.sendRedirect("word-lists.jsp");
   		} 	


%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title></title>
    <link href="../css/style.css" rel="stylesheet" type="text/css" />

    <script type="text/javascript">
        function onColor(td) {
            td.style.backgroundColor = '#D7FFEE';
        }
        function offColor(td) {
            td.style.backgroundColor = '';
        }
        function getFocus() {
            var str = document.getElementById("FileSubject").value;
            if (str == "�������ĵ�����") {
                document.getElementById("FileSubject").value = "";
            }

        }
        function lostFocus() {
            var str = document.getElementById("FileSubject").value;
            if (str.length <= 0) {
                document.getElementById("FileSubject").value = "�������ĵ�����";
            }
        }


    </script>

</head>
<body style=" text-align:center;">
    <!--header-->
    <div class="zz-headBox br-5 clearfix" >
        <div class="zz-head mc">
            <!--logo-->
            <div class="logo fl">
                <a href="home.html">
                    <img src="../images/logo.png" alt="" /></a></div>
            <!--logo end-->
            <ul class="head-rightUl fr">
                <li><a href="home.html">׿����վ</a></li>
                <li><a href="###">�ͻ��ʰ�</a></li>
                <li class="bor-0"><a href="contact-us.html">��ϵ����</a></li>
            </ul>
        </div>
    </div>
    <!--header end-->
    <!--content-->
    <div class="zz-content mc clearfix pd-28">
        <div class="demo mc">
            <h2 class="fs-16">
                PageOffice ���ִ������ĵ��ķ�ʽ</h2>
        </div>
        <div class="demo mc" style="text-align:left;">
            <h3 class="fs-12">
                �½��ļ�</h3>
            <form id="form1" method="post" action="word-lists.jsp?op=create">
            <table class="text" cellspacing="0" cellpadding="0" border="0">
                <tr>
                    <td style="font-size: 9pt" align="left">
                        ����1��ͨ�������ļ��������ļ�
                    </td>
                    <td align="center">
                        <input name="FileSubject" id="FileSubject" type="text" onfocus="getFocus()" onblur="lostFocus()"
                            class="boder" style="width: 180px;" value="�������ĵ�����" />
                    </td>
                    <td style="width: 221px;">
                        &nbsp;
                        <input type="submit" value="�����ļ�" style=" width:86px;"/>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">&nbsp;</td>
                </tr>
                <tr>
                    <td>
                        ����2����������WebCreateNew�������ļ�&nbsp;&nbsp;
                    </td>
                    <td>
                        &nbsp;<a href="CreateWord.jsp" target="_blank"style=" color:Blue; text-decoration:underline;">�½��ļ�</a>
                        </td>
                    <td style="width: 221px;">
                        &nbsp;&nbsp;
                    </td>
                </tr>
            </table>
            </form>
        </div>
        <div class="zz-talbeBox mc">
            <h2 class="fs-12">
                �ĵ��б�</h2>
            <table class="zz-talbe">
                <thead>
                    <tr>
                        <th width="22%">
                            �ĵ�����
                        </th>
                        <th width="10%">
                            ��������
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <%
                Class.forName("org.sqlite.JDBC");
			String strUrl = "jdbc:sqlite:"
				+ this.getServletContext().getRealPath("demodata/") + "\\CreateWord.db";
				Connection conn = DriverManager.getConnection(strUrl);
				Statement stmt = conn.createStatement();
				ResultSet rs=stmt.executeQuery("select * from word order by id desc");
				String fileName="";
				String subject="";
				String submitTime="";
				while(rs.next()){	
					fileName = rs.getString("FileName");
					subject = rs.getString("Subject");
					submitTime = rs.getString("SubmitTime");
				%>
					<tr onmouseover='onColor(this)' onmouseout='offColor(this)'>
					<td>
								<a
									href='OpenWord.jsp?filename=<%= fileName %>&subject=<%=subject %>'><%=subject %></a>
							</td>
				<%
					if(submitTime!=null&&submitTime.length()>0){
				%>
					<td><%=new SimpleDateFormat("yyyy/MM/dd")
								.format(new SimpleDateFormat("yyyy-MM-dd")
										.parse(submitTime)) %></td>
				<% 
					}else{
				%>
					<td>&nbsp;</td>
				<%
					}
				 %>
					</tr>
					<%
				}
				stmt.close();
				conn.close();
                     %>
                </tbody>
            </table>
        </div>
    </div>
    <!--content end-->
    <!--footer-->
    <div class="login-footer clearfix">
        Copyright &copy 2012 ����׿��־Զ������޹�˾</div>
    <!--footer end-->
</body>
</html>
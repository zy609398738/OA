<%@ page language="java"
	import="java.sql.*,java.io.*,javax.servlet.*,javax.servlet.http.*,java.text.SimpleDateFormat,java.util.Date;"
	pageEncoding="gb2312"%>
<%
 %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

		<link rel="stylesheet" href="css/style.css" type="text/css"></link>
		<title>�׺���ʾʾ��</title>
		<script type="text/javascript">
			function onColor(dd){
				dd.style.backgroundColor = "#D7FFEE";
			}
			function offColor(dd){
				dd.style.backgroundColor="";
			}
															
		</script>
	</head>
	<body>
		<!--header-->
		<div class="zz-headBox br-5 clearfix">
			<div class="zz-head mc">
				<!--logo-->
				<div class="logo fl">
					<a href="#"> <img src="images/logo.png" alt="" /> </a>
				</div>
				<!--logo end-->
				<ul class="head-rightUl fr">
					<li><a href="http://www.zhuozhengsoft.com" target="_blank">׿����վ</a></li>
                <li><a href="http://www.zhuozhengsoft.com/poask/index.asp" target="_blank">�ͻ��ʰ�</a></li>
                <li class="bor-0"><a href="http://www.zhuozhengsoft.com/contact-us.html" target="_blank">��ϵ����</a></li>
				</ul>
			</div>
		</div>
		<!--header end-->
		<!--content-->
		<div class="zz-content mc clearfix pd-28">
			<div class="demo mc">
				<h2 class="fs-16">
					PageOffice ���ĵ���ת�е�Ӧ��
				</h2>
				<h3 class="fs-12">
					��ʾ˵��:
				</h3>
				
				<p>
					��ʾ1����ȷ���б���ʾǰ��������Ҫȷ�����Ļ������Ѱ�װMicrosoft Office��
				</p>
				<p>
					��ʾ2��������ǵ�һ��ʹ��PageOffice���ڴ��ļ���ʱ�����ʾ��װ�ؼ����������װ��
				</p>
				
			</div>
			
			<div class="zz-talbeBox mc">
				<h2 class="fs-12">
					�ĵ��б�
				</h2>
				<table class="zz-talbe">
					<thead>
						<tr onmouseover="onColor(this);" onmouseout="offColor(this);">		
							<th width="20%" style="text-align:center;">
								�ĵ�����
							</th>
							<th width="20%" style="text-align:center;">
								��������
							</th>
							<th width="60%" style="text-align:center;">
								����
							</th>
							
						</tr>
					</thead>
					<tbody>
						<tr>
							<td style="text-align:center;">�����ļ�</td>
							<td style="text-align:center;">2013-05-30</td>
							<td style="text-align:center;">
								<a href="edit.jsp"><span style=" color:Green;">�༭</span></a>&nbsp;&nbsp;&nbsp;
								<a href="taoHong.jsp"><span style=" color:Green;">�׺�</span></a>&nbsp;&nbsp;&nbsp;
								<a href="readOnly.jsp"><span style=" color:Green;">��ʽ����</span></a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<!--content end-->
		<!--footer-->
		
		<!--footer end-->
	</body>
</html>

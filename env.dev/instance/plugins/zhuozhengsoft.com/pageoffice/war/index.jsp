 <%@ page language="java" import="java.util.*,com.zhuozhengsoft.pageoffice.*" pageEncoding="gb2312"%>
 
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="css/style.css" />
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/pageoffice.js"></script>

<title>������ʾʾ��</title>
    <style type="text/css">

        .style1
        {
            height: 111px;
        }
        html{/* IE6�з�ֹ���� */ 
            _background-image: url(about:blank); 
            _background-attachment: fixed; 
        } 
        #menubar{ 
            position:fixed;/*��IE6�����*/ 
            bottom:78px;  
            width:150px; 
            z-index:999; 
            height:175px; 
            border-left:solid 1px #ccc;
            _position: absolute;/*����IE6�����*/ 
            _top: expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-19)); 
        }
        #menubar ul
        {
            margin-left:13px;  font-weight:bold; color:#999;
            }
        #menubar ul li
        {
            font-size:14px;
            }
        
        .maodian
        {
            z-index:10; 
        }
        .off
        {
            color:#999; list-style-type:none;
        }
        .on
        {
            color:#333; list-style-type:square;
        }
        
    </style>

    <script type="text/javascript">
	window.onload = function(){ 

		if (checkChromeVersion() > 41) {
				location.href="index2.jsp";
		}

	}

        function checkChromeVersion() {
            //alert(navigator.userAgent);
            var nua = navigator.userAgent;
            var chromePos = nua.toLowerCase().indexOf("chrome/");
            if (chromePos > 0) {
                //alert(nua.substring(chromePos + 7, chromePos + 9));
                return Number(nua.substring(chromePos + 7, chromePos + 9));
            }
            else {
                return 0;
            }
        }


    </script>
</head>
<body >
<!--header-->
<div class="zz-headBox br-5 clearfix">
	<div class="zz-head mc">
    <!--logo-->
    	<div class="logo fl" id="pagetop"><a href="http://www.zhuozhengsoft.com/" target="_blank"><img src="images/logo.png" alt="" /></a></div>
    <!--logo end-->
        <ul class="head-rightUl fr">
        	<li><a href="http://www.zhuozhengsoft.com/" target="_blank">׿����վ</a></li>
            <li><a href="http://www.zhuozhengsoft.com/poask/index.asp" target="_blank">�ͻ��ʰ�</a></li>
            <li class="bor-0"><a href="http://www.zhuozhengsoft.com/contact-us.html" target="_blank">��ϵ����</a></li>
        </ul>
  	</div>
</div>
<!--header end-->


<!--content-->
<div class="zz-content mc clearfix pd-28">
    <div class="demo mc">
        <h2 class="fs-16" style="color:#477ccc;">׿��PageOffice 3.0���ʹ������</h2>
        <h3 class="fs-12" >��ʾ˵��:</h3>
        <p style=" text-indent:40px;">����PageOffice��Ʒ�Ĺ��ܺܶ࣬Ϊ�˱��������û������ҵ��Լ���Ҫ�Ĺ��ܺ�ʾ�����ڴ˰� 
            PageOffice ��ʾ����Ϊ�������ࣺ
        </p>
        <p style=" text-indent:40px;"><span style=" font-weight:bold;">�������ܣ�</span>
        ��ʾ����������ߴ򿪡��༭������Office�ĵ�������PageOffice��Ʒ�Ľ��棬�������������˵������Զ��幤������Office�����������غ���ʾ������Զ���˵�������Զ��尴ť���޸ı������ı��ȣ�����Office�����Ƿ���ã��������桢��桢��ӡ�������ȹ��ܣ�
        </p>
        <p style=" text-indent:40px;"><span style=" font-weight:bold;">�߼����ܣ�</span>
        ��ʾ����Pageoffice�ṩ�Ľӿ�������ݵ�Word��Excelģ���ļ�����̬�����ĵ��Ĺ��ܣ���ʾ����Word��Excel�����ݸ�ʽ���������塢��ɫ�����䷽ʽ������ߡ���Ԫ�񱳾�ɫ���иߡ��п��Ĺ��ܣ���ʾ��Word��Excel����ȡָ��λ�����ݣ����浽���ݿ�Ĺ��ܣ�
        </p>
        <p style=" text-indent:40px;"><span style=" font-weight:bold;">�ۺ���ʾ��</span>
        ͨ������ģ��ʾ����ʾPageOffice�ڸ���Ӧ�ó����У�����PageOffice�����API���ʵ�������Ч����
        </p>
        <p style=" text-indent:40px;"><span style=" font-weight:bold;">�������ɣ�</span>
        ��ʾPageOffice�ڿͻ���ͨ��js����Office��VBA�ӿ�ʵ�ָ���Ч���ļ��ɣ�
        </p>

        <br />
    </div>

    <div class="zz-talbeBox mc" style=" text-align:left;">
        <br />
    	<h2 style=" margin-left:320px;" id="jichu" class="maodian">һ����������</h2>
    	<table class="zz-talbe">
        	<thead>
            	<tr>
                	<th style="width:40px;">���� </th>
                    <th style="width:500px;">����ʾ��</th>
                    <th style="width:120px;">�ļ���</th>
                </tr>
            </thead>
            <tbody>
            	<tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��1��<a href="SimpleWord/Word.jsp" target="_blank">������ߴ򿪱���Word�ļ���URL��ַ��ʽ��</a>
                        <p >��ʾPageOfficeʵ������������ߴ򿪱����������Word�ļ��Ĺ��ܣ�Ҳ����򵥵�һ������PageOffice��ʾ������һ�νӴ�PageOffice��Ʒ���û����Բο���ʾ����PageOffice���ɵ��Լ�����Ŀ�С�</p></td>
                    <td>/SimpleWord</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��2��<a href="SimpleWord/Word1.jsp" target="_blank">�Դ���·����ʽ��Office�ļ�����WordΪ����</a>
                    <p>��򵥵ļ���PageOffice��ʾ������ʹ�õ��Ƿ���������·���ķ�ʽ�����ַ�ʽ���ŵ㣺1. ֧������·����2. �ļ����Ա����ڷ������ϵ���������ļ����¡�</p>
                    </td>
                    
                    <td>/SimpleWord</td>
                </tr>

                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>һ��3��<a href="SimpleExcel/Excel.jsp" target="_blank">������ߴ򿪱���Excel�ļ���URL��ַ��ʽ��</a>
                    <p>��ʾ���ߴ򿪱���Excel�ļ���Ч����������򿪱���Word�Ĵ��뼸����ȫһ����ֻ��WebOpen�ĵڶ���������һ����WebOpen�����ĵڶ���������Ҫ��ʵ��Ҫ�򿪵�Office�ĵ����ļ���ʽ����һ��</p>
                    </td>
                    <td>/SimpleExcel</td>
                </tr>
                <tr>
                	<td><img src="images/office-3.png" /></td>
                    <td>һ��4��<a href="SimplePPT/PPT.jsp" target="_blank">������ߴ򿪱���PPT�ļ���URL��ַ��ʽ��</a><p>��ʾ���ߴ򿪱���PPT�ļ���Ч����������򿪱���Word�Ĵ��뼸����ȫһ����ֻ��WebOpen�ĵڶ���������һ����WebOpen�����ĵڶ���������Ҫ��ʵ��Ҫ�򿪵�Office�ĵ����ļ���ʽ����һ��</p>
                    </td>
                    <td>/SimplePPT</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��5��<a href="TitleText/Word.jsp" target="_blank">�޸ı������ı�����</a>
                    <p>ͨ����Caption���Ը�ֵ�����޸ı��������ı����ݣ��������Caption��ֵ�Ļ���������Ĭ����ʾ���ı��ǣ�׿�� PageOffice ����ƽ̨��</p>
                    </td>
                    <td>/TitleText</td>
                </tr>
                <tr>
                	<td><img  src="images/office-1.png" /></td>
                    <td>һ��6��<a href="ControlBars/OpenWord.jsp"  target="_blank">���ر��������˵������Զ���������Office����������WordΪ����</a>
                    <p>��ʾ������ر��������˵������Զ���������Office��������ÿ�������ǿ��Ե����Ŀ����Ƿ����ء�</p>
                    </td>
                    <td>/ControlBars</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��7��<a href="SetTheme/Word.jsp" target="_blank">����PageOffice�����������ʽ</a>
                    <p>ͨ������Theme ���ԣ��ı�ؼ����ڵĽ�����ʽ�����Զ�����桢Office2007�����Office2010���湲���������ѡ��</p>
                    </td>
                    <td>/SetTheme</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��8��<a href="OpenWord/OpenWord.jsp" target="_blank">��򵥵�ֻ����Office�ļ�����WordΪ����</a>
                    <p>ʵ��ֻ��ģʽ��Office�ļ���ֻ��Ҫ�޸�WebOpen�ĵڶ����������ɣ�PageOffice���Word��Excel��PPT�ֱ��ṩ��docReadOnly��xlsReadOnly��pptReadOnlyģʽ��</p>
                    
                    </td>
                    <td>/OpenWord</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��9��<a href="SavaReturnValue/SavaReturnValue.jsp" target="_blank">�ĵ�������ǰ̨ҳ�淵�ؿ������Զ���ı�����ֵ����WordΪ����</a>
                    <p>ͨ����̨��������PageOffice.FileSaver.CustomSaveResult ���ԣ���ǰ̨ҳ��PageOffice���󷵻�һ���û��Զ����ֵ�������㲿�ֿ����߸�ǰ̨ҳ�淵��ID������������������</p>
                    </td>
                    <td>/SavaReturnValue</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��10��<a href="SendParameters/SendParameters.jsp" target="_blank">������ҳ�棨SaveFilePage����ָ���ҳ�棩���ݲ���</a>
                    <p>��ʾ����ʾ��PageOffice������ҳ�洫�ݲ��������ַ�ʽ:(1)ͨ�����ñ���ҳ���url�е�?���ݲ���;(2)ͨ��input�����������ҳ�洫�ݲ���;(3)ͨ��Form�ؼ�������ҳ�洫�ݲ���(�����Form�ؼ���������������򡢵�ѡ�򡢸�ѡ��TextArea�����͵Ŀؼ�)��</p>
                    </td>
                    <td>/SendParameters</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��11��<a href="DataRegionFill/DataRegionFill.jsp" target="_blank">��Word�ĵ��е���������DataRegion����ֵ�ļ�ʾ��</a>
                    <p>��ʾ����һ����򵥵ĸ�Word��������ֵ��ʾ����Ԥ����Word�ĵ����ֹ�����һЩDataRegion��ͨ��PageOffice����ʵ�����ĵ��б�ǵ�λ�ô���̬������ݡ�</p>
                    </td>
                    <td>/DataRegionFill</td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>һ��12��<a href="ExcelFill/ExcelFill.jsp" target="_blank">�򵥵ĸ�Excel���ֵ</a>
                    <p>��ʾ����һ����򵥵ĸ�Excel��Ԫ��ֵ��ʾ����</p>
                    </td>
                    <td>/ExcelFill</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��13��<a href="SubmitWord/SubmitWord.jsp" target="_blank">��򵥵��ύWord�е��û���������</a>
                    <p>��ʾPageOfficeʹ��WordReader�����ȡWord�ĵ������ݵ�Ч������ʾ������ʾ��������Ĺ��ܣ�����ϸ������ο����ۺ���ʾ��ʾ����</p>
                    </td>
                    <td>/SubmitWord</td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>һ��14��<a href="SubmitExcel/SubmitExcel.jsp" target="_blank">��򵥵��ύExcel�е��û���������</a>
                    <p>��ʾPageOfficeʹ��ExcelReader�����ȡExcel�ĵ��е�Ԫ�����ݵ�Ч������ʾ������ʾ��������Ĺ��ܣ�����ϸ������ο����ۺ���ʾ��ʾ����</p>
                    </td>
                    <td>/SubmitExcel</td>
                </tr>
               
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��15��<a href="InsertSeal/Word.jsp" target="_blank">��ʾ�Ӹ�ӡ�º�ǩ�ֹ��ܣ���WordΪ����</a>
                    <p>��ʾPageOffice���߱༭ʱ���º�ǩ�ֵĹ��ܡ���ʾ������ʾ�û�ʹ��ӡ�¹���ʱ�Ĳ����͸��º��Ч��������ӡ����صĹ�����ο����ۺ���ʾ��ʾ����ӡ�¹���ƽ̨�������׼��ɵ��������ϵͳ�С�</p>
                    </td>
                    <td>/InsertSeal</td>
                </tr>
                 
                <tr>
                	<td><img  src="images/office-1.png" /></td>
                    <td>һ��16��<a href="CommandCtrl/Word.jsp"  target="_blank">���Ʊ��桢���ʹ�ӡ���ܣ���WordΪ����</a>
                    <p>��ʾ�����ֱ��ֹOffice�ı��桢���ʹ�ӡ���ܡ�</p>
                    </td>
                    <td>/CommandCtrl</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��17��<a href="WordSetTable/WordSetTable.jsp" target="_blank">��Word�ĵ���Table��ֵ�ļ�ʾ��</a>
                    <p>��ʾ��PageOffice��Word�ĵ���Table�Ĳ�������������Ԫ��ֵ�Ͷ�̬����е�Ч����</p>
                    </td>
                    <td>/WordSetTable</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��18��<a href="WordDataTag2/DataTag.jsp" target="_blank">ʹ�����ݱ�ǩ��DataTag����Word�ļ�����ı�����</a>
                    <p>��Wordģ�������ݱ�ǩ��DataTag����ֵ�����ģ�����жദλ����Ҫͬһ���ݵ�����ʹ�����ݱ�ǩ�����ظ���Ƕദ��Ҫ���ͬһ���ݵ�λ�ã�Ȼ������ݱ�ǩ���ʵ�����ģ�������ļ���</p>
                    </td>
                    <td>/WordDataTag2</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��19��<a href="CustomToolButton/word.jsp" target="_blank">��PageOffice�Զ��幤���������һ����ť����WordΪ����</a>
                    <p>��PageOffice�Զ��幤���������һ����ť�������õ��ʱִ�еĴ��롣</p>
                    </td>
                    <td>/CustomToolButton</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��20��<a href="AfterDocOpened/Word.jsp" target="_blank">����ĵ���֮����ҳ���ﴥ�����¼�����WordΪ����</a>
                    <p>��ʾ����ʹ���ĵ���֮����ҳ���ﴥ�����¼������¼��ܳ��ã���Ҫ���ļ��򿪵�ʱ��ִ�еĴ��붼���Էŵ����¼���ִ�С�</p>
                    </td>
                    <td>/AfterDocOpened</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��21��<a href="JsControlBars/Word.jsp" target="_blank">��JS����PageOffice�����ϸ��������������غ���ʾ����WordΪ����</a>
                    <p>��ʾ������JS���Ʊ��������˵������Զ��幤������Office�����������غ���ʾ��</p>
                    </td>
                    <td>/JsControlBars</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��22��<a href="ConcurrencyCtrl/Default.jsp" target="_blank">���ĵ�ʹ��"��������"����WordΪ����</a>
                    <p>��ʾʹ��TimeSlice�������ô��ĵ��Ĳ�������ʱ�䣬��ֹ����û�ͬʱ��һ���ļ������ֱ༭�����ļ��໥���ǵ����⡣</p>
                    </td>
                    <td>/ConcurrencyCtrl</td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>һ��23��<a href="ExcelTable/Table.jsp" target="_blank">��Excel�е�һ������ֵ�����Զ�������</a>
                    <p>��ʾʹ��PageOffice�ķ���OpenTable��ʵ����������������ѭ��ʹ��ԭģ��Table����B4:F13����Ԫ����ʽ�� </p>
                    </td>
                    <td>/ExcelTable</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��24��<a href="SaveAsHTML/Word.jsp" target="_blank">����ļ�ΪHTML��ʽ����WordΪ����</a>
                    <p>��ʾʹ��PageOffice��WebSaveAsHTML����������ļ�ΪHtml��ʽ���浽�������� </p>
                    </td>
                    <td>/SaveAsHTML</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��25��<a href="SaveAsMHT/Word.jsp" target="_blank">����ļ�ΪMHT��ʽ����WordΪ����</a>
                    <p>��ʾʹ��PageOffice��WebSaveAsMHT����������ļ�ΪMHT��ʽ���浽�������� </p>
                    </td>
                    <td>/SaveAsMHT</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��26��<a href="BeforeAndAfterSave/Word.jsp" target="_blank">�ĵ�����ǰ�ͱ���󴥷����¼�����WordΪ����</a>
                    <p>��ʾ����ʹ���ĵ�����֮ǰ�ͱ���֮�󴥷����¼����������¼��ܳ��ã���Ҫ�ڱ����ĵ�ʱִ�е�js���룬�����Էŵ��������¼���ִ�С� </p>
                    </td>
                    <td>/BeforeAndAfterSave</td>
                </tr>
		<tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��27��<a href="<%=PageOfficeLink.openWindow(request, "PageOfficeLink/Word.jsp","width=1200px;height=800px;")%>" >PageOfficeLink��ʽ���ߴ��ĵ�����WordΪ����</a>
                    <p>ȫ�µ��ļ��򿪷�ʽ��PageOfficeLink ��ʽ�����˷�ʽ�ṩ�˸�����������������Խ�����������ڴ�ʾ����POL��ʽ���ĵ��ģ���ΪPOL�򿪷�ʽû����ʾ�û���װPageOffice�ͻ��ˣ������������û�а�װ��PageOffice�ͻ��ˣ�<span style='font-size:12px;color:red;'>���Ȱ�װ<a href="posetup.exe" style="border:solid 1px #0473b3;  padding:1px;">PageOffice�ͻ���</a></span>��</p>
                    </td>
                    <td>/PageOfficeLink</td>
                </tr>
               <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��28��<a href="SaveDataAndFile/Word.jsp" target="_blank">�ȱ���Word�ĵ���ָ��λ�õ�����,�ֱ�����ƪ�ĵ�����WordΪ����</a>
                    <p>��ʾ��ν�setSaveDataPage��setSaveFilePage�������ʹ��,�Դﵽͬʱ�������ݺ��ļ���Ч����</p>
                    </td>
                    <td>/SaveDataAndFile</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��29��<a href="ImportWordData/Word.jsp" target="_blank">�����������Word�ļ����ύ����</a>
                    <p>��ʾ��ε����������Word�ļ����ύ����ȡ�ļ��е�����ݡ�</p>
                    </td>
                    <td>/ImportWordData</td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>һ��30��<a href="ImportExcelData/Excel.jsp" target="_blank">�����������Excel�ļ����ύ����</a>
                    <p>��ʾ��ε����������Excel�ļ����ύ����ȡ�ļ��е�����ݡ�</p>
                    </td>
                    <td>/ImportExcelData</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��31��<a href="WordDisableRight/Word.jsp" target="_blank">��ֹWord������Ҽ�</a>
                    <p>��ʾ���ʹ�÷������˷���setDisableWindowRightClick(true)��ֹ��ǰWord�ĵ�������Ҽ��˵���</p>
                    </td>
                    <td>/WordDisableRight</td>
                </tr>
                <tr>
                    <td><img src="images/office-2.png" /></td>
                    <td>һ��32��<a href="ExcelDisableRight/Excel.jsp" target="_blank">��ֹExcel������Ҽ�</a>
                    <p>��ʾ���ʹ�÷������˷���setDisableSheetRightClick(true)��ֹ��ǰExcel����������Ҽ��˵���</p>
                    </td>
                    <td>/ExcelDisableRight</td>
                </tr>
                 <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>һ��33��<a href="PageOfficeLinkTopic/index.jsp" target="_blank">PageOfficeLinkר��</a>
                    <p>��ʾ��θ�PageOfficeLink�򿪵�ҳ�洫�ݲ�����PageOfficeLink�򿪵�ҳ�淵�ز�������ҳ�档</p>
                    </td>
                    <td>/PageOfficeLinkTopic</td>
                </tr>
                <tr>
                
            </tbody>
        </table>
        <br />
	<div id="maoDiv"></div>
        <h2 style=" margin-left:300px;" id="gaoji" class="maodian">�����߼�����</h2>
        <a style=" margin-bottom:10px; text-decoration:underline;" href="#pagetop"><img src="images/arrow_px_up.gif" />��ҳ��</a>
    	<table class="zz-talbe">
        	<thead>
            	<tr>
                	<th style="width:40px;">���� </th>
                    <th style="width:500px;">����ʾ��</th>
                    <th style="width:120px;">�ļ���</th>
                </tr>
            </thead>
            <tbody>
            	<tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����1��<a href="ReadOnly/OpenWord.jsp" target="_blank">�ļ����߰�ȫ�������WordΪ����</a>
                    <p>ʹ��ֻ��ģʽ���ߴ�Word�ļ�����ֹ�༭����������ӡ����档</p>
                    <p>��ȫ����ĵ���ֹ���༭�����ơ�ճ�����Ҽ��˵���ѡ�����ء���桢F12���ء�PrintScreen�����Ȳ�����</p>
                    </td>
                    <td>/ReadOnly</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����2��<a href="DataBase/Stream.jsp" target="_blank">�򿪱������ݿ��е��ļ�����WordΪ����</a>
                    <p>��ʾ���ʹ��PageOffice�����ķ�ʽ�����ݿ��б�����ļ������Ƽ����ļ����������ݿ��У������ڵ��ԣ�����Ӱ�����ݿ�Ĳ�ѯ�ٶȡ�</p>
                    </td>
                    <td>/DataBase</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����3��<a href="CreateWord/word-lists.jsp" target="_blank">�½��ļ�����WordΪ����</a>
                    <p>��ʾϵͳ�д����ĵ������ַ�ʽ��1.�����ļ��������ļ�������2.����PageOffice��WebCreateNew�����������ļ���</p>
                    </td>
                    <td>/CreateWord</td>
                </tr>
                <tr>
                	<td><img src="images/pdf.jpg" /></td>
                    <td>����4��<a href="POPDF/PDF.jsp" target="_blank">���ߴ�PDF�ļ�</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾʹ��POPDF������ߴ�PDF�ļ���Ч�������������˵��������������Զ��幤���������Էֱ����أ�ͬʱ�Զ��幤�����ϵİ�ť�������͹��ܾ��ɱ�̿��ơ�</p>
                    </td>
                    <td>/POPDF</td>
                </tr>
                <tr>
                	<td><img src="images/pdf.jpg" /></td>
                    <td>����5��<a href="SaveAsPDF/WordToPDF.jsp" target="_blank">Office�ļ�ת��ΪPDF�ļ�����WordΪ����</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ��Word�ļ���ת��ΪPDF��ʽ����������Ч����</p>
                    </td>
                    <td>/SaveAsPDF</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����6��<a href="WordResWord/Word.jsp" target="_blank">��̨��̲���Word�ļ�����������</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ����ʾ��ͨ����̨��̣�ʵ�ִ��ļ�ʱ���Word�ļ����뵽ģ��ָ��λ�ã�����һ���ϲ��ĵ���Ч����</p>
                    </td>
                    <td>/WordResWord</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����7��<a href="WordResImage/Word.jsp" target="_blank">��̨��̲���ͼƬ����������</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ����ʾ��9�Ļ����������޸ģ�ʵ����ͼƬ��Word�ļ���ϲ��뵽ģ��ָ��λ�ã�����һ���ϲ��ĵ���Ч����</p>
                    </td>
                    <td>/WordResImage</td>
                </tr>
                 <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����8��<a href="WordResExcel/Word.jsp" target="_blank">��̨��̲���Excel�ļ�����������</a><span style=" color:Red;">����ҵ�棩</span>
                    <p>��ʾ������һ��ʾ���Ļ����������޸ģ�ʵ����Word��Excel�ļ���ϲ��뵽ģ��ָ��λ�ã�����һ���ϲ��ĵ���Ч����</p>
                    </td>
                    <td>/WordResExcel</td>
                </tr>
                
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����9��<a href="AddWaterMark/AddWaterMark.jsp" target="_blank">��Word�ĵ����ˮӡ</a><span style=" color:Red;">����ҵ�棩</span>
                    <p>ͨ������PageOffice.WordWriter.WaterMark ���ԣ���Word�ĵ����ˮӡ��</p>
                    </td>
                    <td>/AddWaterMark</td>
                </tr>
                
                
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����10��<a href="WordDataTag/DataTag.jsp" target="_blank">ʹ�����ݱ�ǩ��DataTag����Word�ļ�������ʽ������</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��Wordģ�������ݱ�ǩ��DataTag����ֵ�����ģ�����жദλ����Ҫͬһ���ݵ�����ʹ�����ݱ�ǩ�����ظ���Ƕദ��Ҫ���ͬһ���ݵ�λ�ã�Ȼ������ݱ�ǩ���ʵ�����ģ�������ļ���</p>
                    </td>
                    <td>/WordDataTag</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����11��<a href="DataRegionCreate/DataRegionCreate.jsp" target="_blank">��Word�ж�̬������������</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾʹ��CreateDataRegion������̬�����������Ĺ��ܡ���̬����������򣬿���������Word�ļ���ʱ������������Դӿհ׵�Word�ļ�����һ��ͼ�Ĳ�ï���ļ���������߼����ܡ�ʾ������</p>
                    </td>
                    <td>/DataRegionCreate</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����12��<a href="RunMacro/Word.jsp" target="_blank">ִ���ĵ��еĺ������WordΪ����</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>ʹ��PageOffice��RunMacro������������Office�ĵ���������ĺ����</p>
                    </td>
                    <td>/RunMacro</td>
                </tr>
                
                
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����13��<a href="FileMakerSingle/Default.jsp" target="_blank">FileMakerת�������ĵ�����WordΪ����</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾʹ��FileMaker����̬�����ļ���Ч������Ȼ�����ڿͻ��������ļ��󱣴浽�������ϵģ����ǲ��ڿͻ�����ʽ�Ĵ��ļ���</p>
                    </td>
                    <td>/FileMakerSingle</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����14��<a href="WordTable/WordTable.jsp" target="_blank">��Word�ĵ��е�Table�������в���ֵ</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ��PageOffice��Word�б��������еĹ��ܣ�ͬʱҲ��ʾ����θ���������ϲ���Ԫ��ı��������С�</p>
                    </td>
                    <td>/WordTable</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����15��<a href="WordHandDraw/Word.jsp" target="_blank">��д��ע�ӿ���ʾ</a><span style=" color:Red;">����ҵ�棩</span>
                    <p>��ʾ�����ʹ�ó��������д��ע���߿���ɫ�����š��ʴ����͵ȹ��ܡ�</p>
                    </td>
                    <td>/WordHandDraw</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����16��<a href="DataRegionTable/Default.jsp" target="_blank">��ȡWord�ļ��б�������</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ�˻�ȡWord����е����ݡ�Ҫ���ȡ����е����ݣ�ǰ���ǣ������������һ�����������ڡ�ʹ��������������OpenTable�����Ϳ��Ի�ȡ������и�����Ԫ������ݡ�</p>
                    </td>
                    <td>/DataRegionTable</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����17��<a href="DataRegionText/Default.jsp" target="_blank">�������������ı�����ʽ</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ�����ʹ�ó���������������ı�����ʽ�����������ı������塢�ֺš���ɫ�����뷽ʽ��</p>
                    </td>
                    <td>/DataRegionText</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����18��<a href="SetDrByUserWord/Default.jsp" target="_blank">���Ʋ�ͬ�û��༭Word�ĵ��в�ͬ������</a><span style=" color:Red;"></span>
                    <p>��ʾ�����ʹ�ó�����Ʋ�ͬ�û����ļ���ֻ�ܱ༭Word�ĵ��������Լ�������</p>
                    </td>
                    <td>/SetDrByUserWord</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����19��<a href="SetDrByUserWord2/Default.jsp" target="_blank">���Ʋ�ͬ�û��༭Word�ĵ��в�ͬ�����򣨿�ͬʱ�༭��</a><span style=" color:Red;">����ҵ�棩</span>
                    <p>��ʾ�����ʹ�ó�����Ʋ�ͬ�û����ļ���ֻ�ܱ༭Word�ĵ��������Լ��������ô˷��������Ļ���֧�ֶ����ͬʱ��һ���ļ��༭���Ե����������Ӱ��ġ�</p>
                    </td>
                    <td>/SetDrByUserWord2</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����20��<a href="SetHandDrawByUser/Default.jsp" target="_blank">�����û����ļ�ֻ�ܿ����Լ�����д</a><span style=" color:Red;">����ҵ�棩</span>
                    <p>��ʾ�����ʹ�ó�������û����ļ���ֻ�ܿ����Լ���д�����ݡ�ʹ��HandDraw�����ShowByUserName����������д���ݵ���ʾ�����ء�</p>
                    </td>
                    <td>/SetHandDrawByUser</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����21��<a href="MergeWordCell/Default.jsp" target="_blank">ʹ�ó���ϲ�Word�ļ��б��ĵ�Ԫ�񲢸�ֵ</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ��ʹ��MergeTo�����ϲ�Word�ļ��б���ָ����Ԫ�񣬲�����ı����ݣ��������ֵ����塢��ʽ�Ͷ��뷽ʽ��</p>
                    </td>
                    <td>/MergeWordCell</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����22��<a href="ClickDataRegion/Default.jsp" target="_blank">��Ӧ�����������¼�</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ�˻�ȡ�����������¼���ʵ�ֽ�ֹ�û�ֱ�ӱ༭������������ݡ��ô˷�������ʵ��������ѡ�����ݵĹ��ܡ�</p>
                    </td>
                    <td>/ClickDataRegion</td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>����23��<a href="MergeExcelCell/Default.jsp" target="_blank">ʹ�ó���ϲ�Excel�ĵ�Ԫ�����ø�ʽ�͸�ֵ</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ��ʹ�ó���ϲ�ָ����Excel��Ԫ�񣬲������ı���ʽ�͸�ֵ��</p>
                    </td>
                    <td>/MergeExcelCell</td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>����24��<a href="SetXlsTableByUser/Default.jsp" target="_blank">���Ʋ�ͬ�û��༭Excel�ĵ��в�ͬ������</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ�����ʹ�ó�����Ʋ�ͬ�û����ļ���ֻ�ܱ༭Excel�ĵ��������Լ�������</p>
                    </td>
                    <td>/SetXlsTableByUser</td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>����25��<a href="SetExcelCellBorder/Default.jsp" target="_blank">ʹ�ó��� �����ơ� Excel�����</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ�����ͨ����ExcelWriter�����̣���Excel�ĵ������ø�����Ԫ�������ı߿���ʽ��Ҳ��������Excel�ı������ʽ��</p>
                    </td>
                    <td>/SetExcelCellBorder</td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>����26��<a href="SetExcelCellText/Default.jsp" target="_blank">�ó�������Excel��Ԫ���ı������塢��ɫ������ͱ���ɫ</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ�����ͨ����ExcelWriter�����̣�����Excel������Ԫ���ı����������ɫ�����õ�Ԫ��Ķ��뷽ʽ�ͱ���ɫ��</p>
                    </td>
                    <td>/SetExcelCellText</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����27��<a href="DataRegionFill2/DataRegionFill.jsp" target="_blank">��Word�ĵ��е���������DataRegion����ֵ��������ʽ </a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ����һ����򵥵ĸ�Word��������ֵ��ʾ����Ԥ����Word�ĵ����ֹ�����һЩDataRegion��ͨ��PageOffice����ʵ�����ĵ��б�ǵ�λ�ô���̬������ݲ������ı�����ʽ��</p>
                    </td>
                    <td>/DataRegionFill2</td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>����28��<a href="ExcelCellClick/SubmitExcel.jsp" target="_blank">��ӦExcel��Ԫ�����¼�</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ��Excel��Ԫ�����¼���ʹ�ã�����ʵ�ֽ�ֹ�û�ֱ�ӱ༭��Ԫ�����ݵ�����£���������ѡ�����ݵĹ��ܡ�</p>
                    </td>
                    <td>/ExcelCellClick</td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>����29��<a href="ExcelFill2/ExcelFill.jsp" target="_blank">�򵥵ĸ�Excel��Ԫ��ֵ�����ı���ɫ</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ���ó����Excel��Ԫ��������ݣ��������ı�����ɫ��</p>
                    </td>
                    <td>/ExcelFill2</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����30��<a href="DataRegionEdit/Default.jsp" target="_blank">�û��Զ���ģ������������DataRegion����λ��</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ��ʹ��PageOffice��װ�õ�������������ڣ�ʵ���û��Լ��༭ģ�壬����ģ���и�����������λ�õ�Ч����</p>
                    </td>
                    <td>/DataRegionEdit</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����31��<a href="DataTagEdit/Default.jsp" target="_blank">�û��Զ���ģ�������ݱ�ǩ��DataTag����λ��</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ��ʹ��PageOffice��װ�õ����ݱ�ǩ�����ڣ�ʵ���û��Լ��༭ģ�壬����ģ���и������ݱ�ǩλ�õ�Ч����</p>
                    </td>
                    <td>/DataTagEdit</td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>����32��<a href="DefinedNameCell/ExcelFill.jsp" target="_blank">��Excelģ���ж��������Ƶĵ�Ԫ��ֵ</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>Excel������һ�����������ơ��Ĺ��ܣ����Ը�����ĵ�Ԫ����һ�����ƣ����綨��ĳ����Ԫ�������Ϊ��testA1����ʾ����ʾ�ˣ���θ��������Ϊ��testA1���ĵ�Ԫ��ֵ��</p>
                    </td>
                    <td>/DefinedNameCell</td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>����33��<a href="DefinedNameTable/Default.jsp" target="_blank">��Excelģ���ж��������Ƶ�һ������ֵ</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>Excel������һ�����������ơ��Ĺ��ܣ����Ը�ѡ�е�һ��������PageOffice�ĸ�������������Ϊһ��Table������һ�����ƣ����綨������B4:F13��������Ϊ��report����ʾ����ʾ�ˣ���θ��������Ϊ��report����Table��ֵ��</p>
                    </td>
                    <td>/DefinedNameTable</td>
                </tr>
                <tr>
                	<td><img src="images/pdf.jpg" /></td>
                    <td>����34��<a href="FileMakerPDF/Default.jsp" target="_blank">FileMakerת�������ĵ�ΪPDF����WordΪ���� </a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾʹ��FileMaker����̬���� PDF �ļ���Ч������Ȼ�����ڿͻ�������PDF�ļ��󱣴浽�������ϵģ����ǲ��ڿͻ�����ʽ�Ĵ��ļ���</p>
                    </td>
                    <td>/FileMakerPDF</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����35��<a href="WordCompare/compare.jsp" target="_blank">��ʾ�Ƚ������汾��Word�ĵ��Ĺ��� </a><span style=" color:Red;">����ҵ�棩</span>
                    <p>ʹ��PageOfficeͬʱ���ߴ������汾��Word�ĵ����л���ʾ���е�һ���ĵ�����ͬʱ��ʾ�����ĵ��Ա��ĵ����ݣ�ʵ�����ߵ��ĵ����ݱȽϹ��ܡ�</p>
                    </td>
                    <td>/WordCompare</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����36��<a href="WordTextBox/TextBoxFill.jsp" target="_blank">��Word�ı����е���������ֵ </a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��Word�ĵ����ı��������������ֵ��ʵ��������ݵ�word�ļ���ĳЩ����λ�õ�Ч����</p>
                    </td>
                    <td>/WordTextBox</td>
                </tr>
				<tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����37��<a href="WordRibbonCtrl/Word.jsp" target="_blank">����Word��Ribbon������ </a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>���ػ���ʾWord��Ribbon�������еİ�ť����塢������顣</p>
                    </td>
                    <td>/WordRibbonCtrl</td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>����38��<a href="ExcelRibbonCtrl/Excel.jsp" target="_blank">����Excel��Ribbon������ </a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>���ػ���ʾExcel��Ribbon�������еİ�ť����塢������顣</p>
                    </td>
                    <td>/ExcelRibbonCtrl</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����39��<a href="SplitWord/Word.jsp" target="_blank">���Word�ĵ��������������е����ݱ���Ϊ���ĵ�</a><span style=" color:Red;">����ҵ�棩</span>
                    <p>�����ļ�ʱ����Word�ĵ�������SubmitAsFile = true�����������е�������ȡ����������Ϊһ�����ļ���</p>
                    </td>
                    <td>/SplitWord</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����40��<a href="CommentsList/Word.jsp" target="_blank">Word�������½���ע��ʽ����ע�б�Ч��</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ�������½���ע�ķ�ʽ��ʹ��WordInsertComment�����½���ע��ʹ��RunMacro��������VBA�½���ע��ʹ��RunMacro��������VBA�ӿ�����ҳ��ʵ����ע�б��������ע�б��е���ע��������ע����ҳ��Ч����</p>
                    </td>
                    <td>/CommentsList</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����41��<a href="RevisionsList/Word.jsp" target="_blank">Word����ʾ�ۼ��б�Ч��</a>
                    <p>��ʾ�˱�����ǰ�ĵ��е����кۼ����б����ʽ��ʾ�Լ�����ۼ��б��еĺۼ��������ۼ�����ҳ��Ч����</p>
                    </td>
                    <td>/RevisionsList</td>
                </tr>
                 <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����42��<a href="HandDrawsList/Word.jsp" target="_blank">Word��ʾ��д��ע�б�Ч��</a><span style=" color:Red;">����ҵ�棩</span>
                    <p>��ʾ�˱�����ǰ�ĵ��е�������д��ע���б����ʽ��ʾ�Լ������д��ע�б��е���д��ע��������ע����ҳ��Ч����</p>
                    </td>
                    <td>/HandDrawsList</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����43��<a href="WordCreateTable/createTable.jsp" target="_blank">��Word�ĵ��ж�̬������񲢸�ֵ</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ�������Word�ĵ��ж�̬���������񲢸�ֵ��<p>
                    </td>
                    <td>/WordCreateTable</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����44��<a href="RunMacro2/Word.jsp" target="_blank">ִ���ĵ����з���ֵ�ĺ������WordΪ����</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>ʹ��PageOffice��RunMacro������������Office�ĺ��������ȡ��ķ���ֵ��</p>
                    </td>
                    <td>/RunMacro2</td>
                </tr>
                <tr>
                	<td><img src="images/pdf.jpg" /></td>
                    <td>����45��<a href="PDFSearch/PDF.jsp" target="_blank">PDF�ĵ��еĹؼ�������</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ�������PDF�ĵ����ԡ���һ�����͡���һ��������ʽ�����ؼ��֡�</p>
                    </td>
                    <td>/PDFSearch</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����46��<a href="SaveFirstPageAsImg/Word.jsp" target="_blank">����Word��ҳΪͼƬ</a><span style=" color:Red;">����ҵ�棩</span>
                    <p>��ʾ�����ʹ��js����WebSaveAsImage()������Word��ҳ����ΪͼƬ��</p>
                    </td>
                    <td>/SaveFirstPageAsImg</td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>����47��<a href="ExcelAdjustRC/Excel.jsp" target="_blank">Excelֻ��ģʽ�µ�������</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ�������Excelֻ��ģʽ�������û��ֶ�����Excel����иߺ��п�</p>
                    </td>
                    <td>/ExcelAdjustRC</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����48��<a href="WordDeleteRow/WordTable.jsp" target="_blank">ɾ��Word����е�ָ����Ԫ��������</a><span style=" color:Red;">����ҵ�棩</span>
                    <p>��ʾ�����ʹ�÷������˷���removeRowAt(cell)ɾ��Word����е�ָ����Ԫ�������С�</p>
                    </td>
                    <td>/WordDeleteRow</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����49��<a href="InsertPageBreak2/Word.jsp" target="_blank">Word��ʹ�÷������˷��������ҳ��</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ�����ʹ�÷������˷���wordDocument.insertPageBreak()�����ҳ����ʹ�ö���ĵ��ϲ�ʱ�����ĵ��ĸ�ʽ���ɱ��ֲ��䡣</p>
                    </td>
                    <td>/InsertPageBreak2</td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>����50��<a href="ExcelInsertImage/Excel.jsp" target="_blank">Excel��Ԫ���в���ͼƬ</a><span style=" color:Red;">����ҵ�棩</span>
                    <p>��ʾ�������Excelָ���ĵ�Ԫ���в���ͼƬ����Ҫ�õ��ķ����ǣ�cell.setValue("[image]image/logo.jpg[/image]")��</p>
                    </td>
                    <td>/ExcelInsertImage</td>
                </tr>
                 <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����51��<a href="WordTableSetImg/WordTable.jsp" target="_blank">Word����еĵ�Ԫ���ڲ���ͼƬ</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ���ʹ��cell.setValue("[image]doc/wang.gif[/image]")��Word����еĵ�Ԫ�����ͼƬ��</p>
                    </td>
                    <td>/WordTableSetImg</td>
                </tr>
                 <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����52��<a href="WordTableBorder/TableBorder.jsp" target="_blank">����Word������ʽ</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ���ʹ��ʹ��Border���Font������Word���ı߿���ʽ��������ʽ��</p>
                    </td>
                    <td>/WordTableBorder</td>
                </tr>
  
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����53��<a href="ExtractImage/Word.jsp" target="_blank">��ȡWord�е�ͼƬ</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ���ʹ��ʹ��Shape���ȡWord�ĵ��е�ͼƬ��</p>
                    </td>
                    <td>/ExtractImage</td>
                </tr>
            </tbody>
        </table>
        
        <br />
        <h2 style=" margin-left:300px;" id="zonghe" class="maodian">�����ۺ���ʾ</h2>
        <a style=" margin-bottom:10px; text-decoration:underline;" href="#pagetop"><img src="images/arrow_px_up.gif" />��ҳ��</a>
    	<table class="zz-talbe">
        	<thead>
            	<tr>
                	<th style="width:40px;">���� </th>
                    <th style="width:500px;">����ʾ��</th>
                    <th style="width:120px;">�ļ���</th>
                </tr>
            </thead>
            <tbody>
 
                
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����1��<a href="FileMaker/Default.jsp" target="_blank">FileMaker����ת���ĵ�����WordΪ����</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ��̬���ɶ��Word�ļ���Ч����</p>
                    </td>
                    <td>/FileMaker</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����2��<a href="ExaminationPaper/Default.jsp" target="_blank">��Word�ĵ��ж�̬����һ���Ծ�</a>
                    <p>��ʾѡ������еĲ������⣬��̬����һ���Ծ��Ч�������ʹ�ö�̬����js�ķ�ʽʵ�֣���ô���е�PageOffice�汾������֧�֣�<span style="color:Maroon;">���ʹ�ö�̬������������ķ�ʽ��ʵ�֣���̻���򵥣����Ǳ�׼�治֧�֡�</span> </p>
                    </td>
                    <td>/ExaminationPaper</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����3��<a href="http://www.zhuozhengsoft.com/down3/Java/BigDemo/worddemo.rar" >��OA���ĵ�ϵͳ���ļ���ת�е�ʹ��Ч��</a>
                    <p>���޸��޺ۼ�ģʽ����ļ��������쵼��ע�Լ������ʱ��ʹ��ǿ������ģʽ�򿪣���Ա����ʱ���ú˸�ģʽ�򿪣��������ֻ��ģʽ�򿪷�������ʽ�ļ����������쵼��ע����Ҳ��ʾ��PageOffice�ṩ����д���ܣ����ļ��˸�֮����ԼӸ�ӡ�¡�</p>
                    </td>
                    <td><p style="color:Red;">׿����վ / worddemo.rar</p></td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>����4��<a href="http://www.zhuozhengsoft.com/down3/Java/BigDemo/exceldemo.rar">��Excel�ļ���ʽ�ṩ�����ֱ༭ģʽ���༭ģʽ��ֻ��ģʽ��</a>
                    <p>��ʾ��PageOffice�򿪱༭����Excel�ļ���Ч����������Excel����дȦ�ĺ͸��µ�Ч����</p>
                    </td>
                    <td><p style="color:Red;">׿����վ / exceldemo.rar</p></td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����5��<a href="http://www.zhuozhengsoft.com/down3/Java/BigDemo/poword.rar">�����ʾ��</a>
                    <p>��ʾ��PageOffice��Wordģ����������������ʽ�ļ�Ч����ͬʱ��ʾ�˴�Word�ļ��л�ȡ�����ύ���������˱��浽���ݿ��е�Ч����ͬʱ�����Կ���PageOffice��Word�ļ��пɱ༭����Ŀ���Ч�����������Կ�����Щ������Ա༭�������Կ�����Щ����ֻ����ѡ��ķ�ʽѡ��ָ�����������޸����ݡ�</p>
                    </td>
                    <td><p style="color:Red;">׿����վ / poword.rar</p></td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>����6��<a href="http://www.zhuozhengsoft.com/down3/Java/BigDemo/poexcel.rar">ģ����һ�����׵Ķ���ϵͳ</a>
                    <p>��ʾ��PageOffice��Excelģ��������������Excel�ļ�����ʾ�˻�ȡExcel����е����ݱ��浽���ݿ⣬��ʾ����PageOffice������ݿ����ݵ�Excel����ģ������Excel������ʾ����䲻�������ݵ�ģ���������Զ�����Ч����</p>
                    </td>
                    <td><p style="color:Red;">׿����վ / poexcel.rar</p></td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����7��<a href="WordParagraph/Word.jsp" target="_blank">��ȫ���ʵ�ֶ�̬����Word�ļ�</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ��ʹ��PageOffice.WordWriter�����ռ����ṩ���࣬�ô������̵ķ�ʽ��һ���հ׵�Word�ļ�������һ��ͼ�Ĳ�ï���ı������ʽ�������úõ�Word�ĵ���</p>
                    </td>
                    <td>/WordParagraph</td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>����8��<a href="DrawExcel/Excel.jsp" target="_blank">��ȫ���ʵ�ֶ�̬����Excel�ļ�</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ��ʹ��PageOffice.ExcelWriter�����ռ����ṩ���࣬�ô������̵ķ�ʽ��һ���հ׵�Excel�ļ��С����ơ�һ�������˸��ӹ�ʽ�ġ�����ߺ��ı���ɫ��ȫ����Ԫ���ʽ��������������ݵ�Excel��</p>
                    </td>
                    <td>/DrawExcel</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����9��<a href="TaoHong/index.jsp" target="_blank">ʹ��PageOfficeʵ��ģ���׺�</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ��ʹ��PageOffice��������书��ʵ��Word�ļ��׺��Ч����</p>
                    </td>
                    <td>/TaoHong</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����10��<a href="WordSalaryBill/index.jsp" target="_blank">����Word���ģ�嶯̬���ɹ�����</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ�˲���Word�ļ������Word������ݡ��ϲ�Word�ļ���ѭ��������ȹ��ܡ�</p>
                    </td>
                    <td>/WordSalaryBill</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����11��<a href="http://www.zhuozhengsoft.com/down3/Java/BigDemo/huiqiandan.rar" >����ǩ����Ч��</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ��ʹ������������Ʋ�ͬ�û��༭��ͬ����ʵ�ֻ�ǩ����Ч����</p>
                    </td>
                    <td><p style="color:Red;">/׿����վ / huiqiandan.rar</p></td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����12��<a href="http://www.zhuozhengsoft.com/down3/Java/BigDemo/TemplateEdit.rar">ʵ�֡��û��Զ���Wordģ�塱��̬�����ļ�</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ�����ͨ���û��Զ���ģ��ʵ�ָ����Ķ�̬�������Word�ĵ���</p>
                    </td>
                    <td><p style="color:Red;">/׿����վ / TemplateEdit.rar</p></td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����13��<a href="PrintFiles/Default.jsp" target="_blank">FileMaker�������ɲ���ӡ�ļ�����WordΪ����</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ��̬���ɶ��Word�ļ���������ӡ��Ч�������ֻ��Ҫ������ӡ����Ҳ���Բο���ʾ����</p>
                    </td>
                    <td>/PrintFiles</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����14��<a href="SaveAndSearch/FileManage.jsp" target="_blank">ȫ�����������ؼ��ֵ�Word�ĵ�</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ���ȫ�����������ؼ��ֵ�Word�ĵ������Ҵ��ĵ��������ʾ�ؼ��֡�</p>
                    </td>
                    <td>/SaveAndSearch</td>
                </tr>
              <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>����15��<a href="FileMakerConvertPDFs/index.jsp" target="_blank">Word����ת����PDF�ļ�</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾ���ʹ��ʹ��FileMakerCtrl�������ת��Word�ļ�ΪPDF�ļ���</p>
                    </td>
                    <td>/FileMakerConvertPDFs</td>
                </tr>
            </tbody>
        </table>
        
        <br />
        <h2 style=" margin-left:300px;" id="jiqiao" class="maodian">�ġ���������</h2>
        <a style=" margin-bottom:10px; text-decoration:underline;" href="#pagetop"><img src="images/arrow_px_up.gif" />��ҳ��</a>
    	<table class="zz-talbe">
        	<thead>
            	<tr>
                	<th style="width:40px;">���� </th>
                    <th style="width:500px;">����ʾ��</th>
                    <th style="width:120px;">�ļ���</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>�ġ�1��<a href="DeleteRow/DeleteRow.jsp" target="_blank">js ɾ��Word����й��������</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾʹ��js����Office��VBA�ӿ�ɾ��Word�����һ�е�Ԫ���Ч����</p>
                    </td>
                    <td>/DeleteRow</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>�ġ�2��<a href="HiddenRulars/Word.jsp" target="_blank">��ʾ/����Word�ļ��еı��</a>
                    <p>��ʾʹ��js����Office��VBA�ӿ�����Word��ߵ�Ч����</p>
                    </td>
                    <td>/HiddenRulars</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>�ġ�3��<a href="WordAddBKMK/WordAddBKMK.jsp" target="_blank">��Word��ǰ��괦������ǩ</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾʹ��js����Office��VBA�ӿ����ļ��в�����ǩ�Ĺ��ܡ�</p>
                    </td>
                    <td>/WordAddBKMK</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>�ġ�4��<a href="WordLocateBKMK/Word.jsp" target="_blank">js ��λ��굽��ǩ</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾʹ��js����Office��VBA�ӿڣ���λ��굽��ǩ����λ�ã�һ���������ʵ�ָ����Զ���ָ��λ�õ�Ч����</p>
                    </td>
                    <td>/WordLocateBKMK</td>
                </tr>
                 <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>�ġ�5��<a href="WordHyperLink/Word.jsp" target="_blank">Word �в��볬�ı�����url</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾʹ��js����Office��VBA�ӿڣ���Word�в��볬����Ч����</p>
                    </td>
                    <td>/WordHyperLink</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>�ġ�6��<a href="WordMergeCell/Word.jsp" target="_blank">js�ϲ�Word��Ԫ��</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾʹ��js����Office��VBA�ӿڣ�ʵ�ֶ�Word�е�Ԫ��ĺϲ�������</p>
                    </td>
                    <td>/WordMergeCell</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>�ġ�7��<a href="WordGetSelection/Word.jsp" target="_blank">js��ȡWordѡ�е�����</a>
                    <p>��ʾʹ��js����Office��VBA�ӿڣ���ȡ���ļ���Ŀǰѡ�е��ı����ݡ�</p>
                    </td>
                    <td>/WordGetSelection</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>�ġ�8��<a href="WordGoToPage/Word.jsp" target="_blank">jsʵ��Word��ת��ָ��ҳ��</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾʹ��js����Office��VBA�ӿڣ�ʵ����ת��Word�ĵ���ָ��ҳ��ͻ�ȡ�ĵ���ҳ����</p>
                    </td>
                    <td>/WordGoToPage</td>
                </tr>
                <tr>
                	<td><img src="images/office-2.png" /></td>
                    <td>�ġ�9��<a href="JsOpXlsCellText/Excel.jsp" target="_blank">js��ȡ������Excel��Ԫ���ֵ</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾʹ��js����Office��VBA�ӿڣ�ʵ�ֻ�ȡ������Excel�ĵ���ָ����Ԫ���ֵ��</p>
                    </td>
                    <td>/JsOpXlsCellText</td>
                </tr>
                 <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>�ġ�10��<a href="InsertPageBreak/Word.jsp" target="_blank">jsʵ����Word��괦�����ҳ��</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾʹ��js����Office��VBA�ӿڣ�ʵ����Word�ĵ���괦�����ҳ����</p>
                    </td>
                    <td>/InsertPageBreak</td>
                </tr>
                <tr>
                	<td><img src="images/office-1.png" /></td>
                    <td>�ġ�11��<a href="WordDelBKMK/Word.jsp" target="_blank">ɾ��Word�ĵ���ѡ���ı������е���ǩ</a><span style=" color:Red;">��רҵ�桢��ҵ�棩</span>
                    <p>��ʾʹ��js����Office��VBA�ӿڣ�ɾ��Word�ĵ���ѡ���ı������е���ǩ��</p>
                    </td>
                    <td>/WordDelBKMK</td>
                </tr>
            </tbody>
        </table>
     </div>
</div>
<!--content end-->
<br /><br /><br />
<!--footer-->
<div class="login-footer clearfix">Copyright &copy; 2013 ����׿��־Զ������޹�˾</div>
<!--footer end-->

<div id="menubar"  >
    <br />
    <div style=" font-size:16px; font-weight:bold; color:#aaa;padding-left:20px;  "> [Ŀ¼] </div>
    <ul>    
        <li id="p0" class="menuli">һ��<a href="#jichu" class="off">��������</a></li>
        <li id="p1" class="menuli">����<a href="#gaoji" class="off">�߼�����</a></li>
        <li id="p2" class="menuli">����<a href="#zonghe" class="off">�ۺ���ʾ</a></li>
        <li id="p3" class="menuli">�ġ�<a href="#jiqiao" class="off">��������</a></li>
        <li id="p4" class="menuli">�塢<a href="http://www.zhuozhengsoft.com/download.html" class="off" target="_blank">����ʾ��</a></li>
    </ul>
</div>

<script type="text/javascript">

    function getIE(e) {
        var t = e.offsetTop;
        var l = e.offsetLeft;
        while (e = e.offsetParent) {
            t += e.offsetTop;
            l += e.offsetLeft;
        }
        //document.getElementById("menubar").innerHTML = "l=" + l;
        return l;
    }

    function setMenuBarPos2() {
        if (isIE = navigator.userAgent.indexOf("MSIE") != -1) {
            document.getElementById("menubar").style.left = getIE(document.getElementById("maoDiv")) + 710 - document.documentElement.scrollLeft + "px";
        }
        else {
            document.getElementById("menubar").style.left = getIE(document.getElementById("maoDiv")) + 710 - document.body.scrollLeft + "px";
        }
    }
    
    //���غ�����һ��
    setMenuBarPos2();
    
    window.onresize = function() {
        setMenuBarPos2();
    }
    window.onscroll = function() {
        setMenuBarPos2();
    }
</script>

<script type="text/javascript">
    $(function() {
        //���ض���
        $('.home').click(function() {
            $("html,body").animate({ scrollTop: 0 }, 1000);
            return false;
        })

        //����ê��
        var mds = $(".maodian");
        var arrMd = [];
        for (var i = 0, len = mds.length; i < len; i++) {
            arrMd.push($(mds[i]));

        }

        function update() {
            var scrollH = $(window).scrollTop();
            for (var i = 0; i < len; i++) {
                var mdHeight = arrMd[i].offset().top;
                if (mdHeight-50 < scrollH) {
                    navon(i); 
                }
            }
        }

        //���������˵�
        function navon(id) {
            $('.menuli').removeClass('on');
            $('.menuli a').removeClass('on');
            $('.menuli a').addClass('off');
            $('#p' + id).addClass('on');
            $('#p' + id + " a").addClass('on');
        }

        //�󶨹����¼�
        $(window).bind('scroll', update);
    })
</script>
</body>
</html>

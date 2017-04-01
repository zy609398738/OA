<%@ page language="java"
	import="java.util.*,java.awt.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*"
	pageEncoding="gb2312"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po"%>
<%
	//******************************׿��PageOffice�����ʹ��*******************************
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	poCtrl1.setServerPage(request.getContextPath()+"/poserver.zz"); //���б���

	WordDocument doc = new WordDocument();

	//�������ݱ���

	//����DataRegion����PO_titleΪ�Զ���ӵ���ǩ����,��ǩ�������ԡ�PO_��Ϊǰ׺������ǩ���Ʋ����ظ�
	//���������ֱ�ΪҪ�²�����ǩ�����ơ�����ǩ�Ĳ���λ�á����������ǩ���ƣ���[home]������Word�ĵ��ĵ�һ��λ�ã�
	DataRegion title = doc.createDataRegion("PO_title",
			DataRegionInsertType.After, "[home]");
	//��DataRegion����ֵ
	title.setValue("C#��Socket���̱߳��ʵ��\n");
	//�������壺��ϸ����С���������ơ��Ƿ���б��
	title.getFont().setBold(true);
	title.getFont().setSize(20);
	title.getFont().setName("����");
	title.getFont().setItalic(false);
	//����������
	ParagraphFormat titlePara = title.getParagraphFormat();
	//���ö�����뷽ʽ
	titlePara.setAlignment(WdParagraphAlignment.wdAlignParagraphCenter);
	//���ö����м��
	titlePara.setLineSpacingRule(WdLineSpacing.wdLineSpaceMultiple);

	//��������
	//��һ��
	//����DataRegion����PO_bodyΪ�Զ���ӵ���ǩ����
	DataRegion body = doc.createDataRegion("PO_body",
			DataRegionInsertType.After, "PO_title");
	//�������壺��ϸ���Ƿ���б�塢��С���������ơ�������ɫ
	body.getFont().setBold(false);
	body.getFont().setItalic(true);
	body.getFont().setSize(10);
	//����������������
	body.getFont().setName("����");
	//����Ӣ����������
	body.getFont().setName("Times New Roman");
	body.getFont().setColor(Color.RED);
	//��DataRegion����ֵ
	body
			.setValue("��΢������VS.net���Ƴ���һ�����ԡ�����Ϊһ�����˵����ԣ�����C++��ǿ����������VB�ȵ�RAD���ԡ����ң�΢���Ƴ�C#��Ҫ��Ŀ����Ϊ�˶Կ�Sun��˾��Java����Ҷ�֪��Java���Ե�ǿ���ܣ������������̷��档���ǣ�C#�������̷���Ҳ��Ȼ����������ˡ����ľ����ҽ���һ��C#��ʵ���׽��֣�Sockets����̵�һЩ����֪ʶ��������ʹ��ҶԴ��и������˽⡣���ȣ������ҽ���һ���׽��ֵĸ��\n");
	//����ParagraphFormat����
	ParagraphFormat bodyPara = body.getParagraphFormat();
	//���ö�����м�ࡢ���뷽ʽ����������
	bodyPara.setLineSpacingRule(WdLineSpacing.wdLineSpaceAtLeast);
	bodyPara.setAlignment(WdParagraphAlignment.wdAlignParagraphLeft);
	bodyPara.setFirstLineIndent(21);

	//�ڶ���
	DataRegion body2 = doc.createDataRegion("PO_body2",
			DataRegionInsertType.After, "PO_body");
	body2.getFont().setBold(false);
	body2.getFont().setSize(12);
	body2.getFont().setName("����");
	body2
			.setValue("�׽�����ͨ�ŵĻ�ʯ����֧��TCP/IPЭ�������ͨ�ŵĻ���������Ԫ�����Խ��׽��ֿ�����ͬ������Ľ��̽���˫��ͨ�ŵĶ˵㣬�������˵��������ڼ����������ı�̽��档�׽��ִ�����ͨ�����У�ͨ������Ϊ�˴���һ����߳�ͨ���׽���ͨ�Ŷ�������һ�ֳ������׽���ͨ����ͬһ�����е��׽��ֽ������ݣ����ݽ���Ҳ���ܴ�Խ��Ľ��ޣ�����ʱһ��Ҫִ��ĳ�ֽ��ͳ��򣩡����ֽ���ʹ�������ͬ������֮����InternetЭ���������ͨ�š�\n");
	//body2.setValue("[image]../images/logo.jpg[/image]");
	ParagraphFormat bodyPara2 = body2.getParagraphFormat();
	bodyPara2.setLineSpacingRule(WdLineSpacing.wdLineSpace1pt5);
	bodyPara2.setAlignment(WdParagraphAlignment.wdAlignParagraphLeft);
	bodyPara2.setFirstLineIndent(21);

	//������
	DataRegion body3 = doc.createDataRegion("PO_body3",
			DataRegionInsertType.After, "PO_body2");
	body3.getFont().setBold(false);
	body3.getFont().setColor(Color.getHSBColor(0, 128, 228));
	body3.getFont().setSize(14);
	body3.getFont().setName("���Ĳ���");
	body3
			.setValue("�׽��ֿ��Ը���ͨ�����ʷ��࣬�������ʶ����û��ǿɼ��ġ�Ӧ�ó���һ�����ͬһ����׽��ּ����ͨ�š�����ֻҪ�ײ��ͨ��Э��������ͬ���͵��׽��ּ�Ҳ��������ͨ�š��׽��������ֲ�ͬ�����ͣ����׽��ֺ����ݱ��׽��֡�\n");
	ParagraphFormat bodyPara3 = body3.getParagraphFormat();
	bodyPara3.setLineSpacingRule(WdLineSpacing.wdLineSpaceDouble);
	bodyPara3.setAlignment(WdParagraphAlignment.wdAlignParagraphLeft);
	bodyPara3.setFirstLineIndent(21);

	DataRegion body4 = doc.createDataRegion("PO_body4",
			DataRegionInsertType.After, "PO_body3");
	body4.setValue("[image]../images/logo.png[/image]");
	//body4.setValue("[word]doc/1.doc[/word]");//����Ƕ������Word�ļ�
	ParagraphFormat bodyPara4 = body4.getParagraphFormat();
	bodyPara4.setAlignment(WdParagraphAlignment.wdAlignParagraphCenter);

	poCtrl1.setWriter(doc);
	//����ҳ�汣���ִ�е�JS����
	poCtrl1.setJsFunction_AfterDocumentSaved("SaveOK()");

	//���ز˵���
	poCtrl1.setMenubar(false);
	//����Զ��尴ť
	poCtrl1.addCustomToolButton("����", "Save()", 1);
	poCtrl1.webOpen("doc/template.doc", OpenModeType.docNormalEdit,
			"����");
	poCtrl1.setTagId("PageOfficeCtrl1"); //���б���
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title></title>
	</head>
	<body>
		<script type="text/javascript">
	function SaveOK() {
		alert("�ļ��Ѿ����浽 1.doc");
	}
</script>
		<form id="form1">
			<div style="width: auto; height: 700px;">
				<po:PageOfficeCtrl id ="PageOfficeCtrl1">
				</po:PageOfficeCtrl>
			</div>
		</form>
	</body>
</html>

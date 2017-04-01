<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<title></title>
		<script type="text/javascript">
	
			var ISEDITOR = '<%=request.getParameter("isEditor")%>';
			
			var BILLKEY = '<%=request.getParameter("billKey")%>';
			
			var BILLID = '<%=request.getParameter("billID")%>';
			
			var DOCNAME = '<%=request.getParameter("fileName")%>';
			
		</script>
		<script type="text/javascript" language="javascript" src="js/jquery-1.8.2.min.js" ></script>
		<script type="text/javascript" language="javascript" src="js/office.js"></script>
		<script language="JavaScript" for=TANGER_OCX event="OnCustomButtonOnMenuCmd(btnPos,btnCaption,btnCmdId)">
			if (TANGER_OCX_OBJ.doctype == 1 || TANGER_OCX_OBJ.doctype == 6) {
				if (btnCmdId == 0) {
					MAP_Office.saveFileToURL();
				} else if (btnCmdId == 1) {
					TANGER_OCX_OBJ.ActiveDocument.Application.Dialogs(168).Show();
				} else if (btnCmdId == 2) {
					MAP_Office.replaceText();
				} else if (btnCmdId == 3) {
					//MAP_Office.doTaoHong();
				} else if (btnCmdId == 4) {
					TANGER_OCX_OBJ.ActiveDocument.ShowRevisions = true;
				} else if (btnCmdId == 5) {
					TANGER_OCX_OBJ.ActiveDocument.ShowRevisions = false;
				} else if (btnCmdId == 6) {
					MAP_Office.saveFileToURLAndClose();
				}
			} else {
				TANGER_OCX_OBJ.ShowTipMessage('提示','此功能只支持在word中使用，谢谢！！！',false);	
			}
		</script>
		<script language="JavaScript" for=TANGER_OCX event="OnCustomMenuCmd2(menuPos,submenuPos,subsubmenuPos,menuCaption,menuID)">
			MAP_Office.doTaoHong(MAP_C_SERVER_URL + '/ext/oa/workflow/template/' + menuCaption);
		</script>
		<script language="JavaScript" for=TANGER_OCX event="OnDocumentOpened(TANGER_OCX_str,TANGER_OCX_obj)">
			MAP_Office.addSaveIcon();
			MAP_Office.addTaoHong();
		</script>
	</head>
	<body style = "margin:0 0;border:0;z-index:1" onload="MAP_Office.load()">
		<script type="text/javascript" src="js/ntkoofficecontrol.js"></script>
	</body>
</html>
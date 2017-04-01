<%@page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html dir="ltr">
	<head>
    	<meta charset="utf-8">
    	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	    <meta name="google" content="notranslate">
	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	    <title>在线预览</title>
	    <link rel="stylesheet" href="web/viewer.css">
	    <script type="text/javascript" src='common/jquery/jquery-1.10.2.js'></script>
	    <script src="web/pdf.js"></script>
	    <script src="web/l10n.js"></script>
     	<script src="web/viewer.js"></script>
     	<script src="web/pdf.worker.js"></script>
	    <script type="text/javascript">
		   	var BASE64_MARKER = ';base64,';
		   	var DEFAULT_URL = "web/test.pdf";
		   	$(document).ready(function(){
		    	var paras = {};
		    	paras.service = "PDFService";
		    	paras.cmd = "Print";
		    	paras.OID = 15391;
		    	paras.formKey = "POrder";
		    	var success = function(data) {
		    		var pdfAsDataUrl = data;
		   			
		   			var pdfAsArray = covent(pdfAsDataUrl);
		   			DEFAULT_URL = pdfAsArray;
		    	};
		    	var json = Svr.Request.getPDFData(Svr.SvrMgr.ServletURL, paras, success);
		   	})
		   	function covent(dataURL){/* 
			   	var base64Index = dataURL.indexOf(BASE64_MARKER)+BASE64_MARKER.length;
			   	var base64 = dataURL.substring(base64Index); */
			   	/* 
			   	var raw = dataURL;
			   	var raw = decodeURIComponent(escape(window.atob(dataURL)));*/
			   	var raw = window.atob(dataURL);
			   	var rawLength = raw.length;
			   	var array = new Uint8Array(new ArrayBuffer(rawLength));
			   	for(var i = 0;i<rawLength;i++){
			   		array[i] = raw.charCodeAt(i);
			   	}
			   	return array;
		   	}
     	</script>
  	</head>

  <body tabindex="1" class="loadingInProgress" >

    <div id="outerContainer">

      <div id="sidebarContainer">
        <div id="toolbarSidebar">
          <div class="splitToolbarButton toggled">
            <button id="viewThumbnail" class="toolbarButton group toggled" title="Show Thumbnails" tabindex="2" data-l10n-id="thumbs">
               <span data-l10n-id="thumbs_label">Thumbnails</span>
            </button>
            <button id="viewOutline" class="toolbarButton group" title="Show Document Outline" tabindex="3" data-l10n-id="outline">
               <span data-l10n-id="outline_label">Document Outline</span>
            </button>
            <button id="viewAttachments" class="toolbarButton group" title="Show Attachments" tabindex="4" data-l10n-id="attachments">
               <span data-l10n-id="attachments_label">Attachments</span>
            </button>
          </div>
        </div>
        <div id="sidebarContent">
          <div id="thumbnailView">
          </div>
          <div id="outlineView" class="hidden">
          </div>
          <div id="attachmentsView" class="hidden">
          </div>
        </div>
      </div>  

      <div id="mainContainer">
        <div class="findbar hidden doorHanger hiddenSmallView" id="findbar">
          <label for="findInput" class="toolbarLabel" data-l10n-id="find_label">Find:</label>
          <input id="findInput" class="toolbarField" tabindex="91">
          <div class="splitToolbarButton">
            <button class="toolbarButton findPrevious" title="" id="findPrevious" tabindex="92" data-l10n-id="find_previous">
              <span data-l10n-id="find_previous_label">Previous</span>
            </button>
            <div class="splitToolbarButtonSeparator"></div>
            <button class="toolbarButton findNext" title="" id="findNext" tabindex="93" data-l10n-id="find_next">
              <span data-l10n-id="find_next_label">Next</span>
            </button>
          </div>
          <input type="checkbox" id="findHighlightAll" class="toolbarField" tabindex="94">
          <label for="findHighlightAll" class="toolbarLabel" data-l10n-id="find_highlight">Highlight all</label>
          <input type="checkbox" id="findMatchCase" class="toolbarField" tabindex="95">
          <label for="findMatchCase" class="toolbarLabel" data-l10n-id="find_match_case_label">Match case</label>
          <span id="findResultsCount" class="toolbarLabel hidden"></span>
          <span id="findMsg" class="toolbarLabel"></span>
        </div>  <!-- findbar -->

        <div id="secondaryToolbar" class="secondaryToolbar hidden doorHangerRight">
          <div id="secondaryToolbarButtonContainer">
            <button id="secondaryPresentationMode" class="secondaryToolbarButton presentationMode visibleLargeView" title="Switch to Presentation Mode" tabindex="51" data-l10n-id="presentation_mode">
              <span data-l10n-id="presentation_mode_label">Presentation Mode</span>
            </button>

            <button id="secondaryOpenFile" class="secondaryToolbarButton openFile visibleLargeView" title="Open File" tabindex="52" data-l10n-id="open_file">
              <span data-l10n-id="open_file_label">Open</span>
            </button>

            <button id="secondaryPrint" class="secondaryToolbarButton print visibleMediumView" title="Print" tabindex="53" data-l10n-id="print">
              <span data-l10n-id="print_label">Print</span>
            </button>

            <button id="secondaryDownload" class="secondaryToolbarButton download visibleMediumView" title="Download" tabindex="54" data-l10n-id="download">
              <span data-l10n-id="download_label">Download</span>
            </button>

            <a href="#" id="secondaryViewBookmark" class="secondaryToolbarButton bookmark visibleSmallView" title="Current view (copy or open in new window)" tabindex="55" data-l10n-id="bookmark">
              <span data-l10n-id="bookmark_label">Current View</span>
            </a>

            <div class="horizontalToolbarSeparator visibleLargeView"></div>

            <button id="firstPage" class="secondaryToolbarButton firstPage" title="Go to First Page" tabindex="56" data-l10n-id="first_page">
              <span data-l10n-id="first_page_label">Go to First Page</span>
            </button>
            <button id="lastPage" class="secondaryToolbarButton lastPage" title="Go to Last Page" tabindex="57" data-l10n-id="last_page">
              <span data-l10n-id="last_page_label">Go to Last Page</span>
            </button>

            <div class="horizontalToolbarSeparator"></div>

            <button id="pageRotateCw" class="secondaryToolbarButton rotateCw" title="Rotate Clockwise" tabindex="58" data-l10n-id="page_rotate_cw">
              <span data-l10n-id="page_rotate_cw_label">Rotate Clockwise</span>
            </button>
            <button id="pageRotateCcw" class="secondaryToolbarButton rotateCcw" title="Rotate Counterclockwise" tabindex="59" data-l10n-id="page_rotate_ccw">
              <span data-l10n-id="page_rotate_ccw_label">Rotate Counterclockwise</span>
            </button>

            <div class="horizontalToolbarSeparator"></div>

            <button id="toggleHandTool" class="secondaryToolbarButton handTool" title="Enable hand tool" tabindex="60" data-l10n-id="hand_tool_enable">
              <span data-l10n-id="hand_tool_enable_label">Enable hand tool</span>
            </button>

            <div class="horizontalToolbarSeparator"></div>

            <button id="documentProperties" class="secondaryToolbarButton documentProperties" title="Document Properties…" tabindex="61" data-l10n-id="document_properties">
              <span data-l10n-id="document_properties_label">Document Properties…</span>
            </button>
          </div>
        </div>  <!-- secondaryToolbar -->

        <div class="toolbar">
          <div id="toolbarContainer">
            <div id="toolbarViewer">
              <div id="toolbarViewerLeft">
                <button id="sidebarToggle" class="toolbarButton" title="Toggle Sidebar" tabindex="11" data-l10n-id="toggle_sidebar">
                  <span data-l10n-id="toggle_sidebar_label">Toggle Sidebar</span>
                </button>
                <div class="toolbarButtonSpacer"></div>
                <button id="viewFind" class="toolbarButton group hiddenSmallView" title="Find in Document" tabindex="12" data-l10n-id="findbar">
                   <span data-l10n-id="findbar_label">Find</span>
                </button>
                <div class="splitToolbarButton">
                  <button class="toolbarButton pageUp" title="Previous Page" id="previous" tabindex="13" data-l10n-id="previous">
                    <span data-l10n-id="previous_label">Previous</span>
                  </button>
                  <div class="splitToolbarButtonSeparator"></div>
                  <button class="toolbarButton pageDown" title="Next Page" id="next" tabindex="14" data-l10n-id="next">
                    <span data-l10n-id="next_label">Next</span>
                  </button>
                </div>
                <label id="pageNumberLabel" class="toolbarLabel" for="pageNumber" data-l10n-id="page_label">Page: </label>
                <input type="number" id="pageNumber" class="toolbarField pageNumber" value="1" size="4" min="1" tabindex="15">
                <span id="numPages" class="toolbarLabel"></span>
              </div>
              <div id="toolbarViewerRight">
                <button id="presentationMode" class="toolbarButton presentationMode hiddenLargeView" title="Switch to Presentation Mode" tabindex="31" data-l10n-id="presentation_mode">
                  <span data-l10n-id="presentation_mode_label">Presentation Mode</span>
                </button>

                <button id="openFile" class="toolbarButton openFile hiddenLargeView" title="Open File" tabindex="32" data-l10n-id="open_file">
                  <span data-l10n-id="open_file_label">Open</span>
                </button>

                <button id="print" class="toolbarButton print hiddenMediumView" title="Print" tabindex="33" data-l10n-id="print">
                  <span data-l10n-id="print_label">Print</span>
                </button>

                <button id="download" class="toolbarButton download hiddenMediumView" title="Download" tabindex="34" data-l10n-id="download">
                  <span data-l10n-id="download_label">Download</span>
                </button>
                <a href="#" id="viewBookmark" class="toolbarButton bookmark hiddenSmallView" title="Current view (copy or open in new window)" tabindex="35" data-l10n-id="bookmark">
                  <span data-l10n-id="bookmark_label">Current View</span>
                </a>

                <div class="verticalToolbarSeparator hiddenSmallView"></div>

                <button id="secondaryToolbarToggle" class="toolbarButton" title="Tools" tabindex="36" data-l10n-id="tools">
                  <span data-l10n-id="tools_label">Tools</span>
                </button>
              </div>
              <div class="outerCenter">
                <div class="innerCenter" id="toolbarViewerMiddle">
                  <div class="splitToolbarButton">
                    <button id="zoomOut" class="toolbarButton zoomOut" title="Zoom Out" tabindex="21" data-l10n-id="zoom_out">
                      <span data-l10n-id="zoom_out_label">Zoom Out</span>
                    </button>
                    <div class="splitToolbarButtonSeparator"></div>
                    <button id="zoomIn" class="toolbarButton zoomIn" title="Zoom In" tabindex="22" data-l10n-id="zoom_in">
                      <span data-l10n-id="zoom_in_label">Zoom In</span>
                     </button>
                  </div>
                  <span id="scaleSelectContainer" class="dropdownToolbarButton">
                     <select id="scaleSelect" title="Zoom" tabindex="23" data-l10n-id="zoom">
                      <option id="pageAutoOption" title="" value="auto" selected="selected" data-l10n-id="page_scale_auto">Automatic Zoom</option>
                      <option id="pageActualOption" title="" value="page-actual" data-l10n-id="page_scale_actual">Actual Size</option>
                      <option id="pageFitOption" title="" value="page-fit" data-l10n-id="page_scale_fit">Fit Page</option>
                      <option id="pageWidthOption" title="" value="page-width" data-l10n-id="page_scale_width">Full Width</option>
                      <option id="customScaleOption" title="" value="custom"></option>
                      <option title="" value="0.5" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 50 }'>50%</option>
                      <option title="" value="0.75" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 75 }'>75%</option>
                      <option title="" value="1" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 100 }'>100%</option>
                      <option title="" value="1.25" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 125 }'>125%</option>
                      <option title="" value="1.5" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 150 }'>150%</option>
                      <option title="" value="2" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 200 }'>200%</option>
                      <option title="" value="3" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 300 }'>300%</option>
                      <option title="" value="4" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 400 }'>400%</option>
                    </select>
                  </span>
                </div>
              </div>
            </div>
            <div id="loadingBar">
              <div class="progress">
                <div class="glimmer">
                </div>
              </div>
            </div>
          </div>
        </div>

        <menu type="context" id="viewerContextMenu">
          <menuitem id="contextFirstPage" label="First Page"
                    data-l10n-id="first_page"></menuitem>
          <menuitem id="contextLastPage" label="Last Page"
                    data-l10n-id="last_page"></menuitem>
          <menuitem id="contextPageRotateCw" label="Rotate Clockwise"
                    data-l10n-id="page_rotate_cw"></menuitem>
          <menuitem id="contextPageRotateCcw" label="Rotate Counter-Clockwise"
                    data-l10n-id="page_rotate_ccw"></menuitem>
        </menu>
        <!-- startprint -->
        <div id="viewerContainer" tabindex="0">
          <div id="viewer" class="pdfViewer"></div>
        </div>
       <!-- endprint -->
        <div id="errorWrapper" hidden='true'>
          <div id="errorMessageLeft">
            <span id="errorMessage"></span>
            <button id="errorShowMore" data-l10n-id="error_more_info">
              More Information
            </button>
            <button id="errorShowLess" data-l10n-id="error_less_info" hidden='true'>
              Less Information
            </button>
          </div>
          <div id="errorMessageRight">
            <button id="errorClose" data-l10n-id="error_close">
              Close
            </button>
          </div>
          <div class="clearBoth"></div>
          <textarea id="errorMoreInfo" hidden='true' readonly="readonly"></textarea>
        </div>
      </div> <!-- mainContainer -->

      <div id="overlayContainer" class="hidden">
        <div id="passwordOverlay" class="container hidden">
          <div class="dialog">
            <div class="row">
              <p id="passwordText" data-l10n-id="password_label">Enter the password to open this PDF file:</p>
            </div>
            <div class="row">
              <!-- The type="password" attribute is set via script, to prevent warnings in Firefox for all http:// documents. -->
              <input id="password" class="toolbarField">
            </div>
            <div class="buttonRow">
              <button id="passwordCancel" class="overlayButton"><span data-l10n-id="password_cancel">Cancel</span></button>
              <button id="passwordSubmit" class="overlayButton"><span data-l10n-id="password_ok">OK</span></button>
            </div>
          </div>
        </div>
        <div id="documentPropertiesOverlay" class="container hidden">
          <div class="dialog">
            <div class="row">
              <span data-l10n-id="document_properties_file_name">File name:</span> <p id="fileNameField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_file_size">File size:</span> <p id="fileSizeField">-</p>
            </div>
            <div class="separator"></div>
            <div class="row">
              <span data-l10n-id="document_properties_title">Title:</span> <p id="titleField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_author">Author:</span> <p id="authorField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_subject">Subject:</span> <p id="subjectField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_keywords">Keywords:</span> <p id="keywordsField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_creation_date">Creation Date:</span> <p id="creationDateField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_modification_date">Modification Date:</span> <p id="modificationDateField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_creator">Creator:</span> <p id="creatorField">-</p>
            </div>
            <div class="separator"></div>
            <div class="row">
              <span data-l10n-id="document_properties_producer">PDF Producer:</span> <p id="producerField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_version">PDF Version:</span> <p id="versionField">-</p>
            </div>
            <div class="row">
              <span data-l10n-id="document_properties_page_count">Page Count:</span> <p id="pageCountField">-</p>
            </div>
            <div class="buttonRow">
              <button id="documentPropertiesClose" class="overlayButton"><span data-l10n-id="document_properties_close">Close</span></button>
            </div>
          </div>
        </div>
      </div>  <!-- overlayContainer -->

    </div> <!-- outerContainer -->
   
    <div id="printContainer"></div>
<div id="mozPrintCallback-shim" hidden>
  <style>
@media print {
  #printContainer div {
    page-break-after: always;
    page-break-inside: avoid;
  }
}
  </style>
  <style scoped>
#mozPrintCallback-shim {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 9999999;

  display: block;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
}
#mozPrintCallback-shim[hidden] {
  display: none;
}
@media print {
  #mozPrintCallback-shim {
    display: none;
  }
}

#mozPrintCallback-shim .mozPrintCallback-dialog-box {
  display: inline-block;
  margin: -50px auto 0;
  position: relative;
  top: 45%;
  left: 0;
  min-width: 220px;
  max-width: 400px;

  padding: 9px;

  border: 1px solid hsla(0, 0%, 0%, .5);
  border-radius: 2px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);

  background-color: #474747;

  color: hsl(0, 0%, 85%);
  font-size: 16px;
  line-height: 20px;
}
#mozPrintCallback-shim .progress-row {
  clear: both;
  padding: 1em 0;
}
#mozPrintCallback-shim progress {
  width: 100%;
}
#mozPrintCallback-shim .relative-progress {
  clear: both;
  float: right;
}
#mozPrintCallback-shim .progress-actions {
  clear: both;
}
  </style>
  <div class="mozPrintCallback-dialog-box">
    <!-- TODO: Localise the following strings -->
    Preparing document for printing...
    <div class="progress-row">
      <progress value="0" max="100"></progress>
      <span class="relative-progress">0%</span>
    </div>
    <div class="progress-actions">
      <input type="button" value="Cancel" class="mozPrintCallback-cancel">
    </div>
  </div>
</div>

  </body>
  
  <!--css引用-->
		
		<link rel="stylesheet" href="yesui/ui/plugin/css/fullcalendar/fullcalendar.css"><!-- 
		<link rel="stylesheet" href="yesui/ui/plugin/css/default/jquery.treeTable.css"> -->
		<link rel="stylesheet" href="yesui/ui/plugin/css/bootstrap/bootstrap.css">
		<link rel="stylesheet" href="yesui/ui/plugin/css/datepicker/css/datepicker.css"/>
		<link rel="stylesheet" href="yesui/ui/plugin/css/smartspin/smartspinner.css"/>
		<link rel="stylesheet" href="yesui/ui/plugin/css/modaldialog/css/jquery.modaldialog.css"/>
		<link rel="stylesheet" href="yesui/ui/plugin/css/paginationjs/pagination.css"/>
		<link rel="stylesheet" href="yesui/ui/plugin/css/wangEditor/wangEditor-1.4.0.css"/>
        <link rel="stylesheet" href="yesui/ui/plugin/css/treetable/stylesheets/jquery.treetable.theme.default.css" />
		
		<link rel="stylesheet" href="yesui/ui/res/css/blue/main.css">
		<link rel="stylesheet" href="yesui/ui/res/css/blue/corecolor.css">
		<link rel="stylesheet" href="yesui/ui/res/css/blue/jquery-ui.css">
		<link rel="stylesheet" href="yesui/ui/res/css/blue/core.css">
		<link rel="stylesheet" href="yesui/ui/res/css/blue/ui.ygrid.css">
		<link rel="stylesheet" href="yesui/ui/res/css/blue/photoCut.css">
		
		<script type="text/javascript" src="common/jquery/jstz-1.0.4.min.js"></script>
		
		<script type="text/javascript" src="yesui/ui/yes-ui.js"></script>
		<script type="text/javascript" src="common/data/yiuiconsts.js"></script>
		<script type="text/javascript" src="common/ext/jsext.js"></script>
        <script type="text/javascript" src="common/exception/ViewException.js"></script>
        <script type="text/javascript" src="common/exception/BPMException.js"></script>
		<script type="text/javascript" src="yesui/base/jQueryExt.js"></script>
		<script type="text/javascript" src="yesui/base/prototypeExt.js"></script>
		<script type="text/javascript" src="yesui/svr/svrmgr.js"></script>
		<script type="text/javascript" src="common/expr/parser.js"></script>
		<script type="text/javascript" src="common/expr/valimpl.js"></script>
        <script type="text/javascript" src="common/expr/exprutil.js"></script>
        <script type="text/javascript" src="common/expr/funimplmap.js"></script>
		<script type="text/javascript" src="common/util/datautil.js"></script>
        <script type="text/javascript" src="common/util/numericutil.js"></script>
        <script type="text/javascript" src="common/util/typeconvertor.js"></script>
        <script type="text/javascript" src="common/util/subdetailutil.js"></script>
		<script type="text/javascript" src="common/data/datatype.js"></script>
		
		<script type="text/javascript" src="yesui/svr/purehandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/basehandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/attachmenthandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/buttonhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/comboboxhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/checkboxhandler.js"></script>
        <script type="text/javascript" src="yesui/svr/handler/celldicthandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/dicthandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/datepickerhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/dropdownbuttonhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/gridhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/hyperlinkhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/imagehandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/listviewhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/numbereditorhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/passwordeditorhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/radiobuttonhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/splitbuttonhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/searchboxhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/textareahandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/texteditorhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/toolbarhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/treehandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/dialoghandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/dictviewhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/filechooserhandler.js"></script>
		<script type="text/javascript" src="yesui/svr/handler/mapdrawhandler.js"></script>
		
		<script type="text/javascript" src="yesui/svr/behavior/basebehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/buttonbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/checkboxbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/comboboxbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/datepickerbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/dictbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/gridbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/hyperlinkbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/imagebehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/listviewbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/numbereditorbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/radiobuttonbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/splitbuttonbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/searchboxbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/textareabehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/texteditorbehavior.js"></script>
		<script type="text/javascript" src="yesui/svr/behavior/utcdatepickerbehavior.js"></script>
		
		<script type="text/javascript" src="yesui/svr/format/dateformat.js"></script>
		<script type="text/javascript" src="yesui/svr/format/utcdateformat.js"></script>
		<script type="text/javascript" src="yesui/svr/format/decimalformat.js"></script>
		<script type="text/javascript" src="yesui/svr/format/textformat.js"></script>
		
		<script type="text/javascript" src="yesui/svr/service/dictserviceproxy.js"></script>
		<script type="text/javascript" src="yesui/svr/request.js"></script>
		<script type="text/javascript" src="yesui/svr/Base64Utils.js"></script>
		<script type="text/javascript" src="yesui/svr/uiutils.js"></script>
	    <script type="text/javascript" src="yesui/svr/formutils.js"></script>
		<script type="text/javascript" src="yesui/ui/filtermap.js"></script>
		<script type="text/javascript" src="yesui/ui/opt.js"></script>
		<script type="text/javascript" src="yesui/ui/showdata.js"></script>
		<script type="text/javascript" src="yesui/ui/fun/basefun.js"></script>
        <script type="text/javascript" src="yesui/ui/objectloop.js"></script>
		<script type="text/javascript" src="yesui/ui/vparser.js"></script>
        <script type="text/javascript" src="yesui/ui/statusproxy.js"></script>
		<script type="text/javascript" src="yesui/ui/uiprocess.js"></script>
		<script type="text/javascript" src="yesui/ui/paras.js"></script>
		<script type="text/javascript" src="yesui/ui/ppobject.js"></script>
		<script type="text/javascript" src="yesui/ui/form.js"></script>
        <script type="text/javascript" src="yesui/ui/focuspolicy.js"></script>
	    <script type="text/javascript" src="yesui/ui/formadapt.js"></script>
		<script type="text/javascript" src="yesui/ui/formbuilder.js"></script>
		<script type="text/javascript" src="yesui/ui/formstack.js"></script>
		<script type="text/javascript" src="yesui/ui/formRender.js"></script>
		
		<script type="text/javascript" src="yesui/ui/yescomponent/yesbutton.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yeshyperlink.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yesimage.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yestexteditor.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yeslabel.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yesnumbereditor.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yescheckbox.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yesdict.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yesdatepicker.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yescombobox.js"></script>
		<script type="text/javascript" src="yesui/ui/yescomponent/yesdialog.js"></script>
		<script type="text/javascript" src="yesui/ui/component/componentmgr.js"></script>
		<script type="text/javascript" src="yesui/ui/component/component.js"></script>
		<script type="text/javascript" src="yesui/ui/component/conditionparas.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/control.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/toolbar.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/treemenubar.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/databinding.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/button.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/richeditor.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/buttongroup.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/dropdownbutton.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/splitbutton.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/calendar.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/checkbox.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/combobox.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/datepicker.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/dict.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/itemdata.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/dicttree.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/dictview.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/dictquerypanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/hyperlink.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/imagelist.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/label.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/listview.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/numbereditor.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/image.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/radiobutton.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/texteditor.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/textarea.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/textbutton.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/statusbar.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/treeview.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/passwordeditor.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/tree.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/attachment.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/separator.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/chart.js"></script>
        <script type="text/javascript" src="yesui/ui/component/control/bpmgraph.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/custom.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/userinfopane.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/rightsset.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/dialog.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/filechooser.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/mapdraw.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/utcdatepicker.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/searchbox.js"></script>
		<script type="text/javascript" src="yesui/ui/component/control/webbrowser.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/gridsumutil.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/grid.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/editor/celleditor.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/editor/celltexteditor.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/editor/cellnumbereditor.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/editor/celldatepicker.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/editor/cellcombobox.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/editor/celldict.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/editor/cellimage.js"></script>
		<script type="text/javascript" src="yesui/ui/component/grid/editor/celltextbutton.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/autolayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/borderlayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/columnlayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/fluidcolumnlayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/gridlayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/tablayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/tab.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/splitlayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/flexflowlayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/flowlayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/tablelayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/layout/fluidtablelayout.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/panel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/borderlayoutpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/columnlayoutpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/flowlayoutpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/flexflowlayoutpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/fluidcolumnlayoutpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/fluidtablelayoutpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/gridlayoutpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/splitpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/tabpanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/tabpanelex.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/treepanel.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/tabcontainer.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/tabexcontainer.js"></script>
		<script type="text/javascript" src="yesui/ui/component/panel/stackcontainer.js"></script>
		
		<script type="text/javascript" src="yesui/ui/maincontainer.js"></script>
		<script type="text/javascript" src="yesui/ui/maintree.js"></script>
		
        <script type="text/javascript" src="yesui/ui/plugin/js/raphael-src.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/jquery.cookie.js"></script>
		
		<script type="text/javascript" src="yesui/ui/plugin/js/datepicker/datetimemask/dateTimeMask.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/jquery.json-2.3.min.js"></script>
		
		<script type="text/javascript" src="yesui/ui/plugin/js/ygrid/ygrid.locale-cn.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/ygrid/jquery.yGrid.src.js"></script>
        <script type="text/javascript" src="yesui/ui/plugin/js/decimal/decimal.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/picture/ajaxfileupload.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/ui-extend/jquery.placeholder.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/ui-extend/jquery.ui.treeTable.js"></script>
		
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/lib/bean-min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/lib/underscore-min.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/Flotr.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/DefaultOptions.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/Color.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/Date.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/DOM.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/EventAdapter.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/Text.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/Graph.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/Axis.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/Series.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/Series.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/lines.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/bars.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/points.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/pie.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/candles.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/markers.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/radar.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/bubbles.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/gantt.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/types/timeline.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/download.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/selection.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/spreadsheet.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/grid.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/hit.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/crosshair.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/labels.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/legend.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/flotr/js/plugins/titles.js"></script>
		
		<!-- 
		<script type="text/javascript" src="yesui/ui/plugin/js/datepicker/js/eye.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/datepicker/js/utils.js"></script> -->
		
		<script type="text/javascript" src="yesui/ui/plugin/js/map/baidumap.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/map/gaodemap.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/map/maputils.js"></script>
		
		<script type="text/javascript" src="yesui/ui/plugin/js/datepicker/js/datepicker.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/smartspin/smartspinner.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/modaldialog/js/modaldialog.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/paginationjs/pagination.js"></script>
	 	<script type="text/javascript" src="yesui/ui/plugin/js/wangEditor/wangEditor-1.4.0.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/picture/jquery_photoCut.js"></script>
	    <script type="text/javascript" src="yesui/ui/plugin/js/treetable/jquery.treetable.js"></script>
		
	    
	    <script type="text/javascript" src="yesui/ui/plugin/js/throttle-debounce/jquery.ba-throttle-debounce.min.js"></script>
	    
	    <script type="text/javascript" src="yesui/ui/plugin/js/rsa/jsbn.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/rsa/prng4.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/rsa/rng.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/rsa/rsa.js"></script>
		<script type="text/javascript" src="yesui/ui/plugin/js/rsa/BASE_64.js"></script>
		
	    <script type="text/javascript" src="yesui/ui/plugin/js/pako/pako.js"></script>
	    
</html>


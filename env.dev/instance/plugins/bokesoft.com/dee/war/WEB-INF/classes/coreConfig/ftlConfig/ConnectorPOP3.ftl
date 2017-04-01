
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<pop3:connector name="${freeMarkerData.text}"
					checkFrequency="${freeMarkerData.checkFrequency}"
					deleteReadMessages="${freeMarkerData.deleteReadMessages}"/>

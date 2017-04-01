
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<smtp:connector name="${freeMarkerData.text}" <#if freeMarkerData.contentType="true">contentType="text/html;charset=utf-8"</#if>/>


	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<file:outbound-endpoint path="${freeMarkerData.path}"  name="${freeMarkerData.text}"
		<#if freeMarkerData.encoding?has_content>
			encoding="${freeMarkerData.encoding}"
		</#if>
		<#if freeMarkerData.connector_ref?has_content>connector-ref="${freeMarkerData.connector_ref}"</#if>
		outputPattern="${freeMarkerData.outputPattern}">
		<#if freeMarkerData.file_subdir?has_content>
		<property key="file_subdir" value="${freeMarkerData.file_subdir}" />
		</#if>
		<#if freeMarkerData.moveFileTo?has_content>
		<property key="moveFileTo" value="${freeMarkerData.moveFileTo}" />
		</#if>
		<#if freeMarkerData.sameFileNameProc?has_content>
		<property key="sameFileNameProc" value="${freeMarkerData.sameFileNameProc}" />
		</#if>
	</file:outbound-endpoint>


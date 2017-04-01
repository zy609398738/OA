
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.transformerName?has_content>
		<spring:property name="transformerName" value="${freeMarkerData.transformerName}"></spring:property></#if>
		<#if freeMarkerData.indexOfValue?has_content>
		<spring:property name="indexOfValue" value="${freeMarkerData.indexOfValue?string('#')}"></spring:property></#if>
	</custom-transformer>

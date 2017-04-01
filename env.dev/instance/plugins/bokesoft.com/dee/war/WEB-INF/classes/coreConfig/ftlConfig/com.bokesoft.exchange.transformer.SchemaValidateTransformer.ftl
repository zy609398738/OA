
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.schemaPath?has_content>
		<spring:property name="schemaPath" value="${freeMarkerData.schemaPath}"></spring:property></#if>
	</custom-transformer>

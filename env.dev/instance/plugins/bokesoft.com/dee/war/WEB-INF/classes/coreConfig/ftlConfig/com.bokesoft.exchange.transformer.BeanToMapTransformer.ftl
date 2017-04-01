
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.isFilterNullFields?has_content><spring:property name="filterNullFields" value="${freeMarkerData.isFilterNullFields}"></spring:property></#if>
	</custom-transformer>

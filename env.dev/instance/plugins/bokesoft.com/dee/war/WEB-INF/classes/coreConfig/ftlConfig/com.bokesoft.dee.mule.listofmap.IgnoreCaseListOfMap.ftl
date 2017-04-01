
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.isIgnoreCase?has_content><spring:property name="isIgnoreCase" value="${freeMarkerData.isIgnoreCase}"></spring:property></#if>
	</custom-transformer>

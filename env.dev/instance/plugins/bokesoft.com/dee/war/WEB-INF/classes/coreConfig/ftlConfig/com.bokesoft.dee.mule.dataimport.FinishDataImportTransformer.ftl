
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.checkWarn?has_content><spring:property name="checkWarn" value="${freeMarkerData.checkWarn}"></spring:property></#if>
	</custom-transformer>

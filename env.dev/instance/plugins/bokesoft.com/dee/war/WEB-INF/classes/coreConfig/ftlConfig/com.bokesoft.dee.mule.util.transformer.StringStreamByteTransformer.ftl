
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.encoding?has_content><spring:property name="encoding" value="${freeMarkerData.encoding}"></spring:property></#if>
		<#if freeMarkerData.targetType?has_content><spring:property name="targetType" value="${freeMarkerData.targetType}"></spring:property></#if>
	</custom-transformer>

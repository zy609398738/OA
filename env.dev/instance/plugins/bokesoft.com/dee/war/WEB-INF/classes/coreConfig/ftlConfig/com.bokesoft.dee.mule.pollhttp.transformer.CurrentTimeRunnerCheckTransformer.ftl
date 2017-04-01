
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.sleepTimePropName?has_content><spring:property name="sleepTimePropName" value="${freeMarkerData.sleepTimePropName}"></spring:property></#if>
		<#if freeMarkerData.regexPatternPropName?has_content><spring:property name="regexPatternPropName" value="${freeMarkerData.regexPatternPropName}"></spring:property></#if>
	</custom-transformer>

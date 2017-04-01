
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.className?has_content><spring:property name="className" value="${freeMarkerData.className}"></spring:property></#if>
		<#if freeMarkerData.methodName?has_content><spring:property name="methodName" value="${freeMarkerData.methodName}"></spring:property></#if>
		<#if freeMarkerData.xstream?has_content><spring:property name="xstream" value="${freeMarkerData.xstream}"></spring:property></#if>
	</custom-transformer>

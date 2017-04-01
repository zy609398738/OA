
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.source?has_content><spring:property name="source" value="${freeMarkerData.source}"></spring:property></#if>
		<#if freeMarkerData.target?has_content><spring:property name="target" value="${freeMarkerData.target}"></spring:property></#if>
		<#if freeMarkerData.fields?has_content><spring:property name="fields" value="${freeMarkerData.fields}"></spring:property></#if>
	</custom-transformer>


	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.httpUrl?has_content><spring:property name="httpUrl" value="${freeMarkerData.httpUrl}"></spring:property></#if>
		<#if freeMarkerData.useList?has_content><spring:property name="useList" value="${freeMarkerData.useList}"></spring:property></#if>
	</custom-transformer>

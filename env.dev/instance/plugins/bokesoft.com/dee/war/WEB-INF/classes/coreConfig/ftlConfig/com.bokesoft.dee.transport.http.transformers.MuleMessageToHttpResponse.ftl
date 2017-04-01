
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.server?has_content><spring:property name="server" value="${freeMarkerData.server}"></spring:property></#if>
	</custom-transformer>


	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.encoding?has_content><spring:property name="encoding" value="${freeMarkerData.encoding}"></spring:property></#if>
		<#if freeMarkerData.encoder?has_content><spring:property name="encoder" value="${freeMarkerData.encoder}"></spring:property></#if>
	</custom-transformer>

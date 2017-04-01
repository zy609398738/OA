
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.splitPerSize?has_content><spring:property name="splitPerSize" value="${freeMarkerData.splitPerSize?string('#')}"></spring:property></#if>
		<#if freeMarkerData.encoding?has_content><spring:property name="encoding" value="${freeMarkerData.encoding}"></spring:property></#if>
	</custom-transformer>

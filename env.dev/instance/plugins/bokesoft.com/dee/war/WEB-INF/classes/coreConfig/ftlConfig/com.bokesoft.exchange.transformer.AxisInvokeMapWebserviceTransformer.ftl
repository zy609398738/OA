
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.sWsdlUrl?has_content><spring:property name="sWsdlUrl" value="${freeMarkerData.sWsdlUrl}"></spring:property></#if>
	</custom-transformer>


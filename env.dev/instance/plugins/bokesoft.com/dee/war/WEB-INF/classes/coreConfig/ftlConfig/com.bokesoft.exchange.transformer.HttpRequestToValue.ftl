
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.encoding?has_content><spring:property name="encoding" value="${freeMarkerData.encoding}"></spring:property></#if>
		<#if freeMarkerData.xstream?has_content><spring:property name="xstream" value="${freeMarkerData.xstream}"></spring:property></#if>
		<#if freeMarkerData.toMap?has_content><spring:property name="toMap" value="${freeMarkerData.toMap}"></spring:property></#if>
		<#if freeMarkerData.decode?has_content><spring:property name="decode" value="${freeMarkerData.decode}"></spring:property></#if>
	</custom-transformer>

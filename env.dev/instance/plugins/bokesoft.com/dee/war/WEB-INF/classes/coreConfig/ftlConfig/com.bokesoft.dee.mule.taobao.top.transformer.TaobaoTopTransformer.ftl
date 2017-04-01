
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.serverURL?has_content>
		<spring:property name="serverURL" value="${freeMarkerData.serverURL}"></spring:property></#if>
		<#if freeMarkerData.appkey?has_content>
		<spring:property name="appkey" value="${freeMarkerData.appkey}"></spring:property></#if>
		<#if freeMarkerData.appSecret?has_content>
		<spring:property name="appSecret" value="${freeMarkerData.appSecret}"></spring:property></#if>
		<#if freeMarkerData.format?has_content>
		<spring:property name="format" value="${freeMarkerData.format}"></spring:property></#if>
		<#if freeMarkerData.sessionKey?has_content>
		<spring:property name="sessionKey" value="${freeMarkerData.sessionKey}"></spring:property></#if>
		<#if freeMarkerData.taoBaoApi?has_content>
		<spring:property name="taoBaoApi" value="${freeMarkerData.taoBaoApi}"></spring:property></#if>
		<#if freeMarkerData.taoBaoApiMappingClass?has_content>
		<spring:property name="taoBaoApiMappingClass" value="${freeMarkerData.taoBaoApiMappingClass}"></spring:property></#if>
		<#if freeMarkerData.returnMethod?has_content>
		<spring:property name="returnMethod" value="${freeMarkerData.returnMethod}"></spring:property></#if>
		<#if freeMarkerData.isFilterNullFields?has_content>
		<spring:property name="isFilterNullFields" value="${freeMarkerData.isFilterNullFields}"></spring:property></#if>
	</custom-transformer>

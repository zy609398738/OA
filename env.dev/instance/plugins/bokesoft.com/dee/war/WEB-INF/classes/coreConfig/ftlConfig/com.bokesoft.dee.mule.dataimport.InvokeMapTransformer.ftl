
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.methodName?has_content><spring:property name="methodName" value="${freeMarkerData.methodName}"></spring:property></#if>
		<#if freeMarkerData.xstream?has_content><spring:property name="xstream" value="${freeMarkerData.xstream}"></spring:property></#if>
		<#if freeMarkerData.oneTransaction?has_content><spring:property name="oneTransaction" value="${freeMarkerData.oneTransaction}"></spring:property></#if>
		<#if freeMarkerData.isSystemOut?has_content><spring:property name="systemOut" value="${freeMarkerData.isSystemOut}"></spring:property></#if>
		<#if freeMarkerData.careEmpty?has_content><spring:property name="careEmpty" value="${freeMarkerData.careEmpty}"></spring:property></#if>
		<#if freeMarkerData.ignoreException?has_content><spring:property name="ignoreException" value="${freeMarkerData.ignoreException}"></spring:property></#if>
		<#if freeMarkerData.sessionId?has_content><spring:property name="sessionId" value="${freeMarkerData.sessionId}"></spring:property></#if>
		<#if freeMarkerData.corpCode?has_content><spring:property name="corpCode" value="${freeMarkerData.corpCode}"></spring:property></#if>
		<#if freeMarkerData.userCode?has_content><spring:property name="userCode" value="${freeMarkerData.userCode}"></spring:property></#if>
		<#if freeMarkerData.roleCode?has_content><spring:property name="roleCode" value="${freeMarkerData.roleCode}"></spring:property></#if>
	</custom-transformer>

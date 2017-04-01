
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.exchangeCenterUrl?has_content>
		<spring:property name="exchangeCenterUrl" value="${freeMarkerData.exchangeCenterUrl}"></spring:property>
		</#if>	
		<#if freeMarkerData.appSecret?has_content>
		<spring:property name="appSecret" value="${freeMarkerData.appSecret}"></spring:property>
		</#if>	
		<#if freeMarkerData.actionType?has_content>
		<spring:property name="actionType" value="${freeMarkerData.actionType}"></spring:property>
		</#if>	
		<#if freeMarkerData.eventId?has_content>
		<spring:property name="eventId" value="${freeMarkerData.eventId}"></spring:property>
		</#if>	
		<#if freeMarkerData.source?has_content>
		<spring:property name="source" value="${freeMarkerData.source}"></spring:property>
		</#if>	
		<#if freeMarkerData.target?has_content>
		<spring:property name="target" value="${freeMarkerData.target}"></spring:property>
		</#if>	
		<#if freeMarkerData.bizData?has_content>
		<spring:property name="bizData" value="${freeMarkerData.bizData}"></spring:property>
		</#if>	
	</custom-transformer>
	
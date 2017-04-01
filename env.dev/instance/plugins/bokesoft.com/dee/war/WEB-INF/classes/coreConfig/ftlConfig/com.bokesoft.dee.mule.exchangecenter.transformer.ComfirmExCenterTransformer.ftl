
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
		<#if freeMarkerData.source?has_content>
		<spring:property name="source" value="${freeMarkerData.source}"></spring:property>
		</#if>	
		<#if freeMarkerData.eventIDs?has_content>
		<spring:property name="eventIDs" value="${freeMarkerData.eventIDs}"></spring:property>
		</#if>	
	</custom-transformer>
	

	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<spring:property name="configFileNameKey" value="${freeMarkerData.configFileNameKey}"></spring:property>
		<spring:property name="htmlStrKey" value="${freeMarkerData.htmlStrKey}"></spring:property>
		<spring:property name="IgnoreKey" value="${freeMarkerData.IgnoreKey}"></spring:property>
		<spring:property name="configDir" value="${freeMarkerData.configDir}"></spring:property>
	</custom-transformer>

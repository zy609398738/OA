
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.interfaceName?has_content><spring:property name="interfaceName" value="${freeMarkerData.interfaceName}"></spring:property></#if>
		<#if freeMarkerData.params?has_content><spring:property name="params">
			<spring:map>
				<#list freeMarkerData.params as itemKey>   
					<spring:entry key="${itemKey.key}" value="${itemKey.value}"></spring:entry>
				</#list>
			</spring:map>
		</spring:property></#if>
		<#if freeMarkerData.smooksConfigFile?has_content><spring:property name="smooksConfigFile" value="${freeMarkerData.smooksConfigFile}"></spring:property></#if>
		<#if freeMarkerData.shopexUrl?has_content><spring:property name="shopexUrl" value="${freeMarkerData.shopexUrl}"></spring:property></#if>
		<#if freeMarkerData.appKey?has_content><spring:property name="appKey" value="${freeMarkerData.appKey}"></spring:property></#if>
		<#if freeMarkerData.smooksReturnBeanId?has_content><spring:property name="smooksReturnBeanId" value="${freeMarkerData.smooksReturnBeanId}"></spring:property></#if>
	</custom-transformer>

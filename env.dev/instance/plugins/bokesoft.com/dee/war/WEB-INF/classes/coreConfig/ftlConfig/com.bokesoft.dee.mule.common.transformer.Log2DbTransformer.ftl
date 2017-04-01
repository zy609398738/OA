
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="com.bokesoft.dee.mule.common.transformer.Log2DbTransformer" <#if freeMarkerData.text?has_content>name="${freeMarkerData.text}"</#if>>
		<#if freeMarkerData.transformerName?has_content>
		<spring:property name="transformerName" value="${freeMarkerData.transformerName}"></spring:property>
		</#if>
		<#if freeMarkerData.interfaceName?has_content>
		<spring:property name="interfaceName" value="${freeMarkerData.interfaceName}"></spring:property></#if>
		<#if freeMarkerData.serviceName?has_content>
		<spring:property name="serviceName" value="${freeMarkerData.serviceName}"></spring:property></#if>
		<#if freeMarkerData.interfaceDesc?has_content>
		<spring:property name="interfaceDesc" value="${freeMarkerData.interfaceDesc}"></spring:property></#if>
		<#if freeMarkerData.serviceDesc?has_content>
		<spring:property name="serviceDesc" value="${freeMarkerData.serviceDesc}"></spring:property></#if>
		<#if freeMarkerData.interfaceId?has_content>
		<spring:property name="interfaceId" value="${freeMarkerData.interfaceId}"></spring:property></#if>
		<#if freeMarkerData.serviceId?has_content>
		<spring:property name="serviceId" value="${freeMarkerData.serviceId}"></spring:property></#if>
		<#if freeMarkerData.errorLog?has_content>
		<spring:property name="errorLog" value="${freeMarkerData.errorLog}"></spring:property></#if>
		<#if freeMarkerData.lastOne?has_content>
		<spring:property name="lastOne" value="${freeMarkerData.lastOne}"></spring:property></#if>
		<#if freeMarkerData.ds?has_content>
		<spring:property name="ds" ref="${freeMarkerData.ds}"></spring:property>
		</#if>
	</custom-transformer>
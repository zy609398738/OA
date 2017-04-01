
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="com.bokesoft.dee.mule.common.transformer.Log2NosqlProcessorTransformer" <#if freeMarkerData.text?has_content>name="${freeMarkerData.text}"</#if>>
		<#if freeMarkerData.transformerName?has_content>
		<spring:property name="transformerName" value="${freeMarkerData.transformerName}"></spring:property>
		</#if>
		<#if freeMarkerData.interfaceName?has_content>
		<spring:property name="interfaceName" value="${freeMarkerData.interfaceName}"></spring:property></#if>
		<#if freeMarkerData.serviceName?has_content>
		<spring:property name="serviceName" value="${freeMarkerData.serviceName}"></spring:property></#if>
		<#if freeMarkerData.errorLog?has_content>
		<spring:property name="errorLog" value="${freeMarkerData.errorLog}"></spring:property></#if>
		<#if freeMarkerData.lastOne?has_content>
		<spring:property name="lastOne" value="${freeMarkerData.lastOne}"></spring:property></#if>
	</custom-transformer>
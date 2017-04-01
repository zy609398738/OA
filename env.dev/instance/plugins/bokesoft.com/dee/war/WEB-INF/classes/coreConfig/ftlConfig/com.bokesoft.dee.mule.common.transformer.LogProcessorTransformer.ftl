
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="com.bokesoft.dee.mule.common.transformer.LogProcessorTransformer" <#if freeMarkerData.text?has_content>name="${freeMarkerData.text}"</#if>>
		<#if freeMarkerData.transformerName?has_content>
		<spring:property name="transformerName" value="${freeMarkerData.transformerName}"></spring:property>
		</#if>
		<#if freeMarkerData.filePath?has_content>
		<spring:property name="filePath" value="${freeMarkerData.filePath}"></spring:property></#if>
		<#if freeMarkerData.errorLog?has_content>
		<spring:property name="errorLog" value="${freeMarkerData.errorLog}"></spring:property></#if>
		<#if freeMarkerData.jdbcDataAccess?has_content>
		<spring:property name="jdbcDataAccess" ref="${freeMarkerData.jdbcDataAccess}"></spring:property></#if>
		<#if freeMarkerData.defaultLogSaveType?has_content>
		<spring:property name="defaultLogSaveType" value="${freeMarkerData.defaultLogSaveType}"></spring:property></#if>
	</custom-transformer>
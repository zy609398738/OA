
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="com.bokesoft.dee.mule.common.transformer.LogBusinessDataTransformer" <#if freeMarkerData.text?has_content>name="${freeMarkerData.text}"</#if>>
		<#if freeMarkerData.error?has_content>
		<spring:property name="error" value="${freeMarkerData.error}"></spring:property></#if>
		<#if freeMarkerData.jdbcDataAccess?has_content>
		<spring:property name="jdbcDataAccess" ref="${freeMarkerData.jdbcDataAccess}"></spring:property></#if>
		<#if freeMarkerData.logTableName?has_content>
		<spring:property name="logTableName" value="${freeMarkerData.logTableName}"></spring:property></#if>
		<#if freeMarkerData.dataMapping?has_content>
		<spring:property name="dataMapping">
			<spring:map>
				<#list freeMarkerData.dataMapping as itemKey>   
					<spring:entry key="${itemKey.key}" value="${itemKey.value}"></spring:entry>
				</#list>
			</spring:map>
		</spring:property>
		</#if>
	</custom-transformer>
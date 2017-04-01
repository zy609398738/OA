
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.tablePath?has_content>
		<spring:property name="tablePath" value="${freeMarkerData.tablePath}"></spring:property>
		</#if>
		<#if freeMarkerData.queries?has_content>
		<spring:property name="queries">
			<spring:list>
			  <#list freeMarkerData.queries as itemKey>
				<spring:value> <![CDATA[${itemKey.value}]]></spring:value>
			  </#list>
			</spring:list>
		</spring:property></#if>
		<#if freeMarkerData.dataAccess?has_content>
		<spring:property name="dataAccess" ref="${freeMarkerData.dataAccess}" />
		</#if>		
	</custom-transformer>

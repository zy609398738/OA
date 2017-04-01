
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.queries?has_content>
		<spring:property name="queries">
			<spring:list>
			  <#list freeMarkerData.queries as itemKey>
				<spring:value> <![CDATA[
					${itemKey.value}
				]]></spring:value>
			  </#list>
			</spring:list>		
		</spring:property></#if>
		<#if freeMarkerData.ds?has_content><spring:property name="ds" ref="${freeMarkerData.ds}"></spring:property>
		</#if>
		<#if freeMarkerData.tablePath?has_content><spring:property name="tablePath" value="${freeMarkerData.tablePath}"></spring:property>
		</#if>
		<#if freeMarkerData.ignoreSQLError?has_content><spring:property name="ignoreSQLError" value="${freeMarkerData.ignoreSQLError}"></spring:property>
		</#if>
		<#if freeMarkerData.addResult?has_content><spring:property name="addResult" value="${freeMarkerData.addResult}"></spring:property>
		</#if>
		<#if freeMarkerData.resultFileNamePrefix?has_content><spring:property name="resultFileNamePrefix" value="${freeMarkerData.resultFileNamePrefix}"></spring:property>
		</#if>
	</custom-transformer>
	

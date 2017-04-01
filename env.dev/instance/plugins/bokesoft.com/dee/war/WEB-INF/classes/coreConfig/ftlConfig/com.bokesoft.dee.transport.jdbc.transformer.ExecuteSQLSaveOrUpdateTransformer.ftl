
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.updateQuery?has_content>
		<spring:property name="updateQuery" value="${freeMarkerData.updateQuery}"></spring:property>
		</#if>	
		<#if freeMarkerData.insertQuery?has_content>
		<spring:property name="insertQuery" value="${freeMarkerData.insertQuery}"></spring:property>
		</#if>				
		<#if freeMarkerData.ds?has_content>
		<spring:property name="ds" ref="${freeMarkerData.ds}"></spring:property>
		</#if>
		<#if freeMarkerData.resultIndexOf?has_content>
		<spring:property name="resultIndexOf" value="${freeMarkerData.resultIndexOf}"></spring:property>
		</#if>
		<#if freeMarkerData.ignoreSQLError?has_content><spring:property name="ignoreSQLError" value="${freeMarkerData.ignoreSQLError}"></spring:property></#if>
	</custom-transformer>
	

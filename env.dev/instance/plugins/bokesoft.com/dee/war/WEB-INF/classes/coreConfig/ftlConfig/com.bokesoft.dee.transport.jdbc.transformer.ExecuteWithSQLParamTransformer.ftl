
	<!--${freeMarkerData.description}-->
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.querySub?has_content><spring:property name="querySub" value="${freeMarkerData.querySub}"></spring:property></#if>
		<#if freeMarkerData.ds?has_content>
		<spring:property name="ds" ref="${freeMarkerData.ds}"></spring:property>
		</#if>
		<#if freeMarkerData.ignoreSQLError?has_content><spring:property name="ignoreSQLError" value="${freeMarkerData.ignoreSQLError}"></spring:property></#if>		
	</custom-transformer>

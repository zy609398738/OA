	
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.expression?has_content>
		<spring:property name="expression" value="${freeMarkerData.expression}"></spring:property>
		</#if>
	</custom-transformer>
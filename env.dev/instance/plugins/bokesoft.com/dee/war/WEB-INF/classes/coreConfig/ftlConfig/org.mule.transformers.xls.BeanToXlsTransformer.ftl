
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.template?has_content>
		<spring:property name="template" value="${freeMarkerData.template}"></spring:property>
		</#if>
	</custom-transformer>
	
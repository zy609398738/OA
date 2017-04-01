
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<spring:property name="path" value="${freeMarkerData.path}"></spring:property>
	</custom-transformer>

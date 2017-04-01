
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.direction?has_content>
		<spring:property name="direction" value="${freeMarkerData.direction}"></spring:property>
		</#if>
		<#if freeMarkerData.toMap?has_content>
		<spring:property name="toMap" value="${freeMarkerData.toMap}"></spring:property>
		</#if>
		<#if freeMarkerData.encoding?has_content>
		<spring:property name="encoding" value="${freeMarkerData.encoding}"></spring:property>
		</#if>
	</custom-transformer>
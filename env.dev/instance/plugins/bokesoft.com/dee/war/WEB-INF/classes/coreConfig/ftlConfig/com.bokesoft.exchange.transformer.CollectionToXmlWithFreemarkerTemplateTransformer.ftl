
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.freeMarkerTemplate?has_content>
		<spring:property name="freeMarkerTemplate"><spring:value><![CDATA[${freeMarkerData.freeMarkerTemplate}]]></spring:value></spring:property>
		</#if>
		<#if freeMarkerData.encoding?has_content>
		<spring:property name="encoding" value="${freeMarkerData.encoding}"></spring:property>
		</#if>
	</custom-transformer>


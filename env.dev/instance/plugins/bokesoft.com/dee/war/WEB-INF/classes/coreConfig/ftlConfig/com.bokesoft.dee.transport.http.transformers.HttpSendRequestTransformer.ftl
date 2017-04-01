
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.URL?has_content><spring:property name="URL"><spring:value><![CDATA[${freeMarkerData.URL}]]></spring:value></spring:property></#if>
		<#if freeMarkerData.HTTP_METHOD?has_content><spring:property name="HTTP_METHOD" value="${freeMarkerData.HTTP_METHOD}"/></#if>
		<#if freeMarkerData.OTHER_CONTENT_TYPE?has_content><spring:property name="CONTENT_TYPE" value="${freeMarkerData.OTHER_CONTENT_TYPE}"/>
		<#elseif freeMarkerData.CONTENT_TYPE?has_content><spring:property name="CONTENT_TYPE" value="${freeMarkerData.CONTENT_TYPE}"/></#if>
		<#if freeMarkerData.CHARSET?has_content><spring:property name="CHARSET" value="${freeMarkerData.CHARSET}"/></#if>
		<#if freeMarkerData.TRUST_STORE?has_content><spring:property name="TRUST_STORE" value="${freeMarkerData.TRUST_STORE}"/></#if>
	</custom-transformer>

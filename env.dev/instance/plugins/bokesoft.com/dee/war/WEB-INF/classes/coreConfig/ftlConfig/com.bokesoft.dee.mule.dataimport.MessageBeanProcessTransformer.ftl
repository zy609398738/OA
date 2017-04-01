
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.transformerName?has_content><spring:property name="transformerName" value="${freeMarkerData.transformerName}"></spring:property></#if>
		<#if freeMarkerData.messageType?has_content><spring:property name="messageType">
			<spring:list>
					  <#list freeMarkerData.messageType as itemKey>
						<spring:value> <![CDATA[${itemKey.value}]]></spring:value>
					  </#list>
			</spring:list>
		</spring:property></#if>
		<#if freeMarkerData.encoding?has_content><spring:property name="encoding" value="${freeMarkerData.encoding}"></spring:property></#if>
		<#if freeMarkerData.level?has_content><spring:property name="level" value="${freeMarkerData.level}"></spring:property></#if>
		<#if freeMarkerData.urls?has_content><spring:property name="urls">
			<spring:list>
					  <#list freeMarkerData.urls as itemKey>
						<spring:value> <![CDATA[${itemKey.value}]]></spring:value>
					  </#list>
			</spring:list>
		</spring:property></#if>
	</custom-transformer>

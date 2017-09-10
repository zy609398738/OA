
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.source?has_content><spring:property name="source" value="${freeMarkerData.source}"></spring:property></#if>
		<#if freeMarkerData.target?has_content><spring:property name="target" value="${freeMarkerData.target}"></spring:property></#if>
		<#if freeMarkerData.fieldExpression?has_content><spring:property name="fieldExpression">
			<spring:list>
					  <#list freeMarkerData.fieldExpression as itemKey>
						<spring:value><![CDATA[${itemKey.value}]]></spring:value>
					  </#list>
			</spring:list>		
		</spring:property></#if>
	</custom-transformer>

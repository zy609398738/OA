
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.splitKeys?has_content><spring:property name="splitKeys">
			<spring:list>
					  <#list freeMarkerData.splitKeys as itemKey>
						<spring:value> <![CDATA[${itemKey.value}]]></spring:value>
					  </#list>
			</spring:list>		
		</spring:property></#if>
		<#if freeMarkerData.maxSize?has_content><spring:property name="maxSize"value="${freeMarkerData.maxSize?string('#')}"></spring:property></#if>
		<#if freeMarkerData.subSplitKeys?has_content><spring:property name="subSplitKeys">
		
			<spring:list>
					  <#list freeMarkerData.subSplitKeys as itemKey>
						<spring:value> <![CDATA[${itemKey.value}]]></spring:value>
					  </#list>
			</spring:list>		
		</spring:property></#if>
		<#if freeMarkerData.masterSubKey?has_content><spring:property name="masterSubKey" value="${freeMarkerData.masterSubKey}"></spring:property></#if>
	</custom-transformer>


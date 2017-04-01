
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.source?has_content><spring:property name="source" value="${freeMarkerData.source}"></spring:property></#if>
		<#if freeMarkerData.fields?has_content><spring:property name="fields" value="${freeMarkerData.fields}"></spring:property></#if>
		<#if freeMarkerData.sequenceField?has_content><spring:property name="sequenceField" value="${freeMarkerData.sequenceField}"></spring:property></#if>
		<#if freeMarkerData.maxSize?has_content><spring:property name="maxSize" value="${freeMarkerData.maxSize?string('#')}"></spring:property></#if>
		<#if freeMarkerData.subField?has_content><spring:property name="subField" value="${freeMarkerData.subField}"></spring:property></#if>
		<#if freeMarkerData.target?has_content><spring:property name="target" value="${freeMarkerData.target}"></spring:property></#if>
		<#if freeMarkerData.childFieldList?has_content><spring:property name="childFieldList">
			<spring:list>
					  <#list freeMarkerData.childFieldList as itemKey>
						<spring:value> <![CDATA[${itemKey.value}]]></spring:value>
					  </#list>
			</spring:list>		
		</spring:property></#if>
		<#if freeMarkerData.groupFieldList?has_content><spring:property name="groupFieldList">
			<spring:list>
					  <#list freeMarkerData.groupFieldList as itemKey>
						<spring:value> <![CDATA[${itemKey.value}]]></spring:value>
					  </#list>
			</spring:list>		
		</spring:property></#if>
	</custom-transformer>


	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.tablePath?has_content>
		<spring:property name="tablePath" value="${freeMarkerData.tablePath}"></spring:property>
		</#if>
		<#if freeMarkerData.query?has_content>
		<spring:property name="query">
			<spring:value> <![CDATA[${freeMarkerData.query}]]></spring:value>
		</spring:property>
		</#if>
		<#if freeMarkerData.ds?has_content>
		<spring:property name="ds" ref="${freeMarkerData.ds}"></spring:property>
		</#if>
		<#if freeMarkerData.firstRecode?has_content>
		<spring:property name="firstRecode" value="${freeMarkerData.firstRecode}"></spring:property>
		</#if>
		<#if freeMarkerData.optionOrderQueries?has_content>
		<spring:property name="optionOrderQueries">
			<spring:list>
					  <#list freeMarkerData.optionOrderQueries as itemKey>
						<spring:value> <![CDATA[${itemKey.value}]]></spring:value>
					  </#list>
			</spring:list>
		</spring:property></#if>
		<#if freeMarkerData.subField?has_content>
		<spring:property name="subField" value="${freeMarkerData.subField}"></spring:property>
		</#if>
	</custom-transformer>


	<!--${freeMarkerData.description}-->
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.queries?has_content>
		<spring:property name="queries">
			<spring:list>
			  <#list freeMarkerData.queries as itemKey>
				<spring:value> <![CDATA[
					${itemKey.value}
				]]></spring:value>
			  </#list>
			</spring:list>		
		</spring:property></#if>
		<#if freeMarkerData.ds?has_content>
		<spring:property name="ds" ref="${freeMarkerData.ds}"></spring:property>
		</#if>
	</custom-transformer>

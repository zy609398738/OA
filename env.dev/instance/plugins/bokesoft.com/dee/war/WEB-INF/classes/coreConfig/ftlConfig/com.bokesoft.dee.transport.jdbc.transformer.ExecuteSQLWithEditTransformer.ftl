
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
	<#list freeMarkerData.queries as a>
	        <#if a.g1?has_content>
			<spring:property name="expQueries">
				<spring:list>
					<#list a.g1 as itemKey>   
						  <spring:map>
							<spring:entry key="symbol">
								<spring:value><![CDATA[${itemKey.symbol}]]></spring:value>
							</spring:entry>
							<spring:entry key="expression" value="${itemKey.expression}">
							</spring:entry>
							<spring:entry key="value" value="${itemKey.value}">
							</spring:entry>
							<spring:entry key="sqls">
								<spring:value><![CDATA[${itemKey.sqls}]]></spring:value>
							</spring:entry>
						 </spring:map>
					</#list>
				</spring:list>
		</spring:property></#if>
	</#list>

		<#if freeMarkerData.ds?has_content>
		<spring:property name="ds" ref="${freeMarkerData.ds}"></spring:property>
		</#if>
		<#if freeMarkerData.resultIndexOf?has_content>
		<spring:property name="resultIndexOf" value="${freeMarkerData.resultIndexOf}"></spring:property>
		</#if>
		<#if freeMarkerData.ignoreSQLError?has_content>
		<spring:property name="ignoreSQLError" value="${freeMarkerData.ignoreSQLError}"></spring:property>
		</#if>
	</custom-transformer>
	

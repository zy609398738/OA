
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<spring:property name="source" value="current"></spring:property>
		<spring:property name="target" value="current"></spring:property>
		<#if freeMarkerData.fieldExpression?has_content><spring:property name="fieldExpression">
			<spring:list>
					  <#list freeMarkerData.fieldExpression as itemKey>
						<spring:value><![CDATA[${itemKey.two}]]><#if itemKey.two?index_of(".")!=-1>~<#if itemKey.three == "1">h<#else>d</#if>2d</#if>:<![CDATA[${itemKey.five}]]><#if itemKey.four == "1">~</#if></spring:value>
					  </#list>
			</spring:list>		
		</spring:property></#if>
	</custom-transformer>

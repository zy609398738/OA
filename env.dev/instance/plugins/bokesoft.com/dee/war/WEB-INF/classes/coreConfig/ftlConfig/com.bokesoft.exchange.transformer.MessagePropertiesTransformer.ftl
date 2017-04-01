
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.deleteProperties?has_content>
		<spring:property name="deleteProperties">
			<spring:list>
			  <#list freeMarkerData.deleteProperties as itemKey>
				<spring:value><![CDATA[${itemKey.value}]]></spring:value>
			  </#list>
			</spring:list>		
		</spring:property></#if>
		<#if freeMarkerData.addProperties?has_content>
		<spring:property name="addProperties">
			<spring:map>
				<#list freeMarkerData.addProperties as itemKey>   
					<spring:entry key="${itemKey.key}" value="${itemKey.value}"></spring:entry>
				</#list>
			</spring:map>
		</spring:property>
		</#if>
		<#if freeMarkerData.getProperty?has_content><spring:property name="getProperty" value="${freeMarkerData.getProperty}"></spring:property></#if>
		<#if freeMarkerData.scope?has_content><spring:property name="scope" value="${freeMarkerData.scope}"></spring:property></#if>
	</custom-transformer>

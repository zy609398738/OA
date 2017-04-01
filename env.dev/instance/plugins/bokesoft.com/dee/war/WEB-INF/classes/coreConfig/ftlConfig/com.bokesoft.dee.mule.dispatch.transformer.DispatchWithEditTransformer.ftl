	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.dispatchEdit?has_content>
			<spring:property name="urlDataMap">
				<spring:list>
						<#list freeMarkerData.dispatchEdit as itemKey>   
						  <spring:map>
								<spring:entry key="expression" value="${itemKey.expression}"></spring:entry>
								<spring:entry key="value" value="${itemKey.value}"></spring:entry>
								<#if itemKey.vmUrl?has_content>
								<spring:entry key="vmUrl" value="${itemKey.vmUrl}"></spring:entry>
								<spring:entry key="interfaceName" value="${itemKey.interfaceName}"></spring:entry>
								</#if>
								<#if itemKey.httpUrl?has_content>
								<spring:entry key="httpUrl" value="${itemKey.httpUrl}"></spring:entry>
								</#if>
						 </spring:map>
						</#list>
				</spring:list>
		</spring:property></#if>
		<#if freeMarkerData.useList?has_content><spring:property name="useList" value="${freeMarkerData.useList}"></spring:property></#if>
	</custom-transformer>
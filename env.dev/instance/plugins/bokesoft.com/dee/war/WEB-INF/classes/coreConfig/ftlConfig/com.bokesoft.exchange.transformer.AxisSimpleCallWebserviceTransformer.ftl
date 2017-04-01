
<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
</#if>
<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.ProgramLanguage?has_content>
		<spring:property name="ProgramLanguage" value="${freeMarkerData.ProgramLanguage}"></spring:property>
		</#if>
		<#if freeMarkerData.proxyHost?has_content>
		<spring:property name="proxyHost" value="${freeMarkerData.proxyHost}"></spring:property>
		</#if>
		<#if freeMarkerData.proxyPort?has_content>
		<spring:property name="proxyPort" value="${freeMarkerData.proxyPort}"></spring:property>
		</#if>
		<#if freeMarkerData.soapParameters?has_content>
		<spring:property name="soapParameters">
			<spring:map>
				<#list freeMarkerData.soapParameters as itemKey>   
					<spring:entry key="${itemKey.key}" value="${itemKey.value}"></spring:entry>
				</#list>
			</spring:map>
		</spring:property>
		</#if>
		<#if freeMarkerData.sWsdlUrl?has_content>
		<spring:property name="sWsdlUrl" value="${freeMarkerData.sWsdlUrl}"></spring:property>
		</#if>
		<#if freeMarkerData.namespace?has_content>
		<spring:property name="namespace" value="${freeMarkerData.namespace}"></spring:property>
		</#if>
		<#if freeMarkerData.methodName?has_content>
		<spring:property name="methodName" value="${freeMarkerData.methodName}"></spring:property>
		</#if>
		<#if freeMarkerData.methodParameters?has_content>
		<spring:property name="methodParameters">
			<spring:map>
				<#list freeMarkerData.methodParameters as itemKey>   
					<spring:entry key="${itemKey.key}" value="${itemKey.value}"></spring:entry>
				</#list>
			</spring:map>
		</spring:property>
		</#if>
		<#if freeMarkerData.netClassName?has_content>
		<spring:property name="netClassName" value="${freeMarkerData.netClassName}"></spring:property>
		</#if>
</custom-transformer>

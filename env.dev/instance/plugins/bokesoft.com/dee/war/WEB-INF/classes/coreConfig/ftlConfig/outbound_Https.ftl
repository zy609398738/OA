
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<https:outbound-endpoint  name="${freeMarkerData.text}"
		<#if freeMarkerData.host?has_content>host="${freeMarkerData.host}"</#if> 
		<#if freeMarkerData.method?has_content>method="${freeMarkerData.method}"</#if> 
		<#if freeMarkerData.connector_ref?has_content>connector-ref="${freeMarkerData.connector_ref}"</#if> 
		<#if freeMarkerData.port?has_content>port="${freeMarkerData.port?c}"</#if> 
		<#if freeMarkerData.path?has_content>path="${freeMarkerData.path}"</#if> 
		<#if freeMarkerData.contentType?has_content>contentType="${freeMarkerData.contentType}"</#if> 
		<#if freeMarkerData.exchange_pattern?has_content>exchange-pattern="${freeMarkerData.exchange_pattern}"</#if> 
		/>


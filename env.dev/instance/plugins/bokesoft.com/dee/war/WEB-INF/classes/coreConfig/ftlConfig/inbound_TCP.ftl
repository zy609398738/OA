	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<tcp:inbound-endpoint  name="${freeMarkerData.text}" 
		host ="${freeMarkerData.host}" 
		port ="${freeMarkerData.port?c}" 
		<#if freeMarkerData.connector_ref?has_content>connector-ref ="${freeMarkerData.connector_ref}"</#if>
		<#if freeMarkerData.exchange_pattern?has_content>exchange-pattern ="${freeMarkerData.exchange_pattern}" </#if>
		/>
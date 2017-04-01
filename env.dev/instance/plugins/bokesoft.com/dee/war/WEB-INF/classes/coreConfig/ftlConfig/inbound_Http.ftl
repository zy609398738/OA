	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<http:inbound-endpoint  name="${freeMarkerData.text}" 
		<#if freeMarkerData.encoding?has_content>
		encoding="${freeMarkerData.encoding}"
		</#if>
		path ="${freeMarkerData.path}" 
		host ="${freeMarkerData.host}" 
		port ="${freeMarkerData.port?string('#')}" 
		<#if freeMarkerData.contentType?has_content>contentType ="${freeMarkerData.contentType}" </#if>
		<#if freeMarkerData.connector_ref?has_content>connector-ref ="${freeMarkerData.connector_ref}"</#if>
		<#if freeMarkerData.exchange_pattern?has_content>exchange-pattern ="${freeMarkerData.exchange_pattern}" </#if>
		<#if freeMarkerData.responseTransformer_refs?has_content>responseTransformer-refs ="${freeMarkerData.responseTransformer_refs}"</#if>
		/>
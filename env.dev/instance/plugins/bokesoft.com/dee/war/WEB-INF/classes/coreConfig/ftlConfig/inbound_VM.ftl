
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<vm:inbound-endpoint  name="${freeMarkerData.text}"
		<#if freeMarkerData.encoding?has_content>
		encoding="${freeMarkerData.encoding}"
		</#if>
		<#if freeMarkerData.address?has_content>address="${freeMarkerData.address}"</#if> 
		<#if freeMarkerData.exchange_pattern?has_content>exchange-pattern ="${freeMarkerData.exchange_pattern}" </#if>
		<#if freeMarkerData.responseTransformer_refs?has_content>responseTransformer-refs ="${freeMarkerData.responseTransformer_refs}"</#if>
		>
	</vm:inbound-endpoint>

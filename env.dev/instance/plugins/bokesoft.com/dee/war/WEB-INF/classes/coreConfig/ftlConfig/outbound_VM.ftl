
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<vm:outbound-endpoint  name="${freeMarkerData.text}"
		<#if freeMarkerData.address?has_content>address="${freeMarkerData.address}"</#if> 
		<#if freeMarkerData.exchange_pattern?has_content>exchange-pattern ="${freeMarkerData.exchange_pattern}" </#if>
		>
	</vm:outbound-endpoint>

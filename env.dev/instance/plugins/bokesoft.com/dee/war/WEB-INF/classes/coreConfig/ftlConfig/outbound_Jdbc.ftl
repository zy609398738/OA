
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<jdbc:outbound-endpoint  name="${freeMarkerData.text}"
		<#if freeMarkerData.pollingFrequency?has_content>pollingFrequency="${freeMarkerData.pollingFrequency}"</#if> 
		connector-ref="${freeMarkerData.connector_ref}"
		queryKey="${freeMarkerData.queryKey}">
		<#if freeMarkerData.transaction?has_content>
			<jdbc:transaction action="${freeMarkerData.transaction}"/>
		<#else>
			<#if freeMarkerData.xaTransaction?has_content><xa-transaction action="${freeMarkerData.xaTransaction} " timeout="600000"/></#if>
		</#if>
		
	</jdbc:outbound-endpoint>
		
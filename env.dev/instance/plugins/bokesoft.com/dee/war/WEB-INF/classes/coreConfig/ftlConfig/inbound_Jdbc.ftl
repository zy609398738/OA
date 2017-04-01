
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<jdbc:inbound-endpoint  name="${freeMarkerData.text}"
		<#if freeMarkerData.encoding?has_content>
		encoding="${freeMarkerData.encoding}"
		</#if>
		pollingFrequency="${freeMarkerData.pollingFrequency?c}" 
		connector-ref="${freeMarkerData.connector_ref}"
		queryKey="${freeMarkerData.queryKey}">
		<#if freeMarkerData.transaction?has_content>
			<jdbc:transaction action="${freeMarkerData.transaction}"/>
		<#else>
			<#if freeMarkerData.xaTransaction?has_content><xa-transaction action="${freeMarkerData.xaTransaction} " timeout="600000"/></#if>
		</#if>
	</jdbc:inbound-endpoint>
		
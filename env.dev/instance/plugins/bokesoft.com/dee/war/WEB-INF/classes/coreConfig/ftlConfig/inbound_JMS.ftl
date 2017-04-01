
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<jms:inbound-endpoint name="${freeMarkerData.text}"
			<#if freeMarkerData.encoding?has_content>
			encoding="${freeMarkerData.encoding}"
			</#if>
			<#if freeMarkerData.exchange_pattern?has_content>
			exchange-pattern="${freeMarkerData.exchange_pattern}"
			</#if>
			address="${freeMarkerData.address}"
			connector-ref="${freeMarkerData.connector_ref}">
			<#if freeMarkerData.xaTransaction?has_content>
			<xa-transaction action="${freeMarkerData.xaTransaction}"/>
			</#if> 
			<#if freeMarkerData.pollingFrequency?has_content>
			<property key="pollingFrequency" value="${freeMarkerData.pollingFrequency?c}"/> 
			</#if>			
	</jms:inbound-endpoint>

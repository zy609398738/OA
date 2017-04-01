
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<smtp:outbound-endpoint
			user="${freeMarkerData.user}"
			password="${freeMarkerData.password}"
			host="${freeMarkerData.host}"
			port="${freeMarkerData.port}"
			from="${freeMarkerData.from}"
			to="${freeMarkerData.to}"
			subject="${freeMarkerData.subject}"
			<#if freeMarkerData.bcc?has_content>
			bcc="${freeMarkerData.bcc}"
			</#if>
			<#if freeMarkerData.cc?has_content>
			cc="${freeMarkerData.cc}"
			</#if>
			<#if freeMarkerData.replyTo?has_content>
			replyTo="${freeMarkerData.replyTo}"
			</#if>
			<#if freeMarkerData.connector_ref?has_content>connector-ref="${freeMarkerData.connector_ref}"</#if>
			<#if freeMarkerData.encoding?has_content>encoding="${freeMarkerData.encoding}"</#if>
		></smtp:outbound-endpoint>

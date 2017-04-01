
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<imap:inbound-endpoint 
		user="${freeMarkerData.user}"
		password="${freeMarkerData.password}"
		host="${freeMarkerData.host}"
		port="${freeMarkerData.port?c}"
		<#if freeMarkerData.encoding?has_content>
		encoding="${freeMarkerData.encoding}"
		</#if>
		connector-ref="${freeMarkerData.connector_ref}"/>

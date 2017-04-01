
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<ftp:outbound-endpoint host ="${freeMarkerData.host}"  name="${freeMarkerData.text}"
			<#if freeMarkerData.connector_ref?has_content>connector-ref ="${freeMarkerData.connector_ref}"</#if>
			port ="${freeMarkerData.port?c}"
			user ="${freeMarkerData.user}"
			password ="${freeMarkerData.password}"
			<#if freeMarkerData.outputPattern?has_content>
			outputPattern="${freeMarkerData.outputPattern}"
			</#if>
			<#if freeMarkerData.encoding?has_content>
			encoding="${freeMarkerData.encoding}"
			</#if>
			<#if freeMarkerData.path?has_content>path="${freeMarkerData.path}"</#if>>

			<#if freeMarkerData.renameFileAlreadyReadSuffix?has_content>
			<property key="renameFileAlreadyReadSuffix" value="${freeMarkerData.renameFileAlreadyReadSuffix}"/>
			</#if>
			<#if freeMarkerData.movefileto?has_content>
			<property key="movefileto" value="${freeMarkerData.movefileto}"/>
			</#if>
		</ftp:outbound-endpoint>


	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<sftp:outbound-endpoint  name="${freeMarkerData.text}"
			address ="${freeMarkerData.address}"
			<#if freeMarkerData.outputPattern?has_content>
			outputPattern="${freeMarkerData.outputPattern}"
			</#if>
			<#if freeMarkerData.connector_ref?has_content>connector-ref ="${freeMarkerData.connector_ref}"</#if>
			<#if freeMarkerData.identityFile?has_content>identityFile="${freeMarkerData.identityFile}"</#if>
			<#if freeMarkerData.passphrase?has_content>passphrase="${freeMarkerData.passphrase}"</#if>>
			<#if freeMarkerData.fileNameEncoding?has_content>
			<property key="fileNameEncoding" value="${freeMarkerData.fileNameEncoding}"/>
			</#if>
			<#if freeMarkerData.tempDir?has_content>
			<property key="tempDir" value="${freeMarkerData.tempDir}"/>
			</#if>
			<#if freeMarkerData.renameFileAlreadyReadSuffix?has_content>
			<property key="renameFileAlreadyReadSuffix" value="${freeMarkerData.renameFileAlreadyReadSuffix}"/>
			</#if>
			<#if freeMarkerData.movefileto?has_content>
			<property key="movefileto" value="${freeMarkerData.movefileto}"/>
			</#if>
		</sftp:outbound-endpoint>

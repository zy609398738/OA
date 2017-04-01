	
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<ftp:inbound-endpoint  name="${freeMarkerData.text}"
			<#if freeMarkerData.encoding?has_content>
			encoding="${freeMarkerData.encoding}"
			</#if>
			host ="${freeMarkerData.host}"
			pollingFrequency ="${freeMarkerData.pollingFrequency?c}"
			<#if freeMarkerData.connector_ref?has_content>connector-ref ="${freeMarkerData.connector_ref}"</#if>
			port ="${freeMarkerData.port?c}"
			user ="${freeMarkerData.user}"
			password ="${freeMarkerData.password}"
			<#if freeMarkerData.path?has_content>path="${freeMarkerData.path}"</#if>>
			<#if !freeMarkerData.filename_regex_filter?has_content><file:filename-wildcard-filter pattern="${freeMarkerData.filename_wildcard_filter}"/></#if>
			<#if freeMarkerData.filename_regex_filter?has_content><file:filename-regex-filter pattern="${freeMarkerData.filename_regex_filter}"/></#if>
			<#if freeMarkerData.file_read_subdir?has_content>
			<property key="file_read_subdir" value="${freeMarkerData.file_read_subdir}"/>
			</#if>
			<#if freeMarkerData.file_rename_suffix?has_content>
			<property key="file_rename_suffix" value="${freeMarkerData.file_rename_suffix}"/>
			</#if>
			<#if freeMarkerData.moveFileSuffix?has_content>
			<property key="moveFileSuffix" value="${freeMarkerData.moveFileSuffix}"/>
			</#if>
			<#if freeMarkerData.maxProcessFile?has_content>
			<property key="maxProcessFile" value="${freeMarkerData.maxProcessFile}"/>
			</#if>
			<#if freeMarkerData.already_read_folder?has_content>
			<property key="already_read_folder" value="${freeMarkerData.already_read_folder}"/>
			</#if>
	</ftp:inbound-endpoint>

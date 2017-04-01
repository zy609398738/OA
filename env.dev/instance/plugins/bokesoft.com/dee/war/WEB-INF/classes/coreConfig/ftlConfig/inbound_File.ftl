
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<file:inbound-endpoint  name="${freeMarkerData.text}" 
			<#if freeMarkerData.encoding?has_content>
			encoding="${freeMarkerData.encoding}"
			</#if>
			path="${freeMarkerData.path}"
			pollingFrequency ="${freeMarkerData.pollingFrequency?c}"
			<#if freeMarkerData.connector_ref?has_content>connector-ref="${freeMarkerData.connector_ref}"</#if>
			moveToDirectory ="${freeMarkerData.moveToDirectory}"
			moveToPattern ="${freeMarkerData.moveToPattern}">
			<#if !freeMarkerData.filename_regex_filter?has_content><file:filename-wildcard-filter pattern="${freeMarkerData.filename_wildcard_filter}"/></#if>
			<#if freeMarkerData.filename_regex_filter?has_content><file:filename-regex-filter pattern="${freeMarkerData.filename_regex_filter}"/></#if>
			<#if freeMarkerData.file_read_subdir?has_content>
			<property key="file_read_subdir" value="${freeMarkerData.file_read_subdir}"/>
			</#if>
			<#if freeMarkerData.file_move_subdir?has_content>
	    	<property key="file_move_subdir" value="${freeMarkerData.file_move_subdir}"/>
	    	</#if>
			<#if freeMarkerData.maxProcessFile?has_content>
	    	<property key="maxProcessFile" value="${freeMarkerData.maxProcessFile}"/>
	    	</#if>	    	
	</file:inbound-endpoint >

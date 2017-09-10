
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<ftp:connector name="${freeMarkerData.text}" 
	<#if freeMarkerData.streaming?has_content>
		streaming="${freeMarkerData.streaming}" 
	</#if>
	/>

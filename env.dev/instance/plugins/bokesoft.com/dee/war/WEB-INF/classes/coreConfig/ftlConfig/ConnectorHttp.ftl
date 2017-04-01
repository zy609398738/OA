
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<http:connector name="${freeMarkerData.text}" >
		<receiver-threading-profile maxThreadsActive="100"/>
		<dispatcher-threading-profile maxThreadsActive="100"/>
	</http:connector>

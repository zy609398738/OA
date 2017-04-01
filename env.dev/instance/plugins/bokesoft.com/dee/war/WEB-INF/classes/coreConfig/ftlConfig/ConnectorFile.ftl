
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<file:connector name="${freeMarkerData.text}" 
					autoDelete="${freeMarkerData.autoDelete}" 
					streaming="${freeMarkerData.streaming}" 
					pollingFrequency="60000" />
					

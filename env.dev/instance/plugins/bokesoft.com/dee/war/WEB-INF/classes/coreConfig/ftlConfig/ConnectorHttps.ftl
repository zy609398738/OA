
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<https:connector name="${freeMarkerData.text}">
		<#if freeMarkerData.keystorepath?has_content && freeMarkerData.keystorepassword?has_content && freeMarkerData.keypassword?has_content>
		<https:tls-key-store path="${freeMarkerData.keystorepath}" keyPassword="${freeMarkerData.keypassword}" storePassword="${freeMarkerData.keystorepassword}"  <#if freeMarkerData.keyalias?has_content>keyAlias="${freeMarkerData.keyalias}"</#if>/>
		</#if> 
		<#if freeMarkerData.truststorepath?has_content && freeMarkerData.truststorepassword?has_content>
		<https:tls-server path="${freeMarkerData.truststorepath}" storePassword="${freeMarkerData.truststorepassword}"/>
		</#if> 
	</https:connector>
		
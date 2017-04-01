
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<tcp:connector name="${freeMarkerData.text}"
					sendBufferSize="${freeMarkerData.sendBufferSize}"
					receiveBufferSize="${freeMarkerData.receiveBufferSize}" 
					receiveBacklog="${freeMarkerData.receiveBacklog}" 
					sendTcpNoDelay="${freeMarkerData.sendTcpNoDelay}" 
					socketSoLinger="${freeMarkerData.socketSoLinger}" 
					keepSendSocketOpen="${freeMarkerData.keepSendSocketOpen}" 
					keepAlive="${freeMarkerData.keepAlive}" 
					reuseAddress="${freeMarkerData.reuseAddress}"
					clientSoTimeout="${freeMarkerData.clientSoTimeout}" 
					serverSoTimeout="${freeMarkerData.serverSoTimeout}">
   			 <#if !freeMarkerData.protocol?has_content||freeMarkerData.protocol="eof-protocol">
   				<tcp:eof-protocol payloadOnly="true" rethrowExceptionOnRead="true"/>
		     <#elseif freeMarkerData.protocol="xml-eof-protocol">
		     	<tcp:xml-eof-protocol rethrowExceptionOnRead="true"/>
		     <#else>
				<tcp:streaming-protocol rethrowExceptionOnRead="true"/>
		     </#if>
</tcp:connector>

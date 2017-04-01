
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<imap:connector name="${freeMarkerData.text}"
					checkFrequency="${freeMarkerData.checkFrequency}"
					<#if freeMarkerData.mailboxFolder?has_content>
					mailboxFolder="${freeMarkerData.mailboxFolder}" 
					</#if>
					<#if freeMarkerData.moveToFolder?has_content>
					moveToFolder="${freeMarkerData.moveToFolder}" 
					</#if>
					deleteReadMessages="${freeMarkerData.deleteReadMessages}"/>

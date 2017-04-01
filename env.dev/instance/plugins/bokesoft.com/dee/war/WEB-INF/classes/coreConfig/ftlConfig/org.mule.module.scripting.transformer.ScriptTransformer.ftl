
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<script:transformer name="${freeMarkerData.text}">
		<script:script engine="groovy">
			<script:text><![CDATA[
				${freeMarkerData.scriptContent}
				]]></script:text>
		</script:script>
	</script:transformer>	
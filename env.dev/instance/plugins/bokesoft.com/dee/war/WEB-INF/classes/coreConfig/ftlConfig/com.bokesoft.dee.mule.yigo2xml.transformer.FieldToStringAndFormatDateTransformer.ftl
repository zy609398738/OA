	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.formatFiledsXml?has_content>
		<spring:property name="formatFiledsXml">
			<spring:value>
			<![CDATA[ 
				${freeMarkerData.formatFiledsXml}
			]]>
			</spring:value>
		</spring:property>
		</#if>
	</custom-transformer>
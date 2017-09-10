	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.notAllowblankFiledsXml?has_content>
		<spring:property name="notAllowblankFiledsXml">
			<spring:value>
			<![CDATA[ 
				${freeMarkerData.notAllowblankFiledsXml}
			]]>
			</spring:value>
		</spring:property>
		</#if>
	</custom-transformer>
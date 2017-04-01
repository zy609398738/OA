	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.needMappingField?has_content>
		<spring:property name="needMappingField">
			<spring:value>
			<![CDATA[ 
				${freeMarkerData.needMappingField}
			]]>
			</spring:value>
		</spring:property>
		</#if>
	</custom-transformer>
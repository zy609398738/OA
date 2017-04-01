
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.tablePath?has_content>
		<spring:property name="tablePath" value="${freeMarkerData.tablePath}"></spring:property>
		</#if>
		<#if freeMarkerData.script?has_content>
		<spring:property name="script">
		<spring:value>
			<![CDATA[ 
				${freeMarkerData.script}
			]]>
			</spring:value>
		</spring:property>
		</#if>
	</custom-transformer>

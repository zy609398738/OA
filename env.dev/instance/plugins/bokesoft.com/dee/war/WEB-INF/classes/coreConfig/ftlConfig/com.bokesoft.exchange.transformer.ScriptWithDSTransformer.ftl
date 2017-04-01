
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.ds?has_content><spring:property name="ds" ref="${freeMarkerData.ds}"></spring:property></#if>
		<#if freeMarkerData.scriptContent?has_content>
		<spring:property name="script">
			<spring:value>
			<![CDATA[
				${freeMarkerData.scriptContent}
			]]>
			</spring:value>
		</spring:property>
		</#if>
	</custom-transformer>

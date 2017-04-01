
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.debug?has_content><spring:property name="debug" value="${freeMarkerData.debug}"></spring:property></#if>
		<#if freeMarkerData.ds?has_content><spring:property name="ds" ref="${freeMarkerData.ds}"></spring:property></#if>
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

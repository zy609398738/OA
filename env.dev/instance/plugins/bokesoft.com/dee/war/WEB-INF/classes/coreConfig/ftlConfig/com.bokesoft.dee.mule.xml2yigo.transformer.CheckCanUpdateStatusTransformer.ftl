	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.statusCanUpdate?has_content>
		<spring:property name="statusCanUpdate">
			<spring:value>
			<![CDATA[ 
				${freeMarkerData.statusCanUpdate}
			]]>
			</spring:value>
		</spring:property>
		</#if>
		<#if freeMarkerData.primaryKeys?has_content>
		<spring:property name="primaryKeys">
			<spring:value>
			<![CDATA[ 
				${freeMarkerData.primaryKeys}
			]]>
			</spring:value>
		</spring:property>
		</#if>
	</custom-transformer>
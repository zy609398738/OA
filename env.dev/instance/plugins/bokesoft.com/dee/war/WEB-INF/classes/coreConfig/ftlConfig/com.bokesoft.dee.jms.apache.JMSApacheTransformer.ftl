
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<spring:property name="messageType" value="${freeMarkerData.messageType}"></spring:property>
		<spring:property name="queue" value="${freeMarkerData.queue}"></spring:property>
		<spring:property name="url" value="${freeMarkerData.url}"></spring:property>
		<spring:property name="username" value="${freeMarkerData.username!""}"></spring:property>
		<spring:property name="password" value="${freeMarkerData.password!""}"></spring:property>
		<#if freeMarkerData.deeProperties?has_content>
		<spring:property name="deeProperties">
			<spring:map>
				<#list freeMarkerData.deeProperties as itemKey>   
					<spring:entry key="${itemKey.key}" value="${itemKey.value}"></spring:entry>
				</#list>
			</spring:map>
		</spring:property>
		</#if>
	</custom-transformer>

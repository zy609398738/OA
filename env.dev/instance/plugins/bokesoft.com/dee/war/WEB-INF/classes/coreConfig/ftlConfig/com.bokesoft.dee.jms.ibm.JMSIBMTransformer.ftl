
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<spring:property name="hostName" value="${freeMarkerData.hostName}"></spring:property>
		<spring:property name="port" value="${freeMarkerData.port}"></spring:property>
		<spring:property name="channel" value="${freeMarkerData.channel}"></spring:property>
		<spring:property name="queueManager" value="${freeMarkerData.queueManager}"></spring:property>
		<spring:property name="username" value="${freeMarkerData.username!""}"></spring:property>
		<spring:property name="password" value="${freeMarkerData.password!""}"></spring:property>
		<spring:property name="queueName" value="${freeMarkerData.queueName}"></spring:property>
		<spring:property name="messageType" value="${freeMarkerData.messageType}"></spring:property>
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
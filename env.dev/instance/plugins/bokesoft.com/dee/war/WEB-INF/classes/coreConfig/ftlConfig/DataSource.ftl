
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<spring:bean id="${freeMarkerData.text}" class="org.apache.commons.dbcp.BasicDataSource"
		destroy-method="close">
		<spring:property name="driverClassName">
			<spring:value>${freeMarkerData.driverClassName}</spring:value>
		</spring:property>
		<spring:property name="url">
			<spring:value>${freeMarkerData.url}</spring:value>
		</spring:property>
		<spring:property name="username">
			<spring:value>${freeMarkerData.username}</spring:value>
		</spring:property>
		<spring:property name="password">
			<spring:value>${freeMarkerData.password}</spring:value>
		</spring:property>
		<spring:property name="initialSize">
			<spring:value>${freeMarkerData.initialSize}</spring:value>
		</spring:property>
		<spring:property name="maxActive">
			<spring:value>${freeMarkerData.maxActive}</spring:value>
		</spring:property>
		<spring:property name="maxWait">
			<spring:value>${freeMarkerData.maxWait}</spring:value>
		</spring:property>
	</spring:bean>

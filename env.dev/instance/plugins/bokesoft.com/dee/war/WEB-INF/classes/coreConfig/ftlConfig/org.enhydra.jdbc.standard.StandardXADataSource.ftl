
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<spring:bean name="${freeMarkerData.text}" class="org.enhydra.jdbc.standard.StandardXADataSource" destroy-method="shutdown">
		<spring:property name="driverName">
			<spring:value>${freeMarkerData.driverClassName}</spring:value>
		</spring:property>
		<spring:property name="url">
			<spring:value>${freeMarkerData.url}</spring:value>
		</spring:property>
		<spring:property name="user">
			<spring:value>${freeMarkerData.username}</spring:value>
		</spring:property>
		<spring:property name="password">
			<spring:value>${freeMarkerData.password}</spring:value>
		</spring:property>
	</spring:bean>

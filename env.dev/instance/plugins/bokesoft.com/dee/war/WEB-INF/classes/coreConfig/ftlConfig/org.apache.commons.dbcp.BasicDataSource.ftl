
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<spring:bean name="${freeMarkerData.text}" class="org.apache.commons.dbcp.BasicDataSource"
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
		<spring:property name="validationQuery">
			<spring:value>${freeMarkerData.validationQuery!""}</spring:value>
		</spring:property>
		<spring:property name="testOnBorrow">
			<spring:value>${freeMarkerData.testOnBorrow!true}</spring:value>
		</spring:property>
		<spring:property name="testOnReturn">
			<spring:value>${freeMarkerData.testOnReturn!false}</spring:value>
		</spring:property>
			<#if freeMarkerData.logAbandoned?has_content><spring:property name="logAbandoned">
		<spring:value>${freeMarkerData.logAbandoned!false}</spring:value>
		</spring:property>
		</#if>
			<#if freeMarkerData.removeAbandoned?has_content><spring:property name="removeAbandoned">
		<spring:value>${freeMarkerData.removeAbandoned!true}</spring:value>
		</spring:property>
		</#if>
			<#if freeMarkerData.minIdle?has_content><spring:property name="minIdle">
		<spring:value>${freeMarkerData.minIdle!0}</spring:value>
		</spring:property>
		</#if>
			<#if freeMarkerData.maxIdle?has_content><spring:property name="maxIdle">
		<spring:value>${freeMarkerData.maxIdle!0}</spring:value>
		</spring:property>
		</#if>
			<#if freeMarkerData.removeAbandonedTimeout?has_content><spring:property name="removeAbandonedTimeout">
		<spring:value>${freeMarkerData.removeAbandonedTimeout!1000}</spring:value>
		</spring:property>
		</#if>
			<#if freeMarkerData.timeBetweenEvictionRunsMillis?has_content><spring:property name="timeBetweenEvictionRunsMillis">
		<spring:value>${freeMarkerData.timeBetweenEvictionRunsMillis!5000}</spring:value>
		</spring:property>
		</#if>
			<#if freeMarkerData.numTestsPerEvictionRun?has_content><spring:property name="numTestsPerEvictionRun">
		<spring:value>${freeMarkerData.numTestsPerEvictionRun!10}</spring:value>
		</spring:property>
		</#if>
			<#if freeMarkerData.minEvictableIdleTimeMillis?has_content><spring:property name="minEvictableIdleTimeMillis">
		<spring:value>${freeMarkerData.minEvictableIdleTimeMillis!5000}</spring:value>
		</spring:property>
		</#if>
	</spring:bean>

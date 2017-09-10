
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<spring:bean class="org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor" name="${freeMarkerData.text}">
		<spring:property name="corePoolSize" value="${freeMarkerData.corePoolSize}" />
		<spring:property name="maxPoolSize" value="${freeMarkerData.maxPoolSize}" />
		<spring:property name="queueCapacity" value="${freeMarkerData.queueCapacity}" />
		<spring:property name="keepAliveSeconds" value="${freeMarkerData.keepAliveSeconds}" />
		<spring:property name="rejectedExecutionHandler">
			<spring:bean class="${freeMarkerData.rejectedExecutionHandler}" />
		</spring:property>
	</spring:bean>

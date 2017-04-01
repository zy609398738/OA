
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<spring:bean name="${freeMarkerData.text}" class="com.ibm.mq.jms.MQQueueConnectionFactory">
		<#if freeMarkerData.transportType?has_content>
		<spring:property name="transportType" value="${freeMarkerData.transportType}" />
		</#if>
		<spring:property name="hostName" value="${freeMarkerData.hostName}" />
		<spring:property name="port" value="${freeMarkerData.port?c}" />
		<spring:property name="channel" value="${freeMarkerData.channel}" />
		<spring:property name="queueManager" value="${freeMarkerData.queueManager}" />
	</spring:bean>

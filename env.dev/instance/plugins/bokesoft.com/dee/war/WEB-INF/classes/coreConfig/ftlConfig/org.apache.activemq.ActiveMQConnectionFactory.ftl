
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<spring:bean name="${freeMarkerData.text}" class="org.apache.activemq.ActiveMQConnectionFactory">
		<spring:property name="brokerURL" value="${freeMarkerData.brokerURL}" />
		<spring:property name="redeliveryPolicy">
	        <spring:bean class="org.apache.activemq.RedeliveryPolicy">
	        	<#if freeMarkerData.initialRedeliveryDelay?has_content>
	            <spring:property name="initialRedeliveryDelay" value="${freeMarkerData.initialRedeliveryDelay}"/> <!--初始重新传递延迟时间-->
	           	</#if>
	           	<#if freeMarkerData.maximumRedeliveries?has_content>
	            <spring:property name="maximumRedeliveries" value="${freeMarkerData.maximumRedeliveries}"/>  <!--MQ中每条消息最大被发送的次数,一旦超过消息就会被忽略掉-->
	       		</#if>
	       </spring:bean>
   		</spring:property>
	</spring:bean>

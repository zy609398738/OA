
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<jms:connector 
		name="${freeMarkerData.text}"
		<#if freeMarkerData.maxRedelivery?has_content>
		maxRedelivery="${freeMarkerData.maxRedelivery}" 
		</#if>
		<#if freeMarkerData.connectionFactory_ref?has_content>
		connectionFactory-ref="${freeMarkerData.connectionFactory_ref}" 
		</#if>
		<#if freeMarkerData.username?has_content&&!(freeMarkerData.connectionFactoryJndiName?has_content)>
		username="${freeMarkerData.username}" 
		password="${freeMarkerData.password}"
		</#if> 
		<#if freeMarkerData.numberOfConsumers?has_content>numberOfConsumers="${freeMarkerData.numberOfConsumers}"</#if>
		<#if freeMarkerData.jndiProviderUrl?has_content>jndiProviderUrl="${freeMarkerData.jndiProviderUrl}"</#if> 
		<#if freeMarkerData.connectionFactoryJndiName?has_content>
		connectionFactoryJndiName="${freeMarkerData.connectionFactoryJndiName}"
		jndiProviderProperties-ref="jndiProviderProperties_${freeMarkerData.connectionFactoryJndiName}"
		</#if> 
		<#if freeMarkerData.jndiDestinations?has_content>jndiDestinations="${freeMarkerData.jndiDestinations}"</#if> 
		<#if freeMarkerData.forceJndiDestinations?has_content>forceJndiDestinations="${freeMarkerData.forceJndiDestinations}"</#if> 
		<#if freeMarkerData.jndiInitialFactory?has_content>jndiInitialFactory="${freeMarkerData.jndiInitialFactory}"</#if> 
		<#if freeMarkerData.specification?has_content>specification="${freeMarkerData.specification}"</#if> 
		<#if freeMarkerData.clientId?has_content>clientId="${freeMarkerData.clientId}"</#if> 
		<#if freeMarkerData.durable?has_content>durable="${freeMarkerData.durable}"</#if> 
		<#if freeMarkerData.persistentDelivery?has_content>persistentDelivery="${freeMarkerData.persistentDelivery}"</#if> 
		/>
		<#if freeMarkerData.connectionFactoryJndiName?has_content>
		<spring:bean name="jndiProviderProperties_${freeMarkerData.connectionFactoryJndiName}" class="java.util.HashMap">
		  <spring:constructor-arg>
			<spring:map>
			  <spring:entry key="java.naming.security.principal" value="${freeMarkerData.username}"/>
			  <spring:entry key="java.naming.security.credentials" value="${freeMarkerData.password}"/>
			  <spring:entry key="java.naming.security.authentication" value="simple"/>
			</spring:map>
		  </spring:constructor-arg>
		</spring:bean>	
		</#if> 
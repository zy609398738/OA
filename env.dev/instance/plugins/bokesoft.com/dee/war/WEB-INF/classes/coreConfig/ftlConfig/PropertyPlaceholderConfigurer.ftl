	
	<spring:bean id="placeholderConfig"  class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
		<spring:property name="location">
			<spring:value>file:${freeMarkerData}</spring:value>
		</spring:property>
		<spring:property name="placeholderPrefix">
			<spring:value>BD{</spring:value>
		</spring:property>
		<spring:property name="placeholderSuffix">
			<spring:value>}</spring:value>
		</spring:property>
		<spring:property name="systemPropertiesMode" value="2"/>		
    </spring:bean>
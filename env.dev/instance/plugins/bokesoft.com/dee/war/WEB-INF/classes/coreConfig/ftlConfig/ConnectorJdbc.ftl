
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
<#if freeMarkerData.queries?has_content>
	<#list freeMarkerData.queries as query>
	<spring:bean class="java.lang.String" name="${freeMarkerData.text}_${query.key}_ref">
		<spring:constructor-arg>
			<spring:value><![CDATA[${query.value} ]]></spring:value>
		</spring:constructor-arg>
	</spring:bean>	
	</#list>
</#if>

	<jdbc:connector dataSource-ref="${freeMarkerData.dataSourceRef}" name="${freeMarkerData.text}">
		<spring:property name="transactionPerMessage" value="${freeMarkerData.transactionPerMessage}"></spring:property>
		<#list freeMarkerData.queries as query>
					<jdbc:query key="${query.key}" value-ref="${freeMarkerData.text}_${query.key}_ref" />
				</#list>
	</jdbc:connector>

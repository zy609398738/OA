
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<spring:bean class="com.bokesoft.dee.mule.jdbc.JdbcDataAccess" name="${freeMarkerData.text}">
		<spring:property name="ds" ref="${freeMarkerData.dataSourceRef}" />
	</spring:bean>


	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="org.milyn.smooks.mule.Transformer" name="${freeMarkerData.text}">
		<#if freeMarkerData.configData?has_content>
		<spring:property name="configData">
			<spring:value>
			<![CDATA[ 
				<#assign data=freeMarkerData.configData>   
				${data.smooks}
			]]>
			</spring:value>
		</spring:property>
		</#if>
		<spring:property name="resultType" value="JAVA"></spring:property>
		<#if freeMarkerData.javaResultBeanId?has_content>
		<spring:property name="javaResultBeanId" value="${freeMarkerData.javaResultBeanId}"></spring:property>
		</#if>
	</custom-transformer>
	
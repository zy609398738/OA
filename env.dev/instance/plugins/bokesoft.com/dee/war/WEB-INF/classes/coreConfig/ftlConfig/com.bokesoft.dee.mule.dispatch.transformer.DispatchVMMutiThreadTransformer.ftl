	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="com.bokesoft.dee.mule.dispatch.transformer.DispatchVMMutiThreadTransformer" name="${freeMarkerData.text}">
		<#if freeMarkerData.dispatchService?has_content><spring:property name="vmUrl" value="${freeMarkerData.dispatchService}"></spring:property></#if>
		<#if freeMarkerData.dispatchInterface?has_content><spring:property name="interfaceName" value="${freeMarkerData.dispatchInterface}"></spring:property></#if>
		<#if freeMarkerData.useList?has_content><spring:property name="useList" value="${freeMarkerData.useList}"></spring:property></#if>
		<#if freeMarkerData.taskExecutor?has_content><spring:property name="taskExecutor" >
			<spring:ref bean="${freeMarkerData.taskExecutor}" />
		</spring:property></#if>
	</custom-transformer>

	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="com.bokesoft.dee.mule.dispatch.transformer.DispatchHttpTransformer" name="${freeMarkerData.text}">
		<#if freeMarkerData.dispatchService?has_content><spring:property name="httpUrl" value="${freeMarkerData.dispatchService}"></spring:property></#if>
		<#if freeMarkerData.useList?has_content><spring:property name="useList" value="${freeMarkerData.useList}"></spring:property></#if>
	</custom-transformer>

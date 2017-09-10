		
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="com.bokesoft.dee.transport.http.transformers.HttpSendRequestToYigoTransformer" name="${freeMarkerData.text}">
		<#if freeMarkerData.yigoUrl?has_content><spring:property name="yigoUrl" value="${freeMarkerData.yigoUrl}"></spring:property></#if>
		<#if freeMarkerData.connectTimeout?has_content><spring:property name="connectTimeout" value="${freeMarkerData.connectTimeout?c}"></spring:property></#if>
		<#if freeMarkerData.readTimeout?has_content><spring:property name="readTimeout" value="${freeMarkerData.readTimeout?c}"></spring:property></#if>
		<#if freeMarkerData.isThrowException?has_content><spring:property name="isThrowException" value="${freeMarkerData.isThrowException}"></spring:property></#if>
		<#if freeMarkerData.isInTransaction?has_content><spring:property name="isInTransaction" value="${freeMarkerData.isInTransaction}"></spring:property></#if>
	</custom-transformer>


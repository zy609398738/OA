
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="com.bokesoft.dee.mule.common.transformer.AddMsgUnqIdToInboundPropTransformer" <#if freeMarkerData.text?has_content>name="${freeMarkerData.text}"</#if>>
		<#if freeMarkerData.propKey?has_content>
		<spring:property name="propKey" value="${freeMarkerData.propKey}"></spring:property>
		</#if>
	</custom-transformer>
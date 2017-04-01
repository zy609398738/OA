
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.lfet?has_content><spring:property name="left" value="${freeMarkerData.left}"></spring:property></#if>
		<#if freeMarkerData.rigth?has_content><spring:property name="right" value="${freeMarkerData.right}"></spring:property></#if>
		<#if freeMarkerData.leftKey?has_content><spring:property name="leftKey" value="${freeMarkerData.leftKey}"></spring:property></#if>
		<#if freeMarkerData.rigthkey?has_content><spring:property name="rightKey" value="${freeMarkerData.rightKey}"></spring:property></#if>
		<#if freeMarkerData.jionType?has_content><spring:property name="joinType" value="${freeMarkerData.joinType}"></spring:property></#if>
		<#if freeMarkerData.importance?has_content><spring:property name="importance" value="${freeMarkerData.importance}"></spring:property></#if>
		<#if freeMarkerData.target?has_content><spring:property name="target" value="${freeMarkerData.target}"></spring:property></#if>
		<#if freeMarkerData.leftKeys?has_content><spring:property name="leftKeys">
			<spring:list>
					  <#list freeMarkerData.leftKeys as itemKey>
						<spring:value> <![CDATA[${itemKey.value}]]></spring:value>
					  </#list>
			</spring:list>		
		</spring:property></#if>
		<#if freeMarkerData.rigthKeys?has_content><spring:property name="rightKeys">
			<spring:list>
					  <#list freeMarkerData.rightKeys as itemKey>
						<spring:value> <![CDATA[${itemKey.value}]]></spring:value>
					  </#list>
			</spring:list>
		</spring:property></#if>
		<#if freeMarkerData.leftObject?has_content><spring:property name="leftObject">
			<spring:map>
				<#list freeMarkerData.leftObject as itemKey>   
					<spring:entry key="${itemKey.key}" value="${itemKey.value}"></spring:entry>
				</#list>
			</spring:map>		
		</spring:property></#if>
		<#if freeMarkerData.rigthObject?has_content><spring:property name="rightObject">
			<spring:map>
				<#list freeMarkerData.rightObject as itemKey>   
					<spring:entry key="${itemKey.key}" value="${itemKey.value}"></spring:entry>
				</#list>
			</spring:map>		
		</spring:property></#if>
	</custom-transformer>

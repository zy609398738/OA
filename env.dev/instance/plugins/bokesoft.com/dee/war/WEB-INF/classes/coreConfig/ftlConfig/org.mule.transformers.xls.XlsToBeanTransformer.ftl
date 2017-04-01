
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.mappingFile?has_content>
		<spring:property name="mappingFile" value="${freeMarkerData.mappingFile}"></spring:property>
		</#if>
		<#if freeMarkerData.mappingContent?has_content>
		<spring:property name="mappingContent">
			<spring:value>
				<![CDATA[${freeMarkerData.mappingContent}]]>
						</spring:value>
		</spring:property>
		</#if>		
		<#if freeMarkerData.mappingBeans?has_content>
		<spring:property name="mappingBeans">
			<spring:map>
				<#list freeMarkerData.mappingBeans as itemKey>
				<spring:entry key="${itemKey.key}" value="${itemKey.value}"></spring:entry>
				</#list>
			</spring:map>
		</spring:property>
		</#if>
		<#if freeMarkerData.beans?has_content>
		<spring:property name="beans">
			<spring:list>
			<#list freeMarkerData.beans as itemKey>
				<spring:map>
					<spring:entry key="${itemKey.key}">
						<spring:value>
							<![CDATA[ 
								${itemKey.value}
							]]>
						</spring:value>
					</spring:entry>
				</spring:map>
			</#list>
			</spring:list>
		</spring:property>
		</#if>		
	</custom-transformer>
	
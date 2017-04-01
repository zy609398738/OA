
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.sheetStartLine?has_content>
		<spring:property name="sheetStartLine" value="${freeMarkerData.sheetStartLine}"></spring:property>
		</#if>
		<#if freeMarkerData.sheetTitle?has_content>
		<spring:property name="sheetTitle" value="${freeMarkerData.sheetTitle}"></spring:property>
		</#if>
		<#if freeMarkerData.sheetName?has_content>
		<spring:property name="sheetName" value="${freeMarkerData.sheetName}"></spring:property>
		</#if>
		<#if freeMarkerData.excelType?has_content>
		<spring:property name="excelType" value="${freeMarkerData.excelType}"></spring:property>
		</#if>
		<#if freeMarkerData.colNames?has_content>
		<spring:property name="colNames">
			<spring:map>
				<#list freeMarkerData.colNames as itemKey>   
					<spring:entry key="${itemKey.key}" value="${itemKey.value}"></spring:entry>
				</#list>
			</spring:map>
		</spring:property>
		</#if>
	</custom-transformer>
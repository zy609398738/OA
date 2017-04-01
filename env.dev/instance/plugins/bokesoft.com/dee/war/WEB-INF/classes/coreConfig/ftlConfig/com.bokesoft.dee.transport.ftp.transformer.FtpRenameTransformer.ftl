
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.host?has_content><spring:property name="host" value="${freeMarkerData.host}"></spring:property></#if>
		<#if freeMarkerData.port?has_content><spring:property name="port" value="${freeMarkerData.port}"></spring:property></#if>
		<#if freeMarkerData.username?has_content><spring:property name="username" value="${freeMarkerData.username}"></spring:property></#if>
		<#if freeMarkerData.password?has_content><spring:property name="password" value="${freeMarkerData.password}"></spring:property></#if>
		<#if freeMarkerData.path?has_content><spring:property name="path" value="${freeMarkerData.path}"></spring:property></#if>
		<#if freeMarkerData.fileReadSubdir?has_content><spring:property name="fileReadSubdir" value="${freeMarkerData.fileReadSubdir}"></spring:property></#if>
		<#if freeMarkerData.alreadyReadFolder?has_content><spring:property name="alreadyReadFolder" value="${freeMarkerData.alreadyReadFolder}"></spring:property></#if>
		<#if freeMarkerData.fileRenameBeforeSuffix?has_content><spring:property name="fileRenameBeforeSuffix" value="${freeMarkerData.fileRenameBeforeSuffix}"></spring:property></#if>
		<#if freeMarkerData.fileRenameAfterSuffix?has_content><spring:property name="fileRenameAfterSuffix" value="${freeMarkerData.fileRenameAfterSuffix}"></spring:property></#if>
		<#if freeMarkerData.maxProcessFile?has_content><spring:property name="maxProcessFile" value="${freeMarkerData.maxProcessFile}"></spring:property></#if>
		<#if freeMarkerData.passiveMode?has_content><spring:property name="passiveMode" value="${freeMarkerData.passiveMode}"></spring:property></#if>
		<#if freeMarkerData.caseSensitive?has_content><spring:property name="caseSensitive" value="${freeMarkerData.caseSensitive}"></spring:property></#if>
		<#if freeMarkerData.encoding?has_content><spring:property name="encoding" value="${freeMarkerData.encoding}"></spring:property></#if>
	</custom-transformer>
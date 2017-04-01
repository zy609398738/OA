

	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.encoding?has_content><spring:property name="encoding" value="${freeMarkerData.encoding}"></spring:property></#if>
		<#if freeMarkerData.host?has_content><spring:property name="host" value="${freeMarkerData.host}"></spring:property></#if>
		<#if freeMarkerData.port?has_content><spring:property name="port" value="${freeMarkerData.port}"></spring:property></#if>
		<#if freeMarkerData.username?has_content><spring:property name="username" value="${freeMarkerData.username}"></spring:property></#if>
		<#if freeMarkerData.password?has_content><spring:property name="password" value="${freeMarkerData.password}"></spring:property></#if>
		<#if freeMarkerData.path?has_content><spring:property name="path" value="${freeMarkerData.path}"></spring:property></#if>
		<#if freeMarkerData.fileReadSubdir?has_content><spring:property name="fileReadSubdir" value="${freeMarkerData.fileReadSubdir}"></spring:property></#if>
		<#if freeMarkerData.fileRenameSuffix?has_content><spring:property name="fileRenameSuffix" value="${freeMarkerData.fileRenameSuffix}"></spring:property></#if>
		<#if freeMarkerData.moveFileSuffix?has_content><spring:property name="moveFileSuffix" value="${freeMarkerData.moveFileSuffix}"></spring:property></#if>
		<#if freeMarkerData.maxProcessFile?has_content><spring:property name="maxProcessFile" value="${freeMarkerData.maxProcessFile}"></spring:property></#if>
		<#if freeMarkerData.alreadyReadFolder?has_content><spring:property name="alreadyReadFolder" value="${freeMarkerData.alreadyReadFolder}"></spring:property></#if>
		<#if freeMarkerData.passiveMode?has_content><spring:property name="passiveMode" value="${freeMarkerData.passiveMode}"></spring:property></#if>
		<#if freeMarkerData.binaryTransfer?has_content><spring:property name="binaryTransfer" value="${freeMarkerData.binaryTransfer}"></spring:property></#if>
		<#if freeMarkerData.pattern?has_content><spring:property name="pattern" value="${freeMarkerData.pattern}"></spring:property></#if>
		<#if freeMarkerData.implicit?has_content><spring:property name="implicit" value="${freeMarkerData.implicit}"></spring:property></#if>
		<#if freeMarkerData.caseSensitive?has_content><spring:property name="caseSensitive" value="${freeMarkerData.caseSensitive}"></spring:property></#if>
		<#if freeMarkerData.streaming?has_content><spring:property name="streaming" value="${freeMarkerData.streaming}"></spring:property></#if>
	</custom-transformer>















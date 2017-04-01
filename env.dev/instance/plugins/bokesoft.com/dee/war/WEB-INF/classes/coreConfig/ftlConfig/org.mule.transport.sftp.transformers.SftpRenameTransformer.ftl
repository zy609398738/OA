	<#if freeMarkerData.description?has_content>
		<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.address?has_content><spring:property name="address" value="${freeMarkerData.address}"></spring:property></#if>
		<#if freeMarkerData.fileReadSubdir?has_content><spring:property name="fileReadSubdir" value="${freeMarkerData.fileReadSubdir}"></spring:property></#if>
		<#if freeMarkerData.fileRenameBeforeSuffix?has_content><spring:property name="fileRenameBeforeSuffix" value="${freeMarkerData.fileRenameBeforeSuffix}"></spring:property></#if>
		<#if freeMarkerData.fileRenameAfterSuffix?has_content><spring:property name="fileRenameAfterSuffix" value="${freeMarkerData.fileRenameAfterSuffix}"></spring:property></#if>
		<#if freeMarkerData.maxProcessFile?has_content><spring:property name="maxProcessFile" value="${freeMarkerData.maxProcessFile}"></spring:property></#if>
		<#if freeMarkerData.alreadyReadFolder?has_content><spring:property name="alreadyReadFolder" value="${freeMarkerData.alreadyReadFolder}"></spring:property></#if>
		<#if freeMarkerData.fileNameEncoding?has_content><spring:property name="fileNameEncoding" value="${freeMarkerData.fileNameEncoding}"></spring:property></#if>
		<#if freeMarkerData.identityFile?has_content><spring:property name="identityFile" value="${freeMarkerData.identityFile}"></spring:property></#if>
		<#if freeMarkerData.passphrase?has_content><spring:property name="passphrase" value="${freeMarkerData.passphrase}"></spring:property></#if>
		<#if freeMarkerData.encoding?has_content><spring:property name="encoding" value="${freeMarkerData.encoding}"></spring:property></#if>
	</custom-transformer>
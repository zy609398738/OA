<smooks-resource-list xmlns="http://www.milyn.org/xsd/smooks-1.1.xsd" xmlns:jb="http://www.milyn.org/xsd/smooks/javabean-1.1.xsd">
<#list freeMarkerData.tableNames as tableName>
	<#assign store="${tableName}_store">
		<#if tableName_index=0>
		<#--主表-->
			<jb:bindings beanId="${tableName}" class="java.util.ArrayList" createOnElement="${freeMarkerData.createOnElements.createOnElement1}"> 
					<jb:wiring beanIdRef="${freeMarkerData.createOnElements.createOnElement1}"/>
			</jb:bindings>
			<jb:bindings beanId="${freeMarkerData.createOnElements.createOnElement1}" class="com.bokesoft.dee.mule.util.CaseInsensitiveHashMap" createOnElement="${freeMarkerData.createOnElements.createOnElement2}"> 
				<#list freeMarkerData["${tableName}_store"] as itemKey>
					<#if itemKey.dataType="TimeStamp"&&itemKey.format!="">
						<jb:value property="${itemKey.key}" data="${itemKey.createOnElement}" decoder="SqlTimeStamp">
							<jb:decodeParam name="format">${itemKey.format}</jb:decodeParam>
						</jb:value>
					<#elseif itemKey.dataType="Date"&&itemKey.format!="">
						<jb:value property="${itemKey.key}" data="${itemKey.createOnElement}" decoder="Date">
							<jb:decodeParam name="format">${itemKey.format}</jb:decodeParam>
						</jb:value>
					<#else>
						<jb:value property="${itemKey.key}<#if itemKey.dicTable!="">_code</#if>" data="${itemKey.createOnElement}"/>
					</#if>
				</#list>
				<#list freeMarkerData.tableNames as tableName>
					<#if tableName_index!=0>
						<jb:wiring property="${tableName}" beanIdRef="${tableName}s"/>
					</#if>
				</#list>
			</jb:bindings>
	</#if>
</#list>
<#list freeMarkerData.tableNames as tableName>
	<#assign store="${tableName}_store">
		<#--子表-->
	<#if tableName_index!=0>
	<#if tableName?has_content>
		<jb:bindings beanId="${tableName}s" class="java.util.ArrayList" createOnElement="${freeMarkerData.createOnElements.createOnElement2}"> 
				<jb:wiring beanIdRef="${tableName}"/>
		</jb:bindings>
		<jb:bindings beanId="${tableName}" class="com.bokesoft.dee.mule.util.CaseInsensitiveHashMap" createOnElement="${freeMarkerData.createOnElements.createOnElement3}"> 
		<#list freeMarkerData["${tableName}_store"] as itemKey>
		 <#if itemKey.dataType="TimeStamp"&&itemKey.format!="">
			<jb:value property="${itemKey.key}" data="${itemKey.createOnElement}" decoder="SqlTimeStamp">
			 <jb:decodeParam name="format">${itemKey.format}</jb:decodeParam>
			</jb:value>
		<#elseif itemKey.dataType="Date"&&itemKey.format!="">
			 <jb:value property="${itemKey.key}" data="${itemKey.createOnElement}" decoder="Date">
		     	<jb:decodeParam name="format">${itemKey.format}</jb:decodeParam>
			 </jb:value>
		<#else>
			<jb:value property="${itemKey.key}<#if itemKey.dicTable!="">_code</#if>" data="${itemKey.createOnElement}"/>
		 </#if>
		</#list>
		</jb:bindings>
	</#if>
	</#if>
</#list>
</smooks-resource-list>
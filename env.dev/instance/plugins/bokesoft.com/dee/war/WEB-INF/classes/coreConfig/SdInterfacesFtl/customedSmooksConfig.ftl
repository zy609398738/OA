<smooks-resource-list xmlns="http://www.milyn.org/xsd/smooks-1.1.xsd" xmlns:jb="http://www.milyn.org/xsd/smooks/javabean-1.1.xsd">
<#list freeMarkerData.tableNames as tableName>
	<#assign store="${tableName}_store">
		<#if tableName?has_content>
		<#list freeMarkerData["${tableName}_store"] as itemListOrMapKey>
			<#if itemListOrMapKey.class="List">
				<jb:bindings beanId="${tableName}s" class="java.util.ArrayList" createOnElement="${itemListOrMapKey.createOnElement}"> 
						<jb:wiring beanIdRef="${tableName}"/>
				</jb:bindings>
			<#elseif itemListOrMapKey.class="Map">
				<jb:bindings beanId="${tableName}" class="com.bokesoft.dee.mule.util.CaseInsensitiveHashMap" createOnElement="${itemListOrMapKey.createOnElement}">
				<#list freeMarkerData["${tableName}_store"] as itemKey>
				 <#if itemKey.fieldType="TimeStamp"&&itemKey.format!="">
					<jb:value property="${itemKey.key}" data="${itemKey.createOnElement}" decoder="SqlTimeStamp">
					 <jb:decodeParam name="format">${itemKey.format}</jb:decodeParam>
					</jb:value>
				<#elseif itemKey.fieldType="Date"&&itemKey.format!="">
					 <jb:value property="${itemKey.key}" data="${itemKey.createOnElement}" decoder="Date">
						<jb:decodeParam name="format">${itemKey.format}</jb:decodeParam>
					 </jb:value>
				<#elseif itemKey.class="List"||itemKey.class="Map">
				<#else>
					<jb:value property="${itemKey.key}<#if itemKey.dicTable!="">_code</#if>" data="${itemKey.createOnElement}"/>
				 </#if>
				</#list>
				<#list freeMarkerData.tableNames as tableName2>
					<#if tableName_index=0&&tableName2_index!=0>
						<jb:wiring property="${tableName2}" beanIdRef="${tableName2}s"/>
					</#if>
				</#list>
				</jb:bindings>
			<#else>
			</#if>
		</#list>
		</#if>
</#list>
</smooks-resource-list>


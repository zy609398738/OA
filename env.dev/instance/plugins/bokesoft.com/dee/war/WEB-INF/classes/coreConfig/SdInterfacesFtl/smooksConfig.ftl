<smooks-resource-list xmlns="http://www.milyn.org/xsd/smooks-1.1.xsd" xmlns:jb="http://www.milyn.org/xsd/smooks/javabean-1.1.xsd">
<jb:bindings beanId="${freeMarkerData.yigoKey}_dees" class="java.util.ArrayList" createOnElement="${freeMarkerData.yigoKey}_dees"> 
		    <jb:wiring beanIdRef="${freeMarkerData.yigoKey}_dee"/>
</jb:bindings>
<jb:bindings beanId="${freeMarkerData.yigoKey}_dee" class="com.bokesoft.dee.mule.util.CaseInsensitiveHashMap" createOnElement="${freeMarkerData.yigoKey}_dee"> 
	<#list freeMarkerData.tableNames as tableName>
	<#assign store="${tableName}_store">
	<#if tableName_index=0>
		<#list freeMarkerData["${tableName}_store"] as itemKey>
		 <#if itemKey.fieldType="TimeStamp"&&itemKey.format!="">
		     <jb:value property="${itemKey.key}" data="${freeMarkerData.yigoKey}_dee/${tableName}/${itemKey.key}" decoder="SqlTimeStamp">
		     	<jb:decodeParam name="format">${itemKey.format}</jb:decodeParam>
			 </jb:value>
		<#elseif itemKey.fieldType="Date"&&itemKey.format!="">
			 <jb:value property="${itemKey.key}" data="${freeMarkerData.yigoKey}_dee/${tableName}/${itemKey.key}" decoder="Date">
		     	<jb:decodeParam name="format">${itemKey.format}</jb:decodeParam>
			 </jb:value>
		<#else>
			 <jb:value property="${itemKey.key}<#if itemKey.dicTable!="">_code</#if>" data="${freeMarkerData.yigoKey}_dee/${tableName}/${itemKey.key}<#if itemKey.dicTable!="">_code</#if>"/>
		</#if>
		</#list>
	<#else>
			 <jb:wiring property="${tableName}" beanIdRef="${tableName}s"/>
	</#if>
	</#list>
</jb:bindings>
<#list freeMarkerData.tableNames as tableName>
	<#assign store="${tableName}_store">
	<#if tableName_index!=0>
		<#--子表-->
		<#if tableName?has_content>
		<jb:bindings beanId="${tableName}s" class="java.util.ArrayList" createOnElement="${tableName}s"> 
				<jb:wiring beanIdRef="${tableName}"/>
		</jb:bindings>
		<jb:bindings beanId="${tableName}" class="com.bokesoft.dee.mule.util.CaseInsensitiveHashMap" createOnElement="${tableName}"> 
		<#list freeMarkerData["${tableName}_store"] as itemKey>
		 <#if itemKey.fieldType="TimeStamp"&&itemKey.format!="">
			<jb:value property="${itemKey.key}" data="${tableName}/${itemKey.key}" decoder="SqlTimeStamp">
			 <jb:decodeParam name="format">${itemKey.format}</jb:decodeParam>
			</jb:value>
		<#elseif itemKey.fieldType="Date"&&itemKey.format!="">
			 <jb:value property="${itemKey.key}" data="${tableName}/${itemKey.key}" decoder="Date">
		     	<jb:decodeParam name="format">${itemKey.format}</jb:decodeParam>
			 </jb:value>
		<#else>
			<jb:value property="${itemKey.key}<#if itemKey.dicTable!="">_code</#if>" data="${tableName}/${itemKey.key}<#if itemKey.dicTable!="">_code</#if>"/>
		 </#if>
		</#list>
		</jb:bindings>
		</#if>
	</#if>
</#list>
</smooks-resource-list>


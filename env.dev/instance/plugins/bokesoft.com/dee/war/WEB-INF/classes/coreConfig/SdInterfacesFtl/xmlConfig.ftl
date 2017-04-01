<${freeMarkerData.yigoKey}_dees><#--多张单据-->
  <${freeMarkerData.yigoKey}_dee>
<#if freeMarkerData.tableNames?has_content><#--主表不为空时-->
 <#list freeMarkerData.tableNames as tableName>
 <#assign store="${tableName}_store">
  <#if tableName_index=0>
	<${tableName}>
	 <#list freeMarkerData["${tableName}_store"] as itemKey>
		<${itemKey.key}<#if itemKey.dicTable!="">_code</#if>>${cdataStart}<#if itemKey.caption?has_content>${itemKey.caption}</#if>(<#if itemKey.fieldType?has_content>type=${itemKey.fieldType},</#if><#if itemKey.format?has_content>format=${itemKey.format},</#if><#if itemKey.primaryKey="true">primaryKey=${itemKey.primaryKey},</#if>required=${itemKey.allowBlank})${cdataEnd}</${itemKey.key}<#if itemKey.dicTable!="">_code</#if>>
	 </#list>
	</${tableName}>
  <#else>
	<${tableName}s>
		<${tableName}>
		<#list freeMarkerData["${tableName}_store"] as itemKey>
			<${itemKey.key}<#if itemKey.dicTable!="">_code</#if>>${cdataStart}<#if itemKey.caption?has_content>${itemKey.caption}</#if>(<#if itemKey.fieldType?has_content>type=${itemKey.fieldType},</#if><#if itemKey.format?has_content>format=${itemKey.format},</#if><#if itemKey.primaryKey="true">primaryKey=${itemKey.primaryKey},</#if>required=${itemKey.allowBlank})${cdataEnd}</${itemKey.key}<#if itemKey.dicTable!="">_code</#if>>
		</#list>
		</${tableName}>
	</${tableName}s>
  </#if>
 </#list>
</#if>				
  </${freeMarkerData.yigoKey}_dee>
</${freeMarkerData.yigoKey}_dees>


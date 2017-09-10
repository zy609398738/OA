
<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
</#if>
<custom-transformer class="com.bokesoft.dee.mule.dataimport.FixFieldsAddTransformer" name="${freeMarkerData.text}">
		<#if freeMarkerData.tablePath?has_content>
		<spring:property name="tablePath" value="${freeMarkerData.tablePath}"></spring:property>
		</#if>
		<#if freeMarkerData.fixFields?has_content>
		<spring:property name="fixFields">
			<spring:map>
				<#list freeMarkerData.fixFields as itemKey>   
					<spring:entry key="${itemKey.key}" value="${itemKey.value}"></spring:entry>
				</#list>
			</spring:map>
		</spring:property>
		</#if>
		<#if freeMarkerData.rowNumColumn?has_content>
		<spring:property name="rowNumColumn" value="${freeMarkerData.rowNumColumn}"></spring:property>
		</#if>
		
</custom-transformer>

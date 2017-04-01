
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<spring:property name="interfaceName" value="${freeMarkerData.interfaceName}"></spring:property>
		<spring:property name="serviceName" value="${freeMarkerData.serviceName}"></spring:property>
		<spring:property name="connectedServer" value="${freeMarkerData.connectedServer}"></spring:property>
		<spring:property name="username" value="${freeMarkerData.username}"></spring:property>
		<spring:property name="password" value="${freeMarkerData.password}"></spring:property>
		<#if freeMarkerData.resultTableName?has_content>
		<spring:property name="resultTableName" value="${freeMarkerData.resultTableName}"></spring:property>
		</#if>
		<#if freeMarkerData.resultTableFields?has_content>
		<spring:property name="resultTableFields">
			<spring:list>
				<#list freeMarkerData.resultTableFields as itemKey>
					<spring:value><![CDATA[${itemKey.value}]]></spring:value>
				</#list>
			</spring:list>
		</spring:property>
		</#if>
		<#if freeMarkerData.outHeardFieldNames?has_content>
		<spring:property name="outHeardFieldNames">
			<spring:list>
				<#list freeMarkerData.outHeardFieldNames as itemKey>
					<spring:value><![CDATA[${itemKey.value}]]></spring:value>
				</#list>
			</spring:list>
		</spring:property>
		</#if>
		<#if freeMarkerData.outTableNames?has_content>
		<spring:property name="outTableNames">
			<spring:list>
				<#list freeMarkerData.outTableNames as itemKey>
					<spring:value><![CDATA[${itemKey.value}]]></spring:value>
				</#list>
			</spring:list>
		</spring:property>
		</#if>
		<#if freeMarkerData.outTableFields?has_content>
		<spring:property name="outTableFields">
			<spring:map>
		  		<#assign outFieldsKeys = freeMarkerData.outTableFields?keys>
				<#list outFieldsKeys as outFieldsKey>   
				<spring:entry key="${outFieldsKey}">
					<spring:list>
					  <#list freeMarkerData.outTableFields[outFieldsKey] as outFieldsValue>   
						  <#assign outFieldsValueKeys = outFieldsValue?keys>
						  <#list outFieldsValueKeys as outFieldsValueKey>
		         		  <spring:value><![CDATA[${outFieldsValue[outFieldsValueKey]}]]></spring:value>
		         		  </#list>
	         		  </#list>
					</spring:list>
				</spring:entry>
				</#list>
			</spring:map>
		</spring:property>
		</#if>
		<#if freeMarkerData.outTableIsArray?has_content>
		<spring:property name="outTableIsArray">
			<spring:map>
				<#list freeMarkerData.outTableIsArray as itemKey>   
					<spring:entry key="${itemKey.key}" value="${itemKey.value}"></spring:entry>
				</#list>
			</spring:map>
		</spring:property></#if>
		<#if freeMarkerData.inHeardName?has_content>
		<spring:property name="inHeardName" value="${freeMarkerData.inHeardName}"></spring:property>
		</#if>
		<#if freeMarkerData.inHeardFieldNames?has_content>
		<spring:property name="inHeardFieldNames">
			<spring:list>
			  <#list freeMarkerData.inHeardFieldNames as itemKey>
				<spring:value><![CDATA[${itemKey.value}]]></spring:value>
			  </#list>
			</spring:list>
		</spring:property>
		</#if>
		<#if freeMarkerData.inTableNames?has_content>
		<spring:property name="inTableNames">
			<spring:list>
			  <#list freeMarkerData.inTableNames as itemKey>
				<spring:value><![CDATA[${itemKey.value}]]></spring:value>
			  </#list>
			</spring:list>
		</spring:property>
		</#if>
		<#if freeMarkerData.inTableFields?has_content>
		<spring:property name="inTableFields">
			<spring:map>
		  		<#assign inFieldsKeys = freeMarkerData.inTableFields?keys>
				<#list inFieldsKeys as inFieldsKey>   
				<spring:entry key="${inFieldsKey}">
					<spring:list>
					  <#list freeMarkerData.inTableFields[inFieldsKey] as inFieldsValue>   
						  <#assign inFieldsValueKeys = inFieldsValue?keys>
						  <#list inFieldsValueKeys as inFieldsValueKey>
		         		  <spring:value><![CDATA[${inFieldsValue[inFieldsValueKey]}]]></spring:value>
		         		  </#list>
	         		  </#list>
					</spring:list>
				</spring:entry>
				</#list>
			</spring:map>		
		</spring:property></#if>
	</custom-transformer>

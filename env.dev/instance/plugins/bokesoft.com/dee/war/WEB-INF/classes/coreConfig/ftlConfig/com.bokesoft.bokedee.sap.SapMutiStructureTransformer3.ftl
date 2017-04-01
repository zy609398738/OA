
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<spring:property name="IP" value="${freeMarkerData.IP}"></spring:property>
		<spring:property name="client" value="${freeMarkerData.client}"></spring:property>
		<spring:property name="systemNo" value="${freeMarkerData.systemNo}"></spring:property>
		<spring:property name="loginid" value="${freeMarkerData.loginid}"></spring:property>
		<spring:property name="pwd" value="${freeMarkerData.pwd}"></spring:property>
		<spring:property name="functionTemplateName" value="${freeMarkerData.functionTemplateName}"></spring:property>
		<#if freeMarkerData.outTableNames?has_content>
		<spring:property name="outTableNames">
			<spring:list>
				<#list freeMarkerData.outTableNames as itemKey>
					<spring:value><![CDATA[${itemKey.value}]]></spring:value>
				</#list>
			</spring:list>
		</spring:property>
		</#if>
		<#if freeMarkerData.outFields?has_content>
		<spring:property name="outFields">
			<spring:map>
		  		<#assign outFieldsKeys = freeMarkerData.outFields?keys>
				<#list outFieldsKeys as outFieldsKey>   
				<spring:entry key="${outFieldsKey}">
					<spring:list>
					  <#list freeMarkerData.outFields[outFieldsKey] as outFieldsValue>   
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
		<#if freeMarkerData.outStructure?has_content>
		<spring:property name="outStructure">
			<spring:list>
			  <#list freeMarkerData.outStructure as itemKey>
				<spring:value><![CDATA[${itemKey.value}]]></spring:value>
			  </#list>
			</spring:list>
		</spring:property>
		</#if>
		<#if freeMarkerData.outStructureField?has_content>
		<spring:property name="outStructureField">
			<spring:map>
		  		<#assign outFieldsKeys = freeMarkerData.outStructureField?keys>
				<#list outFieldsKeys as outFieldsKey>   
				<spring:entry key="${outFieldsKey}">
					<spring:list>
					  <#list freeMarkerData.outStructureField[outFieldsKey] as outFieldsValue>   
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
		<#if freeMarkerData.inTableNames?has_content>
		<spring:property name="inTableNames">
			<spring:list>
					  <#list freeMarkerData.inTableNames as itemKey>
						<spring:value><![CDATA[${itemKey.value}]]></spring:value>
					  </#list>
			</spring:list>		
		</spring:property>
		</#if>
		<#if freeMarkerData.inFields?has_content>
		<spring:property name="inFields">
			<spring:map>
		  		<#assign outFieldsKeys = freeMarkerData.inFields?keys>
				<#list outFieldsKeys as outFieldsKey>   
				<spring:entry key="${outFieldsKey}">
					<spring:list>
					  <#list freeMarkerData.inFields[outFieldsKey] as outFieldsValue>   
						  <#assign outFieldsValueKeys = outFieldsValue?keys>
						  <#list outFieldsValueKeys as outFieldsValueKey>
		         		  <spring:value><![CDATA[${outFieldsValue[outFieldsValueKey]}]]></spring:value>
		         		  </#list>
	         		  </#list>
					</spring:list>
				</spring:entry>
				</#list>
			</spring:map>		
		</spring:property></#if>
		<#if freeMarkerData.importParameterParameter?has_content>
		<spring:property name="importParameterParameter">
			<spring:map>
				<#list freeMarkerData.importParameterParameter as itemKey>   
					<spring:entry key="${itemKey.key}" value="${itemKey.value}"></spring:entry>
				</#list>
			</spring:map>
		</spring:property></#if>
		<#if freeMarkerData.exportParameterParameter?has_content>
		<spring:property name="exportParameterParameter">
			<spring:list>
			  <#list freeMarkerData.exportParameterParameter as itemKey>
				<spring:value> <![CDATA[${itemKey.value}]]></spring:value>
			  </#list>
			</spring:list>		
		</spring:property>
		</#if>
		<#if freeMarkerData.inStructure?has_content>
		<spring:property name="inStructure" value="${freeMarkerData.inStructure}"></spring:property>
		</#if>
		<#if freeMarkerData.inStructureField?has_content>
		<spring:property name="inStructureField">
			<spring:list>
			  <#list freeMarkerData.inStructureField as itemKey>
				<spring:value> <![CDATA[${itemKey.value}]]></spring:value>
			  </#list>
			</spring:list>		
		</spring:property>
		</#if>
	</custom-transformer>

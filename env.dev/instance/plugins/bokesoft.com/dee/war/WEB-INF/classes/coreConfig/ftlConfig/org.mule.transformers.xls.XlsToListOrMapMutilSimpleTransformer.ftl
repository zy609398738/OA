
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
		<#if freeMarkerData.deployMapping?has_content>
		<spring:property name="deployMapping">
			<spring:map>
				<#list freeMarkerData.deployMapping?keys as itemKey0>
					<spring:entry key="${itemKey0}">
					<spring:map>
						<#list freeMarkerData.deployMapping[itemKey0]?keys as itemKey>
						<#if itemKey="name"||itemKey="index">
							<spring:entry key="${itemKey}" value="${freeMarkerData.deployMapping[itemKey0][itemKey]}"/>
						<#elseif itemKey="cell">
							<spring:entry key="cell">
							 	<spring:list>
								 	<#assign item = freeMarkerData.deployMapping[itemKey0][itemKey]>
								 	<#list item as itemKey2>
								 	<spring:map>
								 		<#list itemKey2?keys as item2>
										<spring:entry key="${item2}" value="${itemKey2[item2]}"/>
										</#list>
									</spring:map>
									</#list>
									
								</spring:list>
							</spring:entry>
						 <#else>
						 	 <spring:entry key="loop">
						 	 <spring:map>
						 	 <#list freeMarkerData.deployMapping[itemKey0][itemKey]?keys as itemKey2>
						 	 	<#if itemKey2="title"||itemKey2="startLine"||itemKey2="endConditions">
						 	 	<spring:entry key="${itemKey2}" value="${freeMarkerData.deployMapping[itemKey0][itemKey][itemKey2]}"/>
						 	 	<#else>
						 	 	<spring:entry key="list">
							 	<spring:list>
								 	<#assign item = freeMarkerData.deployMapping[itemKey0][itemKey][itemKey2]>
								 	<#list item as itemKey3>
								 	<spring:map>
								 		<#list itemKey3?keys as item2>
								 		<#if item2!="row">
										<spring:entry key="${item2}" value="${itemKey3[item2]}"/>
										</#if>
										</#list>
									</spring:map>
									</#list>
								</spring:list>
								</spring:entry>
								</#if>
							</#list>
							</spring:map>
							</spring:entry>
				    	 </#if>
						</#list>
					</spring:map>
					</spring:entry>	
				</#list>
				</spring:map>
		</spring:property>
		</#if>	
	</custom-transformer>
	
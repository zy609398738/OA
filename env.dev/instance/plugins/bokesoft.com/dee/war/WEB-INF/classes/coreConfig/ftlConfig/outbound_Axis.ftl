
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<axis:outbound-endpoint  name="${freeMarkerData.text}"
			<#if freeMarkerData.address?has_content>address="${freeMarkerData.address}"</#if>
			<#if freeMarkerData.responseTimeout?has_content>responseTimeout="${freeMarkerData.responseTimeout?c}"</#if>
			<#if freeMarkerData.connector_ref?has_content>
			connector-ref="${freeMarkerData.connector_ref}"
			</#if>
			>
			<axis:soap-method
				method="${freeMarkerData.soap_method.soap_method}">
				<#list freeMarkerData.soap_method.parameter as method>
					<axis:soap-parameter parameter="${method.parameter}"
						type="${method.type}" mode="${method.mode}" />
				</#list>
				<axis:soap-return type="${freeMarkerData.soap_method.soap_returnType}" />
			</axis:soap-method>
	</axis:outbound-endpoint>

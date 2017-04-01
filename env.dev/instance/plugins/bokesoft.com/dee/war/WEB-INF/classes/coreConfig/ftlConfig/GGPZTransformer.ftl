
	<#if freeMarkerData.description?has_content>
	<!--${freeMarkerData.description}-->
	</#if>
	<custom-transformer class="${freeMarkerData.className}" name="${freeMarkerData.text}">
	</custom-transformer>
<#if freeMarkerData.className == 'com.bokesoft.dee.mule.transaction.StartXaTxTransformer'>
	<jbossts:transaction-manager>
	    <property key="com.arjuna.ats.arjuna.coordinator.defaultTimeout" value="470" /><!-- this is in seconds -->
	    <property key="com.arjuna.ats.arjuna.coordinator.txReaperTimeout" value="208000"/><!-- this is in milliseconds -->
	</jbossts:transaction-manager>
</#if>

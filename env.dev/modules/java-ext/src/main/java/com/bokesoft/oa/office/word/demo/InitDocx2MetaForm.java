package com.bokesoft.oa.office.word.demo;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bokesoft.oa.office.word.Json2MetaForm;
import com.bokesoft.oa.office.word.OfficePOITools;
import com.bokesoft.yes.base.IStartListener;
import com.bokesoft.yigo.meta.common.MetaBaseScript;
import com.bokesoft.yigo.meta.factory.IMetaFactory;
import com.bokesoft.yigo.meta.form.MetaBlock;
import com.bokesoft.yigo.meta.form.MetaForm;
import com.bokesoft.yigo.meta.form.component.control.MetaButton;
import com.bokesoft.yigo.meta.form.component.panel.MetaFlexFlowLayoutPanel;
import com.bokesoft.yigo.meta.form.component.panel.gridpanel.MetaGridLayoutPanel;
import com.bokesoft.yigo.meta.form.component.panel.gridpanel.MetaRowDef;
import com.bokesoft.yigo.mid.base.DefaultContext;

public class InitDocx2MetaForm implements IStartListener {
	private static final Logger log = LoggerFactory.getLogger(InitDocx2MetaForm.class);

	@Override
	public void invoke(DefaultContext context) throws Throwable {
		IMetaFactory metaFactory = context.getVE().getMetaFactory();
		// 相对路径 modules\solution-ia
		String solutionPath = metaFactory.getSolutionPath();
		// 相对路径
		// instance/plugins/bokesoft.com/yigo2/webapps/yigo/WEB-INF/classes/
		String docTmpFileUrl = solutionPath
				+ "/../java-ext/src/test/resources/com/bokesoft/oa/office/word/docTemp.docx";
		Map<String,String> relatedMap = null;
		String jsonStr = OfficePOITools.readWordToJson(docTmpFileUrl,relatedMap, null);
		MetaForm metaTemp = metaFactory.getMetaForm("WordTemp");
		MetaForm metaForm = Json2MetaForm.JsonToMetaForm(metaTemp, "测试word界面", "demoWord", jsonStr);
		MetaBlock metaBlock = (MetaBlock) metaForm.getMetaBody().get(0);
		MetaFlexFlowLayoutPanel flexFlowLayoutPanel = (MetaFlexFlowLayoutPanel) metaBlock.getRoot();
		MetaGridLayoutPanel gridLayoutPanel = (MetaGridLayoutPanel) flexFlowLayoutPanel.getComponent(0);
		int posY = gridLayoutPanel.getMetaRowDefCollection().size();
		gridLayoutPanel.getMetaRowDefCollection().add(new MetaRowDef());
		MetaButton button = new MetaButton();
		button.setCaption("测试保存");
		button.setKey("saveBtn");
		button.setDefaultValue("测试保存");
		button.setX(0);
		button.setY(posY);
		MetaBaseScript script = new MetaBaseScript("");
		script.setContent("InvokeService('DemoWordSave', true, false);");
		button.setOnClick(script);
		gridLayoutPanel.addComponent(button);
		
		MetaButton button2 = new MetaButton();
		button2.setCaption("测试载入");
		button2.setKey("importBtn");
		button2.setDefaultValue("测试载入");
		button2.setX(3);
		button2.setY(posY);
		MetaBaseScript script2 = new MetaBaseScript("");
		script2.setContent("InvokeService('DemoFormImport', true, true);");
		button2.setOnClick(script2);
		gridLayoutPanel.addComponent(button2);
		
		/*
		MetaProject metaProject = metaFactory.getMetaProject("TSL");
		metaForm.doPostProcess(0, new Callback<AbstractMetaObject, Boolean>() {
			public Boolean call(AbstractMetaObject param) throws Throwable {
				if (param instanceof MetaDictProperties) {
					((MetaDictProperties) param).calItemKey(metaProject.getKey());
				} else if (param instanceof MetaTable) {
					((MetaTable) param).initI18nColumn(metaFactory);
				}
				return Boolean.valueOf(true);
			}
		});*/
		metaFactory.addExtMetaForm(metaForm);
		log.info(">>> MetaForm : demoWord inited");
	}

}

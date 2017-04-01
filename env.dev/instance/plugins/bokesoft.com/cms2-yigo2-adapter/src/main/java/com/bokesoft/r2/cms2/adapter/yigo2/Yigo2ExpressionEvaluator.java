package com.bokesoft.r2.cms2.adapter.yigo2;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bokesoft.cms2.basetools.util.Misc;
import com.bokesoft.cms2.core.ctx.CmsRequestContext;
import com.bokesoft.cms2.core.exp.ExpressionException;
import com.bokesoft.cms2.impl.exp.AbstractShebangEvaluator;
import com.bokesoft.r2.cms2.adapter.yigo2.tools.Yigo2Helper;
import com.bokesoft.yigo.common.def.ScriptType;
import com.bokesoft.yigo.mid.base.DefaultContext;

public class Yigo2ExpressionEvaluator extends AbstractShebangEvaluator {
    private static final Logger log = LoggerFactory.getLogger(Yigo2ExpressionEvaluator.class);

    private static final String[] shebangSupports = { "yigo", "yigo2" };

    @Override
    protected String[] getShebangs() {
        return shebangSupports;
    }

    @Override
    protected Object doEval(Object ctx, String formula, String desc) throws ExpressionException {
    	if (StringUtils.isNotBlank(desc)){
    		log.info("Begin to run formula for '"+desc+"' ...");
    	}
    	
    	Misc.$assert(null==ctx, "Unsuppored context type: null");
    	Misc.$assert(!(ctx instanceof CmsRequestContext), "Unsuppored context type: "+ctx.getClass().getName());

        CmsRequestContext cmsCtx = (CmsRequestContext)ctx;
        try {
            DefaultContext yigo2Ctx = Yigo2Helper.getYigo2Context(cmsCtx);
            return yigo2Ctx.getMidParser().eval(ScriptType.Formula, formula);
        } catch (Throwable e) {
            log.error("FAIL to run Yigo2 formula: " + formula + ":\n", e);
            throw new ExpressionException(e);
        }
    }
}

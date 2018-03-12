package com.bokesoft.tsl.formula;

import java.util.UUID;

import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;

public class TSL_GetGUIDImpl extends BaseMidFunctionImpl {

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor executor) throws Throwable {
		UUID uuid = UUID.randomUUID();
		return uuid.toString();
	}
}

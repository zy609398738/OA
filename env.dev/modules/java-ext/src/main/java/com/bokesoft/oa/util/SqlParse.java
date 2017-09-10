package com.bokesoft.oa.util;

import com.bokesoft.oa.base.Names;
import com.bokesoft.oa.config.Settings;
import com.bokesoft.yes.common.util.DateUtil;
import com.bokesoft.yes.common.util.ReflectUtil;
import com.bokesoft.yes.mid.base.MidVE;
import com.bokesoft.yes.mid.dict.DictPolicyFactory;
import com.bokesoft.yes.mid.dict.IDictPolicy;
import com.bokesoft.yes.mid.dict.ItemFilterUtil;
import com.bokesoft.yes.mid.i18n.StringTable;
import com.bokesoft.yes.parser.IHeap;
import com.bokesoft.yes.struct.condition.ConditionPair;
import com.bokesoft.yes.struct.condition.ConditionPairTable;
import com.bokesoft.yes.tools.dic.DictTools;
import com.bokesoft.yes.tools.dic.filter.BaseItemFilter;
import com.bokesoft.yes.tools.preparesql.PrepareSQL;
import com.bokesoft.yigo.common.def.CondSign;
import com.bokesoft.yigo.common.i18n.ILocale;
import com.bokesoft.yigo.common.util.SimpleStringFormat;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.common.MetaCondition;
import com.bokesoft.yigo.meta.common.MetaCustomCondition;
import com.bokesoft.yigo.meta.common.MetaCustomConditionPara;
import com.bokesoft.yigo.meta.dataobject.MetaColumn;
import com.bokesoft.yigo.meta.dataobject.MetaTable;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.base.MidCoreException;
import com.bokesoft.yigo.mid.condition.AbstractConditionBuilder;
import com.bokesoft.yigo.struct.condition.ConditionItem;
import com.bokesoft.yigo.struct.dict.ItemData;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import org.json.JSONObject;

/**
 * 转换SQL
 * 
 * @author chenbiao
 *
 *
 */
public class SqlParse {
	private String sql;
	private MetaTable metaTable;
	private ConditionPairTable conditionPairTable;
	/**
	 * 条件值SQL
	 */
	private PrepareSQL prepareSQL;

	/**
	 * 条件值SQL
	 * 
	 * @return 条件值SQL
	 */
	public PrepareSQL getPrepareSQL() {
		return prepareSQL;
	}

	/**
	 * 条件值SQL
	 * 
	 * @param prepareSQL
	 *            条件值SQL
	 */
	public void setPrepareSQL(PrepareSQL prepareSQL) {
		this.prepareSQL = prepareSQL;
	}

	/**
	 * 列名称对象
	 */
	private Names colNames;

	/**
	 * 列名称对象
	 * 
	 * @return 列名称对象
	 */
	public Names getColNames() {
		return colNames;
	}

	/**
	 * 列名称对象
	 * 
	 * @param colNames
	 *            列名称对象
	 */
	public void setColNames(Names colNames) {
		this.colNames = colNames;
	}

	/**
	 * 转换SQL
	 * 
	 * @param sql
	 *            要进行转换的sql语句
	 * @param metaTable
	 *            对应的数据配置对象
	 * @param conditionPairTable
	 *            对应的查询条件对象
	 * @param prepareSQL
	 *            转换的sql对象
	 * @param names
	 *            字段字符串对象
	 * @param groupNames
	 *            分组字段集合对象
	 */
	public SqlParse(String sql, MetaTable metaTable, ConditionPairTable conditionPairTable, PrepareSQL prepareSQL) {
		this.sql = sql;
		this.metaTable = metaTable;
		this.conditionPairTable = conditionPairTable;
		this.prepareSQL = prepareSQL;
		this.colNames = new Names();
	}

	/**
	 * 获得筛选条件
	 * 
	 * @param context
	 *            中间层对象
	 * @return 筛选条件
	 * @throws Throwable
	 */
	public String getFilter(DefaultContext context) throws Throwable {
		String filter = "";
		if (this.metaTable == null) {
			return filter;
		} else {
			ArrayList<ConditionPair> conditionPairList;
			if ((conditionPairList = conditionPairTable.getPairList(metaTable.getKey())) != null
					&& conditionPairList.size() != 0) {
				Iterator<ConditionPair> iterator = conditionPairList.iterator();

				while (true) {
					ConditionPair conditionPair;
					String itemTag;
					do {
						if (!iterator.hasNext()) {
							return filter;
						}
					} while ((itemTag = (conditionPair = iterator.next()).getItem().getTag()) != null
							&& itemTag.length() > 0);

					String where = getWhere(context, conditionPair);
					if (filter.isEmpty()) {
						filter = where;
					} else if (!where.isEmpty()) {
						filter = filter + " and " + where;
					}
				}
			} else {
				return filter;
			}
		}
	}

	public String getSql(DefaultContext context) throws Throwable {
		if (metaTable == null) {
			return this.sql;
		} else {
			ArrayList<ConditionPair> arg1;
			if ((arg1 = conditionPairTable.getPairList(metaTable.getKey())) != null && arg1.size() != 0) {
				Iterator<ConditionPair> arg4 = arg1.iterator();

				while (arg4.hasNext()) {
					ConditionPair conditionPair = arg4.next();
					String arg3 = conditionPair.getItem().getTag();
					if (arg3 != null && arg3.length() > 0) {
						arg3 = "<condition:" + arg3 + ">";
						String arg5 = this.getWhere(context, conditionPair);
						this.sql = this.sql.replace(arg3, arg5);
					}
				}

				this.sql = this.sql.replaceAll("<condition:[^>]+>", "");
				return this.sql;
			} else {
				return this.sql;
			}
		}
	}

	private String getWhere(DefaultContext arg0, ConditionPair arg1) throws Throwable {
		ConditionItem arg2 = arg1.getItem();
		String arg3 = "";
		if (arg2 == null) {
			return arg3;
		} else {
			String arg4 = "";
			int arg5 = arg2.getCondSign();
			if (arg2.getTarget() != null && arg2.getTarget().length() > 0) {
				if (arg5 != 8) {
					arg4 = arg2.getTarget();
				}
			} else if (arg5 != 8) {
				arg4 = arg2.getColumnKey();
				MetaColumn arg6;
				if ((arg6 = (MetaColumn) metaTable.get(arg4)) == null) {
					throw new MidCoreException(5, "查询字段绑定的数据列  " + arg4 + " 未找到!");
				}

				arg4 = arg6.getBindingDBColumnName();
			}

			colNames.addName(arg4);

			switch (arg5) {
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
				arg3 = this.getWhere(arg0, arg4, arg2, arg5);
				break;
			case 6:
				String arg8 = arg4;
				ConditionItem arg12 = arg1.getHead();
				ConditionItem arg9 = arg1.getTail();
				String arg10 = arg8 + " between ? and ? ";
				boolean arg7;
				if (arg12 != null && arg9 != null) {
					arg10 = arg8 + " between ? and ? ";
					switch (arg12.getType()) {
					case 205:
						arg7 = arg12.isOnlyDate();
						prepareSQL.addValue(a(arg12.getValue(), 0, 0, 0, arg7));
						arg7 = arg9.isOnlyDate();
						prepareSQL.addValue(a(arg9.getValue(), 23, 59, 59, arg7));
						break;
					case 206:
						throw new RuntimeException("字典字段" + arg12.getKey() + "不应该使用between作为查询条件符号,应使用in符号");
					default:
						prepareSQL.addValue(arg12.getValue());
						prepareSQL.addValue(arg9.getValue());
					}
				} else {
					int arg11;
					if (arg12 != null) {
						arg11 = arg12.getType();
						arg10 = arg8 + " >= ?";
						switch (arg11) {
						case 205:
							arg7 = arg12.isOnlyDate();
							prepareSQL.addValue(a(arg12.getValue(), 0, 0, 0, arg7));
							break;
						default:
							arg10 = this.getWhere(arg0, arg8, arg12, 2);
						}
					} else if (arg9 != null) {
						arg11 = arg9.getType();
						arg10 = arg8 + " <= ?";
						switch (arg11) {
						case 205:
							arg7 = arg9.isOnlyDate();
							prepareSQL.addValue(a(arg9.getValue(), 23, 59, 59, arg7));
							break;
						default:
							arg10 = this.getWhere(arg0, arg8, arg9, 4);
						}
					}
				}

				arg3 = arg10;
				break;
			case 7:
				String arg9999 = "";
				if (arg2 != null) {
					arg4 = arg4 + " like ? ";
					switch (arg2.getType()) {
					case 206:
						prepareSQL.addValue(((ItemData) arg2.getValue()).getOID());
						break;
					default:
						prepareSQL.addValue("%" + arg2.getValue() + "%");
					}

					arg9999 = arg4;
				}

				arg3 = arg9999;
				break;
			case 8:
				arg3 = this.getWhere(arg0, conditionPairTable, arg2);
				break;
			case 9:
				arg3 = this.getWhere(arg0, arg4, arg2);
			}

			return arg3;
		}
	}

	private String getWhere(DefaultContext arg0, ConditionPairTable arg1, ConditionItem arg2) throws Throwable {
		arg0.setHostHeap(arg1);
		String arg3 = "";
		String arg4;
		if ((arg4 = arg2.getImpl()) != null && !arg4.isEmpty()) {
			AbstractConditionBuilder arg11;
			(arg11 = (AbstractConditionBuilder) ReflectUtil.newInstance(arg4)).fill(arg0.getDBManager(), arg1);
			arg3 = arg11.getFilter();
			List<Object> arg18;
			if ((arg18 = arg11.getParas()) != null) {
				prepareSQL.addValue(arg18);
			}
		} else {
			boolean arg13 = false;
			MetaCondition arg5;
			if ((arg5 = arg2.getMetaObject()) != null) {
				Iterator<MetaCustomCondition> arg16 = arg5.getCustoms().iterator();
				MetaCustomCondition arg7 = null;

				String arg8;
				while (arg16.hasNext()) {
					MetaCustomCondition arg6;
					if ((arg8 = (arg6 = (MetaCustomCondition) arg16.next()).getCondition()) != null
							&& !arg8.isEmpty()) {
						if (!((Boolean) arg0.getMidParser().eval(0, arg8)).booleanValue()) {
							continue;
						}

						arg7 = arg6;
						break;
					}

					arg7 = arg6;
					break;
				}

				if (arg7 != null) {
					List<String> arg17 = SimpleStringFormat.extrace(arg8 = arg7.getFilter());
					arg8 = SimpleStringFormat.format_v2(arg8, new FormatString());
					HashMap<String, Object> arg12 = new HashMap<String, Object>();
					if (arg1 != null) {
						arg1.extractValue(arg12);
					}

					Iterator<MetaCustomConditionPara> arg9 = arg7.iterator();

					while (arg9.hasNext()) {
						MetaCustomConditionPara arg14 = (MetaCustomConditionPara) arg9.next();
						arg12.put(arg14.getKey(), arg0.getMidParser().eval(0, arg14.getFormula()));
					}

					ArrayList<Object> arg10 = new ArrayList<Object>();

					Object arg20;
					for (Iterator<String> arg15 = arg17.iterator(); arg15.hasNext(); arg10.add(arg20)) {
						String arg19 = (String) arg15.next();
						if (arg12.containsKey(arg19)) {
							arg20 = arg12.get(arg19);
						} else {
							arg20 = conditionPairTable.getValue(arg19);
						}
					}

					arg3 = arg8;
					prepareSQL.addValue(arg10);
					arg13 = true;
				}
			}

			if (!arg13) {
				throw new MidCoreException(17,
						SimpleStringFormat.format(StringTable.getString((ILocale) null, "", "CustomConditionNoImpl"),
								new Object[] { arg2.getKey() }));
			}
		}

		arg0.setHostHeap((IHeap) null);
		return arg3;
	}

	private static Timestamp a(Object arg, int arg0, int arg1, int arg2, boolean arg3) {
		Date arg4 = TypeConvertor.toDate(arg);
		if (arg3) {
			arg4 = DateUtil.getDate(arg4, arg0, arg1, arg2);
		}

		return new Timestamp(arg4.getTime());
	}

	private String getWhere(DefaultContext arg0, String arg1, ConditionItem arg2, int arg3) throws Throwable {
		if (arg2 == null) {
			return "";
		} else {
			String arg7;
			switch (arg2.getType()) {
			case 206:
				String arg5 = "";
				Object arg6;
				if ((arg6 = arg2.getValue()) == null) {
					arg5 = this.b(arg0, arg1, arg2);
				} else if (arg6 instanceof ItemData) {
					arg5 = arg1 + " " + CondSign.toString(arg3) + " ? ";
					prepareSQL.addValue(((ItemData) arg6).getOID());
				}

				arg7 = arg5;
				break;
			case 242:
				arg7 = arg1 + " in (" + this.getWhere(arg0, arg2) + ")";
				break;
			default:
				arg7 = arg1 + " " + CondSign.toString(arg3) + " ? ";
				prepareSQL.addValue(arg2.getValue());
			}

			return arg7;
		}
	}

	@SuppressWarnings("unchecked")
	private String getWhere(DefaultContext arg0, String arg1, ConditionItem arg2) throws Throwable {
		if (arg2 == null) {
			return "";
		} else {
			String arg4;
			String arg13;
			switch (arg2.getType()) {
			case 202:
				String[] arg15 = TypeConvertor.toString(arg2.getValue()).split(",");
				StringBuffer arg19;
				(arg19 = new StringBuffer()).append(arg1).append(" in (");
				int arg17 = arg15.length;

				for (int arg23 = 0; arg23 < arg17; ++arg23) {
					arg4 = arg15[arg23];
					arg19.append("?,");
					prepareSQL.addValue(arg4);
				}

				arg19.deleteCharAt(arg19.length() - 1);
				arg19.append(")");
				arg13 = arg19.toString();
				break;
			case 206:
				String arg18 = arg1;
				SqlParse arg14 = this;
				arg4 = "";
				MidVE arg5 = arg0.getVE();
				StringBuffer arg6 = new StringBuffer();
				Object arg7;
				if ((arg7 = arg2.getValue()) == null) {
					arg4 = this.b(arg0, arg1, arg2);
				} else if (arg7 instanceof List) {
					List<ItemData> arg26 = (List<ItemData>) arg7;
					arg1 = arg2.getItemKey();
					MetaTable arg8;
					arg1 = (arg8 = arg5.getMetaFactory().getDataObject(arg1).getMainTable()).getBindingDBTableName();
					String arg9 = arg8.getOIDColumn().getBindingDBColumnName();
					String arg10 = ((MetaColumn) arg8.get("TLeft")).getBindingDBColumnName();
					String arg11 = ((MetaColumn) arg8.get("TRight")).getBindingDBColumnName();
					Iterator<ItemData> arg27 = arg26.iterator();

					while (arg27.hasNext()) {
						ItemData arg12 = (ItemData) arg27.next();
						if (arg5.getDictCache().getItem(arg12.getItemKey(), arg12.getOID().longValue())
								.getNodeType() == 0) {
							arg6.append("OR " + arg9 + " = ? ");
							arg14.prepareSQL.addValue(arg12.getOID());
						} else {
							arg6.append("OR (" + arg10 + " BETWEEN (SELECT " + arg10 + " FROM ");
							arg6.append(arg1);
							arg6.append(" WHERE " + arg9 + " = ?");
							arg14.prepareSQL.addValue(arg12.getOID());
							arg6.append(") AND (SELECT " + arg11 + " FROM ");
							arg6.append(arg1);
							arg6.append(" WHERE " + arg9 + " = ?");
							arg14.prepareSQL.addValue(arg12.getOID());
							arg6.append(")) ");
						}
					}

					String arg28 = ((MetaColumn) arg8.get("Enable")).getBindingDBColumnName();
					String arg29 = DictTools.getEnableWhereClause(arg2.getStateMask(), arg28);
					arg28 = "";
					if (arg29 != null && !arg29.isEmpty()) {
						arg28 = arg29;
					}

					if (arg6.length() > 0) {
						String arg24 = arg6.substring(3);
						if (arg28.isEmpty()) {
							arg28 = arg24;
						} else {
							arg28 = arg28 + " AND " + arg24;
						}
					}

					JSONObject arg25;
					if ((arg25 = arg2.getFilter()) != null && arg25.length() > 0) {
						BaseItemFilter arg20;
						(arg20 = new BaseItemFilter()).fromJSON(arg25);
						PrepareSQL arg21 = ItemFilterUtil.getFilterSQL(arg0, arg20);
						arg28 = arg28 + " AND " + arg21.getSQL();
						arg14.prepareSQL.addAllValue(arg21.getPrepareValues());
					}

					if (!arg28.isEmpty()) {
						String arg22 = "SELECT " + arg9 + " FROM " + arg1 + " WHERE " + arg28;
						arg4 = arg18 + " in (" + arg22 + ")";
					}
				}

				arg13 = arg4;
				break;
			case 242:
				arg13 = arg1 + " in (" + this.getWhere(arg0, arg2) + ")";
				break;
			default:
				throw new RuntimeException("字段" + arg2.getKey() + "不应该使用in作为查询条件符号");
			}

			return arg13;
		}
	}

	private String b(DefaultContext arg0, String arg1, ConditionItem arg2) throws Throwable {
		String arg3 = "";
		MidVE arg9 = arg0.getVE();
		if (arg2.getValue() == null) {
			String arg4 = arg2.getItemKey();
			MetaTable arg13;
			String arg5 = (arg13 = arg9.getMetaFactory().getDataObject(arg4).getMainTable()).getBindingDBTableName();
			String arg6 = arg13.getOIDColumn().getBindingDBColumnName();
			String arg7 = "";
			JSONObject arg8;
			if ((arg8 = arg2.getFilter()) != null && arg8.length() > 0) {
				arg4 = ((MetaColumn) arg13.get("Enable")).getBindingDBColumnName();
				String arg11;
				if ((arg11 = DictTools.getEnableWhereClause(arg2.getStateMask(), arg4)) != null && !arg11.isEmpty()) {
					arg7 = arg11;
				}

				BaseItemFilter arg12;
				(arg12 = new BaseItemFilter()).fromJSON(arg8);
				PrepareSQL arg10 = ItemFilterUtil.getFilterSQL(arg0, arg12);
				arg7 = arg7 + " AND " + arg10.getSQL();
				prepareSQL.addValue(arg10.getPrepareValues());
			}

			if (!arg7.isEmpty()) {
				arg3 = "(" + arg1 + " = 0 OR " + arg1 + " IN (SELECT " + arg6 + " FROM " + arg5 + " WHERE " + arg7
						+ "))";
			}
		}

		return arg3;
	}

	@SuppressWarnings("unchecked")
	private String getWhere(DefaultContext arg0, ConditionItem arg1) throws Throwable {
		String arg2 = arg1.getItemKey();
		MidVE arg4 = arg0.getVE();
		IDictPolicy arg5 = DictPolicyFactory.INSTANCE.createDictPolicy(arg4, arg2);
		Object arg8 = arg1.getValue();
		int arg7 = arg1.getStateMask();
		String arg3 = "";
		if (arg8 instanceof ItemData) {
			PrepareSQL arg9 = arg5.getAllChildrenSQL((ItemData) arg8, arg7);
			prepareSQL.addValue(arg9.getPrepareValues());
			arg3 = arg9.getSQL();
		} else if (arg8 instanceof List) {
			List<ItemData> arg10 = (List<ItemData>) arg8;
			PrepareSQL arg6 = arg5.getAllChildrenSQL(arg10, arg7);
			prepareSQL.addValue(arg6.getPrepareValues());
			arg3 = arg6.getSQL();
		}

		return arg3;
	}

	public static String appendFilter(String arg0, String... arg1) {
		StringBuilder arg2 = new StringBuilder(arg0);
		arg0 = containWhere(arg0) ? " and " : " where ";
		ArrayList<String> arg3 = new ArrayList<String>();
		int arg4 = arg1.length;

		for (int arg5 = 0; arg5 < arg4; ++arg5) {
			String arg6;
			if ((arg6 = arg1[arg5]) != null && arg6.length() != 0) {
				arg3.add(arg6);
			}
		}

		if (arg3.size() > 0) {
			arg2.append(arg0);
		}

		for (int arg7 = 0; arg7 < arg3.size(); ++arg7) {
			arg2.append("(");
			arg2.append((String) arg3.get(arg7));
			arg2.append(")");
			if (arg7 < arg3.size() - 1) {
				arg2.append(" and ");
			}
		}

		return arg2.toString();
	}

	public static boolean containWhere(String arg) {
		if (arg != null && arg.length() != 0) {
			ArrayList<Integer> arg0 = new ArrayList<Integer>();
			ArrayList<Integer> arg1 = new ArrayList<Integer>();
			int arg2 = 0;

			for (int arg3 = 0; arg3 < arg.length(); ++arg3) {
				char arg4;
				if ((arg4 = arg.charAt(arg3)) == 40) {
					if (arg2 == 0) {
						arg0.add(Integer.valueOf(arg3));
					}

					++arg2;
				} else if (arg4 == 41) {
					--arg2;
					if (arg2 == 0) {
						arg1.add(Integer.valueOf(arg3 + 1));
					}
				}
			}

			StringBuffer arg5 = new StringBuffer(arg.toLowerCase());

			for (int arg6 = arg1.size() - 1; arg6 >= 0; --arg6) {
				arg5.delete(((Integer) arg0.get(arg6)).intValue(), ((Integer) arg1.get(arg6)).intValue());
			}

			return arg5.indexOf("where") > 0;
		} else {
			return false;
		}
	}

	public static Names getSumNames(DefaultContext context, Settings settings, MetaTable metaTable, Names names,
			Names groupNames, Names sumNames) throws Throwable {
		Names noGroupNames = new Names(settings.getProperty("NoGroup"));
		String sumType = settings.getProperty("SumType");
		Settings emptyField = null;
		if (settings.containsMap("EmptyField")) {
			emptyField = settings.getMap("EmptyField");
		}
		Names colNames = new Names();
		Iterator<MetaColumn> iterator = metaTable.iterator();
		while (iterator.hasNext()) {
			MetaColumn metaColumn = iterator.next();
			String name = metaColumn.getBindingDBColumnName();

			if (sumNames.containsName(name)) {
				sumNames.removeName(name);
				if (sumType.equalsIgnoreCase("Count")) {
					name = sumType + "(*) " + name;
				} else {
					name = sumType + "(" + name + ") " + name;
				}
				sumNames.addName(name);
				continue;
			}

			if (names.containsName(name)) {
				if (!noGroupNames.containsName(name)) {
					colNames.addName(name);
					groupNames.addName(name);
					continue;
				}
			} else {
				if (emptyField != null && emptyField.containsProperty(name)) {
					name = emptyField.getProperty(name);
					colNames.addName(name);
					continue;
				}
			}

			int type = metaColumn.getDataType();
			switch (type) {
			case 1001:
				name = "0 " + name;
				break;
			case 1010:
				name = "-1 " + name;
				break;
			case 1009:
				name = "0 " + name;
				break;
			case 1002:
			case 1008:
			case 1011:
			case 1012:
				name = "'' " + name;
				break;
			case 1003:
			case 1004:
				name = "'' " + name;
				break;
			case 1005:
			case 1006:
			case 1007:
				name = "0.0 " + name;
				break;
			default:
				name = "'' " + name;
				break;
			}
			colNames.addName(name);

		}
		return colNames;
	}
}

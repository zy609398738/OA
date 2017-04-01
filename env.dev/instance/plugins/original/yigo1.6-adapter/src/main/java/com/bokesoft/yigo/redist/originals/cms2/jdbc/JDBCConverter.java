package com.bokesoft.yigo.redist.originals.cms2.jdbc;

import java.math.BigDecimal;
import java.sql.Time;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 依据 {@link java.sql.Types} 进行数值的转换
 * @author zzj
 * @see /ecomm/branches/20160119-trunk-2.0/modules/backend/core/src/main/java/com/bokesoft/cms2/basetools/jdbc/JDBCConverter.java,
 *      revision 46956.
 */
public class JDBCConverter {
	public static String JDBC_CHAR = "CHAR";
	public static String JDBC_VARCHAR = "VARCHAR";
	public static String JDBC_LONGVARCHAR = "LONGVARCHAR";
	public static String JDBC_BIT = "BIT";
	public static String JDBC_BOOLEAN = "BOOLEAN";
	public static String JDBC_BOOL = "BOOL";
	public static String JDBC_DECIMAL = "DECIMAL";
	public static String JDBC_NUMERIC = "NUMERIC";
	public static String JDBC_DOUBLE = "DOUBLE";
	public static String JDBC_FLOAT = "FLOAT";
	public static String JDBC_REAL = "REAL";
	public static String JDBC_INTEGER = "INTEGER";
	public static String JDBC_INT = "INT";
	public static String JDBC_SMALLINT = "SMALLINT";
	public static String JDBC_TINYINT = "TINYINT";
	public static String JDBC_BIGINT = "BIGINT";
	public static String JDBC_DATE = "DATE";
	public static String JDBC_TIME = "TIME";
	public static String JDBC_DATETIME = "DATETIME";
	public static String JDBC_TIMESTAMP = "TIMESTAMP";
	
	private static Map<String,Integer> MAP_STRING = new HashMap<String, Integer>();
	
	private static Map<String,Integer> MAP_BOOLEAN = new HashMap<String, Integer>();
	
	private static Map<String,Integer> MAP_DECIMAL = new HashMap<String, Integer>();
	
	private static Map<String,Integer> MAP_INTEGER = new HashMap<String, Integer>();
	
	private static Map<String,Integer> MAP_DOUBLE = new HashMap<String, Integer>();
	
	private static final String[] TYPE_LIST_STRING = new String[] { JDBC_CHAR,
			JDBC_VARCHAR, JDBC_LONGVARCHAR };
	private static final String[] TYPE_LIST_BOOLEAN = new String[] { JDBC_BIT,
			JDBC_BOOLEAN, JDBC_BOOL };
	private static final String[] VALUE_LIST_BOOLEAN_TRUE = new String[] {
			"TRUE", "T", "YES", "Y", "1" };
	private static final String[] TYPE_LIST_DECIMAL = new String[] {
			JDBC_DECIMAL, JDBC_NUMERIC, JDBC_DOUBLE, JDBC_FLOAT, JDBC_REAL };
	private static final String[] TYPE_LIST_INTEGER = new String[] {
			JDBC_INTEGER, JDBC_INT, JDBC_SMALLINT, JDBC_TINYINT };
	static {
		Arrays.sort(TYPE_LIST_STRING);
		Arrays.sort(TYPE_LIST_BOOLEAN);
		Arrays.sort(VALUE_LIST_BOOLEAN_TRUE);
		Arrays.sort(TYPE_LIST_DECIMAL);
		Arrays.sort(TYPE_LIST_INTEGER);
		MAP_STRING.put(JDBC_CHAR, 1);
		MAP_STRING.put(JDBC_VARCHAR, 1);
		MAP_STRING.put(JDBC_LONGVARCHAR, 1);
		MAP_BOOLEAN.put(JDBC_BIT, 2);
		MAP_BOOLEAN.put(JDBC_BOOLEAN, 2);
		MAP_BOOLEAN.put(JDBC_BOOL, 2);
		MAP_DECIMAL.put(JDBC_DECIMAL, 3);
		MAP_DECIMAL.put(JDBC_NUMERIC, 3);
		MAP_INTEGER.put(JDBC_INTEGER, 4);
		MAP_INTEGER.put(JDBC_INT, 4);
		MAP_INTEGER.put(JDBC_SMALLINT, 4);
		MAP_INTEGER.put(JDBC_TINYINT, 4);
		MAP_DOUBLE.put(JDBC_DOUBLE, 5);
		MAP_DOUBLE.put(JDBC_FLOAT, 5);
		MAP_DOUBLE.put(JDBC_REAL, 5);
	}

    private JDBCConverter() {
    }

    /**
	 * 依据 JDBC 类型将数据转换为合适类型的对象
	 * @param sourceValue
	 * @param tgtJdbcType
	 * @return
	 */
	public static Object jdbcObjectConvert(Object sourceValue, String tgtJdbcType) {
		Object targetValue = null;
		
		String tmp = object2String(sourceValue);
		targetValue = string2Object(tmp, tgtJdbcType);

		return targetValue;
	}

	/**
	 * 依据 JDBC 类型将字符串转换为合适的数据对象
	 * @param value
	 * @param sqlTypeName
	 * @return
	 */
	private static Object string2Object(String value, String sqlTypeName) {
		try {
			return _string2Object(value, sqlTypeName);
		} catch (ParseException e) {
			throw new RuntimeException(e);
		}
	}
	private static Object _string2Object(String value, String sqlTypeName) throws ParseException {
		if (null == value) {
			return null;
		}
		if (isStringExistsIn(sqlTypeName, TYPE_LIST_STRING)) {
			return value;
		}

		// 非字符串类型, 不需要考虑头尾空格
		value = value.trim();

		if (isStringExistsIn(sqlTypeName, TYPE_LIST_BOOLEAN)) {
			return isStringExistsIn(value, VALUE_LIST_BOOLEAN_TRUE);
		}
		if (isStringExistsIn(sqlTypeName, TYPE_LIST_DECIMAL)) {
			return new BigDecimal(value);
		}
		if (JDBC_BIGINT.equalsIgnoreCase(sqlTypeName)) {
			if (value.indexOf('.') >= 0) {
				return (new BigDecimal(value)).longValue();
			} else {
				return new Long(value);
			}
		}
		if (isStringExistsIn(sqlTypeName, TYPE_LIST_INTEGER)) {
			if ("TRUE".equalsIgnoreCase(value) || "FALSE".equalsIgnoreCase(value)) {
				// 如果传入的实际上是布尔型，则返回0或1
				return "TRUE".equalsIgnoreCase(value) ? 1 : 0;
			} else {
				if (value.indexOf('.') >= 0) {
					// 如果含有小数点，则先转换成BigDecimal后
					return (new BigDecimal(value)).intValue();
				} else {
					return new Integer(value);
				}
			}
		}
		if (JDBC_DATE.equalsIgnoreCase(sqlTypeName)) {
			Date date = DateHelper.stdString2Date(value);
			return new java.sql.Date(date.getTime());
		}
		if (JDBC_TIME.equalsIgnoreCase(sqlTypeName)) {
			Date time;
			try {
				time = DateHelper.stdString2Time(value);
			} catch (ParseException e) {
				//对于一个不是仅包含时间部分的字符串，尝试使用日期时间格式解析
				time = DateHelper.stdString2Date(value);
			}
			return new Time(time.getTime());
		}
		if (JDBC_DATETIME.equalsIgnoreCase(sqlTypeName) || JDBC_TIMESTAMP.equalsIgnoreCase(sqlTypeName)) {
			Date date = DateHelper.stdString2Date(value);
			return new Timestamp(date.getTime());
		}
		// return value for unknown type
		return value;
	}

	private static boolean isStringExistsIn(String jdbcType, String[] strTypes) {
		return Arrays.binarySearch(strTypes, jdbcType.toUpperCase()) >= 0;
	}
	private static String object2String(Object value) {
		if (value instanceof java.sql.Date) {
			return DateHelper.date2String((Date) value, "yyyy/MM/dd Z");
		} else if (value instanceof Time) {
			return DateHelper.date2String((Date) value, "HH:mm:ss.SSS Z");
		} else if (value instanceof Date) { // Timestamp or java.util.Date
			return DateHelper.date2String((Date) value, "yyyy/MM/dd HH:mm:ss.SSS Z");
		} else if (value instanceof BigDecimal) {
			return ((BigDecimal) value).toPlainString();
		} else {
			return value.toString();
		}
	}
	
	public static final class DateHelper{
		/**匹配 ＋0800， －0700 这样的时区表达的正则表达式*/
		private static Pattern END_WITH_TIMEZONE = Pattern.compile(".*\\s+([\\+|-][0-1]\\d00)$");
		/**所有认为标准的日期格式*/
		private static String[] STD_DATE_FORMATS = new String[]{
			"yyyy/M/d H:m:s.S Z", "yyyy/M/d H:m:s Z", "yyyy/M/d H:m Z", "yyyy/M/d Z"
		};
		/**所有认为标准的时间格式*/
		private static String[] STD_TIME_FORMATS = new String[]{
			"H:m:s.S Z", "H:m:s Z", "H:m Z"
		};

        private DateHelper() {
        }

        private static String splitTimeZone(String s){
			Matcher m = END_WITH_TIMEZONE.matcher(s);
			if (m.matches()){
				return m.group(1);
			}else{
				return null;
			}
		}
		private static String getCurrTimeZone() {
			int offset = TimeZone.getDefault().getRawOffset();
			String wOrE = "";
			if (offset > 0)
				wOrE = "+";
			else
				wOrE = "-";
			String timeZoneCode = String.valueOf(offset / (60 * 60 * 1000));
			if (timeZoneCode.length() < 2) {
				timeZoneCode = wOrE + "0" + timeZoneCode + "00";
			} else {
				timeZoneCode = wOrE + timeZoneCode + "00";
			}
			return timeZoneCode;
		}
		private static Date _string2Date(String sDate, String fmt, String timeZone) {
			Date date;
			SimpleDateFormat ofmt = new SimpleDateFormat(fmt);
			try {
				date = ofmt.parse(sDate);
			} catch (ParseException e) {
				date = null;
			}
			return date;	//FIXME: 在目前的 JDK 中, 无论使用什么方法, 返回的 Date 对象一定是当前时区的
		}
		/**
		 * 将标准的日期/时间字符串自动转换为日期(带时区，没有则默认当前时区)<br>
		 * 目前只处理 8 种格式 :<br>
		 * yyyy/MM/dd HH:mm:ss.SSS Z, yyyy/M/d H:m:s.S Z<br>
		 * yyyy/MM/dd HH:mm:ss Z, yyyy/M/d H:m:s Z<br>
		 * yyyy/MM/dd HH:mm Z, yyyy/M/d H:m Z<br>
		 * yyyy/MM/dd Z, yyyy/M/d Z <br>
		 * 其中日期的分隔符除了可以是'/'之外, 还可以是'-', 但时间分隔符只能是':'! <br>
		 * 注意此函数是建立在这样一个事实的基础上:<br>
		 * 1)yyyy/M/d H:m:s'Z'Z的模式也可以用于解析yyyy/MM/dd HH:mm:ss'Z'Z模式;<br>
		 * 2)实际输入字符串中各部分数字前的空格并不影响解析;(例如:" 2002/ 4/ 06 1: 05 +0000")<br>
		 * 
		 * @param dateString 日期时间字符串
		 * @return 解析得到的日期时间对象, 如果解析失败, 返回 null
		 * @throws ParseException 
		 */
		public static Date stdString2Date(String dateString) throws ParseException {
			String sDate = dateString;
			if (null==sDate) return null;
			
			// 处理头尾空格
			sDate = sDate.trim();

			String tz = splitTimeZone(sDate);
			String tm = sDate;
			if (null==tz){
				tz = getCurrTimeZone();
			}else{
				tm = sDate.substring(0, sDate.length() - tz.length());
			}
			// 将'-'分隔符替换为'/'分隔符
			tm = tm.replace("-", "/");
			sDate = tm.trim() + " " +tz;
			
			// 通过尝试获得合适的返回值
			for (int i=0; i<STD_DATE_FORMATS.length; i++){
				Date date = _string2Date(sDate, STD_DATE_FORMATS[i], tz);
				if (date != null) {
					return (date);
				}
			}		
			// 如果不能解析 ...
            return null;
		}
		/**
		 * 将时间字符串解析成日期时间对象(带时区，没有则默认当前时区)
		 * @param timeString 时间字符串
		 * @return 解析得到的日期时间对象, 如果解析失败, 返回 null
		 * @throws ParseException 
		 */
		public static Date stdString2Time(String timeString) throws ParseException {
			String sTime = timeString;
			if (null==sTime) return null;
			
			// 处理头尾空格
			sTime = sTime.trim();
			
			String tz = splitTimeZone(sTime);
			String tm = sTime;
			if (null==tz){
				tz = getCurrTimeZone();
			}else{
				tm = sTime.substring(0, sTime.length() - tz.length());
			}
			sTime = tm + " " +tz;
			
			// 通过尝试获得合适的返回值
			for (int i=0; i<STD_TIME_FORMATS.length; i++){
				Date time = _string2Date(sTime, STD_TIME_FORMATS[i], tz);
				if (time != null) {
					return (time);
				}
			}		
			// 如果不能解析 ...
			throw new ParseException("Unparseable date: \""+timeString+"\"", -1);
		}		
		/**
		 * 格式化日期到指定格式(采用默认 Locale)<br>
		 * (具体格式参见java.text.SimpleDateFormat的有关文档)
		 * @param date 日期时间对象
		 * @param fmt 格式字符串
		 * @return 经过格式化的日期字符串
		 */
		public static String date2String(Date date, String fmt) {
			return date2String(date, fmt, Locale.getDefault());
		}

		/**
		 * 格式化日期到指定格式<br>
		 * (具体格式参见java.text.SimpleDateFormat的有关文档)
		 * @param date 日期时间对象
		 * @param fmt 格式字符串
		 * @param loc 地区编码
		 * @return 经过格式化的日期字符串
		 */
		public static String date2String(Date date, String fmt, Locale loc) {
			return new SimpleDateFormat(fmt, loc).format(date);
		}
	}
}

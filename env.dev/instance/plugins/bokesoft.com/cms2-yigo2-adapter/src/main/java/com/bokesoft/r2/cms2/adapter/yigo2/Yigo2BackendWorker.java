package com.bokesoft.r2.cms2.adapter.yigo2;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.reflect.FieldUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bokesoft.cms2.adapter.BackendWorker;
import com.bokesoft.cms2.adapter.exception.BackendException;
import com.bokesoft.cms2.adapter.exception.DAException;
import com.bokesoft.cms2.adapter.exception.TXException;
import com.bokesoft.cms2.adapter.supports.JdbcDataAccessSupport;
import com.bokesoft.cms2.adapter.supports.TransactionSupport;
import com.bokesoft.cms2.basetools.jdbc.DBTypeUtils;
import com.bokesoft.cms2.basetools.util.Misc;
import com.bokesoft.cms2.extension.acl.IdentityAdapter;
import com.bokesoft.r2.cms2.adapter.yigo2.tools.Yigo2Helper;
import com.bokesoft.yes.mid.connection.dbmanager.GeneralDBManager;
import com.bokesoft.yes.mid.session.ISessionInfo;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.mid.util.ContextBuilder;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.env.Env;

public class Yigo2BackendWorker implements BackendWorker, TransactionSupport, JdbcDataAccessSupport {
	private static final Logger log = LoggerFactory.getLogger(Yigo2BackendWorker.class);

	/** Yigo 2.0 的登录模式, 1 代表 PC 模式登录 */
	public static final int LOGIN_MODE_PC = 1;
	/** 通过 {@link IdentityAdapter} 等途径将 Yigo 2.0 的 ClientID 置入当前上下文 */
	public static final String CLIENT_ID_IN_REQUEST = Yigo2BackendWorker.class.getName()+":CLIENT_ID_IN_REQUEST";
	
    private final HttpServletRequest request;
	private final HttpServletResponse response;
	private DefaultContext context = null;

	public Yigo2BackendWorker(HttpServletRequest request, HttpServletResponse response) {
		//由于 BackendWorker 生存期限就是一个 request, 所以可以使用成员变量存储 request/response
        this.request = request;
        this.response = response;
	}

    public HttpServletRequest getRequest() {
		return request;
	}
	public HttpServletResponse getResponse() {
		return response;
	}

	public DefaultContext getYigo2Ctx() throws BackendException{
		if (context != null) {
			return context;
		}else{
			throw new DAException("Yigo2 context not initialized");
		}
	}
	
	@Override
	public void open() throws BackendException {
		context = ContextBuilder.create();
		Env env = context.getEnv();

		//FIXME: 模拟一个登录的 Yigo 会话, 应该使用 Yigo 提供的 API
		Object tmp = request.getAttribute(CLIENT_ID_IN_REQUEST);
		if (null!=tmp){
			ISessionInfo si = Yigo2Helper.getLoginSession(tmp.toString());
			if (null!=si){
				env.setClientID(si.getClientID());
				env.setClientIP(si.getIP());
				env.setClusterid(si.getClusterID());
				env.setGuestUserID(si.getGuestUserID());
				env.setMode(si.getMode());
				env.setSessionParas(si.getSessionParas());
				env.setTicketID(si.getTicketID());
				//env.setUserCode(?);
				env.setUserID(si.getOperatorID());
				//env.setUserName(?);
			}
		}

		env.setMode(LOGIN_MODE_PC);	//模拟 PC 登录
		
		if (log.isDebugEnabled()) {
            log.debug("Yigo2 transaction started: " + context);
        }
	}

	@Override
	public void close() {
		if (context != null) {
			try {
				context.close();
			} catch (Throwable e) {
				log.error("ERROR on context close: "+e.getClass() + ": "+e.getMessage());
			}
		}
        if (log.isDebugEnabled()) {
            log.debug("Yigo2 transaction closed: " + context);
        }
	}

	@Override
	public void transCommit() throws TXException {
		if (null!=context){
			try {
				context.commit();
			} catch (Throwable e) {
				throw new TXException(e);
			}
		}
	}

	@Override
	public void transRollback() throws TXException {
		if (null!=context){
			try {
				context.rollback();
			} catch (Throwable e) {
				throw new TXException(e);
			}
		}
	}

	@Override
	public List<Map<String, Object>> dataQuery(String ql, Object[] args) throws DAException {
		Misc.$assert(null==context, "Yigo2 context not initialized");
		try {
			DataTable dt = context.getDBManager().execPrepareQuery(ql, args);
			return Yigo2Helper.wrapDataTable(dt);
		} catch (Throwable e) {
			throw new DAException(e);
		}
	}

	@Override
	public int dataUpdate(String ql, Object[] args) throws DAException {
		Misc.$assert(null==context, "Yigo2 context not initialized");
		try {
			int count = context.getDBManager().execPrepareUpdate(ql, args);
			return count;
		} catch (Throwable e) {
			throw new DAException(e);
		}
	}

	@Override
	public Connection getConnection() throws SQLException {
		Misc.$assert(null==context, "Yigo2 context not initialized");
		IDBManager dbm;
		try {
			dbm = context.getDBManager();
			if (dbm instanceof GeneralDBManager){
				//FIXME: 此处获取 connection 的方法存在不兼容的风险, 尤其是在 Yigo2 支持多数据库的情况下
				Connection conn = (Connection)FieldUtils.readField(dbm, "connection", true);
				return conn;
			}else{
				throw new UnsupportedOperationException("Unsupported IDBManager instance: "+dbm.getClass().getName());
			}
		} catch (Throwable e) {
			throw new SQLException(e);
		}
	}

	@Override
	public String adaptSqlRange(String sql, int from, int size) throws SQLException {
		Misc.$assert(null==context, "Yigo2 context not initialized");
		
		return DBTypeUtils.adaptSqlRange(sql, from, size, getConnection().getMetaData().getURL());
	}

}

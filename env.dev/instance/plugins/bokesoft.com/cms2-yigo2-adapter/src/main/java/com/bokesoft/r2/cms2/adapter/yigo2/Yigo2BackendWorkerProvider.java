package com.bokesoft.r2.cms2.adapter.yigo2;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.bokesoft.cms2.adapter.BackendWorker;
import com.bokesoft.cms2.adapter.BackendWorkerProvider;

public class Yigo2BackendWorkerProvider implements BackendWorkerProvider{

	public BackendWorker createBackendWorker(HttpServletRequest request, HttpServletResponse response) {
		return new Yigo2BackendWorker(request, response);
	}

}

package com.bokesoft.services.messager.server.model;

public class RpcReturnCode {
	private static int STATE_ERROR = 0;
	private static int STATE_OK = 1;
	
	private int success;
	private String message;
	
	private RpcReturnCode(int state, String msg){
		//私有的静态方法防止在外部被初始化
		this.success = state;
		this.message = msg;
	}
	
	public static RpcReturnCode success(){
		return new RpcReturnCode(STATE_OK, null);
	}
	
	public static RpcReturnCode error(String message){
		return new RpcReturnCode(STATE_ERROR, message);
	}

	public int getSuccess() {
		return success;
	}
	public String getMessage() {
		return message;
	}
}

/**
 * 密码输入框。
 * 继承自TextEditor。
 */
YIUI.Control.PasswordEditor = YIUI.extend(YIUI.Control.TextEditor, {

	/**
	 * String。
	 * 自动创建为type为password的input。
	 */
    inputType: 'password',

    handler: YIUI.PasswordEditorHandler
    
});
YIUI.reg('passwordeditor', YIUI.Control.PasswordEditor);
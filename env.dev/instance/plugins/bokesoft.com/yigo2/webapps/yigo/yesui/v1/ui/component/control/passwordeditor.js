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

    handler: YIUI.PasswordEditorHandler,
    
    initDefaultValue: function(options) {
		this.el = options.el;
		this._input = $("input", options.el);
		
		if(options.preicon) {
			this.setPreIcon(options.preicon);
		}
		if(options.embedtext) {
			this.setEmbedText(options.embedtext);
		}
		if(!options.selectonfocus) {
			this.selectOnFocus = options.selectonfocus;
		}
		if(options.error) {
			this.setError(options.error);
		}
    }
});
YIUI.reg('passwordeditor', YIUI.Control.PasswordEditor);
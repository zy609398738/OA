var FocusPolicy = FocusPolicy || {};
(function () {
    FocusPolicy = function (form) {
        var Return = {
            form: form,
            requestNextFocus: function (comp) {
                if (comp == undefined || comp == null) {
                    Return.focusNextNode(0, Return.form.getTabCompList().length);
                } else {
                    Return.doFocusNext(comp.getTabIndex());
                }
            },
            doFocusNext: function (tabIndex) {
                var nextIndex = tabIndex + 1, len = Return.form.getTabCompList().length;
                if (nextIndex < len) {
                    Return.focusNextNode(nextIndex, len);
                } else {
                    Return.focusNextNode(0, len);
                }
            },
            focusNextNode: function (begin, len) {
                var match = false, index = begin;
                var matchNextNode = function (index) {
                    var comp = Return.form.getTabCompList()[index];
                    var tabPanel = $(comp.el).parents(".ui-tabs-panel");
                    var isActive = (tabPanel.length > 0 && tabPanel[0].style.display !== "none") || (tabPanel.length == 0);
                    if (comp.enable && comp.visible && isActive) {
                        if (comp.type == YIUI.CONTROLTYPE.GRID) {
                            comp.initFirstFocus();
                            return true;
                        } else {
                        	var el = comp.el[0]
                        	if(el.getBoundingClientRect().top < document.documentElement.clientHeight && el.getBoundingClientRect().left < document.documentElement.clientWidth) {
                        		comp.focus();
                        		return true;
                        	}
                        }
                    }
                    return false;
                };
                while (index < len && !match) {
                    match = matchNextNode(index);
                    index++;
                }
                if (!match) {
                    index = 0;
                    while (index < begin && !match) {
                        match = matchNextNode(index);
                        index++;
                    }
                }
            }
        };
        return Return;
    };
})();
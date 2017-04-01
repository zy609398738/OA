/**
 * Created by chenbinbin on 16-11-22.
 */

YIUI.Component.Gantt = YIUI.extend(YIUI.Component, {
    handler: {},

    onRender : function(ct) {
        this.base(ct);
        var form = YIUI.FormStack.getForm(this.ofFormID);
        //var baseGrid = form.getComponent("detail");
        this.el.addClass("gantt");
        //var dateSrv = YIUI.GanttUtil.getDateSrv("d");
        var ctx = {form: form};
        this.handler = $.gantt(this.el, ctx, this.paras);
    },

    getValue: function () {
        return "";
    },

    refresh: function(canWrite) {
        this.handler.refreshGantt(canWrite);
    },

    getDateSrv: function() {
        return this.handler.getDateSrv();
    }
});
YIUI.reg("gantt", YIUI.Component.Gantt);

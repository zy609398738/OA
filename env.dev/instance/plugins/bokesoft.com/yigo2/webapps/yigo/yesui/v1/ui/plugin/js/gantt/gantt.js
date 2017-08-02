/**
 * Created by chenbinbin on 16-11-16.
 */
(function ($) {
    var GTT = YIUI.GANTT = YIUI.GANTT || {};

    if (!$.loadSingleRes) {
        $.extend($, {
            loadSingleRes: function (path, fn, media, title){
                var el,i;
                var type = path.substr(path.lastIndexOf(".")+1);
                if (type=="js") {
                    var els=document.getElementsByTagName("script");
                    for(i=0;i<els.length;i++) {
                        if(els[i].src && els[i].src.indexOf(path)!=-1 || els[i].title==title) {
                            fn && fn();
                            return els[i];
                        }
                    }
                    el = document.createElement("script");
                    el.type="text/javascript";
                    el.src=path;
                    if(title) el.title = title;
                }
                else if(type=="css") {
                    var ls=document.getElementsByTagName("link");
                    for( i=0; i<ls.length; i++) {
                        if(ls[i].href && ls[i].href.indexOf(path)!=-1 || ls[i].title==title) {
                            fn && fn();
                            return ls[i];
                        }
                    }
                    el = document.createElement("link");
                    el.rel="stylesheet";
                    el.type="text/css";
                    el.href=path;
                    if (title) el.title=title;
                    if (media) el.media = media;
                    el.disabled = false;
                }
                else return;

                el.onload = el.onreadystatechange = function () {
                    if (!el.readyState || 'loaded' === el.readyState || 'complete' === el.readyState) {
                        console.log(path + ": loaded");
                        el.onload = el.onreadystatechange = null;
                        fn && fn();
                    }
                };

                var head = document.getElementsByTagName("head")[0];
                head.appendChild(el);
                return el;
            }
        });
    }

    if (!$.loadRes) {
        $.extend($, {
            loadRes: function(res, callback) {
                (function loadRecurse(count, callback) {
                    if (count == res.length) {
                        callback && callback();
                    } else {
                        if (res[count]) {
                            $.loadSingleRes(res[count].path, function () {
                                loadRecurse(++count, callback);
                            }, res[count].media);
                        }
                    }
                })(0, callback);
            }
        });

    }

    $.extend( $, {
        gantt: function($parent, ctx, paras) {
            var form = ctx.form;
            var oid = form.OID;
            var dataObjectKey = form.dataObjectKey;
            var ganttKey = "gantt-" + form.formKey + "-" + form.formID;
            $parent.attr("id", ganttKey);

            var zoom = "m", unit = 'd', step = "86400000";
            var dataService, dateSrv;
            var sourceType = paras.sourceType;
            if (sourceType == 'grid') {
                var gridKey = paras.source;
                var compGrid = form.getComponent(gridKey);
                zoom = (paras.zoom ? paras.zoom : zoom);
                unit = (paras.unit ? paras.unit : unit);
                var dayStartTime;
                if (paras.dayStartTime)  dayStartTime = eval("(" + paras.dayStartTime + ")");
                var dayEndTime;
                if (paras.dayEndTime)  dayEndTime =  eval("(" + paras.dayEndTime + ")");
                dateSrv = new DateSrv(unit, dayStartTime, dayEndTime);
                dateSrv.step = (paras.step ? parseInt(paras.step) : step);
            } else {
                dateSrv = new DateSrv(unit);
                dateSrv.step = step;
            }

            var BASE_PATH = "yesui/ui/plugin/js/gantt/";
            function ganttPath(path, media) {
                return {
                    path:BASE_PATH + path,
                    media: media
                } ;
            }

            var res = [
                ganttPath("platform.css"),
                ganttPath("libs/dateField/jquery.dateField.css"),
                ganttPath("gantt.css"),
                ganttPath("ganttPrint.css", "print"),
                ganttPath("libs/jquery.svg.css"),
                ganttPath("libs/jquery-ui.min.js"),
                ganttPath("libs/jquery.livequery.min.js"),
                ganttPath("libs/jquery.timers.js"),
                ganttPath("libs/platform.js"),
                ganttPath("libs/date.js"),
                ganttPath("libs/i18nJs.js"),
                ganttPath("libs/dateField/jquery.dateField.js"),
                ganttPath("libs/JST/jquery.JST.js"),
                ganttPath("libs/jquery.svg.min.js"),
                ganttPath("libs/jquery.svgdom.1.8.js"),
                ganttPath("libs/jquery.ba-resize.js"),
                ganttPath("ganttUtilities.js"),
                ganttPath("ganttTask.js"),
                ganttPath("ganttDrawerSVG.js"),
                ganttPath("ganttGridEditor.js"),
                ganttPath("GridDataService4Grid.js"),
                ganttPath("GridDataService4Svr.js"),
                ganttPath("GanttController.js"),
                ganttPath("GanttView.js"),
                ganttPath("GanttModel.js"),
                ganttPath("GanttI18n.js")
            ];
            var ganttView;
            $.loadRes(res, function() {
                $.JST.loadDecorator("ASSIGNMENT_ROW", function(assigTr, taskAssig) {
                    var resEl = assigTr.find("[name=resourceId]");
                    for (var i in taskAssig.task.master.resources) {
                        var res = taskAssig.task.master.resources[i];
                        var opt = $("<option>");
                        opt.val(res.id).html(res.name);
                        if (taskAssig.assig.resourceId == res.id)
                            opt.attr("selected", "true");
                        resEl.append(opt);
                    }

                    var roleEl = assigTr.find("[name=roleId]");
                    for (var i in taskAssig.task.master.roles) {
                        var role = taskAssig.task.master.roles[i];
                        var optr = $("<option>");
                        optr.val(role.id).html(role.name);
                        if (taskAssig.assig.roleId == role.id)
                            optr.attr("selected", "true");
                        roleEl.append(optr);
                    }

                    if(taskAssig.task.master.canWrite && taskAssig.task.canWrite){
                        assigTr.find(".delAssig").click(function() {
                            var tr = $(this).closest("[assigId]").fadeOut(200, function() {
                                $(this).remove();
                            });
                        });
                    }
                });

                if (sourceType == 'grid') {
                    dataService = new GridDataService4Grid(compGrid);
                } else {
                    dataService = new GridDataService4Svr(dataObjectKey, oid);
                }
                var ganttController = new GanttController(dataService);
                var workSpaceKey = 'workSpace-' + ctx.form.formKey + "-" +ctx.form.formID;
                var $ganttTmpls = $("<div style='display:none;'>");
                $ganttTmpls.load(BASE_PATH + "tmpl-cn.html", function() {
                    $ganttTmpls.loadTemplates().remove();
                    ganttView = ganttController.getView();
                    ganttView.init(workSpaceKey, zoom, dateSrv, $parent);

                    var canWrite = (ctx.form.operationState != YIUI.Form_OperationState.Default);
                    ganttController.loadData(canWrite);
                    $parent.find('.ganttButtonBar div').addClass('buttons');
                });
          });

            return {
                refreshGantt : function(canWrite) {
                    ganttView && ganttView.$el.trigger("load.gantt", canWrite);
                },

                getDateSrv: function() {
                    return dateSrv;
                }
            }
        }
    });
})(jQuery);
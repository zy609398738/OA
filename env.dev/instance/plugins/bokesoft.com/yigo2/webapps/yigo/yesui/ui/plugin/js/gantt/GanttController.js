/**
 * Created by chenbinbin on 17-2-16.
 */

function GanttController( dataService ) {
    //this.dataObjectKey = dataObjectKey;
    this.dataService = dataService;
    var self = this;
    function Observer() {
        return {
            notify: function(sEvent, paras) {
                self.fireEvent(sEvent, paras);
            }
        };
    }
    this.observer = new Observer();
    this.model = new GanttModel(this.observer);
    this.views = [new GanttView(this.observer)];
    this.bindEvents();
}

GanttController.prototype.fireEvent = function(sEvent, paras) {
    for( var i=0; i<this.views.length; i++ ) {
        this.views[i].$el.trigger(sEvent, paras);
    }
};

GanttController.prototype.getView = function() {
    return this.views[0];
};

GanttController.prototype.loadData = function(canWrite) {
    var data = this.dataService.loadGanttData();
    data.canWrite = canWrite;
    this.model.setData(data);
};

GanttController.prototype.saveData = function() {
    this.dataService.saveGanttData();
}

GanttController.prototype.commitData = function() {
    if (this.dataService.isClientSrv()) {
        this.dataService.saveGanttData();
    }
}

/**
 * 绑定按钮事件
 */
GanttController.prototype.bindEvents = function() {
    var self = this;
    for( var i=0; i<this.views.length; i++ ) {
        var view = this.views[i];
        //workSpace.bind("clear.gantt",clearGantt());
        view.$el.bind("save.gantt",function() {
                self.saveData();
            }
        );
        view.$el.bind("load.gantt", function(e, canWrite) {
                self.loadData(canWrite);
            }
        );
        view.$el.bind("commit.gantt", function(e) {
                var ret = view.saveGantt(false);
                self.model.gantData.tasks = ret.tasks;
                self.commitData();
                view.updateTaskRowID(ret.tasks);
            }
        );

        view.$el.bind("editrow.gantt", function(e, rowId) {
            var grid = self.dataService.grid;
            if (grid && grid.hasRowDblClick) {
                var id = parseInt(rowId);
                grid.refreshGrid({populate: true, rowNum:grid.dataModel.data.length});
                var gridRowIndex = grid.getRowIndexByID(id);
                grid.setFocusRowIndex(gridRowIndex);
                grid.gridHandler.doOnRowDblClick(grid, id);
            } else {
                view.showTaskEditor(rowId);
            }
         });

        //view.$el.bind("critical.gantt", function() { view.criticalGantt(); } );
        //view.$el.bind("print.gantt", function() { view.printGantt(); } );
        view.$el.bind("editresources.gantt", function() { view.editResources(); } );


        //ondblClickRow
        //editRow()

        view.$el.bind("refreshTasks.gantt", function(){
            view.redrawTasks();
        }).bind("refreshTask.gantt",function (e, task) {
            view.drawTask(task);
        }).bind("refresh.gantt",function (e) {
            view.loadProject(self.model.getData())
        }).bind("deleteCurrentTask.gantt", function(e) {
            view.deleteCurrentTask();
        }).bind("addAboveCurrentTask.gantt",function () {
            view.addAboveCurrentTask();
        }).bind("addBelowCurrentTask.gantt",function () {
            view.addBelowCurrentTask();
        }).bind("indentCurrentTask.gantt",function () {
            view.indentCurrentTask();
        }).bind("outdentCurrentTask.gantt",function () {
            view.outdentCurrentTask();
        }).bind("moveUpCurrentTask.gantt",function () {
            view.moveUpCurrentTask();
        }).bind("moveDownCurrentTask.gantt",function () {
            view.moveDownCurrentTask();
        }).bind("zoomPlus.gantt",function () {
            view.ganttAlendar.zoomGantt(true);
        }).bind("zoomMinus.gantt",function () {
            view.ganttAlendar.zoomGantt(false);
        }).bind("undo.gantt",function () {
            if(!view.canWrite)
                return;
            view.undo();
        }).bind("redo.gantt", function () {
            if(!view.canWrite)
                return;
            view.redo();
        }).bind("resize.gantt", function () {
            view.resize();
        });

        view.$el.bind("keydown.body", function (e) {
            //manage only events for body -> not from inputs
            if (e.target.nodeName.toLowerCase() == "body" || e.target.nodeName.toLowerCase() == "svg") { // chrome,ff receive "body" ie "svg"
                var eventManaged=true;
                switch (e.keyCode) {
                    case 46: //del
                    case 8: //backspace
                        var focused = view.gantt.element.find(".focused.focused");// orrible hack for chrome that seems to keep in memory a cached object
                        if (focused.is(".taskBox")) { // remove task
                            view.deleteCurrentTask();
                        } else if (focused.is(".linkGroup")) {
                            view.removeLink(focused.data("from"), focused.data("to"));
                        }
                        break;
                    case 38: //up
                        if (view.currentTask) {
                            if (view.currentTask.ganttElement.is(".focused")) {
                                view.moveUpCurrentTask();
                                view.gantt.element.oneTime(100, function () {view.currentTask.ganttElement.addClass("focused");});
                            } else {
                                view.currentTask.rowElement.prev().click();
                            }
                        }
                        break;
                    case 40: //down
                        if (view.currentTask) {
                            if (view.currentTask.ganttElement.is(".focused")) {
                                view.moveDownCurrentTask();
                                view.gantt.element.oneTime(100, function () {view.currentTask.ganttElement.addClass("focused");});
                            } else {
                                view.currentTask.rowElement.next().click();
                            }
                        }
                        break;
                    case 39: //right
                        if (view.currentTask) {
                            if (view.currentTask.ganttElement.is(".focused")) {
                                view.indentCurrentTask();
                                view.gantt.element.oneTime(100, function () {view.currentTask.ganttElement.addClass("focused");});
                            }
                        }
                        break;
                    case 37: //left
                        if (view.currentTask) {
                            if (view.currentTask.ganttElement.is(".focused")) {
                                view.outdentCurrentTask();
                                view.gantt.element.oneTime(100, function () {view.currentTask.ganttElement.addClass("focused");});
                            }
                        }
                        break;
                    case 89: //Y
                        if (e.ctrlKey) {
                            view.redo();
                        }
                        break;
                    case 90: //Z
                        if (e.ctrlKey) {
                            view.undo();
                        }
                        break;
                    default :{
                        eventManaged=false;
                    }
                }
                if (eventManaged){
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        });
    }
};


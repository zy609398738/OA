/**
 * Created by chenbinbin on 17-2-16.
 */

function GanttView(monitor) {
    this.tasks = [];
    this.deletedTaskIds = [];
    this.links = [];
    this.__currentTransaction;  // a transaction object holds previous state during changes
    this.__undoStack = [];
    this.__redoStack = [];
    this.__inUndoRedo = false; // a control flag to avoid Undo/Redo stacks reset when needed
    this.start = new Date().getTime() - 3600000 * 24 * 2;
    this.end =  new Date().getTime() + 3600000 * 24 * 15;
    this.monitor = monitor;
    this.gridEditor; // 甘特图编辑表格

    this.$el = $("<div style='padding:0px; overflow-y:auto; overflow-x:hidden;border:1px solid #e5e5e5;position:relative;margin:0 5px'/>");
}

/**
 * 初始化视图元素
 *
 * @param $parent
 */
GanttView.prototype.init = function(id, zoom, dateSrv, $parent) {
    var self = this;
    self.zoom = zoom;
    self.$el.attr('id', id);
    this.dateSrv = dateSrv;
    var $toolbar = $.JST.createFromTemplate({id: id}, "GANTBUTTONS");
    $parent.append($toolbar);
    $parent.append(this.$el);
    self.gridEditor = new GridEditor(self);
    self.ganttAlendar = new Ganttalendar( self.zoom, self.start, self.end, self, 100);
    self.splitter = $.splittify.init(self.$el,self.ganttAlendar.element, self.gridEditor.gridified);
    self.splitter.firstBoxMinWidth = 30;
    $parent.resize(function() {
        self.$el.width($parent.width());
        self.$el.height($parent.height() - $toolbar.height());
    });
}

GanttView.prototype.resize = function(w, h) {
    this.$el.css({width:w,height:h});
}

GanttView.prototype.createTask = function (id, name, code, level, start, duration) {
    var factory = new TaskFactory(this.dateSrv);
    return factory.build(id, name, code, level, start, duration);
};

GanttView.prototype.createResource = function (id, name) {
    var res = new Resource(id, name);
    return res;
};

//update depends strings
GanttView.prototype.updateDependsStrings = function () {
    //remove all deps
    for (var i = 0; i < this.tasks.length; i++) {
        this.tasks[i].depends = "";
    }
    for (var i = 0; i < this.links.length; i++) {
        var link = this.links[i];
        var dep = link.to.depends;
        link.to.depends = link.to.depends + (link.to.depends == "" ? "" : ",") + (link.from.getRow() + 1) + (link.lag ? ":" + link.lag : "");
    }
};

GanttView.prototype.removeLink = function (fromTask, toTask) {
    //console.debug("removeLink");
    if (!this.canWrite || (!fromTask.canWrite && !toTask.canWrite))
        return;
    this.beginTransaction();
    var found = false;
    for (var i = 0; i < this.links.length; i++) {
        if (this.links[i].from == fromTask && this.links[i].to == toTask) {
            this.links.splice(i, 1);
            found = true;
            break;
        }
    }
    if (found) {
        this.updateDependsStrings();
        if (this.updateLinks(toTask))
            this.changeTaskDates(toTask, toTask.start, toTask.end); // fake change to force date recomputation from dependencies
    }
    this.endTransaction();
};

GanttView.prototype.removeAllLinks = function (task,openTrans) {
    //console.debug("removeLink");
    if (!this.canWrite || (!task.canWrite && !task.canWrite))
        return;

    if (openTrans)
        this.beginTransaction();
    var found = false;
    for (var i = 0; i < this.links.length; i++) {
        if (this.links[i].from == task || this.links[i].to == task) {
            this.links.splice(i, 1);
            found = true;
        }
    }

    if (found) {
        this.updateDependsStrings();
    }
    if (openTrans)
        this.endTransaction();
};

GanttView.prototype.addTask = function (task, row) {
    task.master = this; // in order to access controller from task
    //replace if already exists
    var pos = -1;
    for (var i = 0; i < this.tasks.length; i++) {
        if (task.id == this.tasks[i].id) {
            pos = i;
            break;
        }
    }
    if (pos >= 0) {
        this.tasks.splice(pos, 1);
        row = parseInt(pos);
    }
    //add task in collection
    if (typeof(row) != "number") {
        this.tasks.push(task);
    } else {
        this.tasks.splice(row, 0, task);
        //recompute depends string
        this.updateDependsStrings();
    }
    //add Link collection in memory
    var linkLoops = !this.updateLinks(task);

    //set the status according to parent
    if (task.getParent())
        task.status = task.getParent().status;
    else
        task.status = "STATUS_ACTIVE";

    var ret = task;
    if (linkLoops || !task.setPeriod(task.start, task.end)) {
        //remove task from in-memory collection
        this.tasks.splice(task.getRow(), 1);
        ret = undefined;
    } else {
        //append task to editor
        this.gridEditor.addTask(task, row);
        //append task to gantt
        this.ganttAlendar.addTask(task);
    }
    return ret;
};

//GanttView.prototype.refresh = function() {
//    this.loadProject(this.ganttModel.getData());
//}
/**
 * a project contais tasks, resources, roles, and info about permisions
 * @param project
 */
GanttView.prototype.loadProject = function (project) {
    this.beginTransaction();
    this.resources = project.resources;
    this.oid = project.oid;
    this.verid = project.verid;
    this.ganttname = project.ganttname;
    this.roles = project.roles;
    this.canWrite = project.canWrite;
    this.canWriteOnParent = project.canWriteOnParent;
    this.cannotCloseTaskIfIssueOpen = project.cannotCloseTaskIfIssueOpen;

    if (project.minEditableDate)
        this.minEditableDate = computeStart(project.minEditableDate);
    else
        this.minEditableDate = -Infinity;

    if (project.maxEditableDate)
        this.maxEditableDate = computeEnd(project.maxEditableDate);
    else
        this.maxEditableDate = Infinity;

    this.loadTasks(project.tasks, project.selectedRow);
    this.deletedTaskIds = [];

    //recover saved splitter position
    if (project.splitterPosition)
        this.splitter.resize(project.splitterPosition);

    //recover saved zoom level
    if (project.zoom)
        this.ganttAlendar.zoom=project.zoom;
    //[expand]
    //this.ganttAlendar.refreshGantt();
    this.endTransaction();
    var self = this;
    this.ganttAlendar.element.oneTime(200, function () {self.ganttAlendar.centerOnToday()});
};

GanttView.prototype.loadTasks = function (tasks, selectedRow) {
    var factory = new TaskFactory(this.dateSrv);
    this.reset();
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        if (!(task instanceof Task)) {
            var t = factory.build(task.id, task.name, task.code, task.level, task.start, task.duration, task.collapsed, task.assigs);
            for (var key in task) {
                if (key != "end" && key != "start" && key != "dur")
                    t[key] = task[key]; //copy all properties
            }
            task = t;
        }
        task.master = this; // in order to access controller from task
        this.tasks.push(task);  //append task at the end
    }

    for (var i = 0; i < this.tasks.length; i++) {
        var task = this.tasks[i];
        var numOfError=this.__currentTransaction&&this.__currentTransaction.errors?this.__currentTransaction.errors.length:0;
        //add Link collection in memory
        while (!this.updateLinks(task)){  // error on update links while loading can be considered as "warning". Can be displayed and removed in order to let transaction commits.
            if (this.__currentTransaction && numOfError!=this.__currentTransaction.errors.length){
                var msg = "";
                while (numOfError<this.__currentTransaction.errors.length) {
                    var err = this.__currentTransaction.errors.pop();
                    msg = msg + err.msg + "\n\n";
                }
                alert(msg);
            }
            this.removeAllLinks(task,false);
        }

        if (!task.setPeriod(task.start, task.end)) {
            alert(GanttI18n.messages.GANTT_ERROR_LOADING_DATA_TASK_REMOVED + "\n" + task.name + "\n" +GanttI18n.messages.ERROR_SETTING_DATES);
            //remove task from in-memory collection
            this.tasks.splice(task.getRow(), 1);
        } else {
            this.gridEditor.addTask(task, null, true);
            //append task to gantt
            this.ganttAlendar.addTask(task);
        }
    }

    this.gridEditor.fillEmptyLines();
    //prof.stop();

    // re-select old row if tasks is not empty
    if (this.tasks && this.tasks.length > 0) {
        selectedRow = selectedRow ? selectedRow : 0;
        this.tasks[selectedRow].rowElement.click();
    }
};

GanttView.prototype.getTask = function (taskId) {
    var ret;
    for (var i = 0; i < this.tasks.length; i++) {
        var tsk = this.tasks[i];
        if (tsk.id == taskId) {
            ret = tsk;
            break;
        }
    }
    return ret;
};

GanttView.prototype.getResource = function (resId) {
    var ret;
    for (var i = 0; i < this.resources.length; i++) {
        var res = this.resources[i];
        if (res.id == resId) {
            ret = res;
            break;
        }
    }
    return ret;
};

GanttView.prototype.changeTaskDates = function (task, start, end) {
    return task.setPeriod(start, end);
};

GanttView.prototype.moveTask = function (task, newStart) {
    return task.moveTo(newStart, true);
};

GanttView.prototype.taskIsChanged = function () {
    var master = this;
    this.$el.stopTime("gnnttaskIsChanged");
    this.$el.oneTime(50, "gnnttaskIsChanged", function () {
        master.redraw();
        master.monitor.notify("commit.gantt");
    });
};

GanttView.prototype.redraw = function () {
    this.gridEditor.redraw();
    this.ganttAlendar.refreshGantt();
};

GanttView.prototype.reset = function () {
    this.tasks = [];
    this.links = [];
    this.deletedTaskIds = [];
    if (!this.__inUndoRedo) {
        this.__undoStack = [];
        this.__redoStack = [];
    } else { // don't reset the stacks if we're in an Undo/Redo, but restart the inUndoRedo control
        this.__inUndoRedo = false;
    }
    delete this.currentTask;

    this.gridEditor.reset();
    this.ganttAlendar.reset();
};

GanttView.prototype.showTaskEditor = function (taskId) {
    this.gridEditor.openFullEditor(taskId);
    //task.rowElement.find(".edit").click();
};

GanttView.prototype.saveProject = function () {
    return this.saveGantt(false);
};

GanttView.prototype.updateTaskRowID = function(newTasks) {
    for (var i = 0; i < this.tasks.length; i++) {
        this.tasks[i].rowID =  newTasks[i].rowID;
    }
}

GanttView.prototype.saveGantt = function (forTransaction) {
    var saved = [];
    for (var i = 0; i < this.tasks.length; i++) {
        var task = this.tasks[i];
        var cloned = task.clone();
        delete cloned.master;
        delete cloned.rowElement;
        delete cloned.ganttElement;
        saved.push(cloned);
    }

    var ret = {tasks:saved};
    if (this.currentTask) {
        ret.selectedRow = this.currentTask.getRow();
    }

    ret.deletedTaskIds = this.deletedTaskIds;  //this must be consistent with transactions and undo

    if (!forTransaction) {
        ret.resources = this.resources;
        ret.roles = this.roles;
        ret.canWrite = this.canWrite;
        ret.canWriteOnParent = this.canWriteOnParent;
        ret.splitterPosition=this.splitter.perc;
        ret.zoom=this.ganttAlendar.zoom;
    }
    ret.oid = this.oid;
    ret.verid = this.verid;
    ret.ganttname = this.ganttname;
    //prof.stop();
    return ret;
};

GanttView.prototype.updateLinks = function (task) {
    // defines isLoop function
    function isLoop(task, target, visited) {
        if (target == task) {
            return true;
        }
        var sups = task.getSuperiors();
        //my parent' superiors are my superiors too
        var p= task.getParent();
        while (p){
            sups=sups.concat(p.getSuperiors());
            p= p.getParent();
        }

        //my children superiors are my superiors too
        var chs=task.getChildren();
        for (var i=0;i<chs.length;i++){
            sups=sups.concat(chs[i].getSuperiors());
        }
        var loop = false;
        //check superiors
        for (var i = 0; i < sups.length; i++) {
            var supLink = sups[i];
            if (supLink.from == target) {
                loop = true;
                break;
            } else {
                if (visited.indexOf(supLink.from.id+"x"+target.id) <= 0) {
                    visited.push(supLink.from.id+"x"+target.id);
                    if (isLoop(supLink.from, target, visited)) {
                        loop = true;
                        break;
                    }
                }
            }
        }
        //check target parent
        var tpar=target.getParent();
        if (tpar ){
            if (visited.indexOf(task.id+"x"+tpar.id) <= 0) {
                visited.push(task.id+"x"+tpar.id);
                if (isLoop(task,tpar, visited)) {
                    loop = true;
                }
            }
        }
        return loop;
    }

    //remove my depends
    this.links = this.links.filter(function (link) {
        return link.to != task;
    });

    var todoOk = true;
    if (task.depends) {

        //cannot depend from an ancestor
        var parents = task.getParents();
        //cannot depend from descendants
        var descendants = task.getDescendant();

        var deps = task.depends.split(",");
        var newDepsString = "";

        var visited = [];
        for (var j = 0; j < deps.length; j++) {
            var dep = deps[j]; // in the form of row(lag) e.g. 2:3,3:4,5
            var par = dep.split(":");
            var lag = 0;

            if (par.length > 1) {
                lag = parseInt(par[1]);
            }

            var sup = this.tasks[parseInt(par[0] - 1)];

            if (sup) {
                if (parents && parents.indexOf(sup) >= 0) {
                    this.setErrorOnTransaction(task.name + "\n" + GanttI18n.messages.CANNOT_DEPENDS_ON_ANCESTORS + "\n" + sup.name);
                    todoOk = false;

                } else if (descendants && descendants.indexOf(sup) >= 0) {
                    this.setErrorOnTransaction(task.name + "\n" + GanttI18n.messages.CANNOT_DEPENDS_ON_DESCENDANTS + "\n" + sup.name);
                    todoOk = false;

                } else if (isLoop(sup, task, visited)) {
                    todoOk = false;
                    this.setErrorOnTransaction(GanttI18n.messages.CIRCULAR_REFERENCE + "\n" + task.name + " -> " + sup.name);
                } else {
                    this.links.push(new Link(sup, task, lag));
                    newDepsString = newDepsString + (newDepsString.length > 0 ? "," : "") + dep;
                }
            }
        }

        task.depends = newDepsString;

    }

    //prof.stop();

    return todoOk;
};


GanttView.prototype.moveUpCurrentTask=function(){
    var self=this;
    //console.debug("moveUpCurrentTask",self.currentTask)
    if(!self.canWrite )
        return;

    if (self.currentTask) {
        self.beginTransaction();
        self.currentTask.moveUp();
        self.endTransaction();
    }
};

GanttView.prototype.moveDownCurrentTask=function(){
    var self=this;
    //console.debug("moveDownCurrentTask",self.currentTask)
    if(!self.canWrite)
        return;

    if (self.currentTask) {
        self.beginTransaction();
        self.currentTask.moveDown();
        self.endTransaction();
    }
};

GanttView.prototype.outdentCurrentTask=function(){
    var self=this;
    if(!self.canWrite|| !self.currentTask.canWrite)
        return;

    if (self.currentTask) {
        var par = self.currentTask.getParent();

        self.beginTransaction();
        self.currentTask.outdent();
        self.endTransaction();

        //[expand]
        if(par) self.gridEditor.refreshExpandStatus(par);
    }
};

GanttView.prototype.indentCurrentTask=function(){
    var self=this;
    if (!self.canWrite|| !self.currentTask.canWrite)
        return;

    if (self.currentTask) {
        self.beginTransaction();
        self.currentTask.indent();
        self.endTransaction();
    }
};

GanttView.prototype.addBelowCurrentTask=function(){
    var self=this;
    if (!self.canWrite)
        return;

    var factory = new TaskFactory(this.dateSrv);
    self.beginTransaction();
    var ch;
    var row = 0;
    if (self.currentTask) {
        ch = factory.build("tmp_" + new Date().getTime(), "", "", self.currentTask.level + 1, self.currentTask.start, this.dateSrv.computeDayWorkTimes());
        row = self.currentTask.getRow() + 1;
    } else {
        ch = factory.build("tmp_" + new Date().getTime(), "", "", 0, new Date().getTime(), this.dateSrv.computeDayWorkTimes());
    }
    var task = self.addTask(ch, row);
    if (task) {
        task.rowElement.click();
        task.rowElement.find("[name=name]").focus();
    }
    self.endTransaction();
};

GanttView.prototype.addAboveCurrentTask=function(){
    var self=this;
    if (!self.canWrite)
        return;
    var factory = new TaskFactory(this.dateSrv);

    var ch;
    var row = 0;
    if (self.currentTask) {
        //cannot add brothers to root
        if (self.currentTask.level <= 0)
            return;

        ch = factory.build("tmp_" + new Date().getTime(), "", "", self.currentTask.level, self.currentTask.start, this.dateSrv.computeDayWorkTimes());
        row = self.currentTask.getRow();
    } else {
        ch = factory.build("tmp_" + new Date().getTime(), "", "", 0, new Date().getTime(), this.dateSrv.computeDayWorkTimes());
    }
    self.beginTransaction();
    var task = self.addTask(ch, row);
    if (task) {
        task.rowElement.click();
        task.rowElement.find("[name=name]").focus();
    }
    self.endTransaction();
};

GanttView.prototype.deleteCurrentTask=function(){
    var self=this;
    if (!self.currentTask || !self.canWrite || !self.currentTask.canWrite)
        return;
    var row = self.currentTask.getRow();
    if (self.currentTask && (row > 0 || self.currentTask.isNew())) {
        var par = self.currentTask.getParent();
        self.beginTransaction();
        self.currentTask.deleteTask();
        self.currentTask = undefined;

        //recompute depends string
        self.updateDependsStrings();

        //redraw
        self.redraw();

        //[expand]
        if(par) self.gridEditor.refreshExpandStatus(par);


        //focus next row
        row = row > self.tasks.length - 1 ? self.tasks.length - 1 : row;
        if (row >= 0) {
            self.currentTask = self.tasks[row];
            self.currentTask.rowElement.click();
            self.currentTask.rowElement.find("[name=name]").focus();
        }
        self.endTransaction();
    }
};

//<%----------------------------- TRANSACTION MANAGEMENT ---------------------------------%>
GanttView.prototype.beginTransaction = function () {
    if (!this.__currentTransaction) {
        this.__currentTransaction = {
            snapshot:JSON.stringify(this.saveGantt(true)),
            errors:  []
        };
    } else {
        console.error("Cannot open twice a transaction");
    }
    return this.__currentTransaction;
};

GanttView.prototype.endTransaction = function () {
    if (!this.__currentTransaction) {
        console.error("Transaction never started.");
        return true;
    }

    var ret = true;
    //no error -> commit
    if (this.__currentTransaction.errors.length <= 0) {
        //console.debug("committing transaction");
        //put snapshot in undo
        this.__undoStack.push(this.__currentTransaction.snapshot);
        //clear redo stack
        this.__redoStack = [];
        //shrink gantt bundaries
        this.ganttAlendar.originalStartMillis = Infinity;
        this.ganttAlendar.originalEndMillis = -Infinity;
        for (var i = 0; i < this.tasks.length; i++) {
            var task = this.tasks[i];
            if (this.ganttAlendar.originalStartMillis > task.start)
                this.ganttAlendar.originalStartMillis = task.start;
            if (this.ganttAlendar.originalEndMillis < task.end)
                this.ganttAlendar.originalEndMillis = task.end;
        }
        this.taskIsChanged(); //enqueue for gantt refresh
        //error -> rollback
    } else {
        ret = false;
        //try to restore changed tasks
        var oldTasks = JSON.parse(this.__currentTransaction.snapshot);
        this.deletedTaskIds = oldTasks.deletedTaskIds;
        this.loadTasks(oldTasks.tasks, oldTasks.selectedRow);
        this.redraw();
        //compose error message
        var msg = "";
        for (var i = 0; i < this.__currentTransaction.errors.length; i++) {
            var err = this.__currentTransaction.errors[i];
            msg = msg + err.msg + "\n\n";
        }
        alert(msg);
    }
    //reset transaction
    this.__currentTransaction = undefined;
    //[expand]
    this.gridEditor.refreshExpandStatus(this.currentTask);
    return ret;
};

//this function notify an error to a transaction -> transaction will rollback
GanttView.prototype.setErrorOnTransaction = function (errorMessage, task) {
    if (this.__currentTransaction) {
        this.__currentTransaction.errors.push({msg:errorMessage, task:task});
    } else {
        console.error(errorMessage);
    }
};

// inhibit undo-redo
GanttView.prototype.checkpoint = function () {
    this.__undoStack = [];
    this.__redoStack = [];
};

//----------------------------- UNDO/REDO MANAGEMENT ---------------------------------%>
GanttView.prototype.undo = function () {
    if (this.__undoStack.length > 0) {
        var his = this.__undoStack.pop();
        this.__redoStack.push(JSON.stringify(this.saveGantt()));
        var oldTasks = JSON.parse(his);
        this.deletedTaskIds = oldTasks.deletedTaskIds;
        this.__inUndoRedo = true; // avoid Undo/Redo stacks reset
        this.loadTasks(oldTasks.tasks, oldTasks.selectedRow);
        this.redraw();
    }
};

GanttView.prototype.redo = function () {
    if (this.__redoStack.length > 0) {
        var his = this.__redoStack.pop();
        this.__undoStack.push(JSON.stringify(this.saveGantt()));
        var oldTasks = JSON.parse(his);
        this.deletedTaskIds = oldTasks.deletedTaskIds;
        this.__inUndoRedo = true; // avoid Undo/Redo stacks reset
        this.loadTasks(oldTasks.tasks, oldTasks.selectedRow);
        this.redraw();
    }
};

GanttView.prototype.resize = function () {
    //this.splitter.resize();
};

GanttView.prototype.clearGantt = function() {
    this.reset();
}

GanttView.prototype.getCollapsedDescendant = function(){
    var allTasks = this.tasks;
    var collapsedDescendant = [];
    for (var i = 0; i < allTasks.length; i++) {
        var task = allTasks[i];
        if(collapsedDescendant.indexOf(task) >= 0) continue;
        if(task.collapsed) collapsedDescendant = collapsedDescendant.concat(task.getDescendant());
    }
    return collapsedDescendant;
}

GanttView.prototype.computeCriticalPath = function () {

    if (!this.tasks)
        return false;

    // do not consider grouping tasks
    var tasks = this.tasks.filter(function (t) {
        //return !t.isParent()
        return (t.getRow()  > 0) && (!t.isParent() || (t.isParent() && !t.isDependent()));
    });

    // reset values
    for (var i = 0; i < tasks.length; i++) {
        var t = tasks[i];
        t.earlyStart = -1;
        t.earlyFinish = -1;
        t.latestStart = -1;
        t.latestFinish = -1;
        t.criticalCost = -1;
        t.isCritical=false;
    }

    // tasks whose critical cost has been calculated
    var completed = [];
    // tasks whose critical cost needs to be calculated
    var remaining = tasks.concat(); // put all tasks in remaining


    // Backflow algorithm
    // while there are tasks whose critical cost isn't calculated.
    while (remaining.length > 0) {
        var progress = false;

        // find a new task to calculate
        for (var i = 0; i < remaining.length; i++) {
            var task = remaining[i];
            var inferiorTasks = task.getInferiorTasks();

            if (containsAll(completed, inferiorTasks)) {
                // all dependencies calculated, critical cost is max dependency critical cost, plus our cost
                var critical = 0;
                for (var j = 0; j < inferiorTasks.length; j++) {
                    var t = inferiorTasks[j];
                    if (t.criticalCost > critical) {
                        critical = t.criticalCost;
                    }
                }
                task.criticalCost = critical + task.duration;
                // set task as calculated an remove
                completed.push(task);
                remaining.splice(i, 1);

                // note we are making progress
                progress = true;
            }
        }
        // If we haven't made any progress then a cycle must exist in
        // the graph and we wont be able to calculate the critical path
        if (!progress) {
            console.error("Cyclic dependency, algorithm stopped!");
            return false;
        }
    }

    // set earlyStart, earlyFinish, latestStart, latestFinish
    computeMaxCost(tasks);
    var initialNodes = initials(tasks);
    calculateEarly(initialNodes);
    calculateCritical(tasks);



    /*
     for (var i = 0; i < tasks.length; i++) {
     var t = tasks[i];
     console.debug("Task ", t.name, t.duration, t.earlyStart, t.earlyFinish, t.latestStart, t.latestFinish, t.latestStart - t.earlyStart, t.earlyStart == t.latestStart)
     }*/

    return tasks;


    function containsAll(set, targets) {
        for (var i = 0; i < targets.length; i++) {
            if (set.indexOf(targets[i]) < 0)
                return false;
        }
        return true;
    }

    function computeMaxCost(tasks) {
        var max = -1;
        for (var i = 0; i < tasks.length; i++) {
            var t = tasks[i];

            if (t.criticalCost > max)
                max = t.criticalCost;
        }
        //console.debug("Critical path length (cost): " + max);
        for (var i = 0; i < tasks.length; i++) {
            var t = tasks[i];
            t.setLatest(max);
        }
    }

    function initials(tasks) {
        var initials = [];
        for (var i = 0; i < tasks.length; i++) {
            if (!tasks[i].depends || tasks[i].depends == "")
                initials.push(tasks[i]);
        }
        return initials;
    }

    function calculateEarly(initials) {
        for (var i = 0; i < initials.length; i++) {
            var initial = initials[i];
            initial.earlyStart = 0;
            initial.earlyFinish = initial.duration;
            setEarly(initial);
        }
    }

    function setEarly(initial) {
        var completionTime = initial.earlyFinish;
        var inferiorTasks = initial.getInferiorTasks();
        for (var i = 0; i < inferiorTasks.length; i++) {
            var t = inferiorTasks[i];
            if (completionTime >= t.earlyStart) {
                t.earlyStart = completionTime;
                t.earlyFinish = completionTime + t.duration;
            }
            setEarly(t);
        }
    }

    function calculateCritical(tasks) {
        for (var i = 0; i < tasks.length; i++) {
            var t = tasks[i];
            t.isCritical=(t.earlyStart == t.latestStart)
        }
    }
};


GanttView.prototype.criticalGantt = function() {
    this.showCriticalPath();
    //ge.gantt.showCriticalPath=!ge.gantt.showCriticalPath;
    //ge.redraw();
}

GanttView.prototype.editRow = function(rowIndex) {

}
//-------------------------------------------  Open a black popup for managing resources. This is only an axample of implementation (usually resources come from server) ------------------------------------------------------
GanttView.prototype.editResources = function () {
    //make resource editor
    var self = this;
    var resourceEditor = $.JST.createFromTemplate({}, "RESOURCE_EDITOR");
    var resTbl=resourceEditor.find("#resourcesTable");

    for (var i=0; i<self.resources.length; i++){
        var res = self.resources[i];
        resTbl.append($.JST.createFromTemplate(res, "RESOURCE_ROW"))
    }

    //bind add resource
    resourceEditor.find("#addResource").click(function() {
        resTbl.append($.JST.createFromTemplate({id:"new",name:"resource"}, "RESOURCE_ROW"))
    });

    //bind save event
    resourceEditor.find("#resSaveButton").click(function(){
        var newRes=[];
        //find for deleted res
        for (var i=0;i< self.resources.length;i++){
            var res = self.resources[i];
            var row = resourceEditor.find("[resId='"+res.id+"']");
            if (row.size()>0){
                //if still there save it
                var name = row.find("input[name]").val();
                if (name && name!="")
                    res.name=name;
                newRes.push(res);
            } else {
                //remove assignments
                for (var j=0;j<self.tasks.length;j++){
                    var task=self.tasks[j];
                    var newAss=[];
                    for (var k=0;k<task.assigs.length;k++){
                        var ass=task.assigs[k];
                        if (ass.resourceId!=res.id)
                            newAss.push(ass);
                    }
                    task.assigs=newAss;
                }
            }
        }

        //loop on new rows
        resourceEditor.find("[resId=new]").each(function(){
            var row = $(this);
            var name = row.find("input[name]").val();
            if (name && name!="") {
                newRes.push (new Resource("tmp_"+ Math.random(), name));
                //newRes.push (new Resource("tmp_"+new Date().getTime(),name));
            }
        });

        self.resources = newRes;

        GTT.closeBlackPopup();
        self.redraw();
    });
    var ndo = GTT.createBlackPage(400, 500).append(resourceEditor);
}

GanttView.prototype.inputGanttName = function (callback) {
    var nameEditor = $.JST.createFromTemplate({}, "NAME_EDITOR");
    //bind save event
    nameEditor.find("#nameSaveButton").click(function(){
        var name = nameEditor.find("#name").val();
        this.ganttModel.getData().ganttname= name;
        callback();
        GTT.closeBlackPopup();
        this.redraw();
    });
    var ndo = GTT.createBlackPage(400, 180).append(nameEditor);
}


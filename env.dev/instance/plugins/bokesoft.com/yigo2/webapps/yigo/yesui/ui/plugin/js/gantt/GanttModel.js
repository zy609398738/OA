/**
 * Created by chenbinbin on 17-2-16.
 */

function GanttModel(monitor) {
    this.gantData; //模型数据
    this.monitor = monitor; //模型变化监听，通知控制器更新变化到视图
    this.roles = [
        { id:"tmp_1", name:"项目管理者"},
        { id:"tmp_2", name:"执行人员"},
        { id:"tmp_3", name:"客户/其他相关人员"}];
    this.tasks = [];
}

GanttModel.prototype.addTask  = function (task, row) {
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
    if (typeof(row) != "") {
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
        this.editor.addTask(task, row);
        //append task to gantt
        this.gantt.addTask(task);
    }
    return ret;
};

GanttModel.prototype.setData = function(ganttData) {
    this.gantData = ganttData;
    this.monitor.notify("refresh.gantt");
};

GanttModel.prototype.getData = function() {
    return this.gantData;
}
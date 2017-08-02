/**
 * Created by chenbinbin on 17-3-7.
 */

function GridDataService4Grid(grid) {
    this.grid = grid;
    this.boolKeys = ["canWrite","startIsMilestone","endIsMilestone", "collapsed", "hasChild"];
    this.ganttData = {};
    //this.loadGanttDataFromGrid(grid, this.ganttData);
}

GridDataService4Grid.prototype.initGridData = function () {
    delete this.ganttData.tasks;
    delete this.ganttData.canWrite;
    delete this.ganttData.resources;
}

/**
 * 从客户端表格获取甘特图数据
 */
GridDataService4Grid.prototype.loadGanttData = function () {
    this.initGridData();
    this.loadGanttDataFromGrid(this.grid, this.ganttData);
    return this.ganttData;
};

/**
 * 存储甘特图数据到服务端
 *
 * @param ganttData
 */
GridDataService4Grid.prototype.saveGanttData = function() {
    if (!this.ganttData.canWrite)  return;

    var tasks = this.ganttData.tasks;
    var i;
    for (i=0; i<tasks.length; i++) {
        var ganttTask = tasks[i];
        var gridRowIndex = this.grid.getRowIndexByID(ganttTask.id);
        var gridRowData;
        if (gridRowIndex > -1) {
            gridRowData = this.grid.getRowDataByID(ganttTask.id);
            this.grid.gridHandler.doExchangeRow(this.grid, i, gridRowIndex);
        } else {
            gridRowData = this.grid.addGridRow(null, i, false);
            ganttTask.rowID = gridRowData.rowID;
        }
        this.updateGridRowData(i, ganttTask, gridRowData);
    }
    for( var n = this.grid.dataModel.data.length-1; n>=i; n--) {
        this.grid.deleteGridRow(n);
    }
    this.grid.refreshGrid();
};

GridDataService4Grid.prototype.updateGridRowData = function(rowIndex, task, rowData) {
    for(var j=0; j<rowData.cellKeys.length; j++) {
        var key = rowData.cellKeys[j];
        var value;
        if (this.isBoolKey(key)) {
            value = task[rowData.cellKeys[j]] ? 1 : 0;
        } else {
            value = task[rowData.cellKeys[j]];
        }
        this.grid.setValueByKey(rowIndex, key, value, true, true);
        //var data = this.grid.getCellNeedValue(rowIndex, j, rowData.data[j][0], true);
        //data.push(true);
        //rowData.data[j] = data;
    }
};

GridDataService4Grid.prototype.loadGanttDataFromGrid = function(grid, ganttData) {
    var gridData = grid.dataModel.data;
    var tasks = [];
    for(var i=0; i<gridData.length; i++) {
        var task = {};
        var rowData = gridData[i];
        for(var j=0; j<rowData.cellKeys.length; j++) {
            var key = rowData.cellKeys[j];
            if (this.isBoolKey(key)) {
                task[rowData.cellKeys[j]] = YIUI.TypeConvertor.toBoolean(rowData.data[j][0]);
            } else {
                if (rowData.data[j][0] instanceof Decimal) {
                    task[rowData.cellKeys[j]] = YIUI.TypeConvertor.toLong(rowData.data[j][0]);
                } else {
                    task[rowData.cellKeys[j]] = rowData.data[j][0];
                }
            }
        }
        // 新增状态下，表格中默认有一行空行，不处理
        if (task.duration == 0) {
            continue;
        }
        if (!task["assigs"])  task["assigs"] = [];
        task["id"] = rowData.rowID;
        task.rowID = rowData.rowID;
        tasks.push(task);
    }
    ganttData.tasks = tasks;
    ganttData.canWrite = false;
    ganttData.resources = [];
}

GridDataService4Grid.prototype.isBoolKey = function(key) {
    return $.inArray(key, this.boolKeys) != -1;
}

GridDataService4Grid.prototype.isClientSrv = function() {
    return true;
}
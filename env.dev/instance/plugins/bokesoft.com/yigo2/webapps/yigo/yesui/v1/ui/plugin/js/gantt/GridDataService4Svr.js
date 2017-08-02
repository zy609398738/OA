/**
 * Created by chenbinbin on 17-3-7.
 */

function GridDataService4Svr(dataObjectKey, oid) {
    this.dataObjectKey = dataObjectKey;
    this.oid = oid;
}

/**
 * 从服务端获取甘特图数据
 */
GridDataService4Svr.prototype.loadGanttData = function () {
    var paras = {dataObjectKey: this.dataObjectKey, oid: this.oid};
    this.ganttData = Svr.SvrMgr.loadGanttData(paras);
    return this.ganttData;
};

/**
 * 存储甘特图数据到服务端
 *
 * @param ganttData
 */
GridDataService4Svr.prototype.saveGanttData = function() {
    if (!this.ganttData.canWrite)  return;
    var doSave = function () {
        var paras = {
            dataObjectKey: this.dataObjectKey,
            ganttdata: $.toJSON(this.ganttData)
        };
        var oid = Svr.SvrMgr.saveGanttData(paras);
    }
    doSave();
}

GridDataService4Svr.prototype.isClientSrv = function() {
    return false;
}
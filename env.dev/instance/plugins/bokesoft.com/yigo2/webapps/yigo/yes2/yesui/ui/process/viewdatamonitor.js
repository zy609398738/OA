/**
 * Created with IntelliJ IDEA.
 * User: 陈瑞
 * Date: 16-12-26
 * Time: 下午5:19
 */
(function(){
   YIUI.ViewDataMonitor = function(form){
       this.form = form;

       this.preFireCellValueChanged = function(grid, rowIndex, colIndex, cellKey){
           this.form.getUIProcess().doPreCellValueChanged(grid, rowIndex, colIndex, cellKey);
       }

       this.fireCellValueChanged = function(grid,rowIndex,colIndex) {
           var row = grid.dataModel.data[rowIndex],
               metaRow = grid.getMetaObj().rows[row.metaRowIndex],
               cellKey = row.cellKeys[colIndex];

           this.form.getUIProcess().doCellValueChanged(grid,rowIndex,colIndex,cellKey);

           YIUI.GridSumUtil.evalAffectSum(form, grid, rowIndex, colIndex);

           var valueChanged = metaRow.cells[colIndex].valueChanged;
           if (valueChanged !== undefined && valueChanged.length > 0) {
               form.eval($.trim(valueChanged), {form: form, rowIndex: rowIndex}, null);
           }
       }

       this.postFireCellValueChanged = function(grid, rowIndex, colIndex, cellKey) {
           this.form.getUIProcess().doPostCellValueChanged(grid, rowIndex, colIndex, cellKey);
       }

       this.preFireValueChanged = function (component) {
           this.form.getUIProcess().preFireValueChanged(component);
       };

       this.fireValueChanged = function (component) {
           this.form.getUIProcess().fireValueChanged(component);
       };

       this.postFireValueChanged = function (component) {
           this.form.getUIProcess().postFireValueChanged(component);
       }

   }
})()

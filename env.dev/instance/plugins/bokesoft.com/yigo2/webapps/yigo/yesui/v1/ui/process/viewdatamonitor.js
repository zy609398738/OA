/**
 * Created with IntelliJ IDEA.
 * User: 陈瑞
 * Date: 16-12-26
 * Time: 下午5:19
 */
(function(){
   YIUI.ViewDataMonitor = function(form){
       this.form = form;

       this.preFireCellValueChanged = function(grid,rowIndex,colIndex,cellKey){
           this.form.getUIProcess().doPreCellValueChanged(grid,rowIndex,colIndex,cellKey);
       }

       this.fireCellValueChanged = function(grid,rowIndex,colIndex,cellKey) {
           var row = grid.dataModel.data[rowIndex],
               metaRow = grid.metaRowInfo.rows[row.metaRowIndex];
           this.form.getUIProcess().doCellValueChanged(grid,rowIndex,colIndex,cellKey);

           var valueChanged = metaRow.cells[colIndex].valueChanged;
           if (valueChanged !== undefined && valueChanged.length > 0) {
               form.eval($.trim(valueChanged), {form: form, rowIndex: rowIndex}, null);
           }
       }

       this.postFireCellValueChanged = function(grid,rowIndex,colIndex,cellKey) {
           this.form.getUIProcess().doPostCellValueChanged(grid,rowIndex,colIndex,cellKey);
       }

   }
})();

$(function () {
//    var maxHeight = $('.x-window .x-panel-body:first').innerHeight() - 300, // 总高度 （px）
    var maxHeight = 300, // 总高度 （px）
        rowHeight = null;

    console.log('maxHeight:', maxHeight);


    function copy_row(gridEl,row_num){// 复制tr  item_index表示第几项，row_num表示复制多少行
        var $gridBody = $(gridEl).find('.x-grid3-body tbody');
        //$gridBody.html('');
        for(var i=0;i<row_num;i++){
            $gridBody.append($('#row-template').html());
        }
        if (rowHeight === null) {
            rowHeight = $gridBody.find('.x-grid3-row:first').outerHeight(true); // 单行高度 (px)
            console.log('rowHeight:', rowHeight);
        }
    }

    function adjustGridsHeight(/*Array*/rowCountArray) {
        var grids = $(".x-window .x-panel-body-noheader .x-grid-panel .x-grid3-scroller"),      // TODO: selector not work
            labels = $(".x-window .x-panel-body-noheader .x-form-item-label"); // TODO: selector not work

        function assignHeight (/*Number*/overallHeight, /*Object*/demandRowCounts, /*Number*/gridCount){
            console.log('回合开始');
            var availableRowCount = Math.floor(overallHeight / rowHeight),
                avgRowCount = Math.floor(availableRowCount / gridCount);

            var assignedGrids = {}, unassignedHeight = overallHeight,
                unassignedGrids = {}, unassignedGridCount = 0;
            //for (var i = 0; i < gridCount; i++ ) {
            for (var gridIndex in demandRowCounts) {
                if (demandRowCounts.hasOwnProperty(gridIndex)) {
                    if (demandRowCounts[gridIndex] <= avgRowCount) {
                        assignedGrids[gridIndex] = rowHeight * demandRowCounts[gridIndex];
                        unassignedHeight -= assignedGrids[gridIndex];

                        console.log('分配Grid' + gridIndex + '的高度为：' + assignedGrids[gridIndex]);
                    } else {
                        unassignedGrids[gridIndex] = demandRowCounts[gridIndex];
                        unassignedGridCount++;
                        console.log('Grid' + gridIndex + '的高度暂未分配');
                    }
                }
            }

            if (unassignedGridCount === gridCount) { // 要求的行数都高于均值
                var avgHeight = Math.floor(unassignedHeight/unassignedGridCount), remainderGridIndex;
                for (var idx in unassignedGrids) {
                    if (unassignedGrids.hasOwnProperty(idx)) {
                        remainderGridIndex = idx;
                        assignedGrids[idx] = avgHeight;
                    }
                }

                assignedGrids[remainderGridIndex] =  unassignedHeight - avgHeight * (unassignedGridCount - 1);
                console.log('最后' + unassignedGridCount + '个行数高于可用行数的Grid 已分配剩余高度。');
            } else {
                $.extend(assignedGrids, assignHeight(unassignedHeight, unassignedGrids, unassignedGridCount));
            }

            return assignedGrids;
        }

        var demands = {}, gridCount = rowCountArray.length;
        for (var i = 0; i < gridCount; i++ ) {  // array to object
            demands[i + ''] = rowCountArray[i];

            copy_row(grids.get(i), rowCountArray[i]);
        }
        var assignedGrids = assignHeight(maxHeight, demands, gridCount);
        var top = 20;
        var labelHeight = 20;
        var ittop=10;
        for (var i = 0; i < gridCount; i++) {
            var gridHeight = assignedGrids[i + ''];     // object to array

            console.log('清点： Grid' + i + '的高度为' + gridHeight);

            var $grid = $(grids.get(i)),
                $label = $(labels.get(i));
            //TODO: assign grid height & top, label top
            //$grid.height(gridHeight);
            $grid.outerHeight(gridHeight+2);

            var $gridParent=$(".x-window .x-panel-body-noheader .x-grid-panel").eq(i);
            console.log("item"+i+"的高度:"+$gridParent.height());

            $label.css('top', ittop);
            ittop += labelHeight;
            console.log("item"+i+"的top值:"+ittop);
            $gridParent.css('top', ittop);
            ittop += gridHeight+labelHeight+20;

            //top += $grid.outerHeight(true) + $(label).outerHeight(true);
        }
        var $btnlist = $(".x-window .x-panel-body-noheader").children(".x-btn-noicon");
        $btnlist.css("top",ittop);
    }

    function resetHeight(){        //重置高度
        var $obj1 = $(".x-window .x-grid-panel .x-panel-body-noheader"),
            $obj2 = $obj1.children(".x-grid3");
        $obj1.addClass("grid-item-height");
        $obj2.addClass("grid-item-height");
    }
    resetHeight();
    //var q = location.search
    //adjustGridsHeight([1, 1, 1, 1, 1]);
    adjustGridsHeight([12, 1, 1, 1,1]);
    //adjustGridsHeight([6, 1, 1, 1]);
    //adjustGridsHeight([6, 1, 1, 1]);
    //adjustGridsHeight([6, 1, 1, 1]);
    //adjustGridsHeight([6, 7, 1, 3,10]);
}) ;

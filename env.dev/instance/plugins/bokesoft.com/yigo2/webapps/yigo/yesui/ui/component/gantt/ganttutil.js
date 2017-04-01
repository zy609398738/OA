/**
 * Created by chenbinbin on 17-3-21.
 */

YIUI.GanttUtil = (function () {
    var dateSrv = {
        d: new DateSrv("d"),
        hh: new DateSrv("hh"),
        mm: new DateSrv("mm"),
        ss: new DateSrv("ss"),
        ms: new DateSrv("ms")
    };

    var Return = {
         getDateSrv: function (unit) {
            return dateSrv[unit];
         }
    };
    return Return;
}) ();
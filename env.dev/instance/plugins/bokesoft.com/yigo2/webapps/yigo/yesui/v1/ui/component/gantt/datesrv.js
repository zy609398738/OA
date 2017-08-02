/**
 * Created by chenbinbin on 17-3-13.
 *
 * 用于计算任务中的起始日期和结束日期
 */

function DateSrv(unit, dayStartTime, dayEndTime) {
    this.unit = unit;
    if (dayStartTime) {
        this.dayStartTime = dayStartTime;
    } else {
        this.dayStartTime = (this.isDayUnit() ? {hh:0, mm:0, ss:0, ms:0} : {hh:8, mm:30, ss:0, ms:1});
    }

    if (dayEndTime) {
        this.dayEndTime = dayEndTime;
    } else {
        this.dayEndTime = (this.isDayUnit() ? {hh:23, mm:59, ss:59, ms:999} : {hh:17, mm:30, ss:0, ms:0});
    }

    this.BS = {
        ms: 1, ss:1000, mm: 60 * 1000, hh: 60 * 60 * 1000
    }

    this.dayWorkTimes = (this.dayEndTime["hh"] - this.dayStartTime["hh"]) * this.BS["hh"]
        + (this.dayEndTime["mm"] - this.dayStartTime["mm"]) * this.BS["mm"]
        + (this.dayEndTime["ss"] - this.dayStartTime["ss"]) * this.BS["ss"]
        + (this.dayEndTime["ms"] - this.dayStartTime["ms"]) * this.BS["ms"] + 1;
    this.BS.d =  this.dayWorkTimes;

    this.startTimePos = this.dayStartTime["hh"] * this.BS["hh"]
        + this.dayStartTime["mm"] * this.BS["mm"] + this.dayStartTime["ss"] * this.BS["ss"]
        + this.dayStartTime["ms"] * this.BS["ms"];
    this.endTimePos = this.startTimePos + this.BS.d;

    this.BASE_DAY = 24 * 60 * 60 * 1000;
    this.BASE_UNIT_VALUE = this.isDayUnit() ? this.BS["d"] : this.BS[this.unit];
    this.BASE_UNIT = "ms";
}

DateSrv.prototype.isDayUnit = function() {
    return this.unit == "d" || this.unit == "w" || this.unit == "m" || this.unit == "q" || this.unit == "s" || this.unit == "y";
}

DateSrv.prototype.dur2ms = function (dur) {
    return dur *  this.BASE_UNIT_VALUE;
}

DateSrv.prototype.add = function(lstart, dur) {
    var newDate = new Date(lstart);
    var lend = newDate.add(this.BASE_UNIT, this.dur2ms(dur)).getTime();
    return lend;
}

DateSrv.prototype.computeStart = function(start) {
    return this.computeStartDate(start).getTime();
}

DateSrv.prototype.computeStartDate = function(start) {
    var d = new Date(start);
    if (this.isDayUnit()) {
        var dst = this.dayStartTime;
        d.setHours(dst.hh, dst.mm, dst.ss, dst.ms);
        while (isHoliday(d)) {
            d.add(this.BASE_UNIT, this.dur2ms(1));
        }
    }
    return d;
}

DateSrv.prototype.computeEnd = function(end) {
    return this.computeEndDate(end).getTime();
}

DateSrv.prototype.computeEndDate = function(end) {
    var d = new Date(end);
    if (this.isDayUnit()) {
        var det = this.dayEndTime;
        d.setHours(det.hh, det.mm, det.ss, det.ms);
        while (isHoliday(d)) {
            d.setDate(d.getDate() + 1);
        }
    }
    return d;
}

DateSrv.prototype.computeEndByDuration = function(start, dur, bIncludeHoliday) {
    var tempDate = new Date(start);
    tempDate.setHours(0, 0, 0, 0);
    var d = new Date(start);
    var firstDayTimePos = d.getTime() - tempDate.getTime();

    var sdDur = 0;
    if (firstDayTimePos <= this.startTimePos) {
        sdDur = this.BS.d;
    } else if (firstDayTimePos > this.endTimePos) {
        sdDur = 0;
    } else {
        sdDur = this.endTimePos - firstDayTimePos;
    }

    if (dur > sdDur) {
        dur -= sdDur;
        var days = Math.floor(dur / this.BS.d) + 1;
        bIncludeHoliday ? d.add('d', days) : d.incrementDateByWorkingDays(days);

        var edDur = 0;
        var lastDayTime = dur % this.BS.d;
        if (lastDayTime > 0) {
            //bIncludeHoliday ? d.add('d', 1) : d.incrementDateByWorkingDays(1);
            //d.incrementDateByWorkingDays( 1);
            var lastDayTimePos = this.startTimePos + lastDayTime;
            d.setHours(0, 0, 0, 0);
            d.setTime(d.getTime() + lastDayTimePos);
        }
    } else {
        d.setTime(tempDate.getTime() + firstDayTimePos + dur);
    }
    return d.getTime();
}

/**
 * 根据结束日期以及时间跨度，确定起始日期
 * @param end
 * @param dur
 * @returns {number}
 */
DateSrv.prototype.computeStartByDuration = function(end, dur, bIncludeHoliday) {
    var tempDate = new Date(end);
    tempDate.setHours(0, 0, 0, 0);
    var d = new Date(end);
    var lastDayTimePos = d.getTime() - tempDate.getTime();
    var sdDur = 0;
    if (lastDayTimePos >= this.endTimePos) {
        sdDur = this.BS.d;
    } else if (lastDayTimePos < this.startTimePos) {
        sdDur = 0;
    } else {
        sdDur = lastDayTimePos - this.startTimePos;
    }
    if (dur > sdDur) {
        dur -= sdDur;
        var days = Math.floor(dur / this.BS.d) + 1; //从第二天开始计算
        bIncludeHoliday ?  d.add('d',-1 * days) : d.incrementDateByWorkingDays( -1 * days);

        var edDur = 0;
        var firstDayTimes = dur % this.BS.d;
        if (firstDayTimes > 0) {
            //d.incrementDateByWorkingDays( -1);
           // bIncludeHoliday ?  d.add('d',-1) : d.incrementDateByWorkingDays( -1);
            var firstDayTimePos = this.endTimePos - firstDayTimes;
            d.setHours(0, 0, 0, 0);
            d.setTime(d.getTime() + firstDayTimePos);
        }
    } else {
        d.setTime(tempDate.getTime() + lastDayTimePos - dur);
    }
    return d.getTime();
}

DateSrv.prototype.incrementDateByWorkingTimes = function(date, durTimes) {
    if (durTimes > 0) {
        return this.computeEndByDuration(date, durTimes);
    } else {
        return this.computeStartByDuration(date, -1 * durTimes);
    }
}

DateSrv.prototype.recomputeDuration = function(start, end) {
    return this.distanceInWorkingTimes(start, end, false);
}

/**
 * 计算时间区域内 工作时间区域的汇总
 * @param start
 * @param end
 * @param includeHolitime 是否包括周末节假日对应的时间区域
 * @returns {number}
 */
DateSrv.prototype.distanceInWorkingTimes = function(start, end, includeHolitime) {
    var tempSD = new Date(start);
    var tempED = new Date(end);
    tempSD.setHours(0, 0, 0, 0);
    var sd = tempSD.getTime();
    tempED.setHours(0, 0, 0, 0);
    var ed = tempED.getTime();

    if (sd == ed) {
        var dur = end - start;
        return (dur > this.BS.d ? this.BS.d : dur)
    }

    var firstDayTimePos = start  - sd;
    var lastDayTimePos = end - ed;
    var durTime = 0;
    var durDay = includeHolitime ? new Date(sd).distanceDays(new Date(ed)) : new Date(sd).distanceInWorkingDays(new Date(ed));
    if (durDay >= 2) {
        durTime = (durDay - 2) * this.BS.d;
    }

    var sdDur = 0;
    if (!isHoliday(tempSD)) {
        if (firstDayTimePos <= this.startTimePos) {
            sdDur = this.BS.d;
        } else if (firstDayTimePos > this.endTimePos) {
            sdDur = 0;
        } else {
            sdDur = this.endTimePos - firstDayTimePos;
        }
    }

    var edDur = 0;
    if (!isHoliday(tempED)) {
        if ( lastDayTimePos <= this.startTimePos) {
            edDur = 0;
        } else if (lastDayTimePos > this.endTimePos) {
            edDur = this.BS.d;
        } else {
            edDur = lastDayTimePos - this.startTimePos + 1;
        }
    }
    durTime += sdDur + edDur;

    return durTime;
}

DateSrv.prototype.distanceInWorkingDays4Unit = function(start, end) {
    var times = this.distanceInWorkingTimes(start, end, false);
    return Math.round(times / this.BASE_UNIT_VALUE);
}

DateSrv.prototype.ms2dur = function(times) {
    return Math.round(times / this.BASE_UNIT_VALUE);
}

DateSrv.prototype.computeDayWorkTimes = function() {
    return this.BS.d;
}

DateSrv.prototype.initDayTime = function(start, end) {
    start.setHours(this.dayStartTime.hh, this.dayStartTime.mm, this.dayStartTime.ss, this.dayStartTime.ms);
    end.setHours(this.dayEndTime.hh, this.dayEndTime.mm, this.dayEndTime.ss, this.dayEndTime.ms);
}

DateSrv.prototype.isDayEndTime = function(date) {
    var temp = new Date(date.getTime());
    temp.setHours(0, 0, 0, 0);
    var curPos = date.getTime() - temp.getTime();
    return curPos >= this.endTimePos
}

DateSrv.prototype.isDayWorkingTime = function(date) {
    var temp = new Date(date.getTime());
    temp.setHours(0, 0, 0, 0);
    var curPos = date.getTime() - temp.getTime();
    return curPos >= this.startTimePos &&  curPos <= this.endTimePos
}

DateSrv.prototype.initDayStartTime = function(start) {
    start.setHours(this.dayStartTime.hh, this.dayStartTime.mm, this.dayStartTime.ss, this.dayStartTime.ms);
}

DateSrv.prototype.getUnit = function() {
    return this.unit;
}
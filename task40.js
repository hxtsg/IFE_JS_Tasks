/**
 * Created by 鑫 on 2016/8/30.
 */
var $ = function(id)
{
    return document.querySelector(id);
}

var MainController = function()
{
    this.ui = null;
    this.info = null;
}

MainController.prototype.Register = function(obj){
    if( obj instanceof UIManager ){
        this.ui = obj;
    }
    else if( obj instanceof CalendarInfo ){
        this.info = obj;
    }
}

var UIManager = function( c ){
    this.main = c;
    this.htmlElements = {
        
    };
}

UIManager.prototype.Draw = function(){
    var self = this;
    return{
        DrawHead:function(){

        },
        DrawContent:function(){

        },
        DrawSelectionOptions:function(){

        }
    }
}


var CalendarInfo = function( c ){
    this.main = c;
    this.year_selected = null;
    this.month_selected = null;
    this.day_selected = null;
    this.calendar_array = new Array(); // { day, active }
    this.startBound = null;
    this.endBound = null;
}

CalendarInfo.prototype.UpdateCalendarArray = function(){  // when the date selected is updated, the array is updated accordingly

}

CalendarInfo.prototype.SetBoundary = function( startDate, endDate ){

}

CalendarInfo.prototype.SetSelectedDate = function(){


}





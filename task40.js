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
        Calender:$("#Calender"),
        month_ahead:$("#month-ahead"),
        month_forward:$("#month-forward"),
        month_input:$("#month-input"),
        year_input:$("#year-input"),
        CaTable :$("#CaTable")
    };
    this.headNames = [ "Su","Mo","Tu","We","Th","Fr","Sa" ];
    this.lastClick = null; // 表示上次点击的那个日期，用于选下个日期的时候把上个日期的style给改回来
}

UIManager.prototype.Init = function(){
    this.Draw().DrawTable();
    this.Draw().DrawSelectionOptions_Year();
    this.Draw().DrawSelectionOptions_Month();
    this.AddEventHandler();
}

UIManager.prototype.AddEventHandler = function(){
    this.htmlElements.year_input.addEventListener("change",function( ev ){
        var tar = ev.target;
        window.mainController.info.SetYear( tar.value );
        window.mainController.info.UpdateCalendarArray();
        window.mainController.ui.Draw().DrawTable();
        console.log( window.mainController.info.year_selected + " " + window.mainController.info.month_selected );
    });
    this.htmlElements.month_input.addEventListener("change",function( ev ){
        var tar = ev.target;
        window.mainController.info.SetMonth( tar.value );
        window.mainController.info.UpdateCalendarArray();
        window.mainController.ui.Draw().DrawTable();
        console.log( window.mainController.info.year_selected + " " + window.mainController.info.month_selected );

    });

    this.htmlElements.month_ahead.addEventListener("click",function(){
        window.mainController.info.MoveMonth( -1 );
        window.mainController.info.UpdateCalendarArray();
        window.mainController.ui.Draw().DrawTable();
        window.mainController.ui.Draw().DrawSelection();
        console.log( window.mainController.info.year_selected + " " + window.mainController.info.month_selected );


    });
    this.htmlElements.month_forward.addEventListener("click",function(){
        window.mainController.info.MoveMonth( 1 );
        window.mainController.info.UpdateCalendarArray();
        window.mainController.ui.Draw().DrawTable();
        window.mainController.ui.Draw().DrawSelection();
        console.log( window.mainController.info.year_selected + " " + window.mainController.info.month_selected );

    });


}


UIManager.prototype.Draw = function(){
    var self = this;
    return{
        DrawTable:function(){
            self.htmlElements.CaTable.innerHTML = "";
            self.Draw().DrawHead();
            self.Draw().DrawContent();
        },
        DrawSelection:function(){   // 根据左右调节的按钮控制input时间的显示
            self.htmlElements.month_input.value = self.main.info.month_selected;
            self.htmlElements.year_input.value = self.main.info.year_selected;
        },
        DrawHead:function(){
            var tr_element = document.createElement('tr');
            for( var i = 0 ; i < self.headNames.length ; i ++ ){
                var th_element = document.createElement('th');
                th_element.textContent = self.headNames[ i ];
                tr_element.appendChild( th_element );
            }
            self.htmlElements.CaTable.appendChild( tr_element );
        },
        DrawContent:function(){
            var tab_arr = self.main.info.calendar_array;
            for( var i = 0 ; i < tab_arr.length ; i ++ ){
                var tr_element = document.createElement('tr');
                for( var j = 0 ; j < tab_arr[ i ].length ; j ++ ){
                    var td_element = document.createElement('td');
                    td_element.textContent = tab_arr[ i ][ j ][ 0 ];
                    if( tab_arr[ i ][ j ][ 1 ] ){
                        td_element.style.color = "#000000";
                    }
                    else{
                        td_element.style.color = "#979797";
                    }
                    td_element.addEventListener( "click",function( ev ){
                        ev.target.style.backgroundColor = "blue";
                        if( self.lastClick != null ){
                            self.lastClick.style.backgroundColor = "#ffffff";
                        }
                        self.lastClick = ev.target;
                    } );
                    tr_element.appendChild( td_element );
                }
                self.htmlElements.CaTable.appendChild( tr_element );
            }
        },
        DrawSelectionOptions_Year:function(){  // 向年菜单中添加数据
            var start_year = self.main.info.startBound.getFullYear();
            var end_year = self.main.info.endBound.getFullYear();
            for( var i = start_year ; i <= end_year ; i ++ ){
                var option_element = document.createElement('option');
                option_element.textContent = i;
                self.htmlElements.year_input.appendChild( option_element );
            }
        },
        DrawSelectionOptions_Month:function(){  // 向月菜单中添加数据
            for( var i = 1 ; i <= 12 ; i ++ ){
                var option_element = document.createElement('option');
                option_element.textContent = i;
                self.htmlElements.month_input.appendChild( option_element );
            }
        }

    }
}


var CalendarInfo = function( c ){
    this.main = c;
    this.year_selected = 1900;
    this.month_selected = 1;
    this.day_selected = null;
    this.calendar_array = new Array(); // { day, active }
    this.startBound = new Date("1900-1-1");
    this.endBound = new Date("2200-1-1");
    this.dayInMonths = [ 31,28,31,30,31,30,31,31,30,31,30,31 ];
    this.RowCnt = 6;
    this.ColCnt = 7;
}
CalendarInfo.prototype.MoveMonth = function( increment ){
    this.month_selected = parseInt( this.month_selected ) + parseInt(increment);
    if( this.month_selected == 13 ){
        this.month_selected = 1;
        this.MoveYear( 1 );
    }
    else if( this.month_selected == 0 ){
        this.month_selected = 12;
        this.MoveYear( -1 );
    }
}


CalendarInfo.prototype.MoveYear = function( increment )
{
    this.SetYear( parseInt(this.year_selected) + parseInt(increment) );
}


CalendarInfo.prototype.SetYear = function( year ){
    this.year_selected = year;
    if( year % 400 == 0 || ( year % 4 == 0 && year % 100 != 0 ) ){  // is leapyear
        this.dayInMonths[ 1 ] = 29;
    }
    else{
        this.dayInMonths[ 1 ] = 28;
    }
}
CalendarInfo.prototype.SetMonth = function( month ){
    this.month_selected = month;
}

CalendarInfo.prototype.Init = function(){
    for( var i = 0 ; i < 6 ; i ++ ){
        var arr = new Array();
        for( var j = 0 ; j < 7 ; j ++ ){
            arr.push( [ 0, false ] );
        }
        this.calendar_array.push( arr );
    }
    this.UpdateCalendarArray();
}

CalendarInfo.prototype.PushIntoCalendarArray = function( r, c, day, active ){
    this.calendar_array[ r ][ c ][ 0 ] = day;
    this.calendar_array[ r ][ c ][ 1 ] = active;
}


CalendarInfo.prototype.UpdateCalendarArray = function(){  // when the date selected is updated, the array is updated accordingly
    var curDate = new Date( this.year_selected + "/" + this.month_selected + "/" + 1 );
    var curCol = curDate.getDay();
    var curRow = curCol == 0?1:0;

    // last month
    // and get the last several days of last month

    var last_month = null;
    if( this.month_selected == 1 ){
        last_month = 12;
    }
    else{
        last_month = this.month_selected - 1;
    }
    var days_in_last_month = this.dayInMonths[ last_month - 1 ];
    var dayCnts = curRow == 0 ? curCol : 7 ;

    try
    {
        for( var i = 0 ; i < dayCnts ; i ++ ){
            this.PushIntoCalendarArray( 0, (curCol - 1 - i + 7) % 7, days_in_last_month - i, false );
        }
    }
    catch(e){
        console.log("before");
    }

    try{
        for( var i = 1 ; i <= this.dayInMonths[ this.month_selected - 1 ] ; i ++ ){
            this.PushIntoCalendarArray(curRow,curCol,i,true);
            curRow += parseInt(( curCol + 1 ) / 7);
            curCol = ( curCol + 1 ) % 7;
        }
    }
    catch(e){
        console.log( curRow, curCol );
    }


    // next month
    // get several early days in next month
    try{
        var dayCnt = 1;
    while( curRow < this.RowCnt ){
        this.PushIntoCalendarArray(curRow,curCol,dayCnt ++,false);
        curRow += parseInt(( curCol + 1 ) / 7);
        curCol = ( curCol + 1 ) % 7;
    }
    }
    catch(e){
        console.log("after");
    }


}

CalendarInfo.prototype.SetSelectedDate = function( startDate, endDate ){

}

CalendarInfo.prototype.SetBoundary = function( start_date_in_txt, end_date_in_txt ){
    this.startBound = new Date( start_date_in_txt );
    this.endBound = new Date( end_date_in_txt );
    this.year_selected = this.startBound.getFullYear();
    this.month_selected = 1;
}


window.onload = function(){
    var mainController = new MainController();
    var ui = new UIManager( mainController );
    var info = new CalendarInfo( mainController );
    window.mainController = mainController;
    mainController.Register( ui );
    mainController.Register( info );
    info.Init();
    ui.Init();
}



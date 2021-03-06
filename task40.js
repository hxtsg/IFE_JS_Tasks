/**
 * Created by 鑫 on 2016/8/30.
 */
// var $ = function(id)
// {
//     return document.querySelector(id);
// }

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
        calendar:document.querySelector("#calendar"),
        month_ahead:document.querySelector("#month-ahead"),
        month_forward:document.querySelector("#month-forward"),
        month_input:document.querySelector("#month-input"),
        year_input:document.querySelector("#year-input"),
        CaTable :document.querySelector("#CaTable"),
        calendar_btn:document.querySelector("#calendar-button"),
        title_text:document.querySelector("#title-text")
    };
    this.headNames = [ "Su","Mo","Tu","We","Th","Fr","Sa" ];
    this.lastClick = null; // 表示上次点击的那个日期，用于选下个日期的时候把上个日期的style给改回来
    this.disabledColor = "#979797";
}

UIManager.prototype.Init = function(){
    this.Draw().DrawTable();
    this.Draw().DrawSelectionOptions_Year();
    this.Draw().DrawSelectionOptions_Month();
    this.InitCalendarTitle();
    this.AddEventHandler();
}

UIManager.prototype.InitCalendarTitle = function(){
    $("#calendar").hide();
}

UIManager.prototype.MoveMonthEventHandler = function( increment ){
    window.mainController.info.MoveMonth( increment );
    window.mainController.info.UpdateCalendarArray();
    window.mainController.ui.Draw().DrawTable();
    window.mainController.ui.Draw().DrawSelection();
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
        window.mainController.ui.MoveMonthEventHandler( -1 );
        console.log( window.mainController.info.year_selected + " " + window.mainController.info.month_selected );


    });
    this.htmlElements.month_forward.addEventListener("click",function(){
        window.mainController.ui.MoveMonthEventHandler( 1 );
        console.log( window.mainController.info.year_selected + " " + window.mainController.info.month_selected );

    });
    $("#calendar-button").click( function(){
        $("#calendar").toggle();
    } );



}


UIManager.prototype.Draw = function(){
    var self = this;
    return{

        DrawSelectedDay : function( target ){   // target就是被设置的那个element，设置这个elemetn的style，恢复上个element的style

            target.setAttribute("class","chosen");
            target.style.color = "#ffffff";
            var inf = self.main.info;
            inf.day_selected = target.textContent;
            console.log( inf.year_selected + " " + inf.month_selected + " " + inf.day_selected );
            if( self.lastClick != null ){
                self.lastClick.setAttribute("class","not-chosen");
                self.lastClick.style.color = "#000000";
            }
            self.lastClick = target;
            self.htmlElements.title_text.value= self.main.info.year_selected + "-" + self.main.info.month_selected + "-" + self.main.info.day_selected;
            self.main.info.SelectDateCallback();

        },
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

                    if( tab_arr[ i ][ j ][ 1 ] == 0 ){
                        td_element.style.color = "#000000";
                        td_element.addEventListener( "click",function( ev ){
                            window.mainController.ui.Draw().DrawSelectedDay( ev.target );
                            $("#calendar").toggle();
                        } );
                    }
                    else if( tab_arr[ i ][ j ][ 1 ] == -1 ){       // 这就表示是灰色的那些，往前或者往后，具体由表格中的值来确定
                        td_element.style.color = "#979797";
                        td_element.addEventListener( "click",function( ev ){
                            window.mainController.ui.MoveMonthEventHandler( -1 );
                        } );
                    }
                    else if( tab_arr[ i ][ j ][ 1 ] == 1 ){
                        td_element.style.color = "#979797";
                        td_element.addEventListener( "click",function( ev ){
                            window.mainController.ui.MoveMonthEventHandler( 1 );
                        } );
                    }


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
    this.SelectDateCallback = function(){}; //这是设置日期或者点击日期之后的回调函数
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
            arr.push( [ 0, 0 ] );
        }
        this.calendar_array.push( arr );
    }
    this.UpdateCalendarArray();
}

CalendarInfo.prototype.PushIntoCalendarArray = function( r, c, day, active ){
    this.calendar_array[ r ][ c ][ 0 ] = day;
    this.calendar_array[ r ][ c ][ 1 ] = active;
}

CalendarInfo.prototype.Date2Index = function(){  //获得当前的类里面的selected的日期，返回在ui的那个table里面，是第几行，第几列
    for( var i = 0 ; i < 6 ; i ++ ){
        for( var j = 0 ; j < 7 ; j ++ ){
            if( this.calendar_array[ i ][ j ][ 0 ] == this.day_selected
                && this.calendar_array[ i ][ j ][ 1 ] == 0 ){
                return{ row : i, col: j };
            }
        }
    }
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

    //上月月末的几个日期
    for( var i = 0 ; i < dayCnts ; i ++ ) {
        this.PushIntoCalendarArray(0, (curCol - 1 - i + 7) % 7, days_in_last_month - i, -1);

    }
        // 本月的几个日期

    for( var i = 1 ; i <= this.dayInMonths[ this.month_selected - 1 ] ; i ++ ){
        this.PushIntoCalendarArray(curRow,curCol,i,0);
        curRow += parseInt(( curCol + 1 ) / 7);
        curCol = ( curCol + 1 ) % 7;
    }




    // next month
    // get several early days in next month
    var dayCnt = 1;
    while( curRow < this.RowCnt ){
        this.PushIntoCalendarArray(curRow,curCol,dayCnt ++,1);
        curRow += parseInt(( curCol + 1 ) / 7);
        curCol = ( curCol + 1 ) % 7;
    }




}

CalendarInfo.prototype.SetSelectedDate = function( selected_date ){

    var date = new Date(selected_date);
    this.year_selected = date.getFullYear();
    this.month_selected = date.getMonth() + 1;
    this.day_selected = date.getDate();
    this.main.ui.Draw().DrawTable();
    this.main.ui.Draw().DrawSelection();
    var index_object = this.Date2Index();
    var table_htmlElement = this.main.ui.htmlElements.CaTable;
    var target = table_htmlElement.childNodes[ index_object.row + 1 ].childNodes[ index_object.col ];
    this.main.ui.Draw().DrawSelectedDay( target );
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

    info.SelectDateCallback = function(){
        alert("Callback Function!");
    };
    info.SetSelectedDate("2016-8-17");
}



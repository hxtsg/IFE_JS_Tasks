/**
 * Created by 鑫 on 2016/8/29.
 */
var $ = function( id )
{
    return document.querySelector(id);
}

var MainController = function(){
    this.hciManager = null;
    this.chartManager = null;
}

MainController.prototype.Register = function( obj ){
    if( obj instanceof HCIManager ){
        this.hciManager = obj;
    }
    else if( obj instanceof ChartManager ){
        this.chartManager = obj;
    }
}

var HCIManager = function( c ){
    this.mainController = c;
    this.htmlElements = {
        table:$("#sort-table")
    };
}

/*
* @DrawChart：从chartmanager那里获得信息然后重新生成html
* */
HCIManager.prototype.DrawChartHead = function(){
    var table = this.htmlElements.table;
    var headArray = this.mainController.chartManager.table_headNames;
    table.innerHTML = "";
    var tr_element = document.createElement('tr');
    for( var i = 0 ; i < headArray.length ; i ++ ){
        var th_element = document.createElement('th');
        th_element.textContent = headArray[ i ];
        var up_sort_btn = document.createElement('button');
        up_sort_btn.textContent = "up";

        var down_sort_btn = document.createElement('button');
        down_sort_btn.textContent = "down";
        th_element.appendChild( up_sort_btn );
        th_element.appendChild( down_sort_btn );
        up_sort_btn.addEventListener( "click",function( ev ){
            var tar = ev.target;

            window.mainController.chartManager.Sort( tar.parentNode.childNodes[0].textContent, "up" );
        } );
        down_sort_btn.addEventListener( "click",function( ev ){
            var tar = ev.target;
            window.mainController.chartManager.Sort( tar.parentNode.childNodes[0].textContent, "down" );
        } );
        tr_element.appendChild( th_element );
    }
    table.appendChild( tr_element );
}

HCIManager.prototype.DrawOneRow = function( rowIndex ){
    var nArr = this.mainController.chartManager.rowArray[ rowIndex ];
    var tr_element = document.createElement('tr');
    for( var i = 0 ; i < nArr.length ; i ++ ){
        var td_element = document.createElement('td');
        td_element.textContent = nArr[ i ];
        tr_element.appendChild( td_element );
    }
    this.htmlElements.table.appendChild( tr_element );
}

HCIManager.prototype.DrawAllRows = function(){
    var rows = this.mainController.chartManager.rowArray;
    for( var i = 0 ; i < rows.length ; i ++ ){
        this.DrawOneRow( i );
    }
}



var ChartManager = function( c ){
    this.mainController = c;
    this.table_headNames = new Array();
    this.rowArray = new Array();
    this.sortFunction = null;
}

/*
*
*   @headNames:数组，包含表头的名字
* */

ChartManager.prototype.Init = function( headNames )
{
    for( var i = 0 ; i < headNames.length ; i ++ ){
        this.table_headNames.push( headNames[ i ] );
    }
    this.mainController.hciManager.DrawChartHead();
}

/*
*      @rowInfo:rowInfo是一个数组[]，里面包含一行里面的键值对
* */
ChartManager.prototype.PushNewRow = function( rowInfo )
{
    var curArray = new Array();
    for( var i = 0 ; i < rowInfo.length ; i ++ ){
        curArray.push( rowInfo[ i ] );
    }
    this.rowArray.push( curArray );
    this.mainController.hciManager.DrawOneRow( this.rowArray.length - 1 );
}

/*
*
*
* */
ChartManager.prototype.SetSortFunction = function( method ){
    this.sortFunction = method;
}

ChartManager.prototype.GetRowIndexFromName = function( colName ){
    for( var i = 0 ; i < this.table_headNames.length ; i ++ ){
        if( this.table_headNames[ i ] == colName ){
            return i;
        }
    }
    return -1;
}


ChartManager.prototype.SetSortable = function( colName ){

}

ChartManager.prototype.Sort = function( colName, o ){
    //this.sortFunction( colName );
    var order = o == "up"?1:-1;
    var index = this.GetRowIndexFromName( colName );
    this.rowArray.sort( function( a, b ){
        return (parseInt( a[index] ) - parseInt( b[index] )) * order;
    } );
    this.mainController.hciManager.DrawChartHead();
    this.mainController.hciManager.DrawAllRows();
}




window.onload = function(){
    var mainController = new MainController();
    var hciManager = new HCIManager( mainController );
    var chartManager = new ChartManager( mainController );
    mainController.Register( hciManager );
    mainController.Register( chartManager );
    window.mainController = mainController;
    chartManager.Init(["first","second","third","forth"]);
    chartManager.PushNewRow( ["7","2","35","43"] );
    chartManager.PushNewRow( ["1","434","43","46"] );
    chartManager.PushNewRow( ["2","532","334","4"] );
    chartManager.PushNewRow( ["3","2633","3r","4342"] );
    chartManager.PushNewRow( ["4","244","63","43"] );
    chartManager.PushNewRow( ["5","25","37","4"] );
 //   chartManager.Sort( "second" );
}





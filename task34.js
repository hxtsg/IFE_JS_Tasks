/**
 * Created by 鑫 on 2016/8/22.
 */


var CNT_IN_ROW = 10;
var CNT_IN_COL = 10;
var COL_WIDTH = 60;
var ROW_WIDTH = 60;
var WINDOW_OFFSET_X = 8;
var WINDOW_OFFSET_Y = 8;
var $ = function( id ){
    return document.querySelector( id );
}

var MainController = function(){
    this.hciManager = null;
    this.fieldInfoManager = null;
}

MainController.prototype.Register = function( obj ){
    if( obj instanceof HCIManager ){
        this.hciManager = obj;
    }
    else if( obj instanceof  FieldInfoManager ){
        this.fieldInfoManager = obj;
    }
}


var HCIManager = function( main_controller ){
    this.mainController = main_controller;
    this.htmlElements = {
        draw_grid : $("#draw_grid"),
        moving_block:$("#moving"),
        input_command:$("#input-command"),
        submit_btn:$("#submit-btn")
    };
}

HCIManager.prototype.Init = function(){
    this.Draw().Draw_grids();
    this.htmlElements.submit_btn.addEventListener( "click", function(){
        this.mainController.fieldInfoManager.InterpreteAndProcess();
        this.Draw().Draw_moving_block();
    } );
}

HCIManager.prototype.Draw = function(){
    var self = this;
    return{

        Draw_moving_block : function(){
            var element_info = self.mainController.fieldInfoManager.movingBlock;
            var html_element = self.htmlElements.moving_block;
            html_element.style.left = element_info.colNum * COL_WIDTH + "px";
            html_element.style.top = element_info.rowNum * ROW_WIDTH + "px";
        },

        Draw_grid_element : function( id ){
            var grid_element = document.createElement( "div" );
            grid_element.className = "grid-element";
            grid_element.id = id;
            self.htmlElements.draw_grid.appendChild( grid_element );
        },
        Draw_grids : function(){
            var grid_array = self.mainController.fieldInfoManager.gridMap;
            for( var i = 0 ; i < grid_array.length ; i ++ ){
                for( var j = 0 ; j < grid_array[ i ].length ; j ++ ){
                    self.Draw().Draw_grid_element( i * CNT_IN_ROW + j );
                }
            }
            self.Draw().Draw_moving_block();
        }
    }
}




var FieldInfoManager = function( main_controller ){
    this.mainController = main_controller;
    this.gridMap = null;
    this.movingBlock = null;
}

FieldInfoManager.prototype.InterpreteAndProcess = function(){
    var command = this.mainController.hciManager.htmlElements.input_command.value;
    //interprete the command
    //manipulate the moving block
}

FieldInfoManager.prototype.Init = function(){
    this.gridMap = new Array( CNT_IN_ROW );
    for( var i = 0 ; i < this.gridMap.length ; i ++ ){
        this.gridMap[ i ] = new Array( CNT_IN_COL );
        for( var j = 0 ; j < this.gridMap[ i ].length ; j ++ ){
            this.gridMap[ i ][ j ] = new BlockElement( i * CNT_IN_ROW + j, i, j );
        }
    }
    this.movingBlock = new BlockElement( CNT_IN_COL * CNT_IN_ROW, 2, 1, 0 );
}

var BlockElement = function( id, r, c){
    this.id = id;
    this.rowNum = r;
    this.colNum = c;
    this.faceDirection = null;   // 0 is north, and clockwise;
}


window.onload = function(){
        var mainController = new MainController();
        var fieldManager = new FieldInfoManager( mainController );
        var hciManager = new HCIManager(mainController);
        mainController.Register( fieldManager );
        mainController.Register( hciManager );
        fieldManager.Init();
        hciManager.Init();

    }
// (function () {
//
//
// })();


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
        window.main_controller.fieldInfoManager.InterpreteAndProcess();
        window.main_controller.hciManager.Draw().Draw_moving_block();
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
    this.command = {
        word:"",
        step_num:0,
        direction:0
    };

}

FieldInfoManager.prototype.direction2num = function( direction ){
    var command_direction = null;
    switch( direction ){
        case 'TOP':
            command_direction = 0;
            break;
        case 'BOT':
            command_direction = 2;
            break;
        case 'LEF':
            command_direction = 3;
            break;
        case 'RIG':
            command_direction = 1;
            break;
    }
    return command_direction;
}


FieldInfoManager.prototype.Commands = function( arg, arg1,arg2 ){
    var self = this;
    return{
        go:function(){    //translate用的也是这个函数，arg是命令，arg1是步数，arg2是方向
            var direction = self.command.direction;
            var step_num = self.command.step_num;
            for( var i = 0 ; i < step_num ; i ++ ){
                var tmp_r = self.movingBlock.rowNum;
                var tmp_c = self.movingBlock.colNum;
                switch( direction ){
                    case 0:
                        tmp_r --;
                        break;
                    case 1:
                        tmp_c ++;
                        break;
                    case 2:
                        tmp_r ++;
                        break;
                    case 3:
                        tmp_c --;
                        break;
                }
                if( tmp_r < 0 || tmp_r >= CNT_IN_ROW || tmp_c < 0 || tmp_c >= CNT_IN_COL || self.gridMap[ tmp_r ][ tmp_c ].isBlock == true ){
                        return false;
                }
                self.movingBlock.rowNum = tmp_r;
                self.movingBlock.colNum = tmp_c;
            }
            return true;
        },
        turn:function(){
            var degree = parseInt( arg );  // 转的角度，90，-90，180
            self.faceDirection = ( self.faceDirection + degree / 90 ) % 4;
        },
        turn_to:function(){
            var direction = parseInt( arg ); // 转的朝向，0,1,2,3
            self.faceDirection = direction;
        }

    }
}


FieldInfoManager.prototype.InterpreteAndProcess = function(){
    var com = this.mainController.hciManager.htmlElements.input_command.value.toUpperCase().split(" ");
    if( com.length == 0 ){
        return;
    }
    switch( com[0] ){
        case 'GO':
            this.command.word = 'GO';
            if( com.length == 1 ){
                this.command.step_num = 1;
            }
            else{
                this.command.step_num = parseInt( com[1] );
            }
            this.command.direction = this.movingBlock.faceDirection;
            this.Commands().go();
            break;
        case 'TRA':
            this.command.word = 'TRA';
            this.command.direction = this.direction2num( com[ 1 ] );
            if( com.length == 2 ){
                this.command.step_num = 1;
            }
            else{
                this.command.step_num = parseInt( com[ 2 ] );
            }
            this.Commands().go();
            break;
        case 'TUN':
            this.Commands().turn();
            break;
        case '':break;
        case '':break;
    }
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

var BlockElement = function( id, r, c, d){
    this.id = id;
    this.rowNum = r;
    this.colNum = c;
    this.faceDirection = d;   // 0 is north, and clockwise;
    this.isBlock = false;
}


window.onload = function(){
        var mainController = new MainController();
        window.main_controller = mainController;
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


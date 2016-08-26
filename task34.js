/**
 * Created by 鑫 on 2016/8/22.
 */


var CNT_IN_ROW = 10;
var CNT_IN_COL = 10;
var COL_WIDTH = 60;
var ROW_WIDTH = 60;
var WINDOW_OFFSET_X = 8;
var WINDOW_OFFSET_Y = 8;
var VEIL_LINE_HEIGHT = 23;
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
        submit_btn:$("#submit-btn"),
        line_num_ul:$("#line-number-ul"),
        command_area:$("#command-textarea"),
        code_veil:$("#code-veil")
    };
}

HCIManager.prototype.Init = function(){
    this.Draw().Draw_grids();
    this.htmlElements.submit_btn.addEventListener( "click", function(){
        window.main_controller.fieldInfoManager.InterpreteAndProcess();
        window.main_controller.hciManager.Draw().Draw_moving_block();
    } );
    this.htmlElements.command_area.innerHTML = "";
    this.htmlElements.command_area.addEventListener("keyup",function(){
        window.main_controller.fieldInfoManager.SplitTextAreaCommands();
        window.main_controller.hciManager.Draw().ChangeVeilPosition( window.main_controller.fieldInfoManager.commandArray.length - 1 );
        window.main_controller.hciManager.Draw().Draw_lineNumber();
    });
}

HCIManager.prototype.Draw = function(){
    var self = this;
    return{
        ChangeVeilPosition : function( veil_lineNum ){
            self.htmlElements.code_veil.style.top = veil_lineNum * VEIL_LINE_HEIGHT + "px";
        },
        Draw_lineNumber:function(){
            var commands_array = self.mainController.fieldInfoManager.commandArray;
            self.htmlElements.line_num_ul.innerHTML = "";
            var draw_num = commands_array.length;
            for( var i = 0 ; i < draw_num ; i ++ ){
                var li_element = document.createElement('li');
                li_element.textContent = i + 1;
                self.htmlElements.line_num_ul.appendChild( li_element );
            }
        },
        Draw_moving_block : function(){
            var queue = self.mainController.fieldInfoManager.stateQueue;
            if( queue.curPointer >= queue.rear ){
                queue.ClearArray();
                return;
            }

            var element_info = queue.stateArray[ queue.curPointer ];
            var html_element = self.htmlElements.moving_block;

            if (element_info.ani_indication == 'VER') {
                html_element.style.transition = "top 1s";
            }
            else if (element_info.ani_indication == 'HOR') {
                html_element.style.transition = "left 1s";
            }
            else if (element_info.ani_indication == 'ROT') {
                html_element.style.transition = "transform 1s"
            }
            html_element.style.left = element_info.colNum * COL_WIDTH + "px";
            html_element.style.top = element_info.rowNum * ROW_WIDTH + "px";
            html_element.style.transform = "rotate(" + element_info.faceDirection * 90 + "deg)";
            self.Draw().ChangeVeilPosition( element_info.command_index );
            console.log( element_info.command_index );
            queue.curPointer ++;
            setTimeout( function(){
                self.Draw().Draw_moving_block();
            }, 1000);

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


var StateQueue = function(){
    this.stateArray = new Array();
    this.rear = 0;
    this.curPointer = 0;
}
StateQueue.prototype.PushIntoStateArray = function( elementState )
{
    var n_ele = new BlockElement( elementState.id, elementState.rowNum, elementState.colNum, elementState.faceDirection )
    n_ele.ani_indication = elementState.ani_indication;
    n_ele.command_index = elementState.command_index;
    this.stateArray[ this.rear ++ ] = n_ele;
}
StateQueue.prototype.ClearArray = function(){
    this.rear = 0;
    this.curPointer = 0;
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
    this.stateQueue = new StateQueue();
    this.commandArray = null;
}

FieldInfoManager.prototype.SplitTextAreaCommands = function(){
    var raw_text =  raw_text= this.mainController.hciManager.htmlElements.command_area.value;
    // if( keycode == '8' ){
    //     raw_text.slice( 0,-1 );
    // }
    this.commandArray = raw_text.split('\n');

}


FieldInfoManager.prototype.turn_direction2num = function( direction ){  // 返回的是方向的变化量
    var change_in_direction = null;
    switch( direction ){
        case 'BAC':
            change_in_direction = 2;
            break;
        case 'LEF':
            change_in_direction = -1;
            break;
        case 'RIG':
            change_in_direction = 1;
            break;
    }
    return change_in_direction;
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


FieldInfoManager.prototype.Commands = function(){
    var self = this;
    return{
        go:function( command_index ){    //translate用的也是这个函数
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
                if( direction == 0 || direction == 2 ){
                    self.movingBlock.ani_indication = 'VER';
                }
                else{
                    self.movingBlock.ani_indication = 'HOR';
                }
                if( tmp_r < 0 || tmp_r >= CNT_IN_ROW || tmp_c < 0 || tmp_c >= CNT_IN_COL || self.gridMap[ tmp_r ][ tmp_c ].isBlock == true ){
                        return false;
                }
                self.movingBlock.rowNum = tmp_r;
                self.movingBlock.colNum = tmp_c;
            }
            self.movingBlock.command_index = command_index;
            self.stateQueue.PushIntoStateArray( self.movingBlock );
            return true;
        },
        turn:function( command_index ){
            var change_direction = self.command.direction;
            self.movingBlock.faceDirection = ( self.movingBlock.faceDirection + change_direction + 4 ) % 4;
            self.movingBlock.ani_indication = 'ROT';
            self.movingBlock.command_index = command_index;
            self.stateQueue.PushIntoStateArray( self.movingBlock );
        },
        turn_to:function( command_index ){
            var direction = self.command.direction;
            self.movingBlock.faceDirection = direction;
            self.movingBlock.ani_indication = 'ROT';
            self.movingBlock.command_index = command_index;
            self.stateQueue.PushIntoStateArray( self.movingBlock );
        }

    }
}

FieldInfoManager.prototype.InterpreteAndProcess = function(){
    for( var i = 0 ; i < this.commandArray.length ; i ++ ){
        this.ImplementOneCommand( i );
    }
}

FieldInfoManager.prototype.ImplementOneCommand = function( command_index ){

    var com = this.commandArray[ command_index ].split(' ');
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
            this.Commands().go( command_index );

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
            this.Commands().go( command_index );
            break;
        case 'TUN':
            this.command.word = 'TUN';
            this.command.direction = this.turn_direction2num( com[ 1 ] );
            this.command.step_num = 0;
            this.Commands().turn( command_index );
            break;
        case 'TUNTO':
            this.command.word = 'TUNTO';
            this.command.direction = this.direction2num( com[1] );
            this.command.step_num = 0;
            this.Commands().turn_to( command_index );
            break;
        case 'MOV':
            this.command.word = 'MOV';
            this.command.direction = this.direction2num( com[ 1 ] );
            if( com.length > 2 ){
                this.command.step_num = parseInt( com[2] );
            }
            else{
                this.command.step_num = 1;
            }
            this.Commands().turn_to( command_index );
            this.Commands().go( command_index );
            break;
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
    this.movingBlock = new BlockElement( CNT_IN_COL * CNT_IN_ROW, 0, 0, 0 );
}

var BlockElement = function( id, r, c, d){
    this.id = id;
    this.rowNum = r;
    this.colNum = c;
    this.faceDirection = d;   // 0 is north, and clockwise;
    this.isBlock = false;
    this.ani_indication = null;  // VER, HOR, ROT
    this.command_index = null;
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


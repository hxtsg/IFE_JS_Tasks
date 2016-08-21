/**
 * Created by 鑫 on 2016/8/19.
 */

function $( id )
{
    return document.querySelector(id);
}

var MainController = function(){
    this.consoleManager = null;
    this.formManager = null;
    this.middelware = null;
}




MainController.prototype.Register = function( obj ){
    if( obj instanceof ConsoleManager ){
        this.consoleManager = obj;
    }
    else if( obj instanceof FormManager ){
        this.formManager = obj;
    }
    else if( obj instanceof MiddelWare ){
        this.middelware = obj;
    }

}

var MiddelWare = function( main_controller ){
    this.mainController = main_controller;
    this.info = {
        name :{
            s_hint:"填写正确",
            d_hint:"请填写名称",
            f_hint:["长度必须为a-b位"],
        },
        email :{
            s_hint:"填写正确",
            d_hint:"请填写邮箱",
            f_hint:["长度必须为a-b位","邮箱格式错误"],
        },
        figure:{
            s_hint:"填写",
            d_hint:"请填写数字",
            f_hint:["长度必须为a-b位","必须填写数字"],
        },
    };
}

MiddelWare.prototype.Create = function(){
    // get console elements
    var console_info = this.mainController.ConsoleManager.GetConsoleElements();
    var html_element = this.mainController.ConsoleManager.CreateElementInConsole();
    this.mainController.formManager.CreateFormElement( console_info );

    // addevents
    //
}

var ConsoleManager = function( main_controller ){
    this.mainController = main_controller;
    this.htmlArray = null;
    this.add_btn = null;
    this.console_elements = null;

}

ConsoleManager.prototype.GetConsoleElements = function(){
    return this.console_elements;
}


ConsoleManager.prototype.Init = function(){
    this.console_elements = {
        name_input : $("#name_input"),
        chose_type :$("#checked_type"),
        min_len : $("#min_len"),
        max_len : $("#max_len"),
        nec_or_not : $("#checked_nec"),
        add_btn : $("#add"),
        input_block : $("#input_block")
    };
    var types = document.getElementsByName("type");
    var necs = document.getElementsByName("necessary");
    for( var i = 0 ; i < types.length ; i ++ ){
        types[ i ].addEventListener( "click",function( ev ){
            this.console_elements['chose_type'] = ev.target;
            console.log( ev.target.value );
        } );
    }
    for( var i = 0 ; i < necs.length ; i ++ ){
        necs[ i ].addEventListener( "click",function( ev ){
            this.console_elements[ 'nec_or_not' ] = ev.target;
            console.log( ev.target );
        } );
    }
}


ConsoleManager.prototype.CreateElementInConsole = function(){

    var div_element = document.createElement( 'div' );
    div_element.className = "check-element";
    var span_element = document.createElement('span');
    span_element.textContent = this.console_elements.name_input.value;
    var input_element = document.createElement('input');
    var hint_element =document.createElement('div');
    hint_element.className = "hint";
    div_element.appendChild( span_element );
    div_element.appendChild( input_element );
    div_element.appendChild( hint_element );
    this.console_elements.input_block.appendChild( div_element );
    return div_element;
}

ConsoleManager.prototype.AddOnFocusHandler = function( obj ){

}


ConsoleManager.prototype.AddOnBlurHandler = function( obj ){
            // add onfocus
            // add onblur or oncheck
}




var FormManager = function( main_controller ){
    this.mainController = main_controller;
    this.formArray = new Array();
    this.validator = {
        inputText:function(){

        },
        email:function(){

        },
        number:function(){

        }
    }
}

FormManager.prototype.CreateFormElement = function( console_info ){
    var type = console_info.chose_type.value;
    var s_hint = this.mainController.middelware.info[ type ].s_hint;
    var f_hint = this.mainController.middelware.info[ type ].f_hint;
    var d_hint = this.mainController.middelware.info[ type ].d_hint;
    var form_element = new FormElement( this, this.formArray.length, type,
        console_info.min_len, console_info.max_len, console_info.nec_or_not, s_hint, f_hint, d_hint );
    this.formArray.push( form_element );
}


var FormElement;
FormElement = function (formManager, id, type, min_len, max_len, ness_or_not, success_hint, failure_hint, default_hint) {
    this.formManager = formManager;
    this.id = id;
    this.type = type;
    this.min_len = min_len;
    this.max_len = max_len;
    this.necessary = ness_or_not;
    this.success_hint = success_hint;
    this.failure_hint = failure_hint;
    this.default_hint = default_hint;
    this.validator = formManager.validator[type];
    this.ipt_txt = null;
}
(function () {

    window.onload = function () {

    }

})();
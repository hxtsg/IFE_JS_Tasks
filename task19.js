/**
 * Created by 鑫 on 2016/8/2.
 */
function $( id ){
    return document.getElementById( id );
}

var inputText = $('input-text');
var btn_leftIn = $('left-in');
var btn_rightIn = $('right-in');
var btn_leftOut = $('left-out');
var btn_rightOut = $('right-out');
var elementsArray;
var display = $('display-zone');
var sortBtn = $('sort');

function left_in_click( text )
{
    elementsArray.splice( 0,0, text );
    console.log( elementsArray );
    render();
}


function left_out_click()
{
    elementsArray.splice( 0, 1 );
    render();
}

function BubbleSort()
{
    for( var i = 0 ; i < elementsArray.length - 1 ; i ++ ){
        for( var j = 0 ; j < elementsArray.length - 1 - i ; j ++  ){
            if( parseInt(elementsArray[ j ]) > parseInt(elementsArray[ j + 1 ]) ){
                var tmp = elementsArray[ j ];
                elementsArray[ j ] = elementsArray[ j + 1 ];
                elementsArray[ j + 1 ] = tmp;
                render();
                return;
            }
        }
    }


}
function right_in_click( text )
{
    elementsArray.push( text );
    render();
}


function right_out_click()
{
    elementsArray.splice( elementsArray.length - 1, 1 );
    render();
}
function render()
{
    display.innerHTML = "";
    for( var i in elementsArray ){
        var ele = document.createElement('div');
        ele.className = 'redBlock';
     //   ele.style.height = "height:" + elementsArray[ i ];
        ele.style.height = "" + elementsArray[ i ] + "px";
        display.appendChild( ele );
    }

}

function btn_click( ev )
{
    var txt = inputText.value;
    // check if meet demand

    switch( ev.target.id ){

        case "left-in":
            var val = parseInt( txt );
            if( !/^[1-9]\d*$|^0$/.test( val ) ){
                alert( '输入的必须为整数' );
                return;
            }

            if( val < 10 || val > 100 ){
                alert( '10-100之间' );
                return;
            }
            if( elementsArray.length >= 60 ){
                alert('元素数量已经有60个了');
                return;
            }
            left_in_click( txt );
            break;
        case "right-in":
            var val = parseInt( txt );
            if( !/^[1-9]\d*$|^0$/.test( val ) ){
                alert( '输入的必须为整数' );
                return;
            }
            if( val < 10 || val > 100 ){
                alert( '10-100之间' );
                return;
            }
            if( elementsArray.length >= 60 ){
                alert('元素数量已经有60个了');
                return;
            }
            right_in_click( txt );
            break;
        case "left-out":
            if( elementsArray.length == 0 ){
                alert("还没有元素");
                return ;
            }
            left_out_click();
            break;
        case "right-out":
            if( elementsArray.length == 0 ){
                alert("还没有元素");
                return ;
            }
            right_out_click();
            break;


    }
}



function Init()
{
    sortBtn.addEventListener("click", function(){
        setInterval( BubbleSort, 500 );
    });
    var buttons = document.getElementsByName('btn_click');
    elementsArray = new Array();
    console.log( buttons );
    for( var index in buttons ){
        buttons[ index ].addEventListener("click", function( ev ){
            btn_click( ev );
        });

    }

}

Init();
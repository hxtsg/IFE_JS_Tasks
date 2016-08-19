/**
 * Created by 鑫 on 2016/8/5.
 */
function $(id){
    return document.getElementById( id );
}

var root = $("root");
var btn_pre = $("pre");
var btn_in = $("in");
var btn_post = $("post");
var timer = null;
var cur_display_index = 0;



function AddTreeNodes( parentNode )
{
    var childNode = document.createElement('div');
    childNode.style.display = "flex";
    childNode.style.border = "2px solid #000000";
    childNode.style.margin = "20px";
    childNode.style.height = parseInt( parentNode.style.height ) - 40 + "px";
    childNode.style.width = (parseInt( parentNode.style.width ) - 80) / 2 + "px";
    childNode.style.display="flex";
    childNode.style.justifyContent = "space-between";
    parentNode.appendChild( childNode );
    var childNode = document.createElement('div');
    childNode.style.display = "flex";
    childNode.style.border = "2px solid #000000";
    childNode.style.height = parseInt( parentNode.style.height ) - 40 + "px";
    childNode.style.width = (parseInt( parentNode.style.width ) - 80) / 2 + "px";
    childNode.style.margin = "20px";
    childNode.style.display="flex";
    childNode.style.justifyContent = "space-between";
    parentNode.appendChild( childNode );
}

var nodesArray;

function postOrderTraverse( curNode ){
    if( curNode.children.length != 0 ){
        postOrderTraverse( curNode.children[0] );
        postOrderTraverse( curNode.children[1] );
    }
    nodesArray.push( curNode );
}

function inOrderTraverse( curNode )
{
    if( curNode.children.length != 0 ){
        inOrderTraverse( curNode.children[0] );
    }
    nodesArray.push( curNode );
    if( curNode.children.length != 0 ){
        inOrderTraverse( curNode.children[1] );
    }
}
function preOrderTraverse( curNode )
{
    nodesArray.push( curNode );
    if( curNode.children.length != 0 ){
        preOrderTraverse( curNode.children[0] );
        preOrderTraverse( curNode.children[1] );
    }
}


function Init()
{

    AddTreeNodes( root );
    AddTreeNodes( root.children[ 0 ] );
    AddTreeNodes( root.children[ 0 ].children[ 0 ] );
    AddTreeNodes( root.children[ 0 ].children[ 1 ] );
    AddTreeNodes( root.children[ 1 ] );
    AddTreeNodes( root.children[ 1 ].children[ 0 ] );
    AddTreeNodes( root.children[ 1 ].children[ 1 ] );

    btn_pre.addEventListener( "click", function(){
        clearStyle();
        preOrderTraverse(root);
        timer = setInterval(function(){
            display();
        },1000);
    } );
    btn_in.addEventListener( "click", function(){

        clearStyle();
        inOrderTraverse(root);
        timer = setInterval(function(){
            display();
        },1000);
    } );
    btn_post.addEventListener( "click", function(){
        clearStyle();
        postOrderTraverse(root);
        timer = setInterval(function(){
            display();
        },1000);
    } );




}

function clearStyle()
{
    if( timer != null ){
        clearInterval( timer );
    }
    nodesArray = new Array();
    for( var i in nodesArray ){
        nodesArray[ i ].style.backgroundColor = "#ffffff";
    }
    cur_display_index = 0;
}

function display()
{
    console.log(cur_display_index);
    if( cur_display_index >= nodesArray.length ){
        return;
    }
    nodesArray[ cur_display_index ].style.background = "blue";
    for( var i in nodesArray ){
        if( i != cur_display_index ){
            nodesArray[ i ].style.backgroundColor = "white";
        }
    }
    cur_display_index ++;
}
Init();

/**
 * Created by 鑫 on 2016/9/3.
 */


var $ = function(id)
{
    return document.querySelector(id);
}

var MainController = function(){
    this.htmlElements = {
        wrappers:document.getElementsByClassName( 'img-wrapper' )
    };  // 获取html当中的元素
    this.imgPath = ["img/1.jpg","img/2.jpg","img/3.jpg","img/4.jpg","img/5.jpg","img/6.jpg"];  // 表示这几张图片的位置和名字
    this.imgHolderSize = null;

    this.imgHolderOffset = null;  // 二维数组，i，j表示第i种布局的时候第j张图片对于top和left的偏移量
}

MainController.prototype.Init = function(){
    for( var i = 0 ; i < this.htmlElements.wrappers.length ; i ++ ){
        this.htmlElements.wrappers[ i ].innerHTML = "";
    }
    var height = parseInt(getComputedStyle(this.htmlElements.wrappers[0]).height.slice(0,-2));
    var width = parseInt(getComputedStyle(this.htmlElements.wrappers[0]).width.slice(0,-2));

    this.imgHolderSize = [  //指示的图片是从左上角开始顺时针
        [{width:width,height:height}],
        [],  //第二种特殊处理
        [{height:height,width:width-0.5*height},{ height:0.5*height,width:0.5*height },{ height:0.5*height,width:0.5*height }],
        [ { height:0.5 * height,width:0.5 * width },{ height:0.5 * height,width:0.5 * width },{ height:0.5 * height,width:0.5 * width },{ height:0.5 * height,width:0.5 * width } ],
        [ { height:0.666 * height,width:0.666 * width }, { height:0.333*width,width:0.333 * width },{ height:height - 0.333*width,width:0.333 * width }, { height:0.333 * height,width:0.333 * width }, { height:0.333 * height,width:0.333 * width } ],
        [{ height:0.666 * height,width:0.666 * width }, { height:0.333 * height,width:0.333 * width },{ height:0.333 * height,width:0.333 * width },{ height:0.333 * height,width:0.333 * width },{ height:0.333 * height,width:0.333 * width },{ height:0.333 * height,width:0.333 * width }]
    ]; // 二维数组，i，j表示第i种布局里面第j张图片占位符的大小，在窗口resize的时候会改变
    this.imgHolderOffset = [
        [ { top:0,left:0 } ],
        [],//第二种特殊处理
        [{ top:0,left:0 },{ top:0,left: width - 0.5 * height},{ top:0.5*height,left: width - 0.5 * height }],
        [ { top:0,left:0 }, { top:0,left:0.5*width }, { top:0.5*height,left:0 }, { top:0.5*height,left:0.5*width } ],
        [ { top:0,left:0 }, { top:0,left:0.666*width },{ top:0.333*width,left:0.666 * width },{ top:0.666 * height,left:0.333*width },{ top:0.666*height,left:0 } ],
        [{ top:0,left:0 },{ top:0,left:0.666*width },{ top:0.333*height,left:0.666*width },{ top:0.666*height,left:0.666*width },{ top:0.666*height,left:0.333*width },{ top:0.666*height,left:0 }]
    ];
}

MainController.prototype.run = function(){
    this.Init();
    this.DrawImages();
    window.onresize = function(){

        window.controller.ResizeHandler();
    }
}

MainController.prototype.DrawImgsOfTwo = function(){
    var wrp = this.htmlElements.wrappers[ 1 ];

    var imgElements = [];
    for( var i = 0 ; i < 2 ; i ++ ){
        var img_ele = document.createElement('img');
        img_ele.src = this.imgPath[i];
        img_ele.alt = 0 + " " + 0;
        imgElements.push( img_ele );
        img_ele.onload = function(){
            window.controller.SetClipStyles( this );
            if( this === imgElements[0] ){
                this.style.webkitClipPath = "polygon( 0% 0%,  66.6% 0%, 33.3% 100%, 0% 100% )";
            }
            else{
                this.style.webkitClipPath = "polygon( 66.6% 0%, 30% 100%, 100% 100%, 100% 0% )";

            }

        }
        wrp.appendChild( img_ele );
    }


}

MainController.prototype.DrawImages = function(){
    for( var i = 0 ; i < 6 ; i ++ ){
        if( i == 1 ){
            this.DrawImgsOfTwo();
        }
        else{
            var wrp = this.htmlElements.wrappers[ i ];
            for( j = 0 ; j <= i ; j ++ ){
                var imgElement = document.createElement('img');
                imgElement.src = this.imgPath[ j ];
                imgElement.alt = i + " " + j;
                imgElement.onload = function( ev ){
                    window.controller.SetClipStyles( this );
                }
                wrp.appendChild( imgElement );



            }
        }
    }

}

MainController.prototype.SetClipStyles = function( element){  // 把elements按照i，j所示的样式clip

    var alt_string = element.alt.split(' ');
    var i = parseInt( alt_string[0] );
    var j = parseInt( alt_string[1] );
    var size = this.imgHolderSize[ i ][ j ];
    var offset = this.imgHolderOffset[ i ][ j ];
    var cur_height = parseInt(getComputedStyle(element).height.slice(0,-2));
    var cur_width = parseInt(getComputedStyle( element ).width.slice(0,-2));

    var styleHeight = parseInt( parseFloat( cur_height ) * size.height / parseFloat( cur_height ));
    var styleWidth = parseInt( parseFloat( cur_width ) * size.height / parseFloat( cur_height ));

    if( styleWidth < size.width ){
        var factor = size.width / styleWidth;
        styleWidth *= factor;
        styleHeight *= factor;
    }

    element.style.height = styleHeight + "px";
    element.style.width = styleWidth + "px";

    // if( ele_height <= size.height && ele_width <= size.width ){
    //     if(ele_height / size.height <= ele_width / size.width){
    //         element.style.height = size.height + "px";
    //     }
    //     else{
    //         element.style.width = size.width+ "px";
    //     }
    // }
    // else if( ele_height>= size.height && ele_width <= size.width ){
    //     element.style.width = size.width+ "px";
    // }
    // else if( ele_height <= size.height && ele_width >= size.width ){
    //     element.style.height = size.height+ "px";
    // }
    // else{
    //     if(ele_height / size.height <= ele_width / size.width){
    //         element.style.width = size.width+ "px";
    //     }
    //     else{
    //         element.style.height = size.height+ "px";
    //     }
    // }

    var curWidth =  parseInt(getComputedStyle( element ).width.slice(0,-2));
    var curHeight = parseInt(getComputedStyle( element ).height.slice(0,-2));

    

    var offsetH = parseInt(parseFloat(curHeight - size.height) / 2);
    var offsetW = parseInt(parseFloat( curWidth - size.width ) / 2);
    element.style.webkitClipPath = "inset("+
                    offsetH +"px "+
                    offsetW + "px " +
                    offsetH +"px " +
                    offsetW + "px)";

    element.style.position = "absolute";
    element.style.top = offset.top+ "px";
    element.style.left = offset.left+ "px";
    element.style.top = offset.top -( curHeight - size.height - offsetH) + "px";
    element.style.left = offset.left - ( curWidth - size.width - offsetW) + "px";

}

MainController.prototype.ResizeHandler = function(){  // 当窗口大小变化的时候，进行调整
    
    for( var i = 0 ; i < this.htmlElements.wrappers.length ; i ++ ){
        this.htmlElements.wrappers[ i ].style.width = document.documentElement.clientWidth * 0.8 + "px";
        this.htmlElements.wrappers[ i ].style.height = document.documentElement.clientWidth * 0.8 * 0.6 + "px";

    }
    this.Init();
    this.DrawImages();
    console.log( parseFloat(this.htmlElements.wrappers[ 0 ].style.width.slice(0,-2)) / parseFloat(this.htmlElements.wrappers[ 0 ].style.height.slice(0,-2)) );
}

window.onload = function(){
    var controller = new MainController();
    window.controller = controller;
    controller.run();
}




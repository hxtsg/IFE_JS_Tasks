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
    this.imgHolderOffset = [ //负数表示减去另一个边长的若干倍
        [ { top:0,left:0 } ],
        [],
        [{ top:0,left:0 },{ top:0,left: width - 0.5 * height},{ top:0.5*height,left: width - 0.5 * height }],
        [ { top:0,left:0 }, { top:0,left:0.5*width }, { top:0.5*height,left:0 }, { top:0.5*height,left:0.5*width } ],
        [ { top:0,left:0 }, { top:0,left:0.666*width },{ top:0.333*width,left:0.666 * width },{ top:0.666 * height,left:0.333*width },{ top:0.666*height,left:0 } ],
        [{ top:0,left:0 },{ top:0,left:0.666*width },{ top:0.333*height,left:0.666*width },{ top:0.666*height,left:0.666*width },{ top:0.666*height,left:0.333*width },{ top:0.666*height,left:0 }]
    ];
}

MainController.prototype.run = function(){
    this.Init();
    this.DrawImages();
}

MainController.prototype.DrawImages = function(){
    for( var i = 0 ; i < 6 ; i ++ ){
        if( i == 1 ){

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
    var ele_height = getComputedStyle(element).height.slice(0,-2);
    var ele_width = getComputedStyle( element ).width.slice(0,-2);


    //parseInt(ele_height - size.height)
    //parseInt( size.width - ele_width )


    if( ele_height <= size.height && ele_width <= size.width ){
        if(ele_height / size.height < ele_width / size.width){
            element.style.height = size.height + "px";
        }
        else{
            element.style.width = size.width+ "px";
        }
    }
    else if( ele_height> size.height && ele_width < size.width ){
        element.style.width = size.width+ "px";
    }
    else if( ele_height < size.height && ele_width > size.width ){
        element.style.height = size.height+ "px";
    }
    else{
        if(ele_height / size.height < ele_width / size.width){
            element.style.width = size.width+ "px";
        }
        else{
            element.style.height = size.height+ "px";
        }
    }

    var curWidth = getComputedStyle( element ).width.slice(0,-2);
    var curHeight = getComputedStyle( element ).height.slice(0,-2);

    console.log( curWidth );
//-webkit-clip-path:
    console.log(curHeight);
    element.style.webkitClipPath = "inset("+
                    0 +"px "+
                    parseInt( parseInt(curWidth ) -parseInt( size.width)  ) + "px " +
                    parseInt( parseInt(curHeight) -  parseInt(size.height) ) +"px " +
                    0 + "px)";

    element.style.position = "absolute";
    element.style.top = offset.top + "px";
    element.style.left = offset.left + "px";

}

MainController.prototype.AddResizeHandler = function(){  // 当窗口大小变化的时候，进行调整

}

window.onload = function(){
    var controller = new MainController();
    window.controller = controller;
    controller.run();
}




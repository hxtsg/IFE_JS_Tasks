/**
 * Created by 鑫 on 2016/9/3.
 */


var $ = function(id)
{
    return document.querySelector(id);
}

var MainController = function(){
    var imgPath = [];  // 表示这几张图片的位置和名字
    var imgHolderSize = []; // 二维数组，i，j表示第i种布局里面第j张图片占位符的大小，在窗口resize的时候会改变
    var htmlElements = {

    };  // 获取html当中的元素
    var imgHolderOffset = []; // 二维数组，i，j表示第i种布局的时候第j张图片对于top和left的偏移量
}

MainController.prototype.Init = function(){    

}

MainController.prototype.run = function(){

}

MainController.prototype.DrawImages = function(){


}

MainController.prototype.SetClipStyles = function( element, i, j ){  // 把elements按照i，j所示的样式clip

}

MainController.prototype.AddResizeHandler = function(){  // 当窗口大小变化的时候，进行调整

}





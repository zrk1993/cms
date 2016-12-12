/**
 * Created by renkun on 2016/12/10.
 */

//引入zepoto.js 并且设置为全局变量。 注:引入的插件必须是模块化的
const $ = window.zepoto = window.$ = require('./lib/webpack-zepto');

!function () {
    //给 .dropdown 设置下拉菜单事件
    $('.drop-down').bind('click',function(){
        const dropdownmenu =$(this).find('.drop-down-menu');
        dropdownmenu.css('display',dropdownmenu.css('display')=='block'?'none':'block');
    })
}();





/**
 * Created: OCEAN on 2017/6/22
 * Email: oceanstation@163.com
 * Description: 获取浏览器宽度和高度
 */

angular.module('chinavis')
    .factory('getViewport', function () {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    });
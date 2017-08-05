angular.module('chinavis')
    .factory('getViewport', function () {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    });
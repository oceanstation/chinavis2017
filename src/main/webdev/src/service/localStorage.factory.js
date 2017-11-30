/**
 * Created: OCEAN on 2017/6/22
 * Email: oceanstation@163.com
 * Description: 读写localStorage
 */

angular.module('chinavis')
    .factory('localStorage', ['$window', function ($window) {
        return {
            // 存储单个属性
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            // 读取单个属性
            get: function (key) {
                return $window.localStorage[key] || '';
            },
            // 存储对象，以JSON格式存储
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            // 读取对象
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }]);
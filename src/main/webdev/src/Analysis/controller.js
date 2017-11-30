/**
 * Created: OCEAN on 2017/6/22
 * Email: oceanstation@163.com
 * Description: 分析模块
 */

angular.module('chinavis')
    .controller('analysisController', ['$scope', 'colorMap', 'visService', '$interval', '$filter', function ($scope, colorMap, visService, $interval, $filter) {
        $scope.months = [
            {
                "name": "二月",
                "url": "data/M2-30min.json"
            },
            {
                "name": "三月",
                "url": "data/M3-30min.json"
            },
            {
                "name": "四月",
                "url": "data/M4-30min.json"
            }
        ];
        $scope.currentMonth = "二月";

        // 初始展示二月份数据
        visService.getData($scope.months[0].url, {}).then(
            function (data) {
                $scope.data0 = data;
            },
            function (error) {
                $scope.error = error;
            });

        $scope.show = function (index) {
            visService.getData($scope.months[index].url, {}).then(
                function (data) {
                    $scope.currentMonth = data.name;
                    if (index === 0) {
                        $scope.data0 = data;
                        $scope.data1 = null;
                        $scope.data2 = null;
                    } else if (index === 1) {
                        $scope.data0 = null;
                        $scope.data1 = data;
                        $scope.data2 = null;
                    } else if (index === 2) {
                        $scope.data0 = null;
                        $scope.data1 = null;
                        $scope.data2 = data;
                    }
                },
                function (error) {
                    $scope.error = error;
                });
        }
    }]);
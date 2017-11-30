/**
 * Created: OCEAN on 2017/6/22
 * Email: oceanstation@163.com
 * Description: 路由配置
 */

angular.module('chinavis', ['ngAnimate', 'ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('situation', {
                url: '/',
                templateUrl: '../situation/situation.html',
                controller: 'situationController'
            })
            .state('analysis', {
                url: '/analysis',
                templateUrl: '../analysis/analysis.html',
                controller: 'analysisController'
            });
        $urlRouterProvider.otherwise('/');
    });
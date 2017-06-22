angular.module('chinavis', ['ngAnimate', 'ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('situation', {
                url: '/',
                templateUrl: './Situation/situation.html',
                controller: 'situationController'
            })
            .state('analysis', {
                url: '/analysis',
                templateUrl: './Analysis/analysis.html',
                controller: 'analysisController'
            });
        $urlRouterProvider.otherwise('/');
    });
/**
 * Created: OCEAN on 2017/6/22
 * Email: oceanstation@163.com
 * Description: 直方图
 */

angular.module('chinavis')
    .directive('barChart', ['$filter', 'colorMap', function ($filter, colorMap) {
        return {
            restrict: 'AE',
            scope: {
                data: '=',
                type: '='
            },
            template: '<div></div>',
            link: function (scope, element) {
                var title = ['各时间段伪基站活跃情况', '各类短信数量对比'];

                var chart = element.find('div')[0];
                chart.style.height = '230px';
                chart.style.width = '100%';

                var Chart = echarts.init(chart);
                Chart.setOption({
                    title: {
                        text: title[scope.type],
                        textStyle: {
                            color: '#aaaaaa',
                            fontSize: 15
                        },
                        top: 15,
                        left: 40
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {// 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'// 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '1%',
                        right: '2%',
                        bottom: '1%',
                        containLabel: true
                    },// 设置图与边缘的距离
                    xAxis: [
                        {
                            type: 'category',
                            axisLine: {
                                onZero: true,
                                lineStyle: {
                                    color: '#aaaaaa'
                                }
                            },
                            axisLabel: {
                                show: true,
                                interval: 0,
                                textStyle: {
                                    color: '#aaaaaa'
                                }
                            },
                            axisTick: {
                                lineStyle: {
                                    color: '#aaaaaa'
                                }
                            },
                            data: scope.data.map(function (item) {
                                if (scope.type === 0) return $filter('date')(item.time, 'HH:mm');
                                else if (scope.type === 1) return colorMap[item.type].name;
                            })
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            splitLine: {
                                show: false
                            },// 去除网格线
                            splitArea: {
                                show: false
                            },// 保留网格区域
                            axisLine: {
                                lineStyle: {
                                    color: '#aaaaaa'
                                }
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#aaaaaa'
                                }
                            },
                            axisTick: {
                                lineStyle: {
                                    color: '#aaaaaa'
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: '总量',
                            type: 'bar',
                            barWidth: '60%',
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        if (scope.type === 0) return '#3398DB';
                                        else if (scope.type === 1) return (colorMap[params.dataIndex]).color
                                    }
                                }
                            },
                            data: scope.data.map(function (item) {
                                return item.num
                            })
                        }
                    ]
                });

            }
        }
    }]);
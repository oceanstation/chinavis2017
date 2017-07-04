angular.module('chinavis')
    .directive('areaChart', ['$filter', 'colorMap', function ($filter, colorMap) {
        return {
            restrict: 'AE',
            scope: {
                data: '='
            },
            template: '<div></div>',
            link: function (scope, element) {
                var chart = element.find('div')[0];
                chart.style.height = '249px';
                chart.style.width = '100%';

                var Chart = echarts.init(chart);
                Chart.setOption({
                    title: {
                        text: scope.data.name,
                        textStyle: {
                            color: '#aaaaaa',
                            fontSize: 15
                        },
                        top: 15,
                        left: 40
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            lineStyle: {
                                type: 'dashed',
                                width: 1
                            },
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        },
                        position: {
                            right: 10,
                            top: 10
                        }
                    },
                    grid: {
                        left: '1%',
                        right: '2%',
                        bottom: '1%',
                        containLabel: true
                    },// 设置图与边缘的距离
                    dataZoom: [{
                        show: false,
                        realtime: true,
                        start: 0,
                        end: 50
                    }, {
                        type: 'inside'
                    }],
                    color: colorMap.map(function (item) {
                        return item.color
                    }),// 改变legend的颜色
                    legend: {
                        top: 15,
                        data: colorMap.map(function (item) {
                            var obj = {};
                            obj.name = item.name;
                            obj.textStyle = {color: item.color};
                            return obj;
                        })
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {
                            onZero: true,
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
                        },
                        data: scope.data.value.map(function (item) {
                            return $filter('date')(item.time, 'M月d日H时mm分');
                        })
                    },
                    yAxis: {
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
                    },
                    series: [
                        {
                            name: colorMap[0].name,
                            type: 'line',
                            stack: '总量',
                            lineStyle: {
                                normal: {
                                    opacity: 0
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: colorMap[0].color
                                }
                            },
                            smooth: true,
                            smoothMonotone: 'x',
                            symbolSize: 0,
                            showSymbol: false,
                            hoverAnimation: false,
                            data: scope.data.value.map(function (item) {
                                return item.g0 || 0;
                            })
                        }, {
                            name: colorMap[1].name,
                            type: 'line',
                            stack: '总量',
                            lineStyle: {
                                normal: {
                                    opacity: 0
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: colorMap[1].color
                                }
                            },
                            symbolSize: 3,
                            hoverAnimation: false,
                            data: scope.data.value.map(function (item) {
                                return item.g1 || 0;
                            })
                        }, {
                            name: colorMap[2].name,
                            type: 'line',
                            stack: '总量',
                            lineStyle: {
                                normal: {
                                    opacity: 0
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: colorMap[2].color
                                }
                            },
                            symbolSize: 3,
                            hoverAnimation: false,
                            data: scope.data.value.map(function (item) {
                                return item.g1 || 0;
                            })
                        }, {
                            name: colorMap[3].name,
                            type: 'line',
                            stack: '总量',
                            lineStyle: {
                                normal: {
                                    opacity: 0
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: colorMap[3].color
                                }
                            },
                            symbolSize: 3,
                            hoverAnimation: false,
                            data: scope.data.value.map(function (item) {
                                return item.g3 || 0;
                            })
                        }, {
                            name: colorMap[4].name,
                            type: 'line',
                            stack: '总量',
                            lineStyle: {
                                normal: {
                                    opacity: 0
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: colorMap[4].color
                                }
                            },
                            symbolSize: 3,
                            hoverAnimation: false,
                            data: scope.data.value.map(function (item) {
                                return item.g4 || 0;
                            })
                        }, {
                            name: colorMap[5].name,
                            type: 'line',
                            stack: '总量',
                            lineStyle: {
                                normal: {
                                    opacity: 0
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: colorMap[5].color
                                }
                            },
                            symbolSize: 3,
                            hoverAnimation: false,
                            data: scope.data.value.map(function (item) {
                                return item.g5 || 0;
                            })
                        }, {
                            name: colorMap[6].name,
                            type: 'line',
                            stack: '总量',
                            lineStyle: {
                                normal: {
                                    opacity: 0
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: colorMap[6].color
                                }
                            },
                            symbolSize: 3,
                            hoverAnimation: false,
                            data: scope.data.value.map(function (item) {
                                return item.g6 || 0;
                            })
                        }, {
                            name: colorMap[7].name,
                            type: 'line',
                            stack: '总量',
                            lineStyle: {
                                normal: {
                                    opacity: 0
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: colorMap[7].color
                                }
                            },
                            symbolSize: 3,
                            hoverAnimation: false,
                            data: scope.data.value.map(function (item) {
                                return item.g7 || 0;
                            })
                        }, {
                            name: colorMap[8].name,
                            type: 'line',
                            stack: '总量',
                            lineStyle: {
                                normal: {
                                    opacity: 0
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: colorMap[8].color
                                }
                            },
                            symbolSize: 3,
                            hoverAnimation: false,
                            data: scope.data.value.map(function (item) {
                                return item.g8 || 0;
                            })
                        }, {
                            name: colorMap[9].name,
                            type: 'line',
                            stack: '总量',
                            lineStyle: {
                                normal: {
                                    opacity: 0
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: colorMap[9].color
                                }
                            },
                            symbolSize: 3,
                            hoverAnimation: false,
                            data: scope.data.value.map(function (item) {
                                return item.g9 || 0;
                            })
                        }, {
                            name: colorMap[10].name,
                            type: 'line',
                            stack: '总量',
                            lineStyle: {
                                normal: {
                                    opacity: 0
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: colorMap[10].color
                                }
                            },
                            symbolSize: 3,
                            hoverAnimation: false,
                            data: scope.data.value.map(function (item) {
                                return item.g10 || 0;
                            })
                        }, {
                            name: colorMap[11].name,
                            type: 'line',
                            stack: '总量',
                            lineStyle: {
                                normal: {
                                    opacity: 0
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: colorMap[11].color
                                }
                            },
                            symbolSize: 3,
                            hoverAnimation: false,
                            data: scope.data.value.map(function (item) {
                                return item.g11 || 0;
                            })
                        }, {
                            name: colorMap[12].name,
                            type: 'line',
                            stack: '总量',
                            lineStyle: {
                                normal: {
                                    opacity: 0
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: colorMap[12].color
                                }
                            },
                            symbolSize: 3,
                            hoverAnimation: false,
                            data: scope.data.value.map(function (item) {
                                return item.g12 || 0;
                            })
                        }]
                });
            }
        }
    }]);
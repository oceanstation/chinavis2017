angular.module('chinavis')
    .directive('pieChart', ['$filter', 'colorMap', function ($filter, colorMap) {
        return {
            restrict: 'AE',
            scope: {
                data: '='
            },
            template: '<div></div>',
            link: function (scope, element) {
                var pieData = [];
                // 修改key并添加颜色信息
                scope.data.second.map(function (item) {
                    var obj = {};
                    obj.name = colorMap[item.type].name;
                    obj.value = item.num;
                    obj.itemStyle = {"normal": {"color": colorMap[item.type].color}};
                    pieData.push(obj);
                });

                var chart = element.find('div')[0];
                chart.style.height = '490px';
                chart.style.width = '100%';

                var Chart = echarts.init(chart);
                Chart.setOption({
                    title: {
                        text: '各类短信所占比例',
                        x: 'center',
                        bottom: 30,
                        textStyle: {
                            color: '#aaaaaa',
                            fontSize: 15
                        }
                    },
                    grid: {
                        left: '2%',
                        right: '2%',
                        top: '2%',
                        containLabel: true
                    },// 设置图与边缘的距离
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)"
                    },
                    series: [
                        {
                            type: 'pie',
                            selectedMode: 'single',
                            radius: [0, '30%'],

                            label: {
                                normal: {
                                    position: 'inner'
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: scope.data.first
                        },
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: ['40%', '55%'],

                            data: pieData
                        }
                    ]
                });

            }
        }
    }]);
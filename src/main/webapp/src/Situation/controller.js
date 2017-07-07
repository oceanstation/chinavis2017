angular.module('chinavis')
    .controller('situationController', ['$scope', 'localStorage', 'colorMap', 'visService', '$interval', '$filter', function ($scope, localStorage, colorMap, visService, $interval, $filter) {
        $scope.colorMap = colorMap;// 分类及对应颜色

        $scope.types = ['所有分类'];// 所有分类
        $scope.colorMap.map(function (item) {
            $scope.types.push(item.name);
        });
        $scope.selectedType = $scope.types[0];// 当前所选分类

        $scope.currentTime = '2017-02-24 00:00:00';// 当前时间
        $scope.viewTime = new Date($scope.currentTime).valueOf() - 1800000;// 回退时间
        localStorage.set('startTime', (new Date($scope.currentTime).valueOf()) / 1000);// 转化为时间戳存储在localStorage
        $scope.timeRange = '';

        $scope.show = false;// 是否显示短信内容
        $scope.close = function () {
            $scope.show = false;
        };// 关闭短信内容
        $scope.records = [];// 短信内容

        // 创建地图
        var map = new AMap.Map('container', {
            mapStyle: 'amap://styles/grey',
            zoom: 11,
            center: [116.366576, 39.921797]
        });

        map.setFeatures(['road', 'bg']);// 多个种类要素显示
        AMapUI.load(['ui/misc/PointSimplifier', 'lib/utils', 'lib/$'], function (PointSimplifier, utils, $) {
            if (!PointSimplifier.supportCanvas) {
                alert('当前环境不支持 Canvas！');
                return;
            }
            function MyCanvasRender(pointSimplifierIns, opts) {
                // 直接调用父类的构造函数
                MyCanvasRender.__super__.constructor.apply(this, arguments);
            }

            // 继承自默认的Canvas引擎（http://webapi.amap.com/ui/1.0/ui/misc/PointSimplifier/render/canvas.js）
            utils.inherit(MyCanvasRender, PointSimplifier.Render.Canvas);

            utils.extend(MyCanvasRender.prototype, {
                renderNormalPoints: function (zoom, activePoints, shadowPoints) {
                    // 先按默认逻辑处理shadowPoints
                    MyCanvasRender.__super__.renderNormalPoints.call(this, zoom, null, shadowPoints);

                    var pointStyle = this.getOption('pointStyle'),
                        getPointsGroupKey = this.getOption('getPointsGroupKey'),
                        pointStyleGroup = this.getOption('pointStyleGroup'),
                        pointSimplifierIns = this.getPointSimplifierInstance(),
                        groups = {};

                    // 按key分组
                    for (var i = 0, len = activePoints.length; i < len; i++) {

                        var point = activePoints[i],
                            dataIndex = point.idx,
                            dataItem = pointSimplifierIns.getDataItemByIndex(dataIndex);

                        var key = getPointsGroupKey.call(this, dataItem, dataIndex);

                        if (!groups[key]) {
                            groups[key] = [];
                        }

                        groups[key].push(activePoints[i]);
                    }

                    // 分组绘制
                    for (var k in groups) {

                        // 继承pointStyle中的默认属性
                        var styleOptions = utils.extend({}, pointStyle, pointStyleGroup[k]);

                        // 调用父类的绘制函数
                        this.drawPointsWithStyleOptions(groups[k], styleOptions);
                    }
                }
            });

            var pointSimplifierIns = new PointSimplifier({
                map: map, // 所属的地图实例

                getPosition: function (item) {

                    if (!item) {
                        return null;
                    }

                    // 返回经纬度
                    return [parseFloat(item.lng), parseFloat(item.lat)];
                },
                getHoverTitle: function (dataItem) {
                    return dataItem.content;
                },
                autoSetFitView: false,
                // 赋值为 MyCanvasRender
                renderConstructor: MyCanvasRender,
                renderOptions: {
                    // 点的样式
                    pointStyle: {
                        width: 5,
                        height: 5,
                        fillStyle: '#d939bd'
                    },
                    // 鼠标hover时的title信息
                    hoverTitleStyle: {
                        position: 'top'
                    },
                    getPointsGroupKey: function (dataItem) {
                        // 这里直接按索引取余，仅作示意
                        return 'g' + dataItem.type;
                    },
                    // 分组配置
                    pointStyleGroup: {
                        'g0': {
                            fillStyle: colorMap[0].color
                        },
                        'g1': {
                            fillStyle: colorMap[1].color
                        },
                        'g2': {
                            fillStyle: colorMap[2].color
                        },
                        'g3': {
                            fillStyle: colorMap[3].color
                        },
                        'g4': {
                            fillStyle: colorMap[4].color
                        },
                        'g5': {
                            fillStyle: colorMap[5].color
                        },
                        'g6': {
                            fillStyle: colorMap[6].color
                        },
                        'g7': {
                            fillStyle: colorMap[7].color
                        },
                        'g8': {
                            fillStyle: colorMap[8].color
                        },
                        'g9': {
                            fillStyle: colorMap[9].color
                        },
                        'g10': {
                            fillStyle: colorMap[10].color
                        },
                        'g11': {
                            fillStyle: colorMap[11].color
                        },
                        'g12': {
                            fillStyle: colorMap[12].color
                        }
                    }
                }
            });

            pointSimplifierIns.on('pointClick', function (e, record) {
                console.log(e.type, record.data.recitime);
            });

            // 绘制左上legendType
            var legendType = echarts.init(document.getElementById("legendType"));
            // 绘制左上legendPhone
            var legendPhone = echarts.init(document.getElementById("legendPhone"));
            // 绘制下方时间线
            var areaStack = echarts.init(document.getElementById("area-stack"));

            // 初始化数据
            visService.getData('data/First-day.json', {}).then(
                function (data) {
                    // 初始化时间
                    $scope.timeRange = '当前时间：' + $filter('date')(data.areas[data.areas.length - 1].stime, 'yyyy年M月d日')
                        + $filter('date')(data.areas[data.areas.length - 1].stime, ' HH:mm ')
                        + "至" + $filter('date')(data.areas[data.areas.length - 1].etime, ' HH:mm');

                    // 初始化地图数据
                    pointSimplifierIns.setData(data.maps);

                    // 初始化legendType数据
                    legendType.setOption({
                        grid: {
                            left: 5,
                            right: 30,
                            top: 10,
                            bottom: 0,
                            containLabel: true
                        },
                        xAxis: {
                            show: false
                        },
                        yAxis: {
                            type: 'category',
                            boundaryGap: false,
                            axisLabel: {
                                textStyle: {
                                    color: function () {
                                        return (colorMap[0]).color
                                    }
                                }
                            },
                            data: colorMap.map(function (d) {
                                return d.name;
                            })
                        },
                        series: [
                            {
                                type: 'bar',
                                barMaxWidth: 20,
                                itemStyle: {
                                    normal: {
                                        color: function (params) {
                                            return (colorMap[params.dataIndex]).color
                                        }
                                    }
                                },
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'right'
                                    }
                                },
                                data: data.bars
                            }
                        ]
                    });

                    // 初始化legendPhone数据
                    legendPhone.setOption({
                        tooltip: {
                            trigger: 'item',
                            formatter: "{c} ({d}%)"
                        },
                        series: [
                            {
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '60%'],
                                data: data.phone,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    });

                    // 初始化areaStack数据
                    $scope.areas = data.areas;
                    areaStack.setOption({
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                animation: false
                            }
                        },
                        grid: {// 设置图与边缘的距离
                            left: 0,
                            right: 35,
                            bottom: 5,
                            containLabel: true
                        },
                        dataZoom: [{
                            show: false,
                            realtime: true,
                            start: 0,
                            end: 100
                        }, {
                            type: 'inside'
                        }],
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            nameLocation: 'middle',
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
                            },
                            data: $scope.areas.map(function (item) {
                                return $filter('date')(item.etime, 'd日HH:mm');
                            })
                        },
                        yAxis: {
                            show: false
                        },
                        series: [{
                            name: 'num',
                            type: 'line',
                            lineStyle: {
                                normal: {
                                    width: 1
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: '#aaaaaa'
                                }
                            },
                            symbolSize: 3,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            data: $scope.areas.map(function (item) {
                                return item.num;
                            })
                        }]
                    });

                    legendPhone.on('click', function (params) {
                        if (params.componentType === 'series') {
                            if (params.seriesType === 'pie') {
                                var para = {
                                    startTime: ($scope.viewTime) / 1000,
                                    endTime: ($scope.viewTime + 1800000) / 1000,
                                    type: $scope.types.indexOf($scope.selectedType) - 1,
                                    phone: params.name
                                };
                                visService.getData('./api/content.action', para).then(
                                    function (data) {
                                        $scope.records = data;
                                        $scope.show = true;
                                    },
                                    function (error) {
                                        $scope.error = error;
                                    });
                            }
                        }
                    });
                    legendType.on('click', function (params) {
                        if (params.componentType === 'series') {
                            if (params.seriesType === 'bar') {
                                var type = -1;
                                colorMap.map(function (d, i) {
                                    if (d.name === params.name) type = i;
                                });

                                var para = {
                                    startTime: ($scope.viewTime) / 1000,
                                    endTime: ($scope.viewTime + 1800000) / 1000,
                                    type: type
                                };
                                visService.getData('./api/content.action', para).then(
                                    function (data) {
                                        $scope.records = data;
                                        $scope.show = true;
                                    },
                                    function (error) {
                                        $scope.error = error;
                                    });
                            }
                        }
                    });
                    areaStack.on('click', function (params) {
                        if (params.componentType === 'series') {
                            if (params.seriesType === 'line') {
                                if (params.dataType === 'edge') {
                                    // 点击到了 graph 的 edge（边）上
                                }
                                else {
                                    // 点击到了 graph 的 node（节点）上
                                    var time = new Date("2017-02-" + params.name.substring(0, 2) + " " + params.name.substring(3, 8) + ":00");

                                    // 重置content数据
                                    $scope.viewTime = time.getTime() - 1800000;
                                    $scope.show = false;
                                    $scope.records = [];

                                    var para = {
                                        startTime: (time.getTime() - 1800000) / 1000,
                                        endTime: (time.getTime()) / 1000,
                                        type: $scope.types.indexOf($scope.selectedType) - 1
                                    };
                                    visService.getData('./api/position.action', para).then(
                                        function (data) {
                                            // 更新地图数据
                                            pointSimplifierIns.setData(data.maps);

                                            // 更新时间
                                            $scope.timeRange = '当前时间：' + $filter('date')(data.area.stime, 'yyyy年M月d日')
                                                + $filter('date')(data.area.stime, ' HH:mm ')
                                                + "至" + $filter('date')(data.area.etime, ' HH:mm');

                                            // 更新左上legendType数据
                                            legendType.setOption({
                                                series: [{
                                                    data: data.bars
                                                }]
                                            });
                                            // 更新左上legendPhone数据
                                            legendPhone.setOption({
                                                series: [
                                                    {
                                                        data: data.phone
                                                    }
                                                ]
                                            });
                                        },
                                        function (error) {
                                            $scope.error = error;
                                        });
                                }
                            }
                        }
                    });
                },
                function (error) {
                    $scope.error = error;
                });

            // 开始按钮点击事件
            $scope.start = function () {
                $scope.intervalEvent = $interval(function () {
                    // 自定义时间
                    if (parseInt(localStorage.get('startTime')) !== (new Date($scope.currentTime).valueOf()) / 1000) {
                        localStorage.set('startTime', (new Date($scope.currentTime).valueOf()) / 1000);
                        // 清除下方时间线数据
                        $scope.areas = [];
                        areaStack.setOption({
                            xAxis: {
                                data: $scope.areas.map(function (item) {
                                    return $filter('date')(item.etime, 'd日HH:mm');
                                })
                            },
                            series: [{
                                data: $scope.areas.map(function (item) {
                                    return item.num;
                                })
                            }]
                        });
                    }

                    var para = {
                        startTime: parseInt(localStorage.get('startTime')),
                        endTime: parseInt(localStorage.get('startTime')) + 1800,
                        type: $scope.types.indexOf($scope.selectedType) - 1
                    };
                    visService.getData('./api/position.action', para).then(
                        function (data) {
                            // 更新地图数据
                            pointSimplifierIns.setData(data.maps);

                            // 更新时间
                            $scope.timeRange = '当前时间：' + $filter('date')(data.area.stime, 'yyyy年M月d日')
                                + $filter('date')(data.area.stime, 'HH:mm')
                                + "至" + $filter('date')(data.area.etime, 'HH:mm');

                            // 更新左上legendType数据
                            legendType.setOption({
                                series: [{
                                    data: data.bars
                                }]
                            });
                            // 更新左上legendPhone数据
                            legendPhone.setOption({
                                series: [
                                    {
                                        data: data.phone
                                    }
                                ]
                            });

                            // 更新下方时间线数据
                            $scope.areas.push(data.area);
                            // 保留最近一天的数据
                            if ($scope.areas.length > 48) $scope.areas.shift();

                            areaStack.setOption({
                                xAxis: {
                                    data: $scope.areas.map(function (item) {
                                        return $filter('date')(item.etime, 'd日HH:mm');
                                    })
                                },
                                series: [{
                                    data: $scope.areas.map(function (item) {
                                        return item.num;
                                    })
                                }]
                            });
                        },
                        function (error) {
                            $scope.error = error;
                        });

                    // 重置content数据
                    $scope.viewTime = parseInt(localStorage.get('startTime') * 1000);
                    $scope.show = false;
                    $scope.records = [];

                    localStorage.set('startTime', parseInt(localStorage.get('startTime')) + 1800);
                    $scope.currentTime = $filter('date')(localStorage.get('startTime') + '000', 'yyyy-MM-dd HH:mm:ss');

                }, 10000);
            };

            $scope.flag = '';
            $scope.stop = function (flag) {
                if (flag === 'Pause') {
                    $interval.cancel($scope.intervalEvent);
                    $scope.flag = 'Start';
                } else {
                    $scope.start(localStorage.get('startTime'));
                    $scope.flag = 'Pause';

                    // 重置content数据
                    $scope.show = false;
                    $scope.records = [];
                }
            };
        });
    }]);
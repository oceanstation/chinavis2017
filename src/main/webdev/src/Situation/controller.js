angular.module('chinavis')
    .controller('situationController', ['$scope', 'localStorage', 'getViewport', 'colorMap', 'visService', '$interval', '$filter', function ($scope, localStorage, getViewport, colorMap, visService, $interval, $filter) {
        $scope.colorMap = colorMap;// 分类及对应颜色
        $scope.currentTime = '2017-02-24 10:00:00';// 当前时间
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
            center: [116.403909, 39.915212]
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
                //console.log(e.type, record.data.recitime);
            });


            // 绘制时间线
            var w = getViewport.width, h = 97;
            var timeLine = d3.select("#area-stack").append("svg").attr("width", w).attr("height", h);
            var xScale, yScale, max = 0;

            // 初始化数据
            visService.getData('data/First-day.json', {}).then(
                function (data) {
                    // 初始化时间
                    $scope.timeRange = '当前时间：' + $filter('date')(data.areas[data.areas.length - 1].stime, 'yyyy年M月d日')
                        + $filter('date')(data.areas[data.areas.length - 1].stime, ' HH:mm ')
                        + "至" + $filter('date')(data.areas[data.areas.length - 1].etime, ' HH:mm');

                    // 初始化地图数据
                    pointSimplifierIns.setData(data.maps);

                    // 初始化timeLine数据
                    $scope.areas = data.areas;

                    xScale = d3.scale.ordinal()
                        .domain(d3.range(data.areas.length))
                        .rangeRoundBands([0, w], 0.05);

                    $scope.areas.map(function (d) {
                        if (d.num > max) {
                            max = d.num;
                        }
                    });

                    yScale = d3.scale.linear()
                        .domain([0, max])
                        .range([1, h]);

                    // 柱状图
                    timeLine.selectAll("rect")
                        .data($scope.areas)
                        .enter()
                        .append("rect")
                        .attr("x", function (d, i) {
                            return xScale(i);
                        })
                        .attr("y", function (d) {
                            return h - yScale(d.num);
                        })
                        .attr("width", xScale.rangeBand())
                        .attr("height", function (d) {
                            return yScale(d.num);
                        })
                        .attr("fill", function (d, i) {
                            return (i === 47) ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)";
                        })
                        .attr("cursor", "pointer")
                        .on("mouseover", function () {
                            d3.select(this)
                                .transition()
                                .duration(100)
                                .attr("y", function (d) {
                                    return h - yScale(d.num) - 5;
                                });
                        })
                        .on("mouseout", function () {
                            d3.select(this)
                                .transition()
                                .duration(100)
                                .attr("y", function (d) {
                                    return h - yScale(d.num);
                                });
                        })
                        .on("click", function (d) {
                            // 重置所有矩形样式
                            timeLine.selectAll("rect")
                                .transition()
                                .duration(100)
                                .attr("fill", "rgba(255,255,255,0.5)");

                            // 设置当前矩形样式
                            d3.select(this)
                                .transition()
                                .duration(100)
                                .attr("fill", "rgba(255,255,255,0.9)");

                            $scope.showPoint(d.stime, d.etime);
                        })
                        .append("title")
                        .text(function (d) {
                            return $filter('date')(d.stime, 'M月d日HH:mm') + '-' + $filter('date')(d.etime, 'HH:mm');
                        });

                    // 时间标签
                    timeLine.selectAll("text")
                        .data($scope.areas)
                        .enter()
                        .append("text")
                        .text(function (d) {
                            return d.num > 1000 ? d.num : '';
                        })
                        .attr("text-anchor", "middle")
                        .attr("x", function (d, i) {
                            return xScale(i) + xScale.rangeBand() / 2;
                        })
                        .attr("y", function (d) {
                            return h - yScale(d.num) + 10;
                        })
                        .attr("font-size", "10px")
                        .attr("fill", "#0a141b")
                        .attr("pointer-events", "none");

                },
                function (error) {
                    console.log(error);
                });

            // 查看短信内容
            $scope.showContent = function (typeName) {
                var type = -1;
                colorMap.map(function (d, i) {
                    if (d.name === typeName) type = i;
                });
                var para = {
                    startTime: ($scope.viewTime) / 1000,
                    endTime: ($scope.viewTime + 1800000) / 1000,
                    type: type
                };
                visService.getData('./api/content', para).then(
                    function (data) {
                        $scope.records = data;
                        $scope.show = true;
                    },
                    function (error) {
                        console.log(error);
                    });
            };

            // 历史回退
            $scope.showPoint = function (stime, etime) {
                // 重置content数据
                $scope.viewTime = stime;
                $scope.show = false;
                $scope.records = [];

                var para = {
                    startTime: stime / 1000,
                    endTime: etime / 1000,
                    type: -1
                };
                visService.getData('./api/position', para).then(
                    function (data) {
                        // 更新地图数据
                        pointSimplifierIns.setData(data.maps);

                        // 更新时间
                        $scope.timeRange = '当前时间：' + $filter('date')(data.area.stime, 'yyyy年M月d日')
                            + $filter('date')(data.area.stime, ' HH:mm ')
                            + "至" + $filter('date')(data.area.etime, ' HH:mm');
                    },
                    function (error) {
                        console.log(error);
                    });
            };

            // 开始按钮点击事件
            $scope.start = function () {
                $scope.intervalEvent = $interval(function () {
                    var para = {
                        startTime: parseInt(localStorage.get('startTime')),
                        endTime: parseInt(localStorage.get('startTime')) + 1800,
                        type: -1
                    };
                    visService.getData('./api/position', para).then(
                        function (data) {
                            // 更新地图数据
                            pointSimplifierIns.setData(data.maps);

                            // 更新时间
                            $scope.timeRange = '当前时间：' + $filter('date')(data.area.stime, 'yyyy年M月d日')
                                + $filter('date')(data.area.stime, 'HH:mm')
                                + "至" + $filter('date')(data.area.etime, 'HH:mm');

                            // 更新时间轴数据（length=48）
                            $scope.areas.push(data.area);
                            $scope.areas.shift();

                            // 更新y轴比例尺
                            max = 0;
                            $scope.areas.map(function (d) {
                                if (d.num > max) {
                                    max = d.num;
                                }
                            });
                            yScale = d3.scale.linear()
                                .domain([0, max])
                                .range([1, h]);

                            // 更新相关数据
                            timeLine.selectAll("rect")
                                .data($scope.areas)
                                .transition()
                                .duration(500)
                                .attr("y", function (d) {
                                    return h - yScale(d.num);
                                })
                                .attr("height", function (d) {
                                    return yScale(d.num);
                                })
                                .attr("fill", function (d, i) {
                                    return (i === 47) ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)";
                                });

                            timeLine.selectAll("title")
                                .data($scope.areas)
                                .transition()
                                .duration(500)
                                .text(function (d) {
                                    return $filter('date')(d.stime, 'M月d日HH:mm') + '-' + $filter('date')(d.etime, 'HH:mm');
                                });

                            timeLine.selectAll("text")
                                .data($scope.areas)
                                .transition()
                                .duration(500)
                                .text(function (d) {
                                    return d.num > 1000 ? d.num : '';
                                })
                                .attr("y", function (d) {
                                    return h - yScale(d.num) + 10;
                                });
                        },
                        function (error) {
                            console.log(error);
                        });

                    // 重置content数据
                    $scope.viewTime = parseInt(localStorage.get('startTime') * 1000);
                    $scope.show = false;
                    $scope.records = [];

                    localStorage.set('startTime', parseInt(localStorage.get('startTime')) + 1800);
                    $scope.currentTime = $filter('date')(localStorage.get('startTime') + '000', 'yyyy-MM-dd HH:mm:ss');

                }, 8000);
            };

            $scope.flag = '开始';
            $scope.stop = function (flag) {
                if (flag === '暂停') {
                    $interval.cancel($scope.intervalEvent);
                    $scope.flag = '开始';
                } else {
                    $scope.start(localStorage.get('startTime'));
                    $scope.flag = '暂停';

                    // 重置content数据
                    $scope.show = false;
                    $scope.records = [];
                }
            };
        });
    }]);
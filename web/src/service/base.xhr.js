angular.module('chinavis')
    .service('visService', ['$http', '$q', function ($http, $q) {
        return {
            getData: function (url, data) {
                var deferred = $q.defer();
                var promise = $http({
                    method: 'GET',
                    url: url,
                    params: data
                });
                promise.then(
                    // 通讯成功的处理
                    function (answer) {
                        // 在这里可以对返回的数据集做一定的处理,再交由controller进行处理
                        answer.status = true;
                        deferred.resolve(answer.data);
                    },
                    // 通讯失败的处理
                    function (error) {
                        // 可以先对失败的数据集做处理，再交由controller进行处理
                        error.status = false;
                        deferred.reject(error);
                    });
                // 返回promise对象，交由controller继续处理成功、失败的业务回调
                return deferred.promise;
            }
        }
    }]);
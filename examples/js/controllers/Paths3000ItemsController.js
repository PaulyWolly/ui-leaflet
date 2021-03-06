        app.controller('Paths3000ItemsController', ['$scope', 'leafletData', 'LocationDataService', function ($scope, leafletData, LocationDataService) {
            //map properties
            angular.extend($scope, {
                defaults: {
                    scrollWheelZoom: false
                },
                watchOptions: {
                    paths: {
                        type: 'watch',
                        individual: {
                            type: null
                        }
                    }
                },
                //restrict map panning for this region
                maxbounds: {
                    northEast: {
                        lat: 90,
                        lng: -180
                    },
                    southWest: {
                        lat: -90,
                        lng: 180
                    }
                },
                centroid: {
                    lat: 50,
                    lng: 10,
                    zoom: 3
                },
                layers: {
                    baselayers: {
                        stamen: {
                            name: 'StamenWatercolor',
                            url: 'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.png',
                            type: 'xyz',
                        }
                    }
                }
            });
            // set up circle rendering
            //namespace leaflet path
            $scope.paths = {};
            //bind locationGrid to zoom level
            $scope.$watch("centroid.zoom", function (zoom) {
                var tempPaths;
                if (zoom <= 3) {
                    //clear path object
                    $scope.paths = {};
                    //make new paths
                    tempPaths = {};
                    //get location data and initialize leaflet circles
                    LocationDataService.getLocationsTenGrid().then(function (res) {
                        angular.forEach(res.data, function (value, key) {
                            if (value.lat !== null && value.lon !== null) {
                                tempPaths['circle' + key] = {
                                    type: 'circle',
                                    className: 'testClass',
                                    fillColor: 'DarkSlateGray',
                                    color: '#000000',
                                    weight: 0,
                                    opacity: 1,
                                    fillOpacity: 0.8,
                                    stroke: false,
                                    clickable: false,
                                    latlngs: [parseFloat(value.lat), parseFloat(value.lon)],
                                    radius: Math.sqrt(value.location_count) * 5000
                                };
                            }
                        });
                        $scope.paths = tempPaths;
                    }, function (error) {
                        console.log('An error occured!', error);
                    });
                }
                if (zoom >= 4) {
                    //clear path object
                    $scope.paths = {};
                    //make new paths
                    tempPaths = {};
                    //get location data and initialize leaflet circles
                    LocationDataService.getLocationsZeroOneGrid().then(function (res) {
                        angular.forEach(res.data, function (value, key) {
                            if (value.lat !== null && value.lon !== null) {
                                tempPaths['circle' + key] = {
                                    type: 'circle',
                                    className: 'testClass',
                                    fillColor: 'DarkSlateGray',
                                    color: '#000000',
                                    weight: 0,
                                    opacity: 1,
                                    fillOpacity: 0.8,
                                    stroke: false,
                                    clickable: false,
                                    latlngs: [parseFloat(value.lat), parseFloat(value.lon)],
                                    radius: Math.sqrt(value.location_count) * 2000
                                };
                            }
                        });
                        $scope.paths = tempPaths;
                    }, function (error) {
                        console.log('An error occured!', error);
                    });
                }
            });
        }]);
        // getting data with a factory
        app.factory('LocationDataService', LocationDataService);
        /* @ngInject */
        function LocationDataService($http) {
            var srv = {};
            // Service implementation for gridsize = 10
            srv.getLocationsTenGrid = function () {
                return $http.get('json/mockupTenGrid.json', {
                    cache: true
                });
            };
            // Service implementation for gridsize = 0.1
            srv.getLocationsZeroOneGrid = function () {
                return $http.get('json/mockupZeroOneGrid.json', {
                    cache: true
                });
            };
            // Public API
            return {
                getLocationsTenGrid: function () {
                    return srv.getLocationsTenGrid();
                },
                getLocationsZeroOneGrid: function () {
                    return srv.getLocationsZeroOneGrid();
                }
            };
        };
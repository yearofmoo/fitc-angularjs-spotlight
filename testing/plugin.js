angular.module("Plugin", [])
  .directive("expand", [function() {
    return {
      templateUrl : './plugin.html',
      controller : function($scope, $attrs) {
        var items = [], limit = $scope.$eval($attrs.expand);
        for(var i=0;i<limit;i++) {
          items.push(i+1);
        }
        $scope.items = items;
      }
    };
  }])

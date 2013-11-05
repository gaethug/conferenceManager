/**
 * Created with JetBrains PhpStorm.
 * User: hoho
 * Date: 2013. 11. 5.
 * Time: 오후 5:39
 * To change this template use File | Settings | File Templates.
 */
cm.directive('activeNav', ['$location', function($location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var nestedA = element.find('a')[0];
            var path = nestedA.href;

            scope.location = $location;
            scope.$watch('location.absUrl()', function(newPath) {
                if (path === newPath) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });
        }

    };

}]);
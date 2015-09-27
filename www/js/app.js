/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Onsen = ons.bootstrap('Onsen', ['onsen', 'ngOpenFB']);

//var Onsen = angular.module('Onsen', ['onsen', 'ngOpenFB']);

Onsen.config(['$httpProvider', function($httpProvider) {
        // ...www.worklife.com.ar

        // delete header from client:
        // http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);

Onsen.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);

        for (var i = 0; i < total; i++) {
            input.push(i);
        }

        return input;
    };
});

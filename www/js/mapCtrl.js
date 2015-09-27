/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function mapCtrl($scope, $timeout, publicacionFactory, usuarioFactory) {

    $scope.map;

    //Inicializacion mapa
    $timeout(function() {
        var latlng = new google.maps.LatLng(publicacionFactory.seleccionada.latitud, publicacionFactory.seleccionada.longitud);
        var opciones = {
            zoom: 8,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            mapTypeControl: false,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            scaleControl: true,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            }
        };
        $scope.map = new google.maps.Map(document.getElementById("map_canvas"), opciones);
        $scope.overlay = new google.maps.OverlayView();
        $scope.overlay.draw = function() {
        }; // empty function required
        $scope.overlay.setMap($scope.map);
        $scope.element = document.getElementById('map_canvas');
//        $scope.hammertime = Hammer($scope.element).on("hold", function(event) {
//            $scope.addOnClick(event);
//        });

        var marker = new google.maps.Marker({
            position: latlng,
            map: $scope.map,
            title: 'Ubicacion de ' + publicacionFactory.seleccionada.titulo
        });

        if ($scope.isLogueado()) {
            var msjDistancia = 'Los datos de tu ubicación no están actualizados.';
            if (usuarioFactory.usuario.latitud !== null) {
                var destino = new google.maps.LatLng(publicacionFactory.seleccionada.latitud, publicacionFactory.seleccionada.longitud);
                var origen = new google.maps.LatLng(usuarioFactory.usuario.latitud, usuarioFactory.usuario.longitud);
                var distancia = google.maps.geometry.spherical.computeDistanceBetween(origen, destino);
                distancia = Math.floor(distancia / 1000);
                msjDistancia = 'Este servicio se encuentra a <b>' + distancia + ' Km</b> aprox.';
            }

            var infoWindow = new google.maps.InfoWindow({
                content: "<div>Bº " + publicacionFactory.seleccionada.barrio + ". [" + publicacionFactory.seleccionada.idLocalidad.localidad + " - " + publicacionFactory.seleccionada.idLocalidad.idDepartamento.idProvincia.provincia + "] <br> " + msjDistancia + "</div>"
            });
            infoWindow.open($scope.map, marker);
        }

    }, 100);

    $scope.getPublicacionSeleccionada = function() {
        return publicacionFactory.seleccionada;
    };

    $scope.isLogueado = function() {
        if (typeof (usuarioFactory.usuario) === "undefined")
            return false;
        if (usuarioFactory.usuario === "") {
            return false;
        }
        return true;
    };


}





Onsen.controller('mapCtrl', function($scope, $timeout, publicacionFactory, usuarioFactory) {
    mapCtrl($scope, $timeout, publicacionFactory, usuarioFactory);
});
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function publicacionCtrl($scope, publicacionService, publicacionFactory, usuarioFactory, localidadFactory, formaCobroFactory, prestacionFactory, medioPagoFactory, otrosFiltroFactory, comentarioFactory) {

    $scope.textoBuscado = "";
    $scope.verBuscar = false;
    $scope.trayendoPublicaciones = false;
    $scope.pagIni = 0;
    $scope.pagTam = 10;
    $scope.descripcion = "";

    $scope.buscar = function() {
        if ($scope.textoBuscado === '' || $scope.textoBuscado.length < 2) {
            $scope.ons.notification.alert({
                title: 'Info',
                messageHTML: '<strong style=\"color: #ff3333\">Debes ingresar lo que deseas buscar!</strong>'
            });
            return;
        }

        $scope.modal.show();

        publicacionFactory.textoBuscado = $scope.textoBuscado;

        var idUsuario = (usuarioFactory.usuario) === '' ? '-1' : usuarioFactory.usuario.idUsuario;

        $scope.pagIni = 0;
        $scope.pagTam = 10;

        publicacionService.buscar(publicacionFactory.textoBuscado, idUsuario, $scope.pagIni, $scope.pagTam)
                .then(function(data) {
                    publicacionFactory.items = data.contenido;
                    $scope.verBuscar = false;
                    $scope.limpiarFiltros();
                    $scope.modal.hide();
                    $scope.app.navigator.pushPage('busquedaResultado.html');
                })
                .catch(function(data, status) {
                    publicacionFactory.items = [];
                    $scope.modal.hide();
                    var mensaje = "No autorizado.";
                    switch (status) {
                        case 401:
                            mensaje = "No autorizado.";
                            break;
                    }
                    $scope.ons.notification.alert({
                        title: 'Info',
                        messageHTML: '<strong style=\"color: #ff3333\">Operación denegada: ' + mensaje + '</strong>'
                    });
                });

    };

    $scope.traerMasPublicaciones = function() {
        $scope.trayendoPublicaciones = true;
        var idUsuario = (usuarioFactory.usuario) === '' ? '-1' : usuarioFactory.usuario.idUsuario;

        $scope.pagIni = $scope.pagTam;
        $scope.pagTam = $scope.pagTam + 10;

        publicacionService.buscar(publicacionFactory.textoBuscado, idUsuario, $scope.pagIni, $scope.pagTam)
                .then(function(data) {
                    //Agrego los elementos que trae data al array items de publicacionFactory
                    Array.prototype.push.apply(publicacionFactory.items, data.contenido);
//                    Array.prototype.unshift.apply(publicacionFactory.items, data);
                    $scope.verBuscar = false;
                    $scope.limpiarFiltros();
                    $scope.trayendoPublicaciones = false;
                })
                .catch(function(data, status) {
                    $scope.trayendoPublicaciones = false;
                    var mensaje = "No autorizado.";
                    switch (status) {
                        case 401:
                            mensaje = "No autorizado.";
                            break;
                    }
                    $scope.ons.notification.alert({
                        title: 'Info',
                        messageHTML: '<strong style=\"color: #ff3333\">Operación denegada: ' + mensaje + '</strong>'
                    });
//                    $scope.ons.notification.alert({
//                        title: 'Info',
//                        messageHTML: '<strong style=\"color: #ff3333\">Debes ingresar lo que deseas buscar!</strong>'
//                    });
                }).finally(function() {
//                    $done();
        });

    };

    $scope.getPublicaciones = function() {
        return publicacionFactory.items;
    };

    $scope.getPublicacionSeleccionada = function() {
        return publicacionFactory.seleccionada;
    };

    $scope.setVerBuscar = function() {
        $scope.verBuscar = true;
    };

    $scope.getVerBuscar = function() {
        return $scope.verBuscar;
    };

    $scope.mostrarDetalle = function(index) {
        publicacionFactory.seleccionada = publicacionFactory.items[index];
        $scope.app.navigator.pushPage('publicacionDetalle.html');
    };

    $scope.mostrarDescripcion = function() {
        $scope.app.navigator.pushPage('publicacionDescripcion.html');
    };

    $scope.getDescripcion = function() {
        //De esta forma elimino todo el codigo html de la descripcion de la publicacion
        //$(publicacionFactory.seleccionada.publicacion).text(); --> el trabajo lo hace el metodo text() de jquery
        $scope.descripcion = $(publicacionFactory.seleccionada.publicacion).text();
        return $scope.descripcion;
    };

    $scope.mostrarUbicacion = function() {
        $scope.app.navigator.pushPage('publicacionUbicacion.html');
    };

    $scope.mostrarFiltros = function() {
        $scope.app.navigator.pushPage('busquedaFiltrar.html');
    };

    $scope.mostrarFiltroLocalidades = function() {
        localidadFactory.items = [];
        var hashAux = {};
        for (var i = 0; i < publicacionFactory.items.length; i++) {
            if (!(publicacionFactory.items[i].idLocalidad.idLocalidad in hashAux))
            {
                hashAux[publicacionFactory.items[i].idLocalidad.idLocalidad] = publicacionFactory.items[i].idLocalidad;
                localidadFactory.items.push(publicacionFactory.items[i].idLocalidad);
            }
        }

        //Ordeno alfabeticamente las localidades
        localidadFactory.items = localidadFactory.items.sort(function(a, b) {
            if (a.localidad < b.localidad)
                return -1;
            if (a.localidad > b.localidad)
                return 1;
            return 0;
        });

        $scope.dialogFiltroLoc.show();
    };

    $scope.setLocalidadSeleccionada = function(index) {
        localidadFactory.seleccionada = localidadFactory.items[index];
        $scope.dialogFiltroLoc.hide();
    };

    $scope.getLocalidadSeleccionada = function() {
        return localidadFactory.seleccionada;
    };

    $scope.getLocalidades = function() {
        return localidadFactory.items;
    };

    $scope.mostrarFiltroFormasCobro = function() {
        formaCobroFactory.items = [];
        var hashAux = {};
        for (var i = 0; i < publicacionFactory.items.length; i++) {
            if (!(publicacionFactory.items[i].idFormaCobro.idFormaCobro in hashAux))
            {
                hashAux[publicacionFactory.items[i].idFormaCobro.idFormaCobro] = publicacionFactory.items[i].idFormaCobro;
                formaCobroFactory.items.push(publicacionFactory.items[i].idFormaCobro);
            }

        }

        //Ordeno alfabeticamente el array
        formaCobroFactory.items = formaCobroFactory.items.sort(function(a, b) {
            if (a.formaCobro < b.formaCobro)
                return -1;
            if (a.formaCobro > b.formaCobro)
                return 1;
            return 0;
        });


        $scope.dialogFiltroFC.show();

    };

    $scope.setFormaCobroSeleccionada = function(index) {
        formaCobroFactory.seleccionada = formaCobroFactory.items[index];
        $scope.dialogFiltroFC.hide();
    };

    $scope.getFormaCobroSeleccionada = function() {
        return formaCobroFactory.seleccionada;
    };

    $scope.getFormasCobro = function() {
        return formaCobroFactory.items;
    };

    $scope.mostrarFiltroPrestaciones = function() {
        prestacionFactory.items = [];
        var hashAux = {};

        for (var i = 0; i < publicacionFactory.items.length; i++) {
            if (!(publicacionFactory.items[i].idPrestacion.idPrestacion in hashAux))
            {
                hashAux[publicacionFactory.items[i].idPrestacion.idPrestacion] = publicacionFactory.items[i].idPrestacion;
                prestacionFactory.items.push(publicacionFactory.items[i].idPrestacion);
            }
        }

        //Ordeno alfabeticamente el array
        prestacionFactory.items = prestacionFactory.items.sort(function(a, b) {
            if (a.prestacion < b.prestacion)
                return -1;
            if (a.prestacion > b.prestacion)
                return 1;
            return 0;
        });


        $scope.dialogFiltroPrest.show();

    };

    $scope.setPrestacionSeleccionada = function(index) {
        prestacionFactory.seleccionada = prestacionFactory.items[index];
        $scope.dialogFiltroPrest.hide();
    };

    $scope.getPrestacionSeleccionada = function() {
        return prestacionFactory.seleccionada;
    };

    $scope.getPrestaciones = function() {
        return prestacionFactory.items;
    };


    $scope.mostrarFiltroMediosPago = function() {
        medioPagoFactory.items = [];
        var hashAux = {};

        for (var i = 0; i < publicacionFactory.items.length; i++) {
            for (var k = 0; k < publicacionFactory.items[i].medioPagoCollection.length; k++) {
                if (!(publicacionFactory.items[i].medioPagoCollection[k].idMedioPago in hashAux))
                {
                    hashAux[publicacionFactory.items[i].medioPagoCollection[k].idMedioPago] = publicacionFactory.items[i].medioPagoCollection[k];
                    medioPagoFactory.items.push(publicacionFactory.items[i].medioPagoCollection[k]);
                }
            }
        }

        //Ordeno alfabeticamente el array
        medioPagoFactory.items = medioPagoFactory.items.sort(function(a, b) {
            if (a.medioPago < b.medioPago)
                return -1;
            if (a.medioPago > b.medioPago)
                return 1;
            return 0;
        });


        $scope.dialogFiltroMP.show();

    };

    $scope.setMedioPagoSeleccionado = function(index) {
        medioPagoFactory.seleccionado = medioPagoFactory.items[index];
        $scope.dialogFiltroMP.hide();
    };

    $scope.getMedioPagoSeleccionado = function() {
        return medioPagoFactory.seleccionado;
    };

    $scope.getMediosPago = function() {
        return medioPagoFactory.items;
    };

    $scope.setMatricula = function() {
        var isChecked = $scope.switchMat.isChecked();
        otrosFiltroFactory.matricula = isChecked;
    };

    $scope.getMatricula = function() {
        return otrosFiltroFactory.matricula;
    };

    $scope.setDispo = function() {
        var isChecked = $scope.switchDispo.isChecked();
        otrosFiltroFactory.dispo = isChecked;
    };

    $scope.getDispo = function() {
        return otrosFiltroFactory.dispo;
    };

    $scope.setGarantia = function() {
        var isChecked = $scope.switchGarantia.isChecked();
        otrosFiltroFactory.garantia = isChecked;
    };

    $scope.getGarantia = function() {
        return otrosFiltroFactory.garantia;
    };

    $scope.limpiarFiltros = function() {
        localidadFactory.items = [];
        localidadFactory.seleccionada = "";
        formaCobroFactory.items = [];
        formaCobroFactory.seleccionada = "";
        prestacionFactory.items = [];
        prestacionFactory.seleccionada = "";
        medioPagoFactory.items = [];
        medioPagoFactory.seleccionado = "";
        otrosFiltroFactory.garantia = false;
        otrosFiltroFactory.dispo = false;
        otrosFiltroFactory.matricula = false;
    };

    $scope.aplicarFiltro = function(publicacion) {
        var band = true;
        if (localidadFactory.seleccionada !== "") {
            band = (publicacion.idLocalidad.idLocalidad === localidadFactory.seleccionada.idLocalidad);
        }
        if (prestacionFactory.seleccionada !== "") {
            band = band & (publicacion.idPrestacion.idPrestacion === prestacionFactory.seleccionada.idPrestacion);
        }
        if (formaCobroFactory.seleccionada !== "") {
            band = band & (publicacion.idFormaCobro.idFormaCobro === formaCobroFactory.seleccionada.idFormaCobro);
        }
        if (medioPagoFactory.seleccionado !== "") {
            var mp = false;
            for (var k = 0; k < publicacion.medioPagoCollection.length; k++) {
                if (publicacion.medioPagoCollection[k].idMedioPago === medioPagoFactory.seleccionado.idMedioPago) {
                    mp = true;
                    break;
                }
            }
            band = band & mp;
        }
        if (otrosFiltroFactory.dispo) {
            band = band & (publicacion.disponibilidadHoraria === otrosFiltroFactory.dispo);
        }
        if (otrosFiltroFactory.garantia) {
            band = band & (publicacion.garantia !== "NO");
        }
        if (otrosFiltroFactory.matricula) {
            band = band & (publicacion.matricula !== null);
        }

        return band;
    };

    $scope.registrarContratacion = function() {
        $scope.modal.show();
        $scope.ons.notification.confirm({
            message: '¿Seguro deseas contactar?',
            buttonLabels: ['No', 'Si'],
            title: 'Info',
            callback: function(idx) {
                switch (idx) {
                    case 0:
                        // Presiono No
                        $scope.modal.hide();
                        break;
                    case 1:
                        // Presiono Si
                        var idPublicacion = publicacionFactory.seleccionada.idPublicacion;
                        var mailUsuarioQueContrata = usuarioFactory.usuario.email;


                        publicacionService.registrarContratacion(idPublicacion, mailUsuarioQueContrata)
                                .then(function(data) {
                                    var respuesta = data.respuesta;
                                    if (respuesta === 'OK') {
                                        var idPublicacion = data.contenido;
                                        $scope.modal.hide();
                                        $scope.ons.notification.alert({
                                            title: 'Info',
                                            message: 'Contacto realizado con exito'
                                        });
                                        $scope.app.navigator.popPage();
                                    } else {
                                        $scope.modal.hide();
                                        $scope.ons.notification.alert({
                                            title: 'Info',
                                            messageHTML: '<strong style=\"color: #ff3333\">' + data.contenido + '</strong>'
                                        });
                                    }
                                })
                                .catch(function(data, status) {
                                    $scope.modal.hide();
                                    var mensaje = "No autorizado.";
                                    switch (status) {
                                        case 401:
                                            mensaje = "No autorizado.";
                                            break;
                                    }
                                    $scope.ons.notification.alert({
                                        title: 'Info',
                                        messageHTML: '<strong style=\"color: #ff3333\">' + mensaje + '</strong>'
                                    });
                                });
                        break;
                }
            }
        });
    };

    $scope.comnetarios = function() {
        $scope.modal.show();

        publicacionService.comentarios(publicacionFactory.seleccionada.idPublicacion)
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        comentarioFactory.items = data.contenido;
                        console.log(JSON.stringify(comentarioFactory.items));
                        $scope.modal.hide();
                        $scope.app.navigator.pushPage('publicacionPreguntas.html');
                    } else {
                        $scope.modal.hide();
                        $scope.ons.notification.alert({
                            title: 'Info',
                            messageHTML: '<strong style=\"color: #ff3333\">' + data.contenido + '</strong>'
                        });
                    }
                })
                .catch(function(data, status) {
                    $scope.modal.hide();
                    var mensaje = "No autorizado.";
                    switch (status) {
                        case 401:
                            mensaje = "No autorizado.";
                            break;
                    }
                    $scope.ons.notification.alert({
                        title: 'Info',
                        messageHTML: '<strong style=\"color: #ff3333\">' + mensaje + '</strong>'
                    });
                });
    };
    
    $scope.getComentarios = function() {
        return comentarioFactory.items;
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


Onsen.controller('publicacionCtrl', function($scope, publicacionService, publicacionFactory, usuarioFactory, localidadFactory, formaCobroFactory, prestacionFactory, medioPagoFactory, otrosFiltroFactory, comentarioFactory) {
    publicacionCtrl($scope, publicacionService, publicacionFactory, usuarioFactory, localidadFactory, formaCobroFactory, prestacionFactory, medioPagoFactory, otrosFiltroFactory, comentarioFactory);
});


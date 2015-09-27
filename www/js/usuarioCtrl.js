/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Onsen.controller('usuarioCtrl', function($rootScope, $scope, $http) {
//    usuarioCtrl($rootScope, $scope, $http);
//});


//El controlador de usuarios
function usuarioCtrl($scope, usuarioService, usuarioFactory, contratRealiFactory, contratRecibFactory, fBFactory, ngFB) {

    $scope.usuario = "";
    $scope.nombre = "";
    $scope.apellido = "";
    $scope.mail = "";
    $scope.clave1 = "";
    $scope.clave2 = "";
    $scope.accessFB = "";
    $scope.idUsuarioFB = "";
    $scope.reputacionCli = 0;
    $scope.reputacionPro = 0;


    //Método de logueo llamado desde la vista login.html
    $scope.login = function(email, password) {
        // Hacemos una petición DELETE a la API para borrar el id que nos pase el html por parametro
//        $http.delete("/api/todo/" + id).
//                success(function(response) {
//            if (response.status === "OK") { // Si la API nos devuelve un OK...
//                getTodos(); // Actualizamos la lista de ToDo's
//            }
//        });
        $scope.modal.show();

        usuarioService.validarLogin(email, password)
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        usuarioFactory.usuario = data.contenido;
                        $scope.usuario = usuarioFactory.usuario;
                        $scope.modal.hide();
                        $scope.app.slidingMenu.setMainPage('inicio.html');
                    } else {
                        $scope.usuario = "";
                        usuarioFactory.usuario = "";
                        $scope.modal.hide();
                        $scope.ons.notification.alert({
                            title: 'Info',
                            messageHTML: '<strong style=\"color: #ff3333\">' + data.contenido + '</strong>'
                        });
                    }
                })
                .catch(function(data, status) {
                    $scope.usuario = "";
                    usuarioFactory.usuario = "";
                    $scope.modal.hide();
                    var mensaje = "No autorizado.";
                    switch (status) {
                        case 401:
                            mensaje = "No autorizado.";
                            break;
                    }
                    $scope.ons.notification.alert({
                        title: 'Info',
                        messageHTML: '<strong style=\"color: #ff3333\">Usuario o Password incorrectos: ' + mensaje + '</strong>'
                    });
                });

    };

    $scope.isLogueado = function() {
        if (typeof (usuarioFactory.usuario) === "undefined")
            return false;
        if (usuarioFactory.usuario === "") {
            return false;
        }
        return true;
    };
    $scope.logout = function() {
        $scope.usuario = "";
        usuarioFactory.usuario = "";
        usuarioFactory.tituloMenu = "";
        $scope.app.slidingMenu.setMainPage('inicio.html');
    };

    $scope.getNombre = function() {
        return usuarioFactory.usuario.nombre;
    };
    $scope.getApellido = function() {
        return usuarioFactory.usuario.apellido;
    };

    $scope.abrioMenuIzq = function() {
        if ($scope.isLogueado()) {
            usuarioFactory.tituloMenu = "Hola " + usuarioFactory.usuario.nombre;
        } else {
            usuarioFactory.tituloMenu = "WorkLife";
        }
    };

    $scope.cerroMenuIzq = function() {
        usuarioFactory.tituloMenu = "WorkLife";
    };

    $scope.getTituloMenu = function() {
        return usuarioFactory.tituloMenu;
    };

    $scope.registrar = function() {
        usuarioService.registrar($scope.nombre, $scope.apellido, $scope.mail, $scope.clave2, $scope.idUsuarioFB)
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        $scope.ons.notification.alert({
                            title: 'Info',
                            messageHTML: '<strong style=\"color: #25a6d9\">Usuario registrado con exito</strong>',
                            callback: function() {
                                $scope.app.navigator.pushPage('login.html');
                            }
                        });
                    } else {
                        $scope.ons.notification.alert({
                            title: 'Info',
                            messageHTML: '<strong style=\"color: #ff3333\">' + data.contenido + '</strong>'
                        });
                    }
                })
                .catch(function(data, status) {
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


    $scope.proximamente = function() {
        $scope.ons.notification.alert({
            title: 'Info',
            messageHTML: '<strong style=\"color: #ff3333\">Proximamente!!</strong>'
        });
    };


    ngFB.init({appId: fBFactory.id});


    $scope.loginFB = function() {
        ngFB.login({scope: 'email,user_likes,user_friends'}).then(
                function(response) {
                    ngFB.api({path: '/me'}).then(
                            function(data) {
                                $scope.nombre = data.first_name;
                                $scope.apellido = data.last_name;
                                $scope.mail = data.email;
                                $scope.idUsuarioFB = data.id;
                            },
                            errorHandlerFB);
                },
                function(error) {
                    $scope.idUsuarioFB = '';
                    $scope.ons.notification.alert({
                        title: 'Info',
                        messageHTML: '<strong style=\"color: #ff3333\">' + error + '</strong>'
                    });
                });
    };

    function errorHandlerFB(error) {
        $scope.idUsuarioFB = '';
        $scope.ons.notification.alert({
            title: 'Info',
            messageHTML: '<strong style=\"color: #ff3333\">' + error.message + '</strong>'
        });
    }

    $scope.limpiarLoginFB = function() {
        $scope.nombre = "";
        $scope.apellido = "";
        $scope.mail = "";
        $scope.idUsuarioFB = "";
        $scope.clave1 = "";
        $scope.clave2 = "";
    };


    $scope.contrataciones = function(tipoContratacion) {
        $scope.modal.show();

        usuarioService.setTipoContratacion(tipoContratacion);
        usuarioService.contrataciones(usuarioFactory.usuario.idUsuario)
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        if (usuarioService.getTipoContratacion() === 'recibida') {
                            contratRecibFactory.items = data.contenido;
                        } else {
                            contratRealiFactory.items = data.contenido;
                        }
                        $scope.modal.hide();
                        $scope.app.slidingMenu.setMainPage('contratacion.html');
                    } else {
                        contratRecibFactory.items = [];
                        contratRealiFactory.items = [];
                        $scope.modal.hide();
                        $scope.ons.notification.alert({
                            title: 'Info',
                            messageHTML: '<strong style=\"color: #ff3333\">' + data.contenido + '</strong>'
                        });
                    }
                })
                .catch(function(data, status) {
                    contratRecibFactory.items = [];
                    contratRealiFactory.items = [];
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

    $scope.getContratacion = function() {
        if (usuarioService.getTipoContratacion() === 'recibida') {
            return contratRecibFactory.items;
        } else {
            return contratRealiFactory.items;
        }
    };

    $scope.getTipoContratacion = function() {
        if (usuarioService.getTipoContratacion() === 'recibida') {
            return 'Recibidos';
        } else {
            return 'Realizados';
        }
    };

    $scope.mostrarDetalleContratacion = function(index) {
        if (usuarioService.getTipoContratacion() === 'recibida') {
            contratRecibFactory.seleccionada = contratRecibFactory.items[index];
            $scope.app.navigator.pushPage('contratacionRecibDetalle.html');
        } else {
            contratRealiFactory.seleccionada = contratRealiFactory.items[index];
            $scope.app.navigator.pushPage('contratacionRealiDetalle.html');
        }
    };

    $scope.getContratacionSeleccionada = function() {
        if (usuarioService.getTipoContratacion() === 'recibida') {
            return contratRecibFactory.seleccionada;
        } else {
            return contratRealiFactory.seleccionada;
        }
    };

    $scope.getDireccionContratacion = function() {
        var direccion;
        if (usuarioService.getTipoContratacion() === 'recibida') {
            direccion = contratRecibFactory.seleccionada.idUsuarioQueContrata.calleNro + ' Bº ';
            direccion += contratRecibFactory.seleccionada.idUsuarioQueContrata.barrio;
        } else {
            direccion = contratRealiFactory.seleccionada.idPublicacion.calleNro + ' Bº ';
            direccion += contratRealiFactory.seleccionada.idPublicacion.barrio;
        }
        return direccion;
    };

    $scope.getNombreApellidoContratacion = function() {
        var nombreap;
        if (usuarioService.getTipoContratacion() === 'recibida') {
            nombreap = contratRecibFactory.seleccionada.idUsuarioQueContrata.nombre + ' ';
            nombreap += contratRecibFactory.seleccionada.idUsuarioQueContrata.apellido;
        } else {
            nombreap = contratRealiFactory.seleccionada.idPublicacion.idUsuario.nombre + ' ';
            nombreap += contratRealiFactory.seleccionada.idPublicacion.idUsuario.apellido;
        }
        return nombreap;
    };

    $scope.getEmailContratacion = function() {
        var email;
        if (usuarioService.getTipoContratacion() === 'recibida') {
            email = contratRecibFactory.seleccionada.idUsuarioQueContrata.email;
        } else {
            email = contratRealiFactory.seleccionada.idPublicacion.idUsuario.email;
        }
        return email;
    };

    $scope.verCalificacionPop = function() {
        if (usuarioService.getTipoContratacion() === 'recibida') {
            $scope.ons.createPopover('contratacionRecibPopCalif.html').then(function(popover) {
                popover.show('#idLnkVerCalifiRecib');
            });
        } else {
            $scope.ons.createPopover('contratacionRealiPopCalif.html').then(function(popover) {
                popover.show('#idLnkVerCalifiOtor');
            });
        }
    };

    $scope.redondearNumero = function(numero) {
        return usuarioService.redondearNumero(numero);
    };

    $scope.cancelarContratacion = function() {
        $scope.modal.show();
        $scope.ons.notification.confirm({
            message: '¿Seguro desea cancelar el contacto?',
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
                        var idContratacion = usuarioService.getTipoContratacion() === 'recibida' ? contratRecibFactory.seleccionada.idContratacion : contratRealiFactory.seleccionada.idContratacion;

                        usuarioService.cancelarContratacion(idContratacion, usuarioService.getTipoContratacion())
                                .then(function(data) {
                                    var respuesta = data.respuesta;
                                    if (respuesta === 'OK') {
                                        var idContDevuelto = data.contenido;
                                        $scope.modal.hide();
                                        $scope.contrataciones(usuarioService.getTipoContratacion());
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


    $scope.confirmarContratacion = function() {
        $scope.modal.show();
        $scope.ons.notification.confirm({
            message: '¿Seguro desea confirmar el contacto?',
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
                        var idContratacion = contratRecibFactory.seleccionada.idContratacion;

                        usuarioService.confirmarContratacion(idContratacion)
                                .then(function(data) {
                                    var respuesta = data.respuesta;
                                    if (respuesta === 'OK') {
                                        var idContDevuelto = data.contenido;
                                        $scope.modal.hide();
                                        $scope.contrataciones(usuarioService.getTipoContratacion());
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

    $scope.reputacion = function() {
        $scope.modal.show();

        usuarioService.reputacion(usuarioFactory.usuario.email)
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        var promCliente = data.contenido.reputacionCliente;
                        var promProveedor = data.contenido.reputacionProveedor;
                        
                        usuarioService.setReputacionComoCli(usuarioService.redondearReputacion(promCliente));
                        usuarioService.setReputacionComoPro(usuarioService.redondearReputacion(promProveedor));
                        $scope.modal.hide();
                        $scope.app.slidingMenu.setMainPage('reputacion.html');
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
    
    $scope.getReputacionCliente = function() {
        return usuarioService.getReputacionComoCli();
    };
    
    $scope.getReputacionProveedor = function() {
        return usuarioService.getReputacionComoPro();
    };

}


Onsen.controller('usuarioCtrl', function($scope, usuarioService, usuarioFactory, contratRealiFactory, contratRecibFactory, fBFactory, ngFB) {
    usuarioCtrl($scope, usuarioService, usuarioFactory, contratRealiFactory, contratRecibFactory, fBFactory, ngFB);
});




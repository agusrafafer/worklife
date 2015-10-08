/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Onsen.controller('usuarioCtrl', function($rootScope, $scope, $http) {
//    usuarioCtrl($rootScope, $scope, $http);
//});


//El controlador de usuarios
function usuarioCtrl($scope, $timeout, usuarioService, usuarioFactory, publicacionFactory, contratRealiFactory, contratRecibFactory, categoriaFactory, formaCobroFactory, prestacionFactory, medioPagoFactory, otrosFiltroFactory, paisFactory, provFactory, dptoFactory, localidadFactory, fBFactory, ngFB) {

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
    $scope.categoriasSel = [];
    $scope.tituloPublicacion = "";
    $scope.descripcionPublicacion = "";
    $scope.matriculaPublicacion = "";
    $scope.garantiaPublicacion = "";
    $scope.precioPublicacion = "";
    $scope.mapPublicacion;
    $scope.calleNroPublicacion = "";
    $scope.barrioPublicacion = "";
    $scope.telefonoPublicacion = "";
    var markerPublicacion;

    $scope.crearModalEnRunTime = function() {
        var elm = $("<ons-modal var=modal><ons-icon icon='ion-load-c' spin='true'></ons-icon><br><br>Aguarde...</ons-modal>");
        elm.appendTo($("body")); // Insert to the DOM first
        ons.compile(elm[0]); // The argument must be a HTMLElement object
    };


    //Método de logueo llamado desde la vista login.html
    $scope.login = function(email, password) {
        // Hacemos una petición DELETE a la API para borrar el id que nos pase el html por parametro
//        $http.delete("/api/todo/" + id).
//                success(function(response) {
//            if (response.status === "OK") { // Si la API nos devuelve un OK...
//                getTodos(); // Actualizamos la lista de ToDo's
//            }
//        });
        $scope.crearModalEnRunTime();
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

    $scope.getIdUsuarioLogueado = function() {
        return usuarioFactory.usuario.idUsuario;
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
        $scope.crearModalEnRunTime();
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
        $scope.crearModalEnRunTime();
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
        $scope.crearModalEnRunTime();
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
        $scope.crearModalEnRunTime();
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

    $scope.publicacionesPorUsuario = function() {
        $scope.crearModalEnRunTime();
        $scope.modal.show();

        usuarioService.publicaciones(usuarioFactory.usuario.idUsuario)
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        $scope.modal.hide();
                        publicacionFactory.items = data.contenido;

                        if ($scope.app.navigator.getCurrentPage().name === 'publicacionDetalle.html') {
                            $scope.app.navigator.popPage();
                        } else {
                            $scope.app.slidingMenu.setMainPage('publicacionesUsuario.html');
                        }
                    } else {
                        publicacionFactory.items = [];
                        $scope.modal.hide();
                        $scope.ons.notification.alert({
                            title: 'Info',
                            messageHTML: '<strong style=\"color: #ff3333\">' + data.contenido + '</strong>'
                        });
                    }
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
                        messageHTML: '<strong style=\"color: #ff3333\">' + mensaje + '</strong>'
                    });
                });
    };

    $scope.getPublicacionesPorUsuario = function() {
        return publicacionFactory.items;
    };

    $scope.getPublicacionSeleccionada = function() {
        return publicacionFactory.seleccionada;
    };

    $scope.mostrarDetallePublicacionesPorUsuario = function(index) {
        publicacionFactory.seleccionada = publicacionFactory.items[index];
        $scope.app.navigator.pushPage('publicacionDetalle.html');
    };

    $scope.getComentariosPublicacionSinRespuesta = function(arrayComentarios) {
        var cont = 0;
        for (var i in arrayComentarios)
        {
            if (arrayComentarios[i].contestado === false)
                cont++;

        }
        return cont;
    };

    $scope.eliminarPublicacionUsuario = function() {
        $scope.crearModalEnRunTime();

        $scope.ons.notification.confirm({
            message: '¿Seguro deseas eliminar esta publicacion?',
            buttonLabels: ['No', 'Si'],
            title: 'Info',
            callback: function(idx) {
                switch (idx) {
                    case 0:
                        // Presiono No
                        //$scope.modal.hide();
                        break;
                    case 1:
                        // Presiono Si
                        $scope.modal.show();
                        var idPublicacion = publicacionFactory.seleccionada.idPublicacion;
                        usuarioService.eliminarPublicacion(idPublicacion)
                                .then(function(data) {
                                    var respuesta = data.respuesta;
                                    if (respuesta === 'OK') {
                                        idPublicacion = data.contenido;
                                        $scope.modal.hide();
                                        $scope.ons.notification.alert({
                                            title: 'Info',
                                            message: 'Publicacion eliminada con exito'
                                        });
                                        $scope.publicacionesPorUsuario();
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

    $scope.finalizarPublicacionUsuario = function() {
        $scope.crearModalEnRunTime();
        $scope.modal.show();

        // Presiono Si
        var idPublicacion = publicacionFactory.seleccionada.idPublicacion;


        usuarioService.finalizarPublicacion(idPublicacion)
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        idPublicacion = data.contenido;
                        $scope.modal.hide();
                        $scope.ons.notification.alert({
                            title: 'Info',
                            message: 'Publicacion finalizada con exito'
                        });
                        $scope.publicacionesPorUsuario();
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

    $scope.republicarPublicacionUsuario = function() {
        $scope.crearModalEnRunTime();
        $scope.modal.show();

        // Presiono Si
        var idPublicacion = publicacionFactory.seleccionada.idPublicacion;


        usuarioService.republicarPublicacion(idPublicacion)
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        idPublicacion = data.contenido;
                        $scope.modal.hide();
                        $scope.ons.notification.alert({
                            title: 'Info',
                            message: 'Publicacion republicada con exito'
                        });
                        $scope.publicacionesPorUsuario();
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

    $scope.publicar = function() {
        if ($scope.isLogueado()) {
            categoriaFactory.seleccionada = '';
            categoriaFactory.items = [];
            $scope.app.navigator.pushPage('publicarElegir.html');
        } else {
            $scope.ons.notification.alert({
                title: 'Info',
                messageHTML: '<strong style=\"color: #ff3333\">Debes ingresar para poder publicar</strong>',
                callback: function() {
                    $scope.app.navigator.pushPage('login.html');
                }
            });
        }
    };

    $scope.categorias = function(idCategoriaPadre, index) {
        $scope.crearModalEnRunTime();
        $scope.modal.show();

        if (index === -1) {
            var categoriaP;
            switch (idCategoriaPadre) {
                case 1:
                    categoriaP = {"idCategoria": 1, "categoriaEs": "Profesional", "descripcion": null, "categoriaEn": null, "categoriaPr": null, "matricula": null};
                    break;
                case 2:
                    categoriaP = {"idCategoria": 2, "categoriaEs": "Servicios", "descripcion": null, "categoriaEn": null, "categoriaPr": null, "matricula": null};
                    break;
                case 3:
                    categoriaP = {"idCategoria": 3, "categoriaEs": "Educacion", "descripcion": null, "categoriaEn": null, "categoriaPr": null, "matricula": null};
                    break;
            }
            categoriaFactory.seleccionada = categoriaP;
        } else {
            categoriaFactory.seleccionada = categoriaFactory.items[index];
        }

        $scope.categoriasSel.push(categoriaFactory.seleccionada);

        usuarioService.categorias(idCategoriaPadre)
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        categoriaFactory.items = data.contenido;
                        $scope.modal.hide();
//                        $scope.$apply();
//                        $scope.app.slidingMenu.setMainPage('contratacion.html');
                    } else {
                        categoriaFactory.seleccionada = '';
                        categoriaFactory.items = [];
                        $scope.modal.hide();
                        $scope.ons.notification.alert({
                            title: 'Info',
                            messageHTML: '<strong style=\"color: #ff3333\">' + data.contenido + '</strong>'
                        });
                    }
                })
                .catch(function(data, status) {
                    categoriaFactory.seleccionada = '';
                    categoriaFactory.items = [];
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

    $scope.getCategorias = function() {
        return categoriaFactory.items;
    };

    $scope.getCategoriaSeleccionada = function() {
        return categoriaFactory.seleccionada;
    };


    $scope.cancelarElegirCategoria = function() {
        $scope.categoriasSel = [];
        categoriaFactory.seleccionada = '';
    };

    $scope.getListarClase = function(clase) {
        switch (clase) {
            case 'formacobro':
                return formaCobroFactory.items;
            case 'prestacion':
                return prestacionFactory.items;
            case 'mediopago':
                return medioPagoFactory.items;
        }
    };

    $scope.listarClase = function(clase) {

        $scope.crearModalEnRunTime();
        $scope.modal.show();

        usuarioService.listarClase(clase)
                .then(function(data) {
                    var respuesta = data.respuesta;
                    if (respuesta === 'OK') {
                        $scope.modal.hide();
                        var dialogo;
                        switch (clase) {
                            case 'formacobro':
                                formaCobroFactory.items = data.contenido;
                                formaCobroFactory.seleccionada = "";
                                dialogo = $scope.dialogFiltroFC;
                                break;
                            case 'prestacion':
                                prestacionFactory.items = data.contenido;
                                prestacionFactory.seleccionada = "";
                                dialogo = $scope.dialogFiltroPrest;
                                break;
                            case 'mediopago':
                                medioPagoFactory.items = data.contenido;
                                medioPagoFactory.seleccionado = "";
                                dialogo = $scope.dialogFiltroMP;
                                break;
                        }

                        dialogo.show();
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

    $scope.getFormaCobroSeleccionada = function() {
        return formaCobroFactory.seleccionada;
    };

    $scope.setFormaCobroSeleccionada = function(index) {
        formaCobroFactory.seleccionada = formaCobroFactory.items[index];
        $scope.dialogFiltroFC.hide();
    };

    $scope.getPrestacionSeleccionada = function() {
        return prestacionFactory.seleccionada;
    };

    $scope.setPrestacionSeleccionada = function(index) {
        prestacionFactory.seleccionada = prestacionFactory.items[index];
        $scope.dialogFiltroPrest.hide();
    };

    $scope.setMedioPagoSeleccionado = function(index) {
        medioPagoFactory.seleccionado = medioPagoFactory.items[index];
        $scope.dialogFiltroMP.hide();
    };

    $scope.getMedioPagoSeleccionado = function() {
        return medioPagoFactory.seleccionado;
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


    $scope.validarDescribirPublicacion = function() {
        var mensaje = '';

        if ($scope.categoriasSel[0].idCategoria === 1 && $scope.matriculaPublicacion === '') {
            mensaje = 'Debes ingresar una matricula';
        } else if (formaCobroFactory.seleccionada === '') {
            mensaje = 'Debe seleccionar una forma de cobro';
        } else if (prestacionFactory.seleccionada === '') {
            mensaje = 'Debe seleccionar una prestación';
        } else if (medioPagoFactory.seleccionado === '') {
            mensaje = 'Debe seleccionar un medio de pago';
        } else if (otrosFiltroFactory.garantia === true && $scope.garantiaPublicacion === '') {
            mensaje = 'Debe explicar la garantia de la publicación';
        }


        if (mensaje !== '') {
            $scope.ons.notification.alert({
                title: 'Info',
                messageHTML: '<strong style=\"color: #ff3333\">' + mensaje + '</strong>'
            });
        } else {
            $scope.app.navigator.pushPage('publicarUbicar.html', {categoriasSel: $scope.categoriasSel, descripcion: $scope.descripcionPublicacion, titulo: $scope.tituloPublicacion, precio: $scope.precioPublicacion, matricula: $scope.matriculaPublicacion, tel: $scope.telefonoPublicacion});
        }
    };


    //Inicializacion mapa
    $timeout(function() {
        var lat = usuarioFactory.usuario.latitud;
        var lng = usuarioFactory.usuario.longitud;
        if (!$scope.isLogueado()) {
            lat = "-34.603752";
            lng = "-58.381565";
        }
        var latlng = new google.maps.LatLng(lat, lng);
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
        $scope.mapPublicacion = new google.maps.Map(document.getElementById("map_canvas"), opciones);
        $scope.overlay = new google.maps.OverlayView();
        $scope.overlay.draw = function() {
        }; // empty function required
        $scope.overlay.setMap($scope.mapPublicacion);
        $scope.element = document.getElementById('map_canvas');

        markerPublicacion = new google.maps.Marker({
            position: latlng,
            map: $scope.mapPublicacion,
            title: 'Selecciona una ubicación',
            draggable: true
        });


        var infoWindow = new google.maps.InfoWindow({
            content: "Selecciona una ubicación"
        });
        infoWindow.open($scope.mapPublicacion, markerPublicacion);

        google.maps.event.addListener(markerPublicacion, 'dragend', function() {
            actualizaPosicion(markerPublicacion.getPosition());
        });


    }, 100);

    $scope.onBlurCalleNroPublicacion = function() {
        /* change noticed */
        markerPublicacion.setMap(null);

        var geocoder = new google.maps.Geocoder();
        var pais = paisFactory.seleccionado !== '' ? (', ' + paisFactory.seleccionado.pais) : '';
        var loc = localidadFactory.seleccionada !== '' ? (', ' + localidadFactory.seleccionada.localidad) : '';

        var address = $scope.calleNroPublicacion + loc + pais;

        geocoder.geocode({'address': address}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                var lat = results[0].geometry.location.lat();
                var lng = results[0].geometry.location.lng();
                var latlng = new google.maps.LatLng(lat, lng);
                $scope.mapPublicacion.setCenter(latlng);
                markerPublicacion = new google.maps.Marker({
                    position: latlng,
                    map: $scope.mapPublicacion,
                    title: 'Selecciona una ubicación',
                    draggable: true
                });
            } else {
                //alert("El geocoding no funciona por la siguiente razón: " + status);
            }
        });


    };

    $scope.promptUbicacion = function(clase, id) {
        $scope.ons.notification.prompt({
            title: 'Info',
            message: "Ingrese " + clase,
            callback: function(textoUbicacion) {
                $scope.listarUbicacion(clase, id, textoUbicacion);
            }
        });
    };


    $scope.listarUbicacion = function(clase, id, textoUbicacion) {
        if (textoUbicacion.length < 2) {
            $scope.ons.notification.alert({
                title: 'Info',
                messageHTML: '<strong style=\"color: #ff3333\">Debes ingresar al menos dos letras para buscar la ubicación</strong>'
            });
        } else {
            $scope.crearModalEnRunTime();
            $scope.modal.show();

            usuarioService.listarUbicacion(clase, id, textoUbicacion)
                    .then(function(data) {
                        var respuesta = data.respuesta;
                        if (respuesta === 'OK') {
                            $scope.modal.hide();
                            var dialogo;
                            switch (clase) {
                                case 'pais':
                                    paisFactory.items = data.contenido;
                                    paisFactory.seleccionado = "";
                                    dialogo = $scope.dialogFiltroPais;
                                    break;
                                case 'provincia':
                                    provFactory.items = data.contenido;
                                    provFactory.seleccionada = "";
                                    dialogo = $scope.dialogFiltroProv;
                                    break;
                                case 'dpto':
                                    dptoFactory.items = data.contenido;
                                    dptoFactory.seleccionado = "";
                                    dialogo = $scope.dialogFiltroDpto;
                                    break;
                                case 'localidad':
                                    localidadFactory.items = data.contenido;
                                    localidadFactory.seleccionada = "";
                                    dialogo = $scope.dialogFiltroLoc;
                                    break;
                            }

                            dialogo.show();
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
        }

    };

    $scope.getListarUbicacion = function(clase) {
        switch (clase) {
            case 'pais':
                return paisFactory.items;
            case 'provincia':
                return provFactory.items;
            case 'dpto':
                return dptoFactory.items;
            case 'localidad':
                return localidadFactory.items;
        }
    };


    $scope.setPaisSeleccionado = function(index) {
        paisFactory.seleccionado = paisFactory.items[index];
        $scope.dialogFiltroPais.hide();
        $scope.onBlurCalleNroPublicacion();
    };

    $scope.getPaisSeleccionado = function() {
        return paisFactory.seleccionado;
    };

    $scope.setProvSeleccionada = function(index) {
        provFactory.seleccionada = provFactory.items[index];
        $scope.dialogFiltroProv.hide();
    };

    $scope.getProvSeleccionada = function() {
        return provFactory.seleccionada;
    };

    $scope.setDptoSeleccionado = function(index) {
        dptoFactory.seleccionado = dptoFactory.items[index];
        $scope.dialogFiltroDpto.hide();
    };

    $scope.getDptoSeleccionado = function() {
        return dptoFactory.seleccionado;
    };


    $scope.setLocalidadSeleccionada = function(index) {
        localidadFactory.seleccionada = localidadFactory.items[index];
        $scope.dialogFiltroLoc.hide();
        $scope.onBlurCalleNroPublicacion();
    };

    $scope.getLocalidadSeleccionada = function() {
        return localidadFactory.seleccionada;
    };

    $scope.atrasDescribirPublicar = function() {
        $scope.descripcionPublicacion = "";
        $scope.tituloPublicacion = "";
        $scope.precioPublicacion = "";
        $scope.matriculaPublicacion = "";
        $scope.telefonoPublicacion = "";
        $scope.garantiaPublicacion = "";
        medioPagoFactory.seleccionado = "";
        medioPagoFactory.items = [];
        formaCobroFactory.seleccionada = "";
        formaCobroFactory.items = [];
        prestacionFactory.seleccionada = "";
        prestacionFactory.items = [];
        otrosFiltroFactory.dispo = false;
        otrosFiltroFactory.garantia = false;
        $scope.app.navigator.popPage();
    };

    $scope.atrasUbicarPublicar = function() {
        $scope.barrioPublicacion = "";
        $scope.calleNroPublicacion = "";
        paisFactory.seleccionado = "";
        paisFactory.items = [];
        provFactory.seleccionada = "";
        provFactory.items = [];
        dptoFactory.seleccionado = "";
        dptoFactory.items = [];
        localidadFactory.seleccionada = "";
        localidadFactory.items = [];
        $scope.app.navigator.popPage();
    };

    $scope.getParametroParaPublicar = function(pagina) {
        $scope.categoriasSel = $scope.app.navigator.getCurrentPage().options.categoriasSel;
        if (pagina !== 'describir') {
            $scope.descripcionPublicacion = $scope.app.navigator.getCurrentPage().options.descripcion;
            $scope.tituloPublicacion = $scope.app.navigator.getCurrentPage().options.titulo;
            $scope.precioPublicacion = $scope.app.navigator.getCurrentPage().options.precio;
            $scope.matriculaPublicacion = $scope.app.navigator.getCurrentPage().options.matricula;
            $scope.telefonoPublicacion = $scope.app.navigator.getCurrentPage().options.tel;
        }
    };

    $scope.registrarPublicacion = function() {
        if (paisFactory.seleccionado !== '' && provFactory.seleccionada !== '' && dptoFactory.seleccionado !== '' && localidadFactory.seleccionada !== '') {
            $scope.crearModalEnRunTime();
            $scope.modal.show();

            usuarioService.registrarPublicacion(usuarioFactory.usuario.email, $scope.categoriasSel[0].idCategoria,
                    $scope.categoriasSel[$scope.categoriasSel.length - 1].idCategoria, otrosFiltroFactory.dispo, $scope.descripcionPublicacion,
                    localidadFactory.seleccionada.idLocalidad, markerPublicacion.getPosition().lat(), markerPublicacion.getPosition().lng(), $scope.tituloPublicacion, $scope.precioPublicacion,
                    formaCobroFactory.seleccionada.idFormaCobro, prestacionFactory.seleccionada.idPrestacion,
                    medioPagoFactory.seleccionado.idMedioPago, $scope.barrioPublicacion, $scope.calleNroPublicacion, otrosFiltroFactory.garantia, $scope.garantiaPublicacion,
                    $scope.matriculaPublicacion, $scope.telefonoPublicacion)
                    .then(function(data) {
                        $scope.modal.hide();
                        var respuesta = data.respuesta;
                        if (respuesta === 'OK') {
                            $scope.ons.notification.alert({
                                title: 'Info',
                                messageHTML: '<strong style=\"color: #25a6d9\">Publicación registrada con exito</strong>',
                                callback: function() {
                                    $scope.app.slidingMenu.setMainPage('inicio.html');
                                }
                            });
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
                            messageHTML: '<strong style=\"color: #ff3333\">Operación denegada: ' + mensaje + '</strong>'
                        });
                    });
        } else {
            $scope.ons.notification.alert({
                title: 'Info',
                messageHTML: '<strong style=\"color: #ff3333\">Debes elegir país, provincia, dpto/partido y localidad</strong>'
            });
        }
    };


}


Onsen.controller('usuarioCtrl', function($scope, $timeout, usuarioService, usuarioFactory, publicacionFactory, contratRealiFactory, contratRecibFactory, categoriaFactory, formaCobroFactory, prestacionFactory, medioPagoFactory, otrosFiltroFactory, paisFactory, provFactory, dptoFactory, localidadFactory, fBFactory, ngFB) {
    usuarioCtrl($scope, $timeout, usuarioService, usuarioFactory, publicacionFactory, contratRealiFactory, contratRecibFactory, categoriaFactory, formaCobroFactory, prestacionFactory, medioPagoFactory, otrosFiltroFactory, paisFactory, provFactory, dptoFactory, localidadFactory, fBFactory, ngFB);
});




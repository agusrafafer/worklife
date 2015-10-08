/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Onsen.service('usuarioService', function($http, $q, wsFactory) {

    var tipoContratacion = "";
    var reputacionComoCli = 0;
    var reputacionComoPro = 0;

    this.validarLogin = function(email, password) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.post(wsFactory.url + '/login', {mail: email, clave: password})
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

    this.registrar = function(nombre, apellido, mail, clave2, idUsuarioFb) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.post(wsFactory.url + '/registrar', {nombre: nombre, apellido: apellido, mail: mail, clave: clave2, idUsuarioFb: idUsuarioFb})
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };


    this.setTipoContratacion = function(tipoContrat) {
        tipoContratacion = tipoContrat;
    };

    this.getTipoContratacion = function() {
        return tipoContratacion;
    };


    this.contrataciones = function(idUsuario) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get(wsFactory.url + '/contrataciones/' + tipoContratacion + '/' + idUsuario)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

    this.cancelarContratacion = function(idContratacion, tipoContratacion) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.post(wsFactory.url + '/contratacion/cancelar', {idContratacion: idContratacion, tipoContratacion: tipoContratacion})
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

    this.confirmarContratacion = function(idContratacion) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.post(wsFactory.url + '/contratacion/confirmar', {idContratacion: idContratacion})
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    var reputacionComoCli = 0;
    var reputacionComoPro = 0;
    
    this.setReputacionComoCli = function(reputacionCliente) {
        reputacionComoCli = reputacionCliente;
    };

    this.getReputacionComoCli = function() {
        return reputacionComoCli;
    };
    
    this.setReputacionComoPro = function(reputacionProveedor) {
        reputacionComoPro = reputacionProveedor;
    };

    this.getReputacionComoPro = function() {
        return reputacionComoPro;
    };

    this.reputacion = function(mailUsuario) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get(wsFactory.url + '/reputacion/' + mailUsuario)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.publicaciones = function(idUsuario) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get(wsFactory.url + '/publicaciones/' + idUsuario)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.eliminarPublicacion = function(idPublicacion) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.post(wsFactory.url + '/publicacion/eliminar', {idPublicacion: idPublicacion})
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.finalizarPublicacion = function(idPublicacion) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.put(wsFactory.url + '/publicacion/finalizar', {idPublicacion: idPublicacion})
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.republicarPublicacion = function(idPublicacion) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.put(wsFactory.url + '/publicacion/republicar', {idPublicacion: idPublicacion})
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.categoria = function(nombreCateoriaPadre) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get(wsFactory.url + '/categoria/' + nombreCateoriaPadre)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.categorias = function(idCateoriaPadre) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get(wsFactory.url + '/categorias/' + idCateoriaPadre)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.listarClase = function(clase) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get(wsFactory.url + '/listarclase/' + clase)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.listarUbicacion = function(clase, id, textoBuscado) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;
        
        $http.get(wsFactory.url + '/listarubicacion/' + clase + '/' + id + '/' + textoBuscado)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.registrarPublicacion = function(mailUsuario, idCategoriaPadre, idCategoriaFinal, dispo, descripcion, idLocalidad, lat, lng, titulo, precio, idFormaCobro, idPrestacion, idMedioPago, barrio, calleNro, garantiaSiNo, garantia, matricula, telefono) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.post(wsFactory.url + '/publicacion', {mailUsuario: mailUsuario, idCategoriaPadre: idCategoriaPadre, idCategoriaFinal: idCategoriaFinal, dispo: dispo, descripcion: descripcion, idLocalidad: idLocalidad, lat: lat, lng: lng, titulo: titulo, precio: precio, idFormaCobro: idFormaCobro, idPrestacion: idPrestacion, idMedioPago: idMedioPago, barrio: barrio, calleNro: calleNro, garantiaSiNo: garantiaSiNo, garantia: garantia, matricula: matricula, telefono: telefono})
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

    this.redondearNumero = function(numero) {
        var decimals = 2;
        decimals = Math.pow(10, decimals);

        var intPart = Math.floor(numero);
        var fracPart = (numero % 1) * decimals;
        fracPart = fracPart.toFixed(0);

        if (fracPart > 50) {
            intPart += 1;
        }

        return intPart;
    };

    this.redondearReputacion = function(numero) {
        var decimals = 2;
        decimals = Math.pow(10, decimals);

        var intPart = Math.floor(numero);
        var fracPart = (numero % 1) * decimals;
        fracPart = fracPart.toFixed(0);

        if (fracPart >= 50) {
            intPart += 1;
        }

        return intPart;
    };


});


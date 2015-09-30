/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Onsen.service('publicacionService', function($http, $q, wsFactory) {
    this.buscar = function(textoBuscado, idUsuario, pagIni, pagTam) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get(wsFactory.url + '/buscar/' + textoBuscado + '/' + idUsuario + '/' + pagIni + '/' + pagTam)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
//                    console.log(JSON.stringify(err));
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.registrarContratacion = function(idPublicacion, mailUsuarioQueContrata) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.post(wsFactory.url + '/contratacion', {idPublicacion: idPublicacion, mailUsuarioQueContrata: mailUsuarioQueContrata})
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.comentarios = function(idPublicacion) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get(wsFactory.url + '/comentarios/' + idPublicacion)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
//                    console.log(JSON.stringify(err));
                    defered.reject(data, status);
                });

        return promise;
    };
    
    this.registrarComentario = function(mailUsuario, idPublicacion, comentario, contestado, idComentario) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;

        $http.post(wsFactory.url + '/comentarios', {mailUsuario: mailUsuario, idPublicacion: idPublicacion, comentario: comentario, contestado: contestado, idComentario: idComentario})
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };
    
    
});



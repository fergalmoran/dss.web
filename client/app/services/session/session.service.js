'use strict';

angular.module('dssWebApp')
    .service('Session', function Session(SERVER_CONFIG, STORAGE, USER_ROLES) {
        this.user = null;
        this.create = function (user) {
            this.user = user;
        };

        this.isInRole = function (role) {
            return this.user.roles.indexOf(role) !== -1;
        };
        this.destroy = function () {
            this.user = null;
            localStorage.removeItem(STORAGE.authToken);
            localStorage.removeItem(STORAGE.authBackend);
            localStorage.removeItem(STORAGE.authServerToken);
            localStorage.removeItem(STORAGE.authServerSession);
        };
        this.removeJwtToken = function () {
            localStorage.removeItem(STORAGE.authServerToken);
        };
        this.setLocalToken = function (token) {
            localStorage.setItem(STORAGE.authLocalToken, token);
        };
        this.setSession = function (session) {
            localStorage.setItem(STORAGE.authServerSession, session);
        };
        this.setToken = function (token) {
            localStorage.setItem(STORAGE.authServerToken, token);
        };
        this.setBackend = function (backend) {
            localStorage.setItem(STORAGE.authBackend, backend);
        };
        this.getLocalToken = function () {
            return localStorage.getItem(STORAGE.authLocalToken);
        };
        this.getSession = function () {
            return localStorage.getItem(STORAGE.authServerSession);
        };
        this.getToken = function () {
            return localStorage.getItem(STORAGE.authServerToken);
        };
        this.getBackend = function () {
            return localStorage.getItem(STORAGE.authBackend);
        };

    });

angular.module('dssWebApp')
    .directive('checkboxBitfield', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrls) {
                var checkbox = element.find('input[type=checkbox]')[0];
                if (typeof checkbox === "undefined")
                    return;

                // trigger changes of the ngModel
                scope.$watch(attrs.ngModel, function (value) {
                    checkbox.checked = value & (1 << checkbox.value);
                });


                $(checkbox).bind('change', function () {
                    var flagSum = ctrls.$viewValue ^ (1 << this.value);

                    scope.$apply(function () {
                        ctrls.$setViewValue(flagSum);
                    });
                });
            }
        };
    });

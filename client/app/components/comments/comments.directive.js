'use strict';

angular.module('dssWebApp')
    .directive('dssComments', function (logger, dialogs, Session, MixModel, CommentModel) {
        console.log('dssCommentsDirective');
        return {
            restrict: 'E',
            templateUrl: 'app/components/comments/comments.html',
            link: function (scope, element, attrs) {
                console.log('dssCommentsDirective (link): ', scope);
                element.bind('keydown', function (event) {
                    var code = event.keyCode || event.which;
                    if (code === 13 && event.shiftKey) {
                        event.preventDefault();
                        scope.postComment();
                    }
                });
                scope.postComment = function () {
                    if (scope.newComment) {
                        CommentModel.create({
                            comment: scope.newComment,
                            mix_id: scope.mix.id
                        }).then(function (result) {
                            console.log('Saved comment', result);
                            scope.comments.unshift(result);
                            scope.newComment = '';
                        });
                    }
                };
                scope.deleteComment = function (comment) {
                    console.log(comment);
                    var dlg = dialogs.create('app/dialogs/confirm/confirmDialog.html', 'confirmDialogCtrl', {
                        title: 'You sure chief?',
                        body: 'Delete this comment?'
                    });
                    dlg.result.then(function (result) {
                        if (result) {
                            CommentModel.destroy(comment.id).then(function (item) {
                            //comment.destroy().then(function (item) {
                                console.log('Successfully deleted comment', scope.comments);
                            });
                            CommentModel.save();
                        }
                    });
                };
            }
        };
    });

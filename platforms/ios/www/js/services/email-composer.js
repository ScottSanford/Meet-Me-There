angular.module('EmailComposerService', [])

.factory('EmailComposer', function() {
  
  var email = {
    to: 'ssanford@mediafly.com',
    cc: 'nmehta@mediafly.com',
    subject: 'Feedback for Meet Me There App',
    body: 'To Developing Team:',
    isHtml: true
  } 

  return email;

});
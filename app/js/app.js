'use strict';

var sirAngular = angular.module('sirAngular', ['ngNewRouter', 'firebase'])
                        .controller('AppController', ['$router', AppController]);

function AppController($router) {
  $router.config([
    { path: '/editor', component: 'editor' },
    { path: '/', component: 'home' }
  ]);
}

var editorSt;

sirAngular.directive('sirTrevor', function(SirService) {
  return {
    require: '?ngModel',
    link: function(scope, elm, attr, ngModel) {
      
      if (!ngModel) return;

      if (!editorSt) {
        editorSt = new SirTrevor.Editor({
          el: $(elm),
          blockTypes: ["Text", "Video"]
        });
        // SirService.setInstance(editorSt);
      }

      ngModel.$render = function(value) {
        $(elm).val(ngModel.$viewValue);
        editorSt.reinitialize();
      };

      scope.$on('$destroy', function() {
        if (editorSt) {
          editorSt.destroy();
          editorSt = undefined;
        }

      });
    }
  };
});

sirAngular.service('SirService', function(){

  this.text = '{"data":[{"type":"text","data":{"text":"Hello, Im **Sir Trevor**.Create some new blocks and see _what I can do_."}}]}';
});

sirAngular.controller('HomeController', function($firebaseObject, SirService) {
  var vm = this;
  var ref = new Firebase("https://sirtrevor.firebaseio.com/home");

  // vm.text = '{"data":[{"type":"text","data":{"text":"Hello, Im **Sir Trevor**.Create some new blocks and see _what I can do_."}}]}';
  // console.log(SirService.getInstance());
  
  
  vm.text =  $firebaseObject(ref);
  // vm.text = '{"data":[{"type":"text","data":{"text":"Hello, Im **Sir Trevor**.Create some new blocks and see _what I can do_."}}]}';
  vm.text.$add('{"data":[{"type":"text","data":{"text":"Hello, Im **Sir Trevor**.Create some new blocks and see _what I can do_."}}]}');
  console.log(vm.text);

  vm.send = function(){
    // var editorSt = SirService.getInstance();
    console.log('SEND', vm.text);
    console.log(editorSt);
    editorSt.onFormSubmit();
    var data = editorSt.store.retrieve();
    console.log(JSON.stringify(data));
    // vm.text.$add(data);
  };

});

sirAngular.controller('EditorController', function(SirService) {
  
  this.setBody = function() {
    this.body = '{"data":[{"type":"text","data":{"text":"Hello, Im **Sir Trevor**.Create some new blocks and see _what I can do_."}},{"type":"video","data":{"source":"youtube","remote_id":"hcFLFpmc4Pg"}}]}'; 
  }

  this.clearBody = function() {
    this.body = '';
  }
  console.log(editorSt);
  this.setBody();
});

var app = angular.module('myApp',[]);
			app.controller('loginCtrl',function($scope){
				
				
				$scope.sub = function(pristine,e){
					if (pristine) {
						$scope.state = true;
					} else if(e){
						alert('请填写信息')
					} else{
						alert('验证通过')
					}
						
				}
				
			})
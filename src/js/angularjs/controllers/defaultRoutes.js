angular.module("isubset" , ["ngRoute" , "ngAnimate" , "customFilters" , "customDirectives" , "ui.bootstrap" , "ngSanitize"])
  .config(function ($routeProvider) {
		$routeProvider.when("/", {
			templateUrl: "/index.html"
		});
		$routeProvider.when("/explore", {
			templateUrl: "/js/angularjs/views/courseExplorer.html"
		});
		$routeProvider.when("/course", {
			templateUrl: "/js/angularjs/views/course-dashboard.html"
		});
		$routeProvider.when("/editor", {
			templateUrl: "/js/angularjs/views/editor.html"
		});
		$routeProvider.when("/profile", {
			templateUrl: "/js/angularjs/views/profile.html"
		});
		$routeProvider.otherwise({
			templateUrl: "/js/angularjs/views/courseExplorer.html"
		});
	})
	.config(function ($anchorScrollProvider) {
	   $anchorScrollProvider.disableAutoScrolling();
	});
/* global angular */
(function(){ 
  var app = angular.module('movieList', ['truncateFilters', 'ngAnimate', 'ui.bootstrap']).controller('MovieListController', ['$scope', '$http', '$templateCache', '$modal', 
  function($scope, $http, $templateCache, $modal) {
    $scope.method = 'GET';
    $scope.baseurl = 'http://www.myapifilms.com/imdb?limit=15&title=';
	$scope.loading = 0;

	$scope.watchListMovies = [];

	$scope.inWatchList = function(movie) {
		for (var i=0; i < $scope.watchListMovies.length; i++)
    	{
			if ($scope.watchListMovies[i].idIMDB == movie.idIMDB)
			return true;
		}
		return false;
	};

 	$scope.addToWatchlist = function(movie) {
		if ($scope.inWatchList(movie) == false)
		$scope.watchListMovies.push(movie);
		movie.watchlist = true;
	};

 	$scope.removeFromWatchlist = function(movie) {
		for (var i=0; i < $scope.watchListMovies.length; i++)
    	{
			if ($scope.watchListMovies[i].idIMDB == movie.idIMDB)  
			$scope.watchListMovies.splice(i,1)
			movie.watchlist = false;
		}
	};
	
    $scope.searchMovies = function(searchMovieName) {
	  $scope.loading++;
	  $scope.url = $scope.baseurl + searchMovieName + "'";
	  $scope.code = null;
      $scope.response = null;

      $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
        success(function(data, status) {
          $scope.status = status;
          $scope.movies = data;
		  $scope.movies.forEach(function(movie) {
    		movie.watchlist = $scope.inWatchList(movie);
			});
	      $scope.loading--;
      }).
        error(function(data, status) {
          $scope.status = status;
	      $scope.movies = data + 'Request failed';
          $scope.loading--;
      });
    };
               
  $scope.selectedMovie = "";

  $scope.open = function (item) {

	$scope.selectedMovie = item;

    var modalInstance = $modal.open({
      templateUrl: 'confirmationModal',
      controller: ModalInstanceCtrl,
      resolve: {
        selectedMovie: function () {
          return $scope.selectedMovie;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
  	  $scope.removeFromWatchlist(selectedItem);
   });
  };
}]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance, selectedMovie) {

  $scope.selectedMovie = selectedMovie;

  $scope.ok = function () {
    $modalInstance.close($scope.selectedMovie);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

})();
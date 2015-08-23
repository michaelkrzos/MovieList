(function(){ 
var app = angular.module('objectFilters', [])
	.filter('find', function(){
	  return function(movie, movies) {
		for (var index in movies) {
		  if (movies[index].uid == movie.uid) {
			return index;
		  }
		}
		return -1;
	  }
    });
})();
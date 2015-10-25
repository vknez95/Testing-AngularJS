// Code goes here

(function() {

  var app = angular.module("githubViewer", []);

  var MainController = function($scope, github, $interval, $log,
    $anchorScroll, $location) {

    var onUserComplete = function(data) {
      $scope.user = data;
      $scope.error = "";
      github.getRepos($scope.user).then(onRepos, onReposError);
    };

    var onRepos = function(data) {
      $scope.repos = data;
      $scope.error = "";
      $location.hash("userDetails");
      anchorScroll();
    };

    var onReposError = function(reason) {
      $scope.error = "Could not fetch the data";
    };

    var decrementCountdown = function() {
      $scope.countdown -= 1;
      if ($scope.countdown < 1) {
        $scope.search($scope.username);
      }
    };

    var onSearchError = function(reason) {
      $scope.error = "Could not fetch the user";
    };

    $scope.search = function(username) {
      $log.info("Searching for " + username);
      github.getUser(username).then(onUserComplete, onSearchError);
      if (countdownInterval) {
        $interval.cancel(countdownInterval);
      }
      $scope.countdown = null;
    };

    var countdownInterval = null;
    var startCountdown = function() {
      countdownInterval = $interval(decrementCountdown, 1000, $scope.countdown);
    };

    $scope.username = "angular";
    $scope.message = "Github Viewer";
    $scope.repoSortOrder = "-stargazers_count";
    $scope.countdown = 2;
    startCountdown();
  };

  app.controller("MainController", MainController);

}());
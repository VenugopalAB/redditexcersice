// Code goes here
angular.module('redditapp', ['ngSanitize']).controller('appcontroller',['$scope','$http', '$sce', appcontroller]);
function appcontroller($scope, $http, $sce){
    $scope.init = function(){
        $scope.getData();
    };

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }
      
    $scope.getData = function(){
      $http.get("https://www.reddit.com/top.json")
      .then(function(response) {
          $scope.storyJson = response.data;
          console.log($scope.storyJson);
          $scope.storyData = {
            children:$scope.getChildrenJson($scope.storyJson.data.children),
            after:$scope.storyJson.data.after
          }
          console.log($scope.storyData);
      });
    
    $scope.getChildrenJson = function(childrenJson){
      var jsonlist = [];
      for (let index = 0; index < childrenJson.length; ++index){
        var child = childrenJson[index];
        var title = child.data.title;
        var user = child.data.author;
        var url = child.data.permalink;
        var image = "";
        var media = "";
        if(child.data.preview && child.data.preview.images["0"] && child.data.preview.images["0"].source.url){
          var imageobj = child.data.preview.images["0"].source;
          if(child.data.media_embed.content || child.data.preview.reddit_video_preview){
            if(child.data.preview.reddit_video_preview && child.data.preview.reddit_video_preview.scrubber_media_url)
              media = child.data.preview.reddit_video_preview.scrubber_media_url;
            else console.log(child.data.media_embed );
          }
          else
            image = child.data.preview.images["0"].source.url
        }
            
        var utc = child.data.created_utc;
        jsonlist.push({
        "title":title,
        "user":user,
        "image":image,
        "media":media,
        "url":url,
        "utc":utc
      });
      }
      console.log(jsonlist);
      return jsonlist;
    };
    $scope.getDateTimeString = function(unixTimeStamp){
      var options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      };
      var date2 = new Date(unixTimeStamp * 1000);
      var datestring = date2.toLocaleTimeString("en-us", options);
      return datestring;
    }
    
  }
  $scope.init();
}

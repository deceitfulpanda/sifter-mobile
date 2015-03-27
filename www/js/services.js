// App services will go here :)

angular.module('sifter.services', [])

.factory('Camera', ['$q', function($q) {
  var takePhoto = function(options) {
    var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
  };

  return {
    takePhoto: takePhoto
  };
}])

.factory('ImgUpload', ['$http', 'Cloudinary', function($http, Cloudinary) {

  // Upload image to Cloudinary storage
  // api docs at http://cloudinary.com/documentation/upload_images#remote_upload
  var uploadImage = function(imageURI) {
    var timestamp = +new Date();

    // return a promise to get url from cloudinary
    return $http.post(Cloudinary.url, {
    // return $http.post('http://www.mockr.co/1/cflann/images', {
      // need to specify base64 encoding (see http://stackoverflow.com/questions/24014937/uploading-base64-hashed-image-to-cloudinary
      // and http://en.wikipedia.org/wiki/Data_URI_scheme#JavaScript)
      file: "data:image/jpeg;base64," + imageURI,
      api_key: Cloudinary.apiKey,
      timestamp: timestamp,
      signature: Cloudinary.getSignature(timestamp)
    });
  };

  return {
    uploadImage: uploadImage
  };
}])

.factory('SifterAPI', ['$http', function($http) {

  // Send image url to sifter's backend API
  var postImgUrl = function(data) {
    // return promise anticipating server response
    // return $http.post('http://www.mockr.co/1/cflann/items', {
    return $http.post('https://pandasifter.herokuapp.com/api/imgurl', {
      locale: 'en_US',
      imgurl: data.url // TODO: double check this against Cloudinary API
    });
  };

  return {
    postImgUrl: postImgUrl
  };
}])

.factory('Chart', ['$http', function($http){
  var ctx, ctx2, doughData, lineData;

  var doughOptions = {
    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke : true,
    //String - The colour of each segment stroke
    segmentStrokeColor : "#fff",
    //Number - The width of each segment stroke
    segmentStrokeWidth : 5,
    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout : 73, // This is 0 for Pie charts
    //Number - Amount of animation steps
    animationSteps : 50,
    //String - Animation easing effect
    animationEasing : "swing",
    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate : true,
    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale : false,
    //String - A legend template
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
  };

  var lineOptions = {
    ///Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : true,
    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",
    //Number - Width of the grid lines
    scaleGridLineWidth : 1,
    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,
    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: false,
    //Boolean - Whether the line is curved between points
    bezierCurve : true,
    //Number - Tension of the bezier curve between points
    bezierCurveTension : 0.4,
    //Boolean - Whether to show a dot for each point
    pointDot : true,
    //Number - Radius of each point dot in pixels
    pointDotRadius : 4,
    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth : 1,
    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius : 20,
    //Boolean - Whether to show a stroke for datasets
    datasetStroke : true,
    //Number - Pixel width of dataset stroke
    datasetStrokeWidth : 2,
    //Boolean - Whether to fill the dataset with a colour
    datasetFill : true,
    //String - A legend template
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
  };
  var getDoughData = function(allRecycleData, allCompostData, allTrashData){
    var doughData = [
        {
            value: allRecycleData,
            color:"rgba(53,118,240,1)", //53, 118, 240
            highlight: "rgba(151,187,205,1)",
            label: "Recycle"
        },
        {
            value: allCompostData,
            color: "rgba(66,199,66,1)",
            highlight: "rgba(151,205,151,1)",
            label: "Compost"
        },
        {
            value: allTrashData,
            color: "rgba(200,200,210,1)",
            highlight: "rgba(220,220,220,1)",
            label: "Trash"
        }
    ];

    return doughData;
  }
  var getLineData = function(recycleData, compostData, landfillData){
    var lineData = {
        labels: ["1", "2", "3", "4", "5", "6", "7"],
        datasets: [
            {
                label: "Recycle",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: recycleData
            },
            {
                label: "Compost",
                fillColor: "rgba(151,205,151,0.2)",
                strokeColor: "rgba(151,205,151,1)",
                pointColor: "rgba(151,205,151,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,205,151,1)",
                data: compostData
            },
            {
                label: "Landfill",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: landfillData
            }
        ]
    };
    
    return lineData;
  }

  var getData = function(){
    //TODO: GET REQUEST HERE
    $http.get("https://pandasifter.herokuapp.com/api/stats").
      success(function(data, status, headers, config){
        var recycleData = data.recycle || [3, 2, 1, 5, 4];
        var compostData = data.compost || [1, 0, 1, 2, 2];
        var landfillData = data.landfill || [3, 2, 1, 0, 1];
        var allRecycleData = data.totalRecycle || 18;
        var allCompostData = data.totalCompost || 10;
        var allTrashData = data.totalLandfill || 5;   
        
        //WHEN WE HAVE DATA
        var lineData = getLineData(recycleData, compostData, landfillData);
        var doughData = getDoughData(allRecycleData, allCompostData, allTrashData)
        getCtx(doughData, lineData);
      });
  }


  var getCtx = function(doughData, lineData){
    ctx = document.getElementById('myDoughnutChart').getContext('2d');
    ctx2 = document.getElementById('myLineChart').getContext('2d');
    var myDoughnutChart = new Chart(ctx).Doughnut(doughData,doughOptions);
    var myLineChart = new Chart(ctx2).Line(lineData, lineOptions);
  };

  return {
    getData: getData
  }
}]);


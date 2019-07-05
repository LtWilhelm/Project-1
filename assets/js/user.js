let gender = $('#radiobutton').attr('gender');
let queryURL = "https://uinames.com/api/?gender=" + gender + "&region=united+states";


$('#userid').on('click', function(){
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response){
    $('displayid').text(response)
  })
})
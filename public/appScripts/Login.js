var Login={

    onclickLogin:function(){
        localStorage.setItem('BaseUrl','http://13.232.237.19/')
try{
    $.ajax({
        url:  localStorage.getItem('BaseUrl')+'api/users',
        type: "POST",
        crossDoman:true,
       data:{userId:$('#txtuserName').val(),password:$('#txtpassword').val()},
        success: function (response) {
            localStorage.setItem('token',response.token)
            if(response.user.role=="validator"){

                window.location="../CheckRequest.html";
            }else{
                window.location="../Dashboard _ Questionaire App.html";
            }
            
            $('#cityList').html(response).find('select').select2();
        },
        error:function(xhr,status,error){
            console.log(error);
        }
    })
} catch(ex){
console.log(ex);
}

    }
}
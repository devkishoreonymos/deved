var Login={

    onclickLogin:function(){
try{
    $.ajax({
        url: 'http://192.168.0.136:3000/api/users',
        type: "POST",
        crossDoman:true,
       data:{userId:$('#txtuserName').val(),password:$('#txtpassword').val()},
        success: function (response) {
            localStorage.setItem('token',response.token)
            window.location="../Dashboard _ Questionaire App.html";
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
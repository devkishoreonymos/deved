var Login = {

    onclickLogin: function () {
        localStorage.setItem('BaseUrl', 'http://13.232.237.19/')
        try {
            $.ajax({
                url: localStorage.getItem('BaseUrl') + 'api/users',
                type: "POST",
                crossDoman: true,
                data: { userId: $('#txtuserName').val(), password: $('#txtpassword').val() },
                success: function (response) {
                    localStorage.setItem('token', response.token)
                    localStorage.setItem('token', response.token)
                    localStorage.setItem('deved_user', JSON.stringify(response.user))
                    if (response.user.role != "deo") {

                        window.location = "CheckRequest.html";
                    } else {
                        window.location = "form_entries_create_update.html";
                    }

                    $('#cityList').html(response).find('select').select2();
                },
                error: function (xhr, status, error) {
                    console.log(error);
                }
            })
        } catch (ex) {
            console.log(ex);
        }

    }
}
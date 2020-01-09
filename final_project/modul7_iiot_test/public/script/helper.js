//beberapa helper usefull,  
//rikad

//login
function login(username,password) {

    $.ajax({
        url: 'api/login',
        type: 'POST',
        data: { username: username, password: password },
        success: function (data) {
            //save & redirect
            if(data.message == 'ok') {
                localStorage.setItem("login", JSON.stringify(data.data));
                goto('sup.html');
            } else {
                alert('User Not Found !');
            }
        },
        error: function () {
            alert('error')
        }
    });
}

function logout() {
    localStorage.removeItem('login');
    goto('index.html');
}

//EDIT
function edit(table,data) {

    $.ajax({
        url: 'api/edit/'+table,
        type: 'POST',
        data: data,
        success: function (data) {
            alert('sukses')
        },
        error: function () {
            alert('error')
        }
    });
}

function create(table,columns) {
    var data = {};
    var isEmpty = false;

    columns.forEach(function(value,index) {
        if(value.data != "ID") {
            var input = document.getElementById(`inp-${value.data}`)
            if(input.value != '') {
                data[value.data] = input.value;
            } else {
                alert('Input Kosong key = '+value.data);
                isEmpty = true;
                return false;
            }
        }
    })

    if(isEmpty == false) {
        $.ajax({
            url: 'api/add/'+table,
            type: 'POST',
            data: data,
            success: function (data) {
                window.location.reload();
            },
            error: function () {
                alert('error')
            }
        });
    }

}

//init add
function initAdd() {
    console.log('init add');
    var form = '';
    columns.forEach(function(value,index) {
        if(value.data != "ID") {
            form += `${value.data} : <input type="text" class="form-control" id="inp-${value.data}"><br>`;
        }
    })

    $('#myModal p').html(form);
    $('#myModal').modal('show');
}

//fungsi delete
function del(table,id) {
    $.ajax({
        url: 'api/delete/'+table+'/'+id,
        type: 'POST',
        success: function (data) {
            window.location.reload();
        },
        error: function () {
            alert('error')
        }
    });
}
//redirect dengan js
function goto(url) {
    window.location.href = url;
}
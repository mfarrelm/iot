/*
<nav class="navbar navbar-expand-sm bg-light">
<ul class="navbar-nav">
    <li class="nav-item">
        <a class="nav-link" href="sup.html">Supervisory</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="configure.html">Configure</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="users.html">Users</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="profile.html">Profile</a>
    </li>
</ul>
</nav>
*/
const HREF_INDEX = 'index.html'
const HREF_PROFILE = 'profile.html'

function auth_page(hak, emenu) {

// ambil id user
jsonLogin=localStorage.getItem("login");

// kalau kosong, belum login, redirect ke index
if (jsonLogin==undefined) {
    console.log("User belum login");
    window.location.href = HREF_INDEX;
}

// dLogin
// {"ID":1,"name":"admin","username":"admin","password":"admin",
//  "monitor":1,"supervise":1,"configure":1,"analyzing":1,"admin":1}
dLogin = JSON.parse(jsonLogin);

// kalau tidak berhak, redirect ke profile
console.log("Hak ",hak,"=",dLogin[hak]);
if (hak!="" && dLogin[hak]==0) {
    alert("Maaf, user tidak berhak masuk halaman ini");
    window.location.href = HREF_PROFILE;
}

// build menu sesuai hak
strMenu=`<nav class="navbar navbar-expand-sm bg-light">
   <ul class="navbar-nav">`;
if (dLogin.supervise) {
    strMenu += `
    <li class="nav-item">
        <a class="nav-link" href="sup.html">Supervisory</a>
    </li>`;
}
if (dLogin.configure) {
    strMenu += `    
    <li class="nav-item">
        <a class="nav-link" href="configure.html">Configure</a>
    </li>`;
}
if (dLogin.admin) {
    strMenu += `
    <li class="nav-item">
        <a class="nav-link" href="users.html">Users</a>
    </li>`
}
strMenu+=`
    <li class="nav-item">
        <a class="nav-link" href="profile.html">Profile</a>
    </li>
</ul>
</nav>`

// ganti div menu
document.getElementById(emenu).innerHTML = strMenu;

}
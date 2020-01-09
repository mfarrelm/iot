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
    <ul class="nav navbar-nav">`;
  if (dLogin.supervise) {
    strMenu += `<li>
        <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true"> <span class="nav-label">Supervisory</span> <span class="caret"></span></a>
        <ul class="dropdown-menu">
            <li><a class="nav-link" href="sup.html">Single Node</a></li>
            <li><a class="nav-link" href="sup-group.html">Multi Nodes</a></li>
      </ul>`
  }
  if (dLogin.configure) {
    strMenu += `<li>
        <a class="nav-link" href="configure.html">Configure</a>
    </li>`;
  }
  if (dLogin.admin) {
    strMenu += `<li>
        <a class="nav-link" href="users.html">Users</a>
    </li>`
  }
  strMenu+=`<li>
        <a class="nav-link" href="profile.html">Profile</a>
    </li>
  </ul>
</nav>`

  // ganti div menu
  document.getElementById(emenu).innerHTML = strMenu;

}

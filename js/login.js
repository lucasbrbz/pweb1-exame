function checar(){
    var usr = document.getElementById('user').value;
    var passwd = document.getElementById('password').value;
    
    if(usr == 'admin'){
        if(passwd == 'admin'){
            alert('Logado com sucesso!');
            window.location.href = 'home.html';
        } else {
            alert('Dados incorretos!');
        }
    } else {
        alert('Dados incorretos!');
    }
}
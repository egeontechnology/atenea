var mysql = require('mysql');
var express = require('express');
var app = express();
var crypto = require('crypto');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//Conecta con la base de datos
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysqlpass",
    database: 'atenea'
});


con.connect(function(err) {
    if (err) throw err;
    console.log('connected!');
});

//  CARGAMOS DATOS PERFIL ALUMNO
app.post('/perfil', function(req, res) {
    var id = req.body.idUsuario;
    console.log(id);
    con.query("SELECT alias, nombre, apellidos, fechaNacimiento, email, telefono, datosFacturacion, password, foto FROM tusuarios WHERE idUsuario='" + id + "'", function(err, result, fields) {
        //con.query("SELECT alias, nombre, apellidos, fechaNacimiento, email, telefono, datosFacturacion, password FROM tusuarios WHERE idUsuario=2", function(err, result, fields) {
        res.send(JSON.stringify(result));
        console.log(result)
    });
});

//  CARGAMOS DATOS PERFIL PROFE
app.post('/perfilProfe', function(req, res) {
    var id = req.body.idUsuario;
    console.log(id);
    con.query("SELECT alias, nombre, apellidos, fechaNacimiento, email, telefono, datosFacturacion, password, datosAcademicos, foto FROM tusuarios WHERE idUsuario='" + id + "'", function(err, result, fields) {
        //con.query("SELECT alias, nombre, apellidos, fechaNacimiento, email, telefono, datosFacturacion, password FROM tusuarios WHERE idUsuario=2", function(err, result, fields) {
        res.send(JSON.stringify(result));
        console.log(result);
    });
});

//  CARGAMOS DATOS PERFIL EMPRESA
app.post('/perfilEmpresa', function(req, res) {
    var id = req.body.idUsuario;
    console.log(id)
    con.query("SELECT alias, nombre, apellidos, fechaNacimiento, email, telefono, datosFacturacion, cif, foto password FROM tusuarios WHERE idUsuario='" + id + "'", function(err, result, fields) {
        //con.query("SELECT alias, nombre, apellidos, fechaNacimiento, email, telefono, datosFacturacion, password FROM tusuarios WHERE idUsuario=2", function(err, result, fields) {
        res.send(JSON.stringify(result));
        //console.log(result)
    });
});

//COGER ULTIMOS 5 CURSOS
app.post('/ultimos_cursos', function(req, res) {

    con.query("SELECT idCurso, titulo, precio, categoria, idioma_curso, imagen, fecha_inclusion FROM tcursos ORDER BY fecha_inclusion DESC LIMIT 5;", function(err, result, fields) {
        if (err) throw err;
        car_curso = '';
        for (var i = 0; i < result.length; i++) {
            car_curso += '<div class="item h-100 col-lg-4 align-self-stretch border boder-primary"><figure class="m-0"><a href="#"><img style ="width:100%" src="' + result[i].imagen + '" alt="Image" class="img-fluid"></a></figure><div class="py-4 px-4"><span class="course-price">' + result[i].precio + '</span><div class="meta"><span class="icon-clock-o"></span>' + result[i].fecha_inclusion + '</div><h3><a href="#" id="link_to_curso">' + result[i].titulo + '</a></h3><p>Lorem ipsum dolor sit amet ipsa nulla adipisicing elit. </p></div><div class="d-flex border-top stats"><div class="py-3 px-4">2,193 students</div><div class="py-3 px-4 w-25 ml-auto border-left"><span class="icon-chat"></span> 2</div></div></div>';
        };
        res.send(car_curso);
    })

});

app.post('/random_profes', function(req, res) {
    con.query("SELECT * FROM atenea.tUsuarios WHERE rol = 3", function(err, result, fields) {
        console.log(result.length);
        if (err) throw err;

        profesores = '';
        for (var i = 0; i < 3; i++) {
            console.log("hola!!!")
            profesores += '<div class="col-md-6 col-lg-4"><div class="profe_ficha text-center"><img id="foto_profe_1" src="' + result[i].foto + '" alt="Image" class="img-fluid w-50 rounded-circle mx-auto mb-4"><div class="py-2"><h3 class="nombre">' + result[i].nombre + ' ' + result[i].apellidos + '</h3> <p class="posicion">' + result[i].email + '</p><p class="bio">' + result[i].datosAcademicos + '</p></div></div></div>';

        };
        res.send(profesores);
        console.log(profesores);
        //res.end();
    })
});

app.post('/crear_usuario', function(req, res) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    var datos = req.body;
    var alias = datos.falias;
    console.log(alias);
    /*ANTES DE ENVIAR NADA ENCRIPTAMOS CONTRASEÑA, ACCEDIENDO A SU VALOR*/
    pass_noencriptada = datos.fpassword;
    var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
    var pass_encriptada = mykey.update(pass_noencriptada, 'utf8', 'hex');
    pass_encriptada += mykey.final('hex');
    console.log(pass_noencriptada);
    console.log(pass_encriptada);
    /*con.query("SELECT * FROM atenea.tUsuarios WHERE alias = '" + alias + "';", function(err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            console.log("Mierda");

            res.end('alias_existente');

        }
    });*/

    con.query("INSERT INTO tusuarios (rol, alias, nombre , apellidos ,  fechaNacimiento, email, telefono , datosFacturacion, password, datosAcademicos, validado ,fechaInscripcion) VALUES ('" + datos.frol + "','" + datos.falias + "','" + datos.fnombre + "', '" + datos.fapellidos + "', '" + datos.ffechaNacimiento + "','" + datos.femail + "', '" + datos.ftelefono + "', '" + datos.fdatosFacturacion + "', '" + pass_encriptada + "', '" + datos.fdatosAcademicos + "', '0' , '" + today + "')", function(err, result, fields) {
        if (err) throw err;
        console.log("metiendo alumno");
        //Devuelve la respusta (toda la tabla o los datos de un alumno
        res.send('¡Información actualizada con éxito!');
    });

});

app.post('/cargar_categorias', function(req, res) {
    con.query("SELECT * FROM atenea.tcategorias;", function(err, result, fields) {
        if (err) throw err;
        todascategorias = '<option>Selecciona una</option>';
        for (var i = 0; i < result.length; i++) {
            console.log('meto categoria' + result[i].categoria);
            todascategorias += '<option id="' + result[i].idtcategorias + '">' + result[i].categoria + '</option>';

        };

        res.send(todascategorias);
        console.log(todascategorias)

    })
});

app.post('/cargar_idiomas', function(req, res) {
    con.query("SELECT * FROM atenea.tidiomas;", function(err, result, fields) {
        if (err) throw err;
        todosidiomas = '<option>Selecciona uno</option>';
        for (var i = 0; i < result.length; i++) {
            console.log('meto idiomas' + result[i].idioma);
            todosidiomas += '<option id="' + result[i].ididiomas + '">' + result[i].idioma + '</option>';

        };
        res.send(todosidiomas);
        console.log(todosidiomas);
    })
});

app.post('/crear_curso', function(req, res) {
    /*SACO FECHA PARA FECHA INCLUSION*/
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    var datos = req.body;

    con.query("INSERT INTO tcursos (titulo, categoria, precio, idioma_curso, fecha_inclusion, descripcion, validado) VALUES ('" + datos.ftitulo + "','" + datos.fidcategoria + "','" + datos.fprecio + "','" + datos.fididioma + "','" + today + "','" + datos.fdescripcion + "','0');", function(err, result, fields) {
        if (err) throw err;
        var idnuevocurso = result.insertId;
        console.log(idnuevocurso);
        /*COMO LOS VIDEOS VAN EN OTRA TABLA, HAY QUE HACER UN BUCLE POR TODOS LOS VIDEOS PARA PODER METERLO*/
        console.log(datos.video.length);
        for (var i = 0; i < datos.video.length; i++) {
            var numeroleccion = i + 1;
            con.query("INSERT INTO tvideos(idcurso, url,leccion) VALUES('" + idnuevocurso + "','" + datos.video[i] + "','" + numeroleccion + "')", function(err, result, fields) {
                if (err) throw err;
            })
        }
        res.send();
    });
});

//LOG IN

app.post('/log_in', function(req, res) {

    var datos = req.body;
    var email = datos.login_email;
    con.query("SELECT validado FROM atenea.tUsuarios WHERE email= '" + email + "';", function(err, result, fields) {
        console.log('El valor de validado es '+result[0].validado);
        if (result[0].validado == 0) {
            res.send('no_validado');
        }
        var pass_noencriptada = datos.login_pass;
        var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
        var pass_encriptada = mykey.update(pass_noencriptada, 'utf8', 'hex');
        pass_encriptada += mykey.final('hex');
        con.query("SELECT idUsuario, rol, password FROM atenea.tUsuarios WHERE email = '" + email + "' AND password= '" + pass_encriptada + "';", function(err, result, fields) {
            if (result.length == 0) {
                res.send('pass_invalida');
            } else {
                var id = result[0].idUsuario;
                var rol = result[0].rol;
                console.log('!!!!!!!!!!!el ID es' + result[0].idUsuario);
                 console.log('!!!!!!!!!!!el ROL es' + result[0].rol);
                var data= { 'idUsuario': id, 'rol': rol };
                res.send(data);


            }

        });

    });
});


app.use(express.static('html'));


app.listen(8080, function() {
    console.log('Example app listening on port 8080!');
});

// JavaScript Document
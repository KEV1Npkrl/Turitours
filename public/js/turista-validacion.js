/**
 * Validacion de turistas — alineado con Catálogo 06 SUNAT
 * tipo_doc: DNI (1) | CE (4) | RUC (6) | Pasaporte (7) | OtroDoc (0 - emergencia)
 * documento: VARCHAR(15) según especificación SUNAT
 */
const TuristaValidacion = (function() {
    const LIMITS = {
        documento: 15,
        nombre: 60,
        apellidos: 80,
        email: 120,
        celular: 20
    };

    // Tipos de documento según Catálogo 06 SUNAT
    const TIPOS_DOC = ['DNI', 'CE', 'RUC', 'Pasaporte', 'OtroDoc'];

    // Reglas exactas según SUNAT Catálogo 06
    const REGLAS_DOCUMENTO = {
        DNI: {
            pattern: /^\d{8}$/,
            mensaje: 'El DNI debe tener exactamente 8 dígitos numéricos.',
            inputmode: 'numeric',
            maxlength: 8,
            placeholder: '12345678',
            catalogo06: '1'
        },
        RUC: {
            pattern: /^\d{11}$/,
            mensaje: 'El RUC debe tener exactamente 11 dígitos numéricos. Comienza con 10, 15, 17 o 20.',
            inputmode: 'numeric',
            maxlength: 11,
            placeholder: '20123456789',
            catalogo06: '6'
        },
        CE: {
            pattern: /^[A-Za-z0-9]{1,12}$/,
            mensaje: 'El Carné de Extranjería debe tener hasta 12 caracteres alfanuméricos.',
            inputmode: 'text',
            maxlength: 12,
            placeholder: '001234567',
            catalogo06: '4'
        },
        Pasaporte: {
            pattern: /^[A-Za-z0-9]{1,12}$/,
            mensaje: 'El Pasaporte debe tener hasta 12 caracteres alfanuméricos.',
            inputmode: 'text',
            maxlength: 12,
            placeholder: 'AB1234567',
            catalogo06: '7'
        },
        OtroDoc: {
            pattern: /^[A-Za-z0-9]{1,15}$/,
            mensaje: 'Documento Tributario No Domiciliado: hasta 15 caracteres. Usar solo si no tiene otro documento.',
            inputmode: 'text',
            maxlength: 15,
            placeholder: 'XXXXX',
            catalogo06: '0'
        }
    };

    function getReglaDocumento(tipoDoc) {
        return REGLAS_DOCUMENTO[tipoDoc] || REGLAS_DOCUMENTO.Pasaporte;
    }

    function validarDocumento(tipoDoc, documento) {
        const valor = (documento || '').trim();
        if (!valor) return 'El numero de documento es obligatorio.';
        if (valor.length > LIMITS.documento) {
            return 'El documento no puede superar ' + LIMITS.documento + ' caracteres.';
        }
        if (!TIPOS_DOC.includes(tipoDoc)) return 'Tipo de documento no valido.';
        const regla = getReglaDocumento(tipoDoc);
        if (!regla.pattern.test(valor)) return regla.mensaje;
        return null;
    }

    function validarNombre(nombre) {
        const valor = (nombre || '').trim();
        if (!valor) return 'Los nombres son obligatorios.';
        if (valor.length > LIMITS.nombre) {
            return 'Los nombres no pueden superar ' + LIMITS.nombre + ' caracteres.';
        }
        return null;
    }

    function validarApellidos(apellidos) {
        const valor = (apellidos || '').trim();
        if (!valor) return 'Los apellidos son obligatorios.';
        if (valor.length > LIMITS.apellidos) {
            return 'Los apellidos no pueden superar ' + LIMITS.apellidos + ' caracteres.';
        }
        return null;
    }

    function validarEmail(email) {
        const valor = (email || '').trim();
        if (!valor) return null;
        if (valor.length > LIMITS.email) {
            return 'El correo no puede superar ' + LIMITS.email + ' caracteres.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
            return 'Ingresa un correo electronico valido.';
        }
        return null;
    }

    function validarCelular(celular) {
        const valor = (celular || '').trim();
        if (!valor) return null;
        if (valor.length > LIMITS.celular) {
            return 'El celular no puede superar ' + LIMITS.celular + ' caracteres.';
        }
        if (!/^[+0-9()\s-]{6,20}$/.test(valor)) {
            return 'Ingresa un numero de celular valido.';
        }
        return null;
    }

    function validarPassword(password, obligatoria) {
        if (!password) {
            return obligatoria ? 'La contrasena es obligatoria para crear tu cuenta.' : null;
        }
        if (password.length < 6) return 'La contrasena debe tener al menos 6 caracteres.';
        return null;
    }

    function validarRegistro(datos) {
        const errores = {};

        const docErr = validarDocumento(datos.tipo_doc, datos.documento);
        if (docErr) errores.documento = docErr;

        const nomErr = validarNombre(datos.nombre);
        if (nomErr) errores.nombre = nomErr;

        const apeErr = validarApellidos(datos.apellidos);
        if (apeErr) errores.apellidos = apeErr;

        const emailErr = validarEmail(datos.email);
        if (emailErr) errores.email = emailErr;

        const celErr = validarCelular(datos.celular);
        if (celErr) errores.celular = celErr;

        const passErr = validarPassword(datos.password, true);
        if (passErr) errores.password = passErr;

        if (datos.password !== datos.confirmPassword) {
            errores.confirmPassword = 'Las contrasenas no coinciden.';
        }

        if (!datos.politica) {
            errores.politica = 'Debes aceptar la politica de privacidad.';
        }

        return {
            valido: Object.keys(errores).length === 0,
            errores
        };
    }

    function validarPerfil(datos) {
        const errores = {};

        const nomErr = validarNombre(datos.nombre);
        if (nomErr) errores.nombre = nomErr;

        const apeErr = validarApellidos(datos.apellidos);
        if (apeErr) errores.apellidos = apeErr;

        const emailErr = validarEmail(datos.email);
        if (emailErr) errores.email = emailErr;

        const celErr = validarCelular(datos.celular);
        if (celErr) errores.celular = celErr;

        const quiereCambiarPass = datos.password_nueva || datos.password_confirmar || datos.password_actual;
        if (quiereCambiarPass) {
            if (!datos.password_actual) {
                errores.password_actual = 'Ingresa tu contrasena actual.';
            }
            const passErr = validarPassword(datos.password_nueva, true);
            if (passErr) errores.password_nueva = passErr;
            if (datos.password_nueva !== datos.password_confirmar) {
                errores.password_confirmar = 'Las contrasenas nuevas no coinciden.';
            }
        }

        return {
            valido: Object.keys(errores).length === 0,
            errores
        };
    }

    return {
        LIMITS,
        TIPOS_DOC,
        REGLAS_DOCUMENTO,
        getReglaDocumento,
        validarDocumento,
        validarNombre,
        validarApellidos,
        validarEmail,
        validarCelular,
        validarPassword,
        validarRegistro,
        validarPerfil
    };
})();

if (typeof window !== 'undefined') {
    window.TuristaValidacion = TuristaValidacion;
}

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Obtener valores del formulario
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const phone = document.getElementById('phone').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const email = document.getElementById('email').value;

        // Validar contraseñas coincidentes
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        // Almacenar información en el localStorage
        const userData = {
            firstName,
            lastName,
            phone,
            username,
            password,
            email
        };

        localStorage.setItem('userData', JSON.stringify(userData));

        // Redirigir o realizar otras acciones según tus necesidades
        alert('Cuenta creada exitosamente. ¡Ahora puedes iniciar sesión!');
        window.location.href = '../index.html';
    });
});

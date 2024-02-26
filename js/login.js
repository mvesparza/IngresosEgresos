document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Obtener valores del formulario
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Obtener información almacenada en localStorage
        const storedUserData = JSON.parse(localStorage.getItem('userData'));

        // Verificar si las credenciales son correctas
        if (storedUserData && username === storedUserData.username && password === storedUserData.password) {
            // Redirigir a la página del sistema después de iniciar sesión
            window.location.href = 'sistema.html';
        } else {
            // Mostrar un mensaje de error (puedes personalizar según tus necesidades)
            alert('Usuario o contraseña incorrectos. Por favor, verifica tus credenciales.');
        }
    });
});

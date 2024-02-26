document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logout-btn');
    const agregarIngresoBtn = document.getElementById('agregarIngresoBtn');
    const agregarEgresoBtn = document.getElementById('agregarEgresoBtn');
    const reporteBtn = document.getElementById('reporte-btn');
    const totalIngresosElement = document.getElementById('totalIngresos');
    const totalEgresosElement = document.getElementById('totalEgresos');
    const movimientosTableBody = document.querySelector('#movimientos-table tbody');

    // Agregamos un objeto para almacenar los datos mensuales
    const reporteMensual = {
        ingresos: Array(12).fill(0),
        egresos: Array(12).fill(0),
        resultadoPorMes: Array(12).fill(0),
        saldoAcumulado: Array(12).fill(0),
    };

    logoutButton.addEventListener('click', function () {
        alert('Sesión cerrada exitosamente.');
        window.location.href = '../index.html';
    });

    agregarIngresoBtn.addEventListener('click', agregarIngreso);
    agregarEgresoBtn.addEventListener('click', agregarEgreso);
    reporteBtn.addEventListener('click', generarReporteMensual);

    function agregarIngreso() {
    const autoFecha = document.getElementById('autoFechaIngreso').checked;
    const fecha = autoFecha ? obtenerFechaActual() : document.getElementById('fechaIngreso').value;
    const mes = new Date(fecha).getMonth(); // Obtén el número de mes (0-11)
    const descripcion = document.getElementById('descripcionIngreso').value;
    const monto = parseFloat(document.getElementById('montoIngreso').value);

    if (!isNaN(monto)) {
        const totalIngresos = parseFloat(totalIngresosElement.textContent) + monto;
        totalIngresosElement.textContent = totalIngresos.toFixed(2);

        agregarMovimiento(fecha, descripcion, monto, 'Ingreso');
    } else {
        alert('Ingrese un monto válido.');
    }
}

function agregarEgreso() {
        const autoFecha = document.getElementById('autoFechaEgreso').checked;
        const fecha = autoFecha ? obtenerFechaActual() : document.getElementById('fechaEgreso').value;
    const mes = new Date(fecha).getMonth(); // Obtén el número de mes (0-11)
    const descripcion = document.getElementById('descripcionEgreso').value;
    const monto = parseFloat(document.getElementById('montoEgreso').value);

    if (!isNaN(monto)) {
        const totalEgresos = parseFloat(totalEgresosElement.textContent) + monto;
        totalEgresosElement.textContent = totalEgresos.toFixed(2);

        agregarMovimiento(fecha, descripcion, monto, 'Egreso');
    } else {
        alert('Ingrese un monto válido.');
    }
}


    function agregarMovimiento(fecha, descripcion, monto, tipo) {
        const fechaMostrar = fecha === 'auto' ? obtenerFechaActual() : fecha;

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${fechaMostrar}</td>
            <td>${obtenerNombreMes(new Date(fechaMostrar).getMonth())}</td>
            <td>${descripcion}</td>
            <td>${monto.toFixed(2)}</td>
            <td>${tipo}</td>
            <td>${tipo === 'Ingreso' ? document.getElementById('personaIngreso').value : document.getElementById('personaEgreso').value}</td>
            <td><button class="borrar-btn" onclick="borrarFila(this)">Borrar Item</button></td>
        `;

        movimientosTableBody.appendChild(newRow);
        actualizarReporteMensual();
    }

    // Función para obtener la fecha actual en formato 'YYYY-MM-DD'
    function obtenerFechaActual() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }



    function generarReporteMensual() {
    // Calcula y muestra el reporte mensual en una nueva pestaña
    const reporteWindow = window.open('', '_blank');
    reporteWindow.document.write('<html><head><title>Reporte Mensual</title>');
    reporteWindow.document.write('<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>');
    reporteWindow.document.write('</head><body>');

    // Botón de impresión
    reporteWindow.document.write('<button onclick="imprimirReporte()">Imprimir</button>');

    // Datos Mensuales
    reporteWindow.document.write('<div>');
    reporteWindow.document.write('<h2>Datos Mensuales</h2>');
    reporteWindow.document.write('<table border="1">');
    reporteWindow.document.write('<tr><th>Mes</th><th>Ingresos</th><th>Egresos</th><th>Resultado por Mes</th><th>Saldo Acumulado</th></tr>');

    for (let i = 0; i < 12; i++) {
        reporteWindow.document.write(`<tr><td>${obtenerNombreMes(i)}</td>`);
        reporteWindow.document.write(`<td>${reporteMensual.ingresos[i].toFixed(2)}</td>`);
        reporteWindow.document.write(`<td>${reporteMensual.egresos[i].toFixed(2)}</td>`);
        reporteWindow.document.write(`<td>${reporteMensual.resultadoPorMes[i].toFixed(2)}</td>`);
        reporteWindow.document.write(`<td>${reporteMensual.saldoAcumulado[i].toFixed(2)}</td></tr>`);
    }

    reporteWindow.document.write('</table>');
    reporteWindow.document.write('</div>');

    // Tabla de Detalle
    reporteWindow.document.write('<div>');
    reporteWindow.document.write('<h2>Tabla de Detalle</h2>');
    reporteWindow.document.write('<table border="1">');
    reporteWindow.document.write('<tr><th>Persona</th><th>Descripción</th><th>Monto</th><th>Fecha</th><th>Tipo</th></tr>');

    // Ciclo para recorrer las filas de la tabla de movimientos y agregar los datos a la nueva tabla
    document.querySelectorAll('#movimientos-table tbody tr').forEach(function (row) {
        const persona = row.children[5].textContent;
        const descripcion = row.children[2].textContent;
        const monto = row.children[3].textContent;
        const fecha = row.children[0].textContent;
		const tipo = row.children[4].textContent;

        // Agrega una nueva fila a la tabla de detalle
        reporteWindow.document.write(`<tr><td>${persona}</td><td>${descripcion}</td><td>${monto}</td><td>${fecha}</td><td>${tipo}</td></tr>`);
    });

    reporteWindow.document.write('</table>');
    reporteWindow.document.write('</div>');

    // Gráficos
    reporteWindow.document.write('<div>');

    // Gráfico Ingresos vs Egresos
    reporteWindow.document.write('<h2>Gráfico Ingresos vs Egresos</h2>');
    reporteWindow.document.write('<canvas id="ingresosEgresosChart" width="400" height="200"></canvas>');

    // Gráfico Saldo Acumulado
    reporteWindow.document.write('<h2>Gráfico Saldo Acumulado</h2>');
    reporteWindow.document.write('<canvas id="saldoAcumuladoChart" width="400" height="200"></canvas>');

    reporteWindow.document.write('</div>');

    // Agrega scripts para inicializar los gráficos
    reporteWindow.document.write('<script>');
    reporteWindow.document.write('var ctxIngresosEgresos = document.getElementById("ingresosEgresosChart").getContext("2d");');
    reporteWindow.document.write('var ingresosEgresosChart = new Chart(ctxIngresosEgresos, {');
    reporteWindow.document.write('type: "bar",');
    reporteWindow.document.write('data: {');
    reporteWindow.document.write('labels: ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"],');
    reporteWindow.document.write('datasets: [');
    reporteWindow.document.write('{');
    reporteWindow.document.write('label: "Ingresos",');
    reporteWindow.document.write('data: [' + reporteMensual.ingresos.join(', ') + '],');
    reporteWindow.document.write('backgroundColor: "rgba(75, 192, 192, 0.2)",');
    reporteWindow.document.write('borderColor: "rgba(75, 192, 192, 1)",');
    reporteWindow.document.write('borderWidth: 1');
    reporteWindow.document.write('},');
    reporteWindow.document.write('{');
    reporteWindow.document.write('label: "Egresos",');
    reporteWindow.document.write('data: [' + reporteMensual.egresos.join(', ') + '],');
    reporteWindow.document.write('backgroundColor: "rgba(255, 99, 132, 0.2)",');
    reporteWindow.document.write('borderColor: "rgba(255, 99, 132, 1)",');
    reporteWindow.document.write('borderWidth: 1');
    reporteWindow.document.write('}');
    reporteWindow.document.write(']');
    reporteWindow.document.write('},');
    reporteWindow.document.write('options: {');
    reporteWindow.document.write('scales: {');
    reporteWindow.document.write('y: {');
    reporteWindow.document.write('beginAtZero: true');
    reporteWindow.document.write('}');
    reporteWindow.document.write('}');
    reporteWindow.document.write('}');
    reporteWindow.document.write('});');
    reporteWindow.document.write('</script>');

    reporteWindow.document.write('<script>');
    reporteWindow.document.write('var ctxSaldoAcumulado = document.getElementById("saldoAcumuladoChart").getContext("2d");');
    reporteWindow.document.write('var saldoAcumuladoChart = new Chart(ctxSaldoAcumulado, {');
    reporteWindow.document.write('type: "line",');
    reporteWindow.document.write('data: {');
    reporteWindow.document.write('labels: ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"],');
    reporteWindow.document.write('datasets: [');
    reporteWindow.document.write('{');
    reporteWindow.document.write('label: "Saldo Acumulado",');
    reporteWindow.document.write('data: [' + reporteMensual.saldoAcumulado.join(', ') + '],');
    reporteWindow.document.write('borderColor: "rgba(75, 192, 192, 1)",');
    reporteWindow.document.write('borderWidth: 2,');
    reporteWindow.document.write('fill: false');
    reporteWindow.document.write('}');
    reporteWindow.document.write(']');
    reporteWindow.document.write('},');
    reporteWindow.document.write('options: {');
    reporteWindow.document.write('scales: {');
    reporteWindow.document.write('y: {');
    reporteWindow.document.write('beginAtZero: false');
    reporteWindow.document.write('}');
    reporteWindow.document.write('}');
    reporteWindow.document.write('}');
    reporteWindow.document.write('});');
    reporteWindow.document.write('</script>');

    reporteWindow.document.write('<script>');
    reporteWindow.document.write('function imprimirReporte() {');
    reporteWindow.document.write('window.print();');
    reporteWindow.document.write('}');
    reporteWindow.document.write('</script>');

    reporteWindow.document.write('</body></html>');
    reporteWindow.document.close();
}



    function actualizarReporteMensual() {
        // Reinicia los datos del reporte mensual
        for (let i = 0; i < 12; i++) {
            reporteMensual.ingresos[i] = 0;
            reporteMensual.egresos[i] = 0;
            reporteMensual.resultadoPorMes[i] = 0;
            reporteMensual.saldoAcumulado[i] = 0;
        }

        // Recorre las filas de la tabla de movimientos
        document.querySelectorAll('#movimientos-table tbody tr').forEach(function (row) {
            const fecha = new Date(row.children[0].textContent);
            const mes = fecha.getMonth(); // Obtén el número de mes (0-11)

            const monto = parseFloat(row.children[3].textContent);
            const tipo = row.children[4].textContent;

            if (tipo === 'Ingreso') {
                reporteMensual.ingresos[mes] += monto;
            } else if (tipo === 'Egreso') {
                reporteMensual.egresos[mes] += monto;
            }
        });

        // Calcula el resultado por mes y el saldo acumulado
        let saldoAcumulado = 0;
        for (let i = 0; i < 12; i++) {
            reporteMensual.resultadoPorMes[i] = reporteMensual.ingresos[i] - reporteMensual.egresos[i];
            saldoAcumulado += reporteMensual.resultadoPorMes[i];
            reporteMensual.saldoAcumulado[i] = saldoAcumulado;
        }
    }

    function obtenerNombreMes(numeroMes) {
        const meses = [
            'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
            'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
        ];
        return meses[numeroMes];
    }

    window.borrarFila = function (btn) {
        const row = btn.closest('tr');
        const monto = parseFloat(row.children[3].textContent);
        const tipo = row.children[4].textContent;

        if (tipo === 'Ingreso') {
            totalIngresosElement.textContent = (parseFloat(totalIngresosElement.textContent) - monto).toFixed(2);
        } else if (tipo === 'Egreso') {
            totalEgresosElement.textContent = (parseFloat(totalEgresosElement.textContent) - monto).toFixed(2);
        }

        row.remove();

        // Actualiza el reporte mensual al borrar un movimiento
        actualizarReporteMensual();
    };

    window.onscroll = function () {
        mostrarOcultarBoton();
    };

    function mostrarOcultarBoton() {
        const botonVolverArriba = document.getElementById('volver-arriba-btn');
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            botonVolverArriba.style.display = 'block';
        } else {
            botonVolverArriba.style.display = 'none';
        }
    }

    window.scrollToTop = function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };
});
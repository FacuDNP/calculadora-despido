
function redondear(valor) {
  return Math.round(valor);
}

function calcularAntiguedad(fechaIngreso, fechaDespido) {
  let anios = fechaDespido.getFullYear() - fechaIngreso.getFullYear();
  let meses = fechaDespido.getMonth() - fechaIngreso.getMonth();
  let dias = fechaDespido.getDate() - fechaIngreso.getDate();

  if (meses < 0 || (meses === 0 && dias < 0)) {
    anios--;
    meses += 12;
  }
  if (dias < 0) {
    meses--;
  }

  return meses >= 3 ? anios + 1 : anios;
}

function calcularIndemnizacion() {
  const fechaIngreso = new Date(document.getElementById('fechaIngreso').value);
  const fechaDespido = new Date(document.getElementById('fechaDespido').value);
  const sueldo = parseFloat(document.getElementById('sueldo').value);
  const aplicaArt1 = document.getElementById('multaArt1').checked;
  const aplicaArt2 = document.getElementById('multaArt2').checked;
  const aplicaArt80 = document.getElementById('multaArt80').checked;

  if (isNaN(fechaIngreso) || isNaN(fechaDespido) || isNaN(sueldo)) {
    alert('Completá todos los campos correctamente.');
    return;
  }

  const antigCalc = calcularAntiguedad(fechaIngreso, fechaDespido);
  const antigAnios = (fechaDespido - fechaIngreso) / (1000 * 60 * 60 * 24 * 365);
  const sueldoDiario = sueldo / 30;
  const sueldoSemestral = sueldo / 2;

  const art245 = redondear(antigCalc * sueldo);
  const preaviso = redondear(antigAnios < 5 ? sueldo : sueldo * 2);
  const sacPreaviso = redondear(preaviso / 12);

  const diasDelMes = new Date(fechaDespido.getFullYear(), fechaDespido.getMonth() + 1, 0).getDate();
  const diasTrabajados = fechaDespido.getDate();
  const diasTrabajadosMes = diasTrabajados < diasDelMes ? redondear(sueldoDiario * diasTrabajados) : 0;

  const integracionMesDespido = redondear(sueldo);
  const sacIntegracion = redondear(integracionMesDespido / 12);
  const sacProporcional = redondear(sueldoSemestral / 6);

  const diasVacProp = antigAnios < 0.5 ? 0 : antigAnios < 5 ? 14 : antigAnios < 10 ? 21 : antigAnios < 20 ? 28 : 35;
  const mesesTrabajadosEnAnio = fechaDespido.getMonth() + 1;
  const vacacionesNoGozadasDias = diasVacProp;
  const vacacionesNoGozadas = redondear(sueldoDiario * vacacionesNoGozadasDias);
  const sacVacaciones = redondear(vacacionesNoGozadas / 12);
  const vacacionesProporcionales = redondear(sueldoDiario * (diasVacProp * mesesTrabajadosEnAnio / 12));
  const sacVacacionesProporcionales = redondear(vacacionesProporcionales / 12);

  let totalBasico = art245 + preaviso + sacPreaviso + diasTrabajadosMes + integracionMesDespido + sacIntegracion + sacProporcional + vacacionesNoGozadas + sacVacaciones + vacacionesProporcionales + sacVacacionesProporcionales;

  let multa1 = aplicaArt1 ? redondear(art245 * 0.5) : 0;
  let multa2 = aplicaArt2 ? redondear(art245) : 0;
  let multa80 = aplicaArt80 ? redondear(sueldo * 3) : 0;

  let totalFinal = redondear(totalBasico + multa1 + multa2 + multa80);

  let resultadoHTML = `
    Antigüedad Art. 245: $ ${art245}<br>
    Sustitutiva de Preaviso: $ ${preaviso}<br>
    SAC Preaviso: $ ${sacPreaviso}<br>`;

  if (diasTrabajados < diasDelMes) {
    resultadoHTML += `Días trabajados del Mes: $ ${diasTrabajadosMes}<br>`;
  }

  resultadoHTML += `
    Integración mes de Despido: $ ${integracionMesDespido}<br>
    SAC Integración mes de Despido: $ ${sacIntegracion}<br>
    SAC Proporcional: $ ${sacProporcional}<br>
    Vacaciones no Gozadas: $ ${vacacionesNoGozadas}<br>
    SAC Vacaciones no Gozadas: $ ${sacVacaciones}<br>
    Vacaciones Proporcionales: $ ${vacacionesProporcionales}<br>
    SAC Vacaciones Proporcionales: $ ${sacVacacionesProporcionales}<br>
    Multa Art. 1 Ley 25.323: $ ${multa1}<br>
    Multa Art. 2 Ley 25.323: $ ${multa2}<br>
    Multa Art. 80 LCT: $ ${multa80}<br>
    <br><strong>Total Final: $ ${totalFinal}</strong>`;

  document.getElementById('resultado').innerHTML = resultadoHTML;
}

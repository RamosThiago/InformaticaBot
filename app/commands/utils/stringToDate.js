/* Espera un string de formato 'DD/MM/YYYY HH:MM' para convertirlo en un Date
Si llega un string indebido se lo filtra con regex y verificando que retorne una fecha valida*/

function stringToDate(fecha) {
  if (!fecha) return null;

  // Si tiene el formato correcto retorna el array con el string completo y cada grupo
  const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;
  const matches = fecha.match(regex);

  if (!matches) return null;

  // Descarto el string completo
  const [, dia, mes, año, hora, minuto] = matches;

  // Valido que me retorne una fecha valida
  const date = new Date(`${año}-${mes}-${dia}T${hora}:${minuto}:00`);
  if (isNaN(date.getTime())) return null;

  return date;
}

module.exports = stringToDate;

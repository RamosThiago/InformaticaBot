export const materiasData = {
  primero: [
    { name: "EPA", id: 134 },
    { name: "COC", id: 138 },
    { name: "MAT0", id: 144 },
    { name: "CADP (1º)", id: 167 },
    { name: "OC (1º)", id: 61 },
    { name: "MAT1 (1º)", id: 62 },
    { name: "Taller de Programacion (2º)", id: 174 },
    { name: "ARQ (2º)", id: 63 },
    { name: "MAT2 (2º)", id: 64 },
    {
      name: "Redictado - CADP (2º)",
      id: 227,
    },
    { name: "Redictado - MAT2 (1º)", id: 235 },
    { name: "Redictado - Taller de Programacion (1º)", id: 242 },
    { name: "Redictado - OC (2º)", id: 126 },
    { name: "Redictado - MAT1 (2º)", id: 121 },
  ],
  segundo: [
    { name: "FOD (1º)", id: 178 },
    { name: "AyED (1º)", id: 65 },
    { name: "Seminario .NET (1º)", id: 74 },
    { name: "Seminario Android (1º)", id: 188 },
    { name: "Seminario Go (1º)", id: 312 },
    { name: "Seminario PHP (1º)", id: 73 },
    { name: "Seminario Python (1º)", id: 75 },
    { name: "Seminario Rust (1º)", id: 313 },
    { name: "Seminario JS (1º)", id: 305 },
    { name: "DBD (2º)", id: 179 },
    { name: "Ing. Software 1 (2º)", id: 67 },
    { name: "OO1 (2º)", id: 68 },
    { name: "ISO (2º)", id: 69 },
    {
      name: "Taller de ingles (2º)",
      id: 81,
    },
    { name: "Redictado - DBD (1º)", id: 232 },
    { name: "Redictado - Ing. de Software 1 (1º)", id: 247 },
    { name: "Redictado - OO1 (1º)", id: 157 },
    { name: "Redictado - ISO (1º)", id: 233 },
    { name: "Redictado - FOD (2º)", id: 243 },
    { name: "Redictado - AyED (2º)", id: 160 },
    { name: "Redictado - Seminario .NET (2º)", id: 184 },
    {
      name: "Redictado - Seminario PHP (2º)",
      id: 181,
    },
  ],
  tercero: [
    { name: "MAT3 (1º)", id: 66 },
    { name: "Ing. de Software 2 (1º)", id: 76 },
    {
      name: "Conceptos y Paradigmas de Prog. (1º)",
      id: 82,
    },
    { name: "OO2 (1º)", id: 77 },
    { name: "Redes y Comunicaciones (1º)", id: 41 },
    { name: "Prog. Concurrente (2º)", id: 78 },
    { name: "Proyecto de Software (2º)", id: 79 },
    { name: "Computabilidad y Complejidad (2º)", id: 32 },
    { name: "Redictado - Prog. Concurrente (1º)", id: 292 },
    { name: "Redictado - Proyecto de Software (1º)", id: 293 },
    { name: "Redictado - MAT3 (2º)", id: 127 },
    {
      name: "Redictado - Conceptos y Paradigmas de Prog. (2º)",
      id: 317,
    },
    { name: "Redictado - OO2 (2º)", id: 237 },
  ],
  cuarto: [
    {
      name: "Teoria de la Computacion y Verif. de Programas (1º)",
      id: 30,
    },
    { name: "Sistemas Operativos (1º)", id: 18 },
    { name: "Sistemas Paralelos (1º)", id: 38 },
    { name: "Logica e IA (2º)", id: 201 },
    { name: "MAT4 (2º)", id: 122 },
    { name: "Laboratorio de Software (2º)", id: 27 },
    { name: "Prog. Distribuida y Tiempo Real (2º)", id: 206 },
    { name: "Redictado - Logica e IA (1º)", id: 200 },
    { name: "Redictado - MAT4 (1º)", id: 236 },
  ],
  quinto: [
    { name: "Diseño de Experiencia de Usuario (1º)", id: 195 },
    {
      name: "Aspectos Et. Soc. y Prof. (1º)",
      id: 315,
    },
  ],
  otras: [
    { name: "Programacion Concurrente ATIC (1º)", id: 238 },
    { name: "Web Semantica y Grafos de Conoc. (1º)", id: 89 },
    { name: "Tecnologia, Ambiente y Soc. (1º)", id: 169 },
    { name: "Taller de Prog. Orientada a Objetos 1 (1º)", id: 96 },
    { name: "Aspectos Leg. y Prof. (1º)", id: 50 },
    { name: "Redes y Servicios Avanzados (1º)", id: 199 },
    { name: "Procesamiento de Imagenes Digitales (1º)", id: 302 },
    { name: "Bases de Datos 1 (2º)", id: 56 },
    { name: "Metodos Agiles para App. Web (2º)", id: 289 },
    { name: "Prog. Funcional (2º)", id: 14 },
    { name: "Prog. Lógica (2º)", id: 85 },
    { name: "Seguridad y Privacidad en Redes (2º)", id: 47 },
    { name: "Taller de Prog. sobre GPU (2º)", id: 208 },
    { name: "Cloud Computing y Cloud Robotics (2º)", id: 249 },
    { name: "Conceptos y Aplicaciones de Big Data (2º)", id: 203 },
    {
      name: "Tecnologias Aplicadas para Business Intelligence (2º)",
      id: 131,
    },
    { name: "Teoría de Grafos (2º)", id: 93 },
    {
      name: "Deep Learning (2º)",
      id: 295,
    },
    { name: "Redictado - Prog Func. (1º)", id: 239 },
    { name: "Redictado - Prog Log. (1º)", id: 240 },
  ],
};

export async function fetchAdvertises(id) {
  const url =
    `https://gestiondocente.info.unlp.edu.ar/cartelera/data/0/${1000}?idMateria=` +
    id;
  const headers = {
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "es-419,es;q=0.9",
    Connection: "keep-alive",
    Cookie: "PHPSESSID=lqfucg1si4gjqvkdg3h79oan1c",
    Host: "gestiondocente.info.unlp.edu.ar",
    Referer: "https://gestiondocente.info.unlp.edu.ar/cartelera/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "Sec-GPC": "1",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
    "sec-ch-ua": '"Not)A;Brand";v="99", "Brave";v="127", "Chromium";v="127"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

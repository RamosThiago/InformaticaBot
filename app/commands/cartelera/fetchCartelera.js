async function fetchPosts(id, amount = 10000) {
  if (amount === null) {
    amount = 10000;
  }

  const url =
    `https://gestiondocente.info.unlp.edu.ar/cartelera/data/0/${amount}?idMateria=` +
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

module.exports = fetchPosts;

// Só dígitos: 55 + DDD + número
const WHATSAPP_NUMBER = "557335311308";

const WHATSAPP_MESSAGE = "Olá! Gostaria de fazer um orçamento.";

window.SITE_CONFIG = {
  storeName: "Madeireira Lima",
  slogan: "Construindo com Você",

  whatsapp: {
    number: WHATSAPP_NUMBER,
    message: WHATSAPP_MESSAGE,
    display: "(73) 3531-1308",
  },

  address: {
    street: "AV. Lauro de freitas, 1340",
    district: "Lauro de freitas",
    city: "Ipiaú",
    state: "BA",
    zip: "",
  },

  map: {
    lat: -14.132274716323222,
    lng: -39.75144253038328,
    zoom: 16,
  },

  // days: 0 = domingo ... 6 = sábado
  hours: [
    {
      label: "Segunda a sexta",
      short: "Seg – Sex",
      days: [1, 2, 3, 4, 5],
      open: "08:00",
      close: "18:00",
    },
    {
      label: "Sábado",
      short: "Sábado",
      days: [6],
      open: "08:00",
      close: "12:00",
    },
  ],
  timezone: "America/Bahia",

  // Deixe "" para não exibir
  social: {
    instagram: "https://www.instagram.com/madeireiralimaipiau/",
    facebook: "",
  },
};

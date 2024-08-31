import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { materiasData } from "../Fetch/fetchCartelera.js";
dotenv.config();

const commands = [
  {
    name: "cartelera",
    description: "Ver cartelera virtual",
    options: [
      {
        name: "general",
        description: "Cartelera de todas las materias",
        type: 1, // SUB_COMMAND
        value: "0",
      },
      {
        name: "primero",
        description: "Primer año",
        type: 1, // SUB_COMMAND
        options: [
          {
            name: "materia",
            description: "Selecciona una materia",
            required: true,
            type: 3, // STRING
            choices: materiasData.primero.map((materia) => {
              return { name: materia.name, value: materia.id.toString() };
            }),
          },
        ],
      },
      {
        name: "segundo",
        description: "Segundo año",
        type: 1, // SUB_COMMAND
        options: [
          {
            name: "materia",
            description: "Selecciona una materia",
            required: true,
            type: 3, // STRING
            choices: materiasData.segundo.map((materia) => {
              return { name: materia.name, value: materia.id.toString() };
            }),
          },
        ],
      },
      {
        name: "tercero",
        description: "Tercer año",
        type: 1, // SUB_COMMAND
        options: [
          {
            name: "materia",
            description: "Selecciona una materia",
            required: true,
            type: 3, // STRING
            choices: materiasData.tercero.map((materia) => {
              return { name: materia.name, value: materia.id.toString() };
            }),
          },
        ],
      },
      {
        name: "cuarto",
        description: "Cuarto año",
        type: 1, // SUB_COMMAND
        options: [
          {
            name: "materia",
            description: "Selecciona una materia",
            required: true,
            type: 3, // STRING
            choices: materiasData.cuarto.map((materia) => {
              return { name: materia.name, value: materia.id.toString() };
            }),
          },
        ],
      },
      {
        name: "quinto",
        description: "Quinto año",
        type: 1, // SUB_COMMAND
        options: [
          {
            name: "materia",
            description: "Selecciona una materia",
            required: true,
            type: 3, // STRING
            choices: materiasData.quinto.map((materia) => {
              return { name: materia.name, value: materia.id.toString() };
            }),
          },
        ],
      },
      {
        name: "otras",
        description: "Otras materias",
        type: 1, // SUB_COMMAND
        options: [
          {
            name: "materia",
            description: "Selecciona una materia",
            required: true,
            type: 3, // STRING
            choices: materiasData.otras.map((materia) => {
              return { name: materia.name, value: materia.id.toString() };
            }),
          },
        ],
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
    console.log("Slash commands registered successfully");
  } catch (error) {
    console.log(`${error}`);
  }
})();

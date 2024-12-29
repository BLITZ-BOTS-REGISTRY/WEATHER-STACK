import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';

const API_KEY = '60dbcfbfa6c6fe8565a1e1022b9582a9';

async function getWeather(location: string): Promise<string> {
  try {
    const response = await axios.get(`http://api.weatherstack.com/current`, {
      params: {
        access_key: API_KEY,
        query: location,
      },
    });

    if (response.data.success === false) {
      throw new Error(response.data.error.info);
    }

    const weather = response.data.current;
    return `The current weather in ${location} is:
      - Temperature: ${weather.temperature}°C
      - Weather: ${weather.weather_descriptions[0]}
      - Wind Speed: ${weather.wind_speed} km/h
      - Humidity: ${weather.humidity}%`;
  } catch (error) {
    console.error('Error:', error);
    throw new Error(error.response ? error.response.data.error : error.message);
  }
}
export default {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Get the current weather of a location')
    .addStringOption(option =>
      option.setName('location')
        .setDescription('Location to get the weather for')
        .setRequired(true)
    ),

  action: async (client, interaction) => {
    const location = interaction.options.getString('location') as string;

    try {
      const weatherInfo = await getWeather(location);
      await interaction.reply(weatherInfo);
    } catch (error) {
      await interaction.reply(`Error: ${error.message}`);
    }
  },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date'); // Format: 2025-06-15
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  
  if (!date) {
    return Response.json({ error: 'Date requise' }, { status: 400 });
  }

  try {    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${date}&end_date=${date}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=Europe/Paris`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.daily) {
      return Response.json({
        date: data.daily.time[0],
        tempMax: data.daily.temperature_2m_max[0],
        tempMin: data.daily.temperature_2m_min[0],
        precipitation: data.daily.precipitation_sum[0],
        weatherCode: data.daily.weathercode[0],
        description: getWeatherDescription(data.daily.weathercode[0])
      });
    }
    
    return Response.json({ error: 'Données non disponibles pour cette date' }, { status: 404 });
  } catch (error) {
    return Response.json({ error: 'Erreur API météo' + error }, { status: 500 });
  }
}

function getWeatherDescription(code: number): string {
  const weatherCodes: { [key: number]: string } = {
    0: 'Ciel dégagé ☀️',
    1: 'Principalement dégagé 🌤️',
    2: 'Partiellement nuageux ⛅',
    3: 'Couvert ☁️',
    45: 'Brouillard 🌫️',
    48: 'Brouillard givrant 🌫️',
    51: 'Bruine légère 🌦️',
    61: 'Pluie légère 🌧️',
    63: 'Pluie modérée 🌧️',
    65: 'Pluie forte 🌧️',
    80: 'Averses légères 🌦️',
    95: 'Orage ⛈️',
  };
  return weatherCodes[code] || 'Inconnu';
}
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const apiKey = process.env.SPOONACULAR_API_KEY;

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  if (!apiKey) {
    console.error('SPOONACULAR_API_KEY is missing from environment variables');
    return NextResponse.json({ error: 'Food search service is not configured' }, { status: 503 });
  }

  try {
    // search for recipes/foods
    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
      params: {
        query,
        addRecipeNutrition: true,
        number: 8,
        apiKey
      }
    });

    if (!response.data || !response.data.results) {
      console.error('Spoonacular API Unexpected Response:', response.data);
      return NextResponse.json({ error: 'Unexpected response from food service' }, { status: 502 });
    }

    const results = response.data.results.map(item => {
      const nutrition = item.nutrition?.nutrients || [];
      const getNutrient = (name) => nutrition.find(n => n.name === name)?.amount || 0;

      return {
        id: item.id?.toString() || Math.random().toString(),
        label: item.title || 'Unknown Food',
        image: item.image || 'https://via.placeholder.com/300?text=No+Image',
        calories: getNutrient('Calories'),
        protein: getNutrient('Protein'),
        carbs: getNutrient('Net Carbohydrates') || getNutrient('Carbohydrates'),
        fat: getNutrient('Fat'),
        vitamins: nutrition.filter(n => n.name.includes('Vitamin')).slice(0, 2).map(n => n.name),
        minerals: nutrition.filter(n => ['Iron', 'Calcium', 'Magnesium', 'Potassium'].includes(n.name)).slice(0, 2).map(n => n.name)
      };
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Spoonacular API Error:', {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status
    });
    
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to fetch food data';
    
    return NextResponse.json({ error: message }, { status });
  }
}

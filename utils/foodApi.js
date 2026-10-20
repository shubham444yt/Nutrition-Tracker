"use client";

import axios from "axios";

export const searchFood = async (query) => {
  if (!query) return [];

  try {
    const response = await axios.get(`/api/food/search?query=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error searching food:", error);
    // Return structured error instead of empty array to allow UI feedback
    return { 
      error: error.response?.data?.error || error.message || "Failed to search food",
      status: error.response?.status 
    };
  }
};

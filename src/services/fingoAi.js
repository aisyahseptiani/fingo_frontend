const API_BASE = "https://mes1205-fingo.hf.space";

export const predictIncomeAi = async (income_history) => {
  try {
    const response = await fetch(`${API_BASE}/predict/income`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Berdasarkan API, income_history butuh array 12 nilai (float/int)
      body: JSON.stringify({ income_history }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error predicting income:", error);
    throw error;
  }
};

export const chatWithAi = async (user_message, financial_context) => {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_message,
        financial_context,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error chatting with Fingo AI:", error);
    throw error;
  }
};

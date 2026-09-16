import 'dotenv/config';

async function testConnection() {
  console.log("Probando conexión a OpenAI...");
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ ERROR: No se encontró OPENAI_API_KEY en el archivo .env");
    return;
  }
  
  if (apiKey.includes("your_openai_api_key") || apiKey === "sk-tu-clave-secreta-aqui") {
    console.error("❌ ERROR: Aún tienes el valor de ejemplo en tu .env. Debes poner tu clave real (empieza con sk-...).");
    return;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });

    if (response.ok) {
      console.log("✅ ¡Conexión exitosa! Tu API Key de OpenAI es completamente válida y está funcionando.");
    } else {
      const errorData = await response.json();
      console.error("❌ Error en la API Key:");
      console.error(errorData.error?.message || response.statusText);
      console.log("\nRevisa que la clave esté bien copiada y que tu cuenta tenga saldo disponible.");
    }
  } catch (error) {
    console.error("❌ Error inesperado:", error.message);
  }
}

testConnection();

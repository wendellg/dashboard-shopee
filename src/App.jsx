import React from "react";

export default function ShopeeCalculator() {
  const calculatePrice = (desired) => {
    const value = parseFloat(desired);

    if (!value || value <= 0) {
      return { price: "-", fee: "-", rule: "-" };
    }

    let finalPrice = 0;
    let fee = 0;
    let rule = "";

    // Até R$8 → 50%
    const faixa1 = value / 0.5;

    if (faixa1 <= 8) {
      finalPrice = faixa1;
      fee = finalPrice * 0.5;
      rule = "50% de comissão";
    } else {
      // Até R$79 → 20% + R$4
      const faixa2 = (value + 4) / 0.8;

      if (faixa2 <= 79) {
        finalPrice = faixa2;
        fee = finalPrice * 0.2 + 4;
        rule = "20% + R$4";
      } else {
        // Até R$99,99 → 14% + R$16
        const faixa3 = (value + 16) / 0.86;

        finalPrice = faixa3;
        fee = finalPrice * 0.14 + 16;
        rule = "14% + R$16";
      }
    }

    return {
      price: finalPrice.toFixed(2),
      fee: fee.toFixed(2),
      rule,
    };
  };

  const [desiredValue, setDesiredValue] = React.useState("");
  const result = calculatePrice(desiredValue);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f4f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>
          Calculadora Shopee
        </h1>

        <p style={{ color: "#666", marginBottom: "20px" }}>
          Digite quanto deseja receber:
        </p>

        <input
          type="number"
          placeholder="0.00"
          value={desiredValue}
          onChange={(e) => setDesiredValue(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "20px",
            borderRadius: "12px",
            border: "1px solid #ccc",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        <div
          style={{
            background: "#fff7ed",
            padding: "20px",
            borderRadius: "15px",
          }}
        >
          <p style={{ color: "#666" }}>Preço ideal na Shopee</p>

          <h2 style={{ fontSize: "36px", color: "#ea580c" }}>
            {result.price === "-" ? "-" : `R$ ${result.price}`}
          </h2>

          <p style={{ marginTop: "10px" }}>
            <strong>Taxas:</strong>{" "}
            {result.fee === "-" ? "-" : `R$ ${result.fee}`}
          </p>

          <p>
            <strong>Regra:</strong> {result.rule}
          </p>
        </div>
      </div>
    </div>
  );
}
import { useMemo, useState } from "react";
import "./App.css";

function formatMoney(value) {
  if (Number.isNaN(value) || !Number.isFinite(value)) return "R$ 0,00";

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function parseNumber(value) {
  const cleaned = String(value)
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.]/g, "");

  return Number(cleaned) || 0;
}

function calcularTaxasShopee(valorProduto) {
  if (valorProduto <= 0) {
    return {
      percentual: 0,
      comissao: 0,
      tarifaFixa: 0,
      totalTaxas: 0,
      subsidioPixPercentual: 0,
      subsidioPix: 0,
      regraAplicada: "-",
    };
  }

  if (valorProduto <= 8) {
    const tarifaFixa = valorProduto / 2;

    return {
      percentual: 0,
      comissao: 0,
      tarifaFixa,
      totalTaxas: tarifaFixa,
      subsidioPixPercentual: 0,
      subsidioPix: 0,
      regraAplicada:
        "Produto até R$ 8,00: tarifa fixa equivalente à metade do valor do produto.",
    };
  }

  if (valorProduto <= 79.99) {
    const comissao = valorProduto * 0.2;
    const tarifaFixa = 4;

    return {
      percentual: 20,
      comissao,
      tarifaFixa,
      totalTaxas: comissao + tarifaFixa,
      subsidioPixPercentual: 0,
      subsidioPix: 0,
      regraAplicada: "De R$ 8,01 até R$ 79,99: comissão de 20% + R$ 4,00.",
    };
  }

  if (valorProduto <= 99.99) {
    const comissao = valorProduto * 0.14;
    const tarifaFixa = 16;
    const subsidioPix = valorProduto * 0.05;

    return {
      percentual: 14,
      comissao,
      tarifaFixa,
      totalTaxas: comissao + tarifaFixa,
      subsidioPixPercentual: 5,
      subsidioPix,
      regraAplicada:
        "De R$ 80,00 até R$ 99,99: comissão de 14% + R$ 16,00. Subsídio Pix informado: 5%.",
    };
  }

  if (valorProduto <= 199.99) {
    const comissao = valorProduto * 0.14;
    const tarifaFixa = 20;
    const subsidioPix = valorProduto * 0.05;

    return {
      percentual: 14,
      comissao,
      tarifaFixa,
      totalTaxas: comissao + tarifaFixa,
      subsidioPixPercentual: 5,
      subsidioPix,
      regraAplicada:
        "De R$ 100,00 até R$ 199,99: comissão de 14% + R$ 20,00. Subsídio Pix informado: 5%.",
    };
  }

  if (valorProduto <= 499.99) {
    const comissao = valorProduto * 0.14;
    const tarifaFixa = 26;
    const subsidioPix = valorProduto * 0.05;

    return {
      percentual: 14,
      comissao,
      tarifaFixa,
      totalTaxas: comissao + tarifaFixa,
      subsidioPixPercentual: 5,
      subsidioPix,
      regraAplicada:
        "De R$ 200,00 até R$ 499,99: comissão de 14% + R$ 26,00. Subsídio Pix informado: 5%.",
    };
  }

  const comissao = valorProduto * 0.14;
  const tarifaFixa = 26;
  const subsidioPix = valorProduto * 0.08;

  return {
    percentual: 14,
    comissao,
    tarifaFixa,
    totalTaxas: comissao + tarifaFixa,
    subsidioPixPercentual: 8,
    subsidioPix,
    regraAplicada:
      "Acima de R$ 500,00: comissão de 14% + R$ 26,00. Subsídio Pix informado: 8%.",
  };
}

function calcularPrecoSugerido(custoTotal, margemDesejada) {
  if (custoTotal <= 0 || margemDesejada <= 0) return 0;

  const lucroDesejado = custoTotal * (margemDesejada / 100);
  const valorLiquidoDesejado = custoTotal + lucroDesejado;

  for (let preco = 0.01; preco <= 10000; preco += 0.01) {
    const taxas = calcularTaxasShopee(preco);
    const liquido = preco - taxas.totalTaxas;

    if (liquido >= valorLiquidoDesejado) {
      return preco;
    }
  }

  return 0;
}

export default function App() {
  const [valorProduto, setValorProduto] = useState("");
  const [custoProduto, setCustoProduto] = useState("");
  const [embalagem, setEmbalagem] = useState("");
  const [margemDesejada, setMargemDesejada] = useState("");

  const resultado = useMemo(() => {
    const produto = parseNumber(valorProduto);
    const custo = parseNumber(custoProduto);
    const custoEmbalagem = parseNumber(embalagem);
    const margem = parseNumber(margemDesejada);

    const taxasShopee = calcularTaxasShopee(produto);

    const comissaoShopee = taxasShopee.comissao;
    const tarifaFixa = taxasShopee.tarifaFixa;
    const totalTaxas = taxasShopee.totalTaxas;
    const valorLiquido = produto - totalTaxas;

    const custoTotal = custo + custoEmbalagem;
    const lucroFinal = valorLiquido - custoTotal;

    const precoSugerido = calcularPrecoSugerido(custoTotal, margem);
    const taxasPrecoSugerido = calcularTaxasShopee(precoSugerido);
    const liquidoPrecoSugerido = precoSugerido - taxasPrecoSugerido.totalTaxas;
    const lucroPrecoSugerido = liquidoPrecoSugerido - custoTotal;

    return {
      comissaoShopee,
      tarifaFixa,
      totalTaxas,
      valorLiquido,
      custoTotal,
      lucroFinal,
      precoSugerido,
      liquidoPrecoSugerido,
      lucroPrecoSugerido,
      subsidioPixPercentual: taxasShopee.subsidioPixPercentual,
      subsidioPix: taxasShopee.subsidioPix,
      regraAplicada: taxasShopee.regraAplicada,
    };
  }, [valorProduto, custoProduto, embalagem, margemDesejada]);

  function limparCampos() {
    setValorProduto("");
    setCustoProduto("");
    setEmbalagem("");
    setMargemDesejada("");
  }

  return (
    <main className="page">
      <section className="calculator-card main-card">
        <div className="header">
          <p className="badge">WL Studio 3D</p>

          <h1>Calculadora Shopee</h1>

          <p className="subtitle">
            Calcule quanto a Shopee desconta, o valor líquido que você recebe e
            simule um preço ideal com base no custo e na margem desejada.
          </p>
        </div>

        <div className="form-group">
          <label>Valor do Produto</label>

          <input
            type="text"
            inputMode="decimal"
            placeholder="Ex: 59,90"
            value={valorProduto}
            onChange={(e) => setValorProduto(e.target.value)}
          />
        </div>

        <div className="result-box primary">
          <p className="result-label">Valor líquido que irá receber</p>
          <strong>{formatMoney(resultado.valorLiquido)}</strong>
        </div>

        <div className="fees-box">
          <div>
            <span>Comissão Shopee</span>
            <strong>{formatMoney(resultado.comissaoShopee)}</strong>
          </div>

          <div>
            <span>Tarifa fixa</span>
            <strong>{formatMoney(resultado.tarifaFixa)}</strong>
          </div>

          <div className="total">
            <span>Total das taxas Shopee</span>
            <strong>{formatMoney(resultado.totalTaxas)}</strong>
          </div>

          <div>
            <span>Subsídio Pix informado</span>
            <strong>
              {resultado.subsidioPixPercentual > 0
                ? `${resultado.subsidioPixPercentual}% | ${formatMoney(
                    resultado.subsidioPix
                  )}`
                : "-"}
            </strong>
          </div>
        </div>

        <div className="rule-box">
          <span>Regra aplicada</span>
          <p>{resultado.regraAplicada}</p>
        </div>
      </section>

      <section className="calculator-card pricing-card">
        <div className="pricing-header">
          <span className="section-tag">Simulação</span>

          <h2>Teste de Precificação</h2>

          <p>
            Preencha o custo, embalagem e margem para calcular o preço ideal de
            venda.
          </p>
        </div>

        <div className="grid">
          <div className="form-group">
            <label>Custo do produto</label>

            <input
              type="text"
              inputMode="decimal"
              placeholder="Ex: 18,00"
              value={custoProduto}
              onChange={(e) => setCustoProduto(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Embalagem</label>

            <input
              type="text"
              inputMode="decimal"
              placeholder="Ex: 2,50"
              value={embalagem}
              onChange={(e) => setEmbalagem(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Margem desejada (%)</label>

            <input
              type="text"
              inputMode="decimal"
              placeholder="Ex: 40"
              value={margemDesejada}
              onChange={(e) => setMargemDesejada(e.target.value)}
            />
          </div>
        </div>

        <div className="summary">
          <div>
            <span>Custo total</span>
            <strong>{formatMoney(resultado.custoTotal)}</strong>
          </div>

          <div className="profit-current">
            <span>Lucro final no valor atual</span>
            <strong
              className={resultado.lucroFinal >= 0 ? "positive" : "negative"}
            >
              {formatMoney(resultado.lucroFinal)}
            </strong>
          </div>

          <div className="price-suggested">
            <span>Preço sugerido para anúncio</span>
            <strong>{formatMoney(resultado.precoSugerido)}</strong>
          </div>

          <div>
            <span>Líquido no preço sugerido</span>
            <strong>{formatMoney(resultado.liquidoPrecoSugerido)}</strong>
          </div>

          <div className="profit-suggested">
            <span>Lucro estimado no preço sugerido</span>
            <strong
              className={
                resultado.lucroPrecoSugerido >= 0 ? "positive" : "negative"
              }
            >
              {formatMoney(resultado.lucroPrecoSugerido)}
            </strong>
          </div>
        </div>

        <div className="pricing-footer">
          <button className="clear-button" onClick={limparCampos}>
            Limpar cálculo
          </button>

          <p className="warning">
            Cálculo feito com base na tabela CNPJ informada. O Subsídio Pix está
            sendo exibido separadamente e não foi somado ao total das taxas.
          </p>
        </div>
      </section>
    </main>
  );
}
/**
 * Hypereal API — Teste de Latência
 *
 * Uso:
 *   HYPEREAL_API_KEY=sua_chave node test-latency.mjs
 *
 * Opcional — número de tentativas (padrão: 3):
 *   HYPEREAL_API_KEY=sua_chave RUNS=5 node test-latency.mjs
 */

const API_KEY = process.env.HYPEREAL_API_KEY;
const RUNS = parseInt(process.env.RUNS ?? "3", 10);
const ENDPOINT = "https://api.hypereal.tech/v1/images/generate";

const TEST_PROMPT = "a delicious bowl of pasta with tomato sauce, food photography, professional lighting";
const MODEL = "gemini-3-1-flash-t2i";

// ─── Validação ────────────────────────────────────────────────────────────────

if (!API_KEY) {
  console.error("\n❌  Erro: variável HYPEREAL_API_KEY não definida.");
  console.error("   Uso: HYPEREAL_API_KEY=sua_chave node test-latency.mjs\n");
  process.exit(1);
}

// ─── Função de teste ──────────────────────────────────────────────────────────

async function testRun(runIndex) {
  const label = `  [Run ${runIndex + 1}/${RUNS}]`;
  console.log(`${label} Enviando request...`);

  const start = performance.now();

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: TEST_PROMPT,
      model: MODEL,
      size: "1024*1024",
    }),
  });

  const elapsed = performance.now() - start;

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`${label} ❌  HTTP ${response.status}: ${errorText}`);
    return null;
  }

  const data = await response.json();

  console.log(`${label} ✅  ${(elapsed / 1000).toFixed(2)}s`);
  console.log(`${label}    Modelo:       ${data.data?.[0]?.model ?? "—"}`);
  console.log(`${label}    Credits used: ${data.creditsUsed ?? "—"}`);
  console.log(`${label}    Result ID:    ${data.resultId ?? "—"}`);
  console.log(`${label}    URL:          ${data.data?.[0]?.url ?? "—"}`);

  return elapsed;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log("\n🔬  Hypereal API — Teste de Latência");
console.log("════════════════════════════════════════");
console.log(`  Endpoint:  ${ENDPOINT}`);
console.log(`  Modelo:    ${MODEL}`);
console.log(`  Prompt:    "${TEST_PROMPT}"`);
console.log(`  Tentativas: ${RUNS}`);
console.log("════════════════════════════════════════\n");

const results = [];

for (let i = 0; i < RUNS; i++) {
  try {
    const ms = await testRun(i);
    if (ms !== null) results.push(ms);

    // Pequena pausa entre runs para não sobrecarregar a API
    if (i < RUNS - 1) {
      console.log("  Aguardando 2s antes da próxima tentativa...\n");
      await new Promise((r) => setTimeout(r, 2000));
    }
  } catch (err) {
    console.error(`  [Run ${i + 1}] ❌  Erro de rede: ${err.message}`);
  }
}

// ─── Resumo ───────────────────────────────────────────────────────────────────

if (results.length === 0) {
  console.log("\n❌  Nenhuma requisição bem-sucedida.\n");
  process.exit(1);
}

const avg = results.reduce((a, b) => a + b, 0) / results.length;
const min = Math.min(...results);
const max = Math.max(...results);

console.log("\n════════════════════════════════════════");
console.log("  📊  Resumo de Latência");
console.log("════════════════════════════════════════");
console.log(`  Tentativas bem-sucedidas: ${results.length}/${RUNS}`);
console.log(`  Mínima:  ${(min / 1000).toFixed(2)}s`);
console.log(`  Máxima:  ${(max / 1000).toFixed(2)}s`);
console.log(`  Média:   ${(avg / 1000).toFixed(2)}s`);

console.log("\n  💡  Conclusão:");
if (avg < 8000) {
  console.log("  ✅  Latência aceitável para loading síncrono (< 8s em média).");
  console.log("      Recomendação: usar loading síncrono com spinner/skeleton.\n");
} else if (avg < 15000) {
  console.log("  ⚠️   Latência moderada (8–15s). Considere polling ou UX de progresso.");
  console.log("      Recomendação: polling a cada 2s + estimativa de progresso.\n");
} else {
  console.log("  🔴  Latência alta (> 15s). Polling obrigatório.");
  console.log("      Recomendação: fila assíncrona com notificação ao usuário.\n");
}

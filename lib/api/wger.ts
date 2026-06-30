// Cliente para a API pública do wger (banco de exercícios aberto, gratuito, sem chave)
// Docs: https://wger.de/en/software/api
//
// OBS: a resposta exata do endpoint de busca do wger pode variar entre versões.
// Este cliente foi escrito de forma defensiva (tenta múltiplos formatos de resposta)
// e nunca lança erro de "formato inesperado" — na pior hipótese retorna null,
// e a UI mostra "demonstração não encontrada" em vez de quebrar.

export type ExerciseDemo = {
  name: string;
  imageUrl: string | null;
};

function extractFirstCandidate(data: any): any {
  if (!data) return null;
  if (Array.isArray(data.suggestions) && data.suggestions.length > 0) return data.suggestions[0];
  if (Array.isArray(data.results) && data.results.length > 0) return data.results[0];
  if (Array.isArray(data.data) && data.data.length > 0) return data.data[0];
  if (Array.isArray(data) && data.length > 0) return data[0];
  return null;
}

export async function searchExerciseDemo(term: string, signal?: AbortSignal): Promise<ExerciseDemo | null> {
  const query = term.trim();
  if (!query) return null;

  try {
    const searchUrl = `https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(query)}&format=json`;
    const res = await fetch(searchUrl, { signal });
    if (!res.ok) return null;
    const data = await res.json();

    const candidate = extractFirstCandidate(data);
    if (!candidate) return null;

    const inner = candidate.data ?? candidate;
    const name: string = inner?.name ?? query;
    let imageUrl: string | null = inner?.image ?? null;

    const baseId: number | undefined = inner?.base_id ?? inner?.base ?? inner?.id;

    if (!imageUrl && baseId) {
      const imgUrl = `https://wger.de/api/v2/exerciseimage/?exercise_base=${baseId}&format=json`;
      const imgRes = await fetch(imgUrl, { signal });
      if (imgRes.ok) {
        const imgData = await imgRes.json();
        const results = Array.isArray(imgData?.results) ? imgData.results : [];
        imageUrl = results[0]?.image ?? null;
      }
    }

    return { name, imageUrl };
  } catch {
    // rede indisponível, CORS bloqueado, formato inesperado, etc — falha silenciosa
    return null;
  }
}

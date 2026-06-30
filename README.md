# FitTrack

App de treinos, dietas e contagem de calorias/macros. Next.js 14 + TypeScript + Tailwind, com os dados salvos no `localStorage` do navegador (sem backend/banco de dados necessário).

## Integrações com APIs externas

- **Open Food Facts** (busca de produtos industrializados, em Dietas e no Diário): gratuita, sem chave de API, sem limite restritivo de uso. Os dados vêm de um banco aberto e colaborativo — a qualidade varia produto a produto, então sempre vale conferir os macros antes de confiar 100%.
- **wger** (demonstração visual de exercícios, em Treinos, botão "Ver demonstração"): gratuita, sem chave de API. A cobertura é melhor para nomes em inglês; para alguns exercícios em português pode não encontrar imagem — nesse caso o app mostra "demonstração não encontrada" em vez de quebrar.

Ambas as chamadas são feitas direto do navegador (client-side), sem necessidade de variáveis de ambiente ou servidor próprio. Isso simplifica o deploy, mas significa que essas duas funcionalidades exigem que o usuário esteja com internet ativa — se a API externa estiver fora do ar, o app continua funcionando normalmente para tudo o resto (a base local de alimentos e exercícios não depende disso).

Não testei essas chamadas em produção durante o desenvolvimento (o ambiente onde montei o projeto não tinha acesso a esses domínios) — recomendo testar essas duas telas logo após o primeiro deploy na Vercel.

## Funcionalidades

- **Perfil**: cadastre nome, idade, sexo, peso, altura, nível de atividade, objetivo e experiência de treino. Com isso o app calcula seu gasto calórico (fórmula de Mifflin-St Jeor) e sugere metas de calorias/macros ajustadas ao seu objetivo — você pode aplicar a sugestão com um clique ou ajustar manualmente. A tela de Treinos também passa a mostrar uma recomendação de frequência/divisão/repetições com base no seu objetivo e experiência.
- **Treinos**: crie rotinas, adicione dias de treino, escolha exercícios por grupo muscular e registre séries/reps/carga. Registre o treino do dia no histórico. Cada exercício tem um botão "Ver demonstração" que busca uma imagem ilustrativa na API wger.
- **Dietas**: monte planos de refeições com uma base de ~30 alimentos brasileiros (macros já calculados), busque produtos industrializados via Open Food Facts, e lance um dia de dieta inteiro direto no diário.
- **Diário**: registre o que você comeu por refeição, em qualquer data (manualmente ou via busca Open Food Facts), e acompanhe o anel de calorias e as barras de macros (proteína/carbo/gordura) comparado à meta.

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Subindo para o GitHub

```bash
git init
git add .
git commit -m "FitTrack inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

## Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta GitHub.
2. Clique em **Add New > Project** e selecione o repositório que você acabou de subir.
3. A Vercel detecta automaticamente que é um projeto Next.js — não precisa configurar nada, é só clicar em **Deploy**.
4. Em poucos minutos seu app estará no ar, em um link tipo `seu-projeto.vercel.app`.

A cada `git push` na branch `main`, a Vercel gera um novo deploy automaticamente.

## Observações importantes

- Os dados (treinos, dietas, diário, metas) ficam salvos no `localStorage` do navegador de cada pessoa que acessa o app. Isso significa que **não há login nem sincronização entre dispositivos** — é uma base local, pensada para uso pessoal e simplicidade de deploy. Se mais pra frente você quiser multiusuário ou acesso pelo celular e computador com os mesmos dados, dá pra evoluir adicionando um banco (ex: Supabase/Postgres) e autenticação.
- A base de alimentos está em `lib/seedFoods.ts` e a de exercícios em `lib/seedExercises.ts` — é só editar esses arquivos para adicionar mais itens.
- Limpar o cache do navegador ou usar uma aba anônima apaga os dados salvos.

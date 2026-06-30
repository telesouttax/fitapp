# FitTrack

App de treinos, dietas e contagem de calorias/macros. Next.js 14 + TypeScript + Tailwind, com os dados salvos no `localStorage` do navegador (sem backend/banco de dados necessário).

## Funcionalidades

- **Treinos**: crie rotinas, adicione dias de treino, escolha exercícios por grupo muscular e registre séries/reps/carga. Registre o treino do dia no histórico.
- **Dietas**: monte planos de refeições com uma base de ~30 alimentos brasileiros (macros já calculados), e lance um dia de dieta inteiro direto no diário.
- **Diário**: registre o que você comeu por refeição, em qualquer data, e acompanhe o anel de calorias e as barras de macros (proteína/carbo/gordura) comparado à meta.
- **Metas**: defina suas metas diárias de calorias e macros.

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

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
- **Dietas**: monte planos de refeições manualmente com uma base de ~30 alimentos brasileiros (macros já calculados) e suplementos (whey, creatina etc.), busque produtos industrializados via Open Food Facts, **ou gere uma dieta automaticamente** com base nas suas metas. Lance um dia de dieta inteiro direto no diário.
- **Diário**: registre o que você comeu por refeição, em qualquer data (manualmente ou via busca Open Food Facts), e acompanhe o anel de calorias e as barras de macros (proteína/carbo/gordura) comparado à meta.
- **Lista de compras**: a partir de uma dieta montada, o app soma as quantidades de cada alimento/suplemento de todas as refeições e monta uma lista de compras (com opção de multiplicar pra quantos dias você vai seguir aquela dieta, ex: 7 dias = a semana toda). Aparece na tela (botão "Lista de compras" dentro da dieta) e também sai junto na versão impressa/PDF.
- **Imprimir / Salvar PDF**: exporte sua dieta (com lista de compras) ou rotina de treino ativa pra PDF (ou imprima em papel) direto da tela de Dietas/Treinos.

## Sobre a dieta gerada automaticamente

O botão "Gerar dieta automática" (em Dietas) monta um plano de 4 refeições calculando as quantidades de alimentos pra bater suas metas de calorias e macros — usando uma combinação fixa de alimentos por refeição (proteína + carboidrato + gordura) e resolvendo um sistema de equações lineares pra achar as quantidades certas. Em testes, a margem de erro fica geralmente abaixo de 5%, podendo chegar a ~10-15% em casos específicos (mais comum na gordura). É uma estimativa de ponto de partida, não uma prescrição nutricional profissional — sinta-se livre pra trocar alimentos ou ajustar quantidades manualmente depois de gerada. A lógica está em `lib/dietGenerator.ts`, incluindo os alimentos escolhidos por refeição — fácil de customizar.

## Imprimir / salvar como PDF

Nas telas de **Dietas** e **Treinos**, a dieta/rotina selecionada tem um botão "Imprimir / Salvar PDF". Ele abre a janela de impressão nativa do navegador, que em qualquer navegador moderno (Chrome, Edge, Firefox, Safari) tem a opção **"Salvar como PDF"** no destino da impressão — não precisa de nenhum serviço externo ou biblioteca pesada pra isso.

O app gera uma versão limpa (fundo branco, texto preto, sem menu/botões) só com o conteúdo da dieta ou treino ativo no momento. Pra trocar o que será impresso, é só selecionar outra dieta/rotina antes de clicar no botão.


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
- A base de alimentos está em `lib/seedFoods.ts`, a de suplementos em `lib/seedSupplements.ts` (whey, creatina, albumina, BCAA, glutamina, maltodextrina, dextrose, ômega 3, multivitamínico, pré-treino) e a de exercícios em `lib/seedExercises.ts` — é só editar esses arquivos para adicionar mais itens.
- Quando você adicionar novos itens a essas bases, quem já tinha o app salvo no navegador recebe os itens novos automaticamente na próxima visita (a store tem uma migração que mescla o catálogo novo sem apagar dados que a pessoa já tinha criado).
- Limpar o cache do navegador ou usar uma aba anônima apaga os dados salvos.

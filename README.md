# LoL Build Advisor

Sistema web local que detecta automaticamente partidas ao vivo de **League of Legends** e recomenda a build completa ideal com justificativa para cada item, baseado na composição dos times e no patch atual.

> Desenvolvido para uso pessoal e local. Sem necessidade de instalação de extensões ou modificações no jogo.

---

## Funcionalidades

- Detecção automática de partidas em andamento via Live Client Data API
- Identificação dos campeões aliados e inimigos em tempo real
- Análise da composição inimiga (dano físico, mágico, assassinos, CC)
- Recomendação de build completa (5 itens + botas) gerada por IA
- Justificativa individual para cada item recomendado
- Ícones reais dos campeões e itens do Data Dragon
- Dados sempre atualizados com o patch atual do jogo
- Interface com tema visual do League of Legends

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Python + FastAPI |
| IA | Gemini 2.5 Flash (Google AI Studio) |
| Dados LoL | Riot Data Dragon + Live Client API |

---

## Pré-requisitos

- Python 3.10+
- Node.js 18+
- League of Legends instalado
- Conta no [Google AI Studio](https://aistudio.google.com) para a Gemini API Key

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/falamathews/lol-build-advisor.git
cd lol-build-advisor
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha suas chaves:

```bash
cp .env.example .env
```

Edite o `.env` com seus dados:

```env
GEMINI_API_KEY=sua_chave_aqui       # aistudio.google.com — gratuito
RIOT_API_KEY=sua_chave_aqui         # developer.riotgames.com — expira a cada 24h
RIOT_REGION=br1
RIOT_ID_NAME=seu nome no jogo
RIOT_ID_TAG=TAG
```

### 3. Instale as dependências do backend

```bash
python3 -m venv venv
source venv/bin/activate            # Windows: venv\Scripts\activate
pip install -r backend/requirements.txt
```

### 4. Instale as dependências do frontend

```bash
cd frontend
npm install
cd ..
```

---

## Como rodar

Abra **dois terminais** na raiz do projeto.

**Terminal 1 — Backend:**
```bash
source venv/bin/activate
cd backend
uvicorn main:app --reload
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Acesse **[http://localhost:5173](http://localhost:5173)** no navegador.

---

## Como usar

1. Com os dois servidores rodando, acesse `http://localhost:5173`
2. A tela de espera será exibida aguardando uma partida
3. Entre em uma partida no League of Legends (qualquer modo)
4. O app detecta automaticamente em até 5 segundos
5. A build completa é gerada pelo Gemini e exibida na tela
6. Clique em cada item para ver a justificativa detalhada
7. Ao terminar, clique em **Nova partida** para reiniciar

---

## Estrutura do projeto

```
lol-build-advisor/
├── backend/
│   ├── main.py                  # Servidor FastAPI
│   ├── routes/
│   │   ├── build.py             # Endpoint de recomendação de build
│   │   ├── game.py              # Endpoint de status da partida
│   │   └── patch.py             # Endpoint de dados do patch
│   └── services/
│       ├── gemini.py            # Integração com Gemini AI
│       ├── data_dragon.py       # Integração com Riot Data Dragon
│       └── live_client.py       # Integração com Live Client API
├── frontend/
│   └── src/
│       ├── App.jsx              # Componente principal
│       └── components/
│           ├── WaitingScreen.jsx
│           ├── LoadingScreen.jsx
│           ├── ChampionList.jsx
│           ├── BuildRecommendation.jsx
│           └── ItemCard.jsx
├── .env.example
├── .gitignore
└── README.md
```

---

## Solução de problemas

| Problema | Solução |
|---|---|
| Partida não detectada | Confirme que o LoL está aberto e a partida já iniciou (não funciona no cliente, apenas em partidas) |
| Build não é gerada | Verifique se a Gemini API Key está correta no `.env` |
| Ícones não carregam | Verifique sua conexão com a internet |
| Backend não inicia | Confirme que o ambiente virtual está ativo (`source venv/bin/activate`) |
| Erro de API key inválida | A Riot API Key expira a cada 24h — renove em [developer.riotgames.com](https://developer.riotgames.com) |

---

## Roadmap

- [ ] Overlay flutuante sobre o jogo via Electron
- [ ] Atualização da build em tempo real conforme inimigos compram itens
- [ ] Hospedagem online (Railway + Vercel)

---

## Aviso

Este projeto utiliza a [Live Client Data API](https://developer.riotgames.com/docs/lol#game-client-api) da Riot Games para leitura local de dados da partida. Não realiza nenhuma modificação no jogo e está em conformidade com os Termos de Uso da Riot.

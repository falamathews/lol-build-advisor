#!/bin/bash

# Caminho do projeto (ajuste se necessário)
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "================================================"
echo "       LoL Build Advisor — Iniciando...         "
echo "================================================"

# Verifica se o venv existe
if [ ! -d "$PROJECT_DIR/venv" ]; then
  echo ""
  echo "ERRO: Ambiente virtual não encontrado."
  echo "Execute primeiro: python3 -m venv venv && pip install -r backend/requirements.txt"
  echo ""
  read -p "Pressione Enter para fechar..."
  exit 1
fi

# Verifica se o .env existe
if [ ! -f "$PROJECT_DIR/.env" ]; then
  echo ""
  echo "ERRO: Arquivo .env não encontrado."
  echo "Copie o .env.example para .env e preencha suas chaves de API."
  echo ""
  read -p "Pressione Enter para fechar..."
  exit 1
fi

echo ""
echo "Iniciando Backend..."
osascript <<EOF
tell application "Terminal"
  activate
  do script "cd \"$PROJECT_DIR\" && source venv/bin/activate && cd backend && uvicorn main:app --reload"
end tell
EOF

sleep 2

echo "Iniciando Frontend..."
osascript <<EOF
tell application "Terminal"
  activate
  do script "cd \"$PROJECT_DIR/frontend\" && npm run dev"
end tell
EOF

sleep 3

echo ""
echo "Abrindo navegador..."
open "http://localhost:5173"

echo ""
echo "Sistema iniciado! Pode fechar esta janela."
echo "Para encerrar, feche as duas janelas do Terminal abertas."

#!/bin/zsh
set -e

echo -n "Bot token (BotFather): "
read -s BOT_TOKEN
echo
echo -n "Webhook secret (el mismo que guardaste con wrangler secret put): "
read -s WEBHOOK_SECRET
echo

WORKER_URL="https://kaedo-kwan-bot.javier-acuna1992.workers.dev"

curl -s "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -d "url=${WORKER_URL}" \
  -d "secret_token=${WEBHOOK_SECRET}"

unset BOT_TOKEN WEBHOOK_SECRET
echo

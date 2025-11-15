# Multi Gateway Payment System

Sistema de pagamentos com fallback automático entre gateways.

## Funcionalidades

- API RESTful para pagamentos
- Fallback Gateway 1 → Gateway 2
- Gestão de produtos
- Autenticação
- Histórico de transações

## Fluxo

1. Recebe produto + cartão
2. Calcula valor
3. Tenta Gateway 1, se falhar usa Gateway 2
4. Salva transação

## Tech Stack

- Node.js + AdonisJS
- MySQL + ORM
- Bearer tokens

## Rotas

**Públicas:** `/login`, `/purchase`
**Privadas:** `/transactions`, `/refund`, CRUD

## Setup

```bash
npm install
npm run migration:run
npm start
```

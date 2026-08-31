# 🩺 Calculadora de IMC Pro (Índice de Massa Corporal)

Uma aplicação full-stack moderna, elegante e pronta para produção para avaliação antropométrica, cálculo do Índice de Massa Corporal (IMC), classificação segundo a Organização Mundial da Saúde (OMS), recomendações nutricionais e de atividades físicas personalizadas, histórico persistido em banco de dados e impressão de laudo clínico profissional.

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 19 + TypeScript, Tailwind CSS 4, Lucide Icons, animações fluidas com Motion.
- **Backend**: Node.js com Express e endpoints RESTful sanitizados.
- **Banco de Dados**: 
  - **Produção (Vercel / Nuvem)**: PostgreSQL (Supabase, Neon, Railway ou Vercel Postgres).
  - **Ambiente Local / Fallback Zero-Config**: Armazenamento JSON local persistente em `data/imc_records.json`.
- **Deploy**: Otimizado para **Vercel** (`vercel.json` e Serverless API em `api/index.ts`) e **Cloud Run / Docker**.

---

## 📋 Funcionalidades

1. **Cálculo Preciso**: Fórmula padrão da OMS: $\text{IMC} = \frac{\text{peso (kg)}}{\text{altura (m)}^2}$.
2. **Entrada Flexível**: Altura em centímetros (ex: `175`) ou metros (ex: `1.75`) com conversão e validação automática.
3. **Classificação da OMS**:
   - 🔵 Abaixo do Peso ($< 18,5$)
   - 🟢 Peso Normal / Eutrofia ($18,5 - 24,9$)
   - 🟡 Sobrepeso / Pré-obesidade ($25,0 - 29,9$)
   - 🔴 Obesidade Grau I ($30,0 - 34,9$)
   - 🔴 Obesidade Grau II ($35,0 - 39,9$)
   - 🟣 Obesidade Grau III / Mórbida ($\ge 40,0$)
4. **Metas e Métricas Complementares**:
   - Faixa de peso ideal saudável para a altura informada.
   - Diferença exata de peso (kg a ganhar ou perder para atingir a faixa ideal).
   - Recomendação de ingestão diária de água ($35\text{ ml} \times \text{peso}$).
5. **Orientações Personalizadas**: Recomendações nutricionais, atividade física, fatores de risco e alertas médicos customizados para cada faixa.
6. **Laudo para Impressão (`Print-Friendly`)**: Layout médico pronto para impressão em folha A4 com cabeçalho institucional, dados do paciente, medidor de IMC, tabela de referência, orientações e campo para assinatura.
7. **Histórico e Persistência**: Busca por nome, filtros por classificação, exclusão segura e exportação para CSV.
8. **Segurança e Validação**: Sanitização de strings contra XSS, validação de limites físicos e tratamento robusto de erros.

---

## 🛠️ Passo a Passo para Configuração Local

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/calculadora-imc.git
cd calculadora-imc
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` a partir do modelo `.env.example`:
```bash
cp .env.example .env
```

Conteúdo do `.env`:
```env
# Opcional: Se deixar vazio, a aplicação usará persistência local automática em JSON.
# Para conectar ao Supabase ou PostgreSQL:
DATABASE_URL="postgresql://postgres:sua_senha@db.exemplo.supabase.co:5432/postgres"
```

### 4. Executar em Modo de Desenvolvimento
```bash
npm run dev
```
Acesse no seu navegador: `http://localhost:3000`

---

## 🗄️ Configuração do Banco de Dados (Supabase / PostgreSQL)

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. Vá até o **SQL Editor** no painel do Supabase.
3. Cole e execute o conteúdo do arquivo `schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS imc_records (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    weight NUMERIC(5,2) NOT NULL,
    height NUMERIC(5,2) NOT NULL,
    imc NUMERIC(5,2) NOT NULL,
    classification VARCHAR(32) NOT NULL,
    classification_label VARCHAR(64) NOT NULL,
    gender VARCHAR(16),
    age INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_imc_records_created_at ON imc_records (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_imc_records_name ON imc_records (name);
```

4. Copie a **Connection String URI** em *Project Settings > Database* e cole na variável `DATABASE_URL` do seu ambiente.

---

## 🌐 Como Fazer o Deploy no Vercel

### Opção A: Pelo Dashboard da Vercel (Recomendado)
1. Envie seu código para o GitHub (`git push origin main`).
2. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**.
3. Importe o repositório do GitHub.
4. Em **Environment Variables**, adicione:
   - `DATABASE_URL`: `postgresql://...` (sua string de conexão do Supabase ou Neon).
5. Clique em **Deploy**. O Vercel detectará automaticamente o Vite e a pasta `api/` para as serverless functions.

### Opção B: Pela Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

---

## 📁 Estrutura do Projeto

```
├── api/
│   └── index.ts            # Entrypoint Serverless para Vercel
├── server/
│   ├── db.ts               # Camada de persistência (PostgreSQL + Local Fallback)
│   └── routes/
│       └── imc.ts          # Endpoints RESTful da API
├── src/
│   ├── components/         # Componentes UI (Calculadora, Relatório, Histórico, etc.)
│   ├── utils/
│   │   └── imc.ts          # Algoritmos da OMS, validações e orientações
│   ├── types.ts            # Tipagens TypeScript
│   ├── App.tsx             # Componente raiz da aplicação
│   └── main.tsx            # Ponto de entrada do React
├── schema.sql              # Script DDL do banco de dados
├── vercel.json             # Configuração de rotas para Vercel
├── server.ts               # Servidor Express Full-stack para Node/Cloud Run
└── package.json            # Scripts de build e dependências
```

---

## 📄 Licença
Distribuído sob a licença MIT. Pronto para uso acadêmico, clínico ou profissional.

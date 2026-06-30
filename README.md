# 👁 EYE-GATE - Sistema de Reconhecimento Facial Escolar

**Projeto Escolar - Controle de Entrada e Saída de Alunos**

---

## 📋 Sobre o Projeto

Sistema inteligente que utiliza **reconhecimento facial** para registrar automaticamente a entrada e saída de alunos na escola.

### 🎯 Objetivos
- Automatizar o controle de presença
- Reduzir fraudes de entrada/saída
- Gerar relatórios em tempo real
- Interface simples e moderna

---

## ✨ Funcionalidades

### Para Alunos/Usuários
- Cadastro com captura de 5 poses do rosto
- Reconhecimento facial em tempo real na porta
- Registro automático de Entrada/Saída
- Histórico pessoal em PDF

### Para Administradores
- Painel completo de gerenciamento
- Visualização de logs em tempo real
- Gráficos de frequência
- Exportar dados em CSV
- Limpar histórico completo

---

## 🛠 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Reconhecimento Facial**: [face-api.js](https://github.com/justadudewhohacks/face-api.js)
- **Banco de Dados**: Supabase (PostgreSQL)
- **Gráficos**: Chart.js
- **Relatórios**: jsPDF
- **Ícones**: Lucide

---

## 📁 Estrutura do Projeto

EYE-GATE/
├── index.html---
├── css/---
├── js/---
│   ├── core/          (supabase, pages)---
│   ├── face/          (reconhecimento, cadastro)---
│   ├── dashboard/     (stats, charts, logs)---
│   ├── admin/         (gerenciamento)---
│   ├── auth/          (login, sessão)---
│   └── ui/            (navegação, loading)---
├── models/            (modelos da face-api)---
└── README.md---

---

## 🚀 Como Usar

1. Abra o `index.html`
2. Faça login como Administrador
3. Cadastre alunos na aba **Cadastro**
4. Use a aba **Monitor** para reconhecimento automático
5. Veja relatórios na aba **Registros** e **Dashboard**

---

## 🔧 Melhorias Futuras

- Integração com câmera IP
- Notificação por e-mail/SMS
- App mobile
- Relatório por turma
- Detecção de máscara

---

**Desenvolvido por: [RAUL, JULIO, VICENTE, GIAN, RICHARD]**
**Data: Junho 2026**

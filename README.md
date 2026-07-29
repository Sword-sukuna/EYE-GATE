# 👁 EYE-GATE - Sistema de Reconhecimento Facial Escolar

**Projeto Escolar - Controle de Entrada e Saída de Alunos**

---

## 📋 Sobre o Projeto

Sistema inteligente que utiliza **reconhecimento facial** para registrar automaticamente a entrada e saída de alunos na escola, com o objetivo de **otimizar o fluxo de entrada** e tornar o processo mais rápido e organizado.

### 🎯 Objetivos

- Otimizar a entrada e saída dos alunos
- Automatizar o controle de presença
- Reduzir fraudes de entrada/saída
- Gerar relatórios em tempo real
- Interface simples e moderna

---

## ✨ Funcionalidades

### Para Alunos / Usuários
- Cadastro com captura de 5 poses do rosto
- Reconhecimento facial em tempo real
- Registro automático de Entrada/Saída
- Histórico pessoal em PDF
- **Alternativa por Tag** (cartão ou pulseira) para liberar a mesma catraca

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
├── index.html
├── css/
├── js/
│   ├── core/          (supabase, pages)
│   ├── face/          (reconhecimento, cadastro)
│   ├── dashboard/     (stats, charts, logs)
│   ├── admin/         (gerenciamento)
│   ├── auth/          (login, sessão)
│   └── ui/            (navegação, loading)
├── models/            (modelos da face-api)
└── README.md
text---

## 🚀 Como Usar

1. Abra o `index.html`
2. Faça login como Administrador
3. Cadastre alunos na aba **Cadastro**
4. Use a aba **Monitor** para reconhecimento automático
5. Veja relatórios nas abas **Registros** e **Dashboard**

---

## 🔒 EYE-GATE e a LGPD – Como seguimos a lei

O EYE-GATE trata dados biométricos faciais, que pela **LGPD (Lei nº 13.709/2018)** são dados pessoais **sensíveis** (Art. 5º, II).

Como a maioria dos alunos são crianças e adolescentes, seguimos especialmente o **Art. 14** (melhor interesse do menor) e o **Art. 11** (tratamento de dados sensíveis).

### Objetivo do sistema
O EYE-GATE tem como finalidade **otimizar a entrada e saída dos alunos**, tornando o processo mais rápido e organizado, sem prejudicar a segurança.

### Como o projeto cumpre a LGPD:

- **Cadastro facial não é obrigatório**: o aluno pode optar por usar uma **tag** (cartão ou pulseira) para liberar a mesma catraca.
- **Consentimento**: o cadastro facial só ocorre com autorização específica dos pais ou responsáveis.
- **Finalidade**: os dados são usados apenas para controle de entrada/saída e registro de frequência.
- **Minimização**: coletamos apenas o necessário e oferecemos alternativas menos invasivas.
- **Segurança**: os dados ficam protegidos e com acesso restrito.
- **Direitos**: os responsáveis podem pedir acesso, correção ou exclusão dos dados a qualquer momento.

O sistema é um **protótipo educacional**. Em caso de uso real, será elaborado um Relatório de Impacto à Proteção de Dados (RIPD).

---

## 🔧 Melhorias Futuras

- Integração com câmera IP
- Notificação por e-mail/SMS
- App mobile
- Relatório por turma
- Detecção de máscara
- Leitor de tag RFID/NFC completo

---

**Desenvolvido por:** GIAN, JULIO, MOZER, RAUL, RICHARD, VICENTE  
**Data:** Junho 2026

<div align="center">
<img alt="NeatNest Logo" height="450" src="/src/assets/logos/neatnest-logo-dark.svg" width="350"/>
</div>

<div align="center">
<i>Sistema de Gerenciamento de Inventário Residencial e Profissional</i>
</div>

---

### Este repositório contém a interface frontend do projeto, construída como um **PWA (Progressive Web Application)** moderno, focado em trazer uma experiência de aplicativo nativo diretamente pelo navegador.

#### Este Projeto é parte do meu Trabalho de Conclusão de Curso em Ciência da Computação e já se encontra em produção, sendo ativamente testado por usuários reais.

---

### Por que um PWA?

A escolha da arquitetura PWA para o frontend do NeatNest foi estratégica. O objetivo era eliminar atrito de instalação via App Stores, garantindo que o usuário tenha acesso imediato
à plataforma. Com o PWA, o NeatNest oferece:
- **Instalação Direta**: Adicionável à tela inicial do aparelho com um clique;
- **Experiência Nativa**: Funciona em tela cheia, sem barras de navegação, como um app tradicional;
- **Leveza**: Ocupa uma fração do espaço de armazenamento comparado a um aplicativo nativo baixado pelas lojas virtuais;
- **Cross-Platform**: Um único código fonte rodando de forma impecável no iOS, Android, Windows e Mac.

### Principais Funcionalidades

- **Controle de Inventário**: Gerenciamento centralizado de itens da casa e do trabalho;
- **Upload Otimizado de Imagens**: Suporte a anexos de fotos dos itens. As imagens enviadas pelo frontend são automaticamente convertidas para `.webp` e otimizadas pelo backend, economizando dados e garantindo carregamento rápido;
- **Autenticação e Segurança (Supabase Auth)**: Sistema de login robusto e controle de acesso com chaves anônimas baseadas em JWT, permitindo delegar funções complexas à API;
- **Controle de Acesso Baseado em Cargos (RBAC)**: Hierarquia de permissões gerenciadas e refletidas de forma fluida na interface de usuário;
- **Design Mobile-First**: Interface responsiva projetada especificamente para o uso confortável com apenas um mão em aparelhos móveis.

### Como Instalar no Smartphone

**Link Oficial**: [NeatNest](https://neatnest.codifylab.app)

**Para iOS (Safari)**:
1. Acesse o link oficial do NeatNest no Safari;
2. Toque no ícone de **Compartilhar** (quadrado com uma seta para cima);
3. Selecione **"Adicionar à Tela de Início"**;
4. O app NeatNest aparecerá na sua lista de aplicativos.

**Para Android (Chrome)**:
1. Acesse o link oficial do NeatNest no Google Chrome;
2. O navegador exibirá um banner automático na parte inferior da tela solicitando a instalação;
3. (Alternativo) Toque no menu de 3 pontos no canto superior direito e selecione **Instalar Aplicativo**.

### Arquitetura e Ecossistema

O NeatNest é um sistema Full-Stack divido em dois monolitos modernos:
- **Frontend (NeatNest PWA) em Angular**: Hospedado de forma estática e global. Responsável pela interação direta com o usuário, cacheamento local e comunicação limpa via REST.
- **[Backend (NeatNest API) em NestJS](https://github.com/gfvictor/neatnest-api/tree/develop)**: Uma API REST robusta construída em NestJS, hospedada na DigitalOcean App Platform. Ela atua como uma fortaleza para regras de negócio pesadas (ex: conversão de imagens usando `sharp`, persistência no Banco de Dados via Prisma e roteamento de arquivos no Storage do Supabase). Para ver a documentação técnica da API, acesse o repositório.

### Sobre o Autor

Desenvolvido por **Victor Farias** como projeto final (TCC) em Ciência da Computação, aplicando conceitos avançados de Arquitetura Limpa (Clean Architecture), SOLID, e design autoral centrado no usuário em ambientes de nuvem.

---
*(c) 2026 NeatNest - Todos os Direitos Reservados* 

# 🌤️ Clima Tempo Pro - Aplicação de Previsão do Tempo Inteligente

Uma aplicação web moderna e responsiva para consulta de previsão do tempo com geolocalização automática e funcionalidades avançadas.

## ✨ Funcionalidades Principais

### 🌍 Geolocalização Automática
- **Detecção automática da localização** do usuário
- **Botão dedicado** para usar localização atual
- **Permissões de localização** com feedback visual
- **Fallback inteligente** para cidade padrão

### 🔍 Busca Inteligente
- **Busca por nome de cidade** com autocompletar
- **Histórico de buscas recentes** (últimas 5 cidades)
- **Busca por coordenadas** geográficas
- **Validação de entrada** com mensagens de erro

### 📊 Informações Detalhadas
- **Temperatura atual** com sensação térmica
- **Condições meteorológicas** com ícones animados
- **Umidade, vento e visibilidade**
- **Pressão atmosférica** e índice UV
- **Nascer e pôr do sol**
- **Qualidade do ar** (AQI)

### 📅 Previsões Avançadas
- **Previsão para 7 dias** com temperaturas médias
- **Previsão por hora** para as próximas 24 horas
- **Tabs interativos** para alternar entre visualizações
- **Ícones dinâmicos** baseados nas condições

### ⚙️ Configurações Personalizáveis
- **Unidades de temperatura** (Celsius/Fahrenheit)
- **Unidades de velocidade** (km/h/mph)
- **Localização automática** (habilitar/desabilitar)
- **Persistência de configurações** no navegador

### 🎨 Interface Moderna
- **Design responsivo** para todos os dispositivos
- **Tema escuro/claro** com gradientes
- **Animações suaves** e transições
- **Loading states** e feedback visual
- **Modal de configurações** elegante

## 🚀 Como Usar

### 1. Configuração Inicial
1. Obtenha uma chave gratuita da API OpenWeatherMap:
   - Acesse: https://openweathermap.org/api
   - Crie uma conta gratuita
   - Copie sua API Key

2. Configure a aplicação:
   - Abra o arquivo `script.js`
   - Substitua `'YOUR_API_KEY'` pela sua chave real
   - Salve o arquivo

### 2. Executando a Aplicação
1. Abra o arquivo `index.html` em seu navegador
2. Permita o acesso à localização quando solicitado
3. A aplicação carregará automaticamente os dados da sua localização

### 3. Funcionalidades Disponíveis
- **Buscar cidade**: Digite o nome da cidade na barra de busca
- **Usar localização**: Clique no botão "Minha Localização"
- **Configurações**: Clique no ícone de engrenagem
- **Histórico**: Clique em qualquer cidade recente

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com CSS Grid e Flexbox
- **JavaScript ES6+** - Lógica da aplicação com classes e async/await
- **Font Awesome** - Ícones meteorológicos
- **Google Fonts** - Tipografia Poppins
- **OpenWeatherMap API** - Dados meteorológicos

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- 📱 **Smartphones** (320px+)
- 📱 **Tablets** (768px+)
- 💻 **Desktops** (1024px+)
- 🖥️ **Telas grandes** (1200px+)

## 🔧 Estrutura do Projeto

```
clima-tempo/
├── index.html          # Estrutura principal da aplicação
├── style.css           # Estilos e responsividade
├── script.js           # Lógica da aplicação
└── README.md           # Documentação
```

## 🌐 APIs Utilizadas

### OpenWeatherMap API
- **Current Weather**: Dados meteorológicos atuais
- **5-Day Forecast**: Previsão para 5 dias
- **Air Pollution**: Qualidade do ar
- **Geocoding**: Conversão de coordenadas

### Geolocation API
- **getCurrentPosition**: Obtenção da localização do usuário
- **High Accuracy**: Precisão alta para melhor localização

## 💾 Armazenamento Local

A aplicação utiliza `localStorage` para:
- **Configurações do usuário** (unidades, preferências)
- **Histórico de buscas** (últimas cidades consultadas)
- **Estado da aplicação** (localização atual)

## 🎯 Funcionalidades Avançadas

### Sistema de Estado
- **Gerenciamento centralizado** do estado da aplicação
- **Atualizações reativas** da interface
- **Persistência de dados** entre sessões

### Tratamento de Erros
- **Feedback visual** para erros de rede
- **Mensagens amigáveis** para o usuário
- **Botão de retry** para tentar novamente
- **Fallbacks** para situações de erro

### Performance
- **Carregamento assíncrono** de dados
- **Cache inteligente** de requisições
- **Otimização de imagens** e ícones
- **Lazy loading** de componentes

## 🔒 Privacidade e Segurança

- **Não coleta dados pessoais**
- **Localização opcional** (requer permissão)
- **Dados armazenados localmente**
- **Sem cookies de rastreamento**

## 🚀 Melhorias Futuras

- [ ] **Notificações push** para alertas meteorológicos
- [ ] **Widgets personalizáveis** para desktop
- [ ] **Mapas interativos** com condições meteorológicas
- [ ] **Histórico meteorológico** detalhado
- [ ] **Alertas de tempestade** e condições extremas
- [ ] **Modo offline** com cache de dados
- [ ] **Temas personalizáveis** (claro/escuro)
- [ ] **Exportação de dados** em diferentes formatos

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se sua API Key está configurada corretamente
2. Certifique-se de que tem conexão com a internet
3. Verifique as permissões de localização do navegador
4. Consulte a documentação da OpenWeatherMap API

---

**Desenvolvido com ❤️ para fornecer informações meteorológicas precisas e acessíveis.** 
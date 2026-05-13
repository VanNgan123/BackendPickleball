# Unit Tests para Service Layer

Este diretório contém testes unitários para a camada de serviços da aplicação backend.

## Estrutura

```
test/
├── setup/
│   ├── setupTests.js       # Configuração global do Jest e MongoDB In-Memory
│   └── mongodb.js          # Setup do servidor MongoDB em memória
├── services/
│   ├── UserServices.test.js
│   ├── CartService.test.js
│   ├── ProductServices.test.js
│   ├── CategoryServices.test.js
│   └── CouponServices.test.js
└── README.md
```

## Instalação

As dependências necessárias já foram instaladas:

```bash
npm install --save-dev jest @babel/preset-env babel-jest mongodb-memory-server
```

## Como executar os testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch (atualização automática)
```bash
npm run test:watch
```

### Gerar relatório de cobertura
```bash
npm run test:coverage
```

### Executar um arquivo de teste específico
```bash
npm test -- UserServices.test.js
```

### Executar testes de um padrão específico
```bash
npm test -- --testNamePattern="createUser"
```

## Sobre os testes

### UserServices.test.js
- ✅ createUser - Criar novo usuário
- ✅ loginUser - Fazer login com credenciais
- ✅ getUserById - Obter usuário por ID
- ✅ Validações de password, email duplicado, etc.

### CartService.test.js
- ✅ addToCart - Adicionar produto ao carrinho
- ✅ getCartByUser - Obter carrinho do usuário
- ✅ updateCartItem - Atualizar quantidade do item
- ✅ removeFromCart - Remover item do carrinho
- ✅ clearCart - Limpar todos os itens do carrinho

### ProductServices.test.js
- ✅ createProduct - Criar novo produto
- ✅ getAllProduct - Obter todos os produtos
- ✅ searchAndFilterProducts - Buscar e filtrar produtos
- ✅ Validações de nome/preço duplicado

### CategoryServices.test.js
- ✅ createCategory - Criar nova categoria
- ✅ getCategories - Obter todas as categorias
- ✅ updateCategory - Atualizar categoria
- ✅ deleteCategory - Deletar categoria

### CouponServices.test.js
- ✅ createCoupon - Criar novo cupom
- ✅ getCouponByCode - Obter cupom por código
- ✅ validateCoupon - Validar cupom (data, uso máximo)
- ✅ getAllCoupons - Obter todos os cupons

## Configuração do Jest

A configuração está no arquivo `jest.config.js`:
- Ambiente: Node.js
- Setup: test/setup/setupTests.js
- Banco de dados: MongoDB In-Memory Server (para testes isolados)
- Timeout padrão: 30 segundos

## MongoDB In-Memory Server

Os testes usam um servidor MongoDB em memória, então:
- ✅ Nenhuma base de dados real é afetada
- ✅ Testes são rápidos e isolados
- ✅ Cada teste começa com um banco limpo
- ✅ Collections são limpas entre os testes

## Como adicionar novos testes

1. Crie um novo arquivo em `test/services/` com o nome `NomeDoService.test.js`
2. Importe o serviço e os modelos necessários
3. Use o padrão describe/test do Jest
4. Exemplo:

```javascript
const MyService = require("../../src/services/MyService");
const MyModel = require("../../src/models/MyModel");

describe("MyService", () => {
  beforeEach(async () => {
    await MyModel.deleteMany({});
  });

  describe("myFunction", () => {
    it("should do something", async () => {
      const result = await MyService.myFunction("test");
      expect(result).toBeDefined();
    });
  });
});
```

## Boas práticas

1. **Teste uma coisa por vez** - Cada teste deve testar apenas uma funcionalidade
2. **Use nomes descritivos** - Descreva o que está sendo testado
3. **Limpe dados entre testes** - Use beforeEach para preparar o ambiente
4. **Teste casos de sucesso e erro** - Teste tanto happy path quanto edge cases
5. **Evite dependências entre testes** - Cada teste deve ser independente

## Troubleshooting

### Erro: "MongoDB memory server failed to start"
```bash
npm install mongodb-memory-server --force
```

### Erro: "Cannot find module"
Verifique se o caminho do require está correto (relativo aos arquivos de teste)

### Testes timeout
Aumente o timeout no jest.config.js:
```javascript
testTimeout: 60000, // 60 segundos
```

## Próximas etapas

- [ ] Adicionar testes para OrderServices
- [ ] Adicionar testes para ReviewServices
- [ ] Adicionar testes para WishlistServices
- [ ] Adicionar testes para middleware
- [ ] Adicionar testes de integração para controllers

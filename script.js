// Produtos padrão (pré-cadastrados)
const produtosPadrao = [
  {nome:"Capa Simples Android", preco:14.99, img:"images/placeholder-capa-android.png"},
  {nome:"Capa Premium Android", preco:24.99, img:"images/placeholder-capa-android-premium.png"},
  {nome:"Capa Simples iPhone", preco:19.99, img:"images/placeholder-capa-iphone.png"},
  {nome:"Capa Premium iPhone", preco:28.99, img:"images/placeholder-capa-iphone-premium.png"},
  {nome:"Película 3D Vidro", preco:9.99, img:"images/placeholder-pelicula-3d.png"},
  {nome:"Película Vidro Privacidade", preco:19.90, img:"images/placeholder-pelicula-privacidade.png"},
  {nome:"Película Cerâmica", preco:24.99, img:"images/placeholder-pelicula-ceramica.png"},
  {nome:"Cabo Tipo C", preco:10.98, img:"images/placeholder-cabo-tipo-c.png"},
  {nome:"Cabo iPhone", preco:10.98, img:"images/placeholder-cabo-iphone.png"},
  {nome:"Cabo V8", preco:10.00, img:"images/placeholder-cabo-v8.png"},
  {nome:"Carregador Diversos", preco:23.90, img:"images/placeholder-carregador.png"},
  {nome:"Smartwatch", preco:99.90, img:"images/placeholder-smartwatch.png"}
];

// Puxar produtos do localStorage ou usar padrão
function carregarProdutosIndex() {
  const listaSalva = JSON.parse(localStorage.getItem('produtos')) || [];
  const produtos = produtosPadrao.concat(listaSalva); // junta produtos padrão + novos
  const container = document.getElementById('produtos-list');
  container.innerHTML = "";

  produtos.forEach(prod => {
    const article = document.createElement('article');
    article.classList.add('card','product-card');
    article.innerHTML = `
      <img class="product-img" src="${prod.img}" alt="${prod.nome}">
      <h3>${prod.nome}</h3>
      <p class="muted">R$ ${prod.preco.toFixed(2)}</p>
      <div class="price-row">
        <strong class="price">R$ ${prod.preco.toFixed(2)}</strong>
        <div class="actions">
          <button class="btn small" onclick="addToCart('${prod.nome}')">Adicionar ao carrinho</button>
          <a class="btn outline small" href="https://wa.me/5575983313523?text=Olá,%20gostaria%20de%20comprar%20um%20${encodeURIComponent(prod.nome)}." target="_blank">Comprar WhatsApp</a>
        </div>
      </div>
    `;
    container.appendChild(article);
  });
}

// Carrinho
let cart = [];
function addToCart(nome){
  const listaSalva = JSON.parse(localStorage.getItem('produtos')) || [];
  const produtos = produtosPadrao.concat(listaSalva);
  const p = produtos.find(prod => prod.nome === nome);
  if(p) cart.push(p);
  atualizarCarrinho();
}

function atualizarCarrinho(){
  const cartItems = document.getElementById('cart-items');
  const empty = document.getElementById('empty-cart');
  const footer = document.getElementById('cart-footer');
  if(!cartItems) return;
  cartItems.innerHTML="";
  if(cart.length===0){ empty.style.display="block"; footer.style.display="none"; return; }
  empty.style.display="none"; footer.style.display="block";
  let total = 0;
  cart.forEach(item=>{
    total+=item.preco;
    const div = document.createElement('div');
    div.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
    cartItems.appendChild(div);
  });
  document.getElementById('cart-total').textContent=`R$ ${total.toFixed(2)}`;
  const whatsapp = document.getElementById('checkout-whatsapp');
  const msg = cart.map(i=>`${i.nome} - R$ ${i.preco.toFixed(2)}`).join(', ');
  if(whatsapp) whatsapp.href=`https://wa.me/5575983313523?text=Olá,%20quero%20comprar:%20${encodeURIComponent(msg)}`;
}

// Pagamentos fictícios
function checkoutPix(){
  if(cart.length === 0){
    alert("Seu carrinho está vazio!");
    return;
  }
  
  // Calcula total do carrinho
  let total = cart.reduce((sum, item) => sum + item.preco, 0).toFixed(2);
  
  const chavePix = "08684203526"; // chave Pix do LAPATECH
  const nomeRecebedor = "LAPATECH Informática";
  const cidade = "Amelia Rodrigues";

  // Mostra a área do Pix
  const pixArea = document.getElementById('pix-dinamico');
  pixArea.style.display = 'block';
  document.getElementById('pix-key').innerText = chavePix;

  // Monta dados para a API QR Code Pix
  const qrApi = `https://api.qrcodepix.com/v1/create-qr-code?chave=${encodeURIComponent(chavePix)}&nome=${encodeURIComponent(nomeRecebedor)}&cidade=${encodeURIComponent(cidade)}&valor=${total}&size=150x150`;

  document.getElementById('pix-qrcode').src = qrApi;
}

function copiarPix(){
  const chave = document.getElementById('pix-key').innerText;
  navigator.clipboard.writeText(chave).then(()=>{
    alert("Chave Pix copiada!");
  });
}
// Inicializa produtos ao carregar
window.onload = carregarProdutosIndex;

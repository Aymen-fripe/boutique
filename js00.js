const OWNER_WHATSAPP_NUMBER = "+216 29 633 211"; 

const DELIVERY_FEE = 8.00;



const defaultProducts = [

    { id: 1, name: "Montre Classique Noir", price: 145, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80" },

    { id: 2, name: "Casque Audio Sans Fil", price: 210, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80" },

    { id: 3, name: "Lunettes de Soleil", price: 85, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=80" }

];



let products = JSON.parse(localStorage.getItem('boutique_products')) || defaultProducts;

let orders = JSON.parse(localStorage.getItem('boutique_orders')) || [];

let cart = [];



function saveData() {

    localStorage.setItem('boutique_products', JSON.stringify(products));

    localStorage.setItem('boutique_orders', JSON.stringify(orders));

}



// --- AFFICHAGE BOUTIQUE ---

function renderStore() {

    const productsList = document.getElementById('products-list');

    productsList.innerHTML = '';

    products.forEach(product => {

        productsList.innerHTML += `

            <div class="product-card" onclick="openProductDetails(${product.id})">

                <img src="${product.image}" alt="${product.name}">

                <div class="product-info">

                    <h3>${product.name}</h3>

                    <div class="price">${Number(product.price).toFixed(2)} DT</div>

                    <button class="add-btn" onclick="event.stopPropagation(); addToCart(${product.id})">

                        Ajouter au panier

                    </button>

                </div>

            </div>

        `;

    });

}
function renderStore() {

    const productsList = document.getElementById('products-list');

    productsList.innerHTML = '';

    products.forEach(product => {

        const mainImage = product.images
            ? product.images[0]
            : product.image;

        productsList.innerHTML += `

            <div class="product-card"
                 onclick="openProductDetails(${product.id})">

                <img src="${mainImage}" alt="${product.name}">

                <div class="product-info">

                    <h3>${product.name}</h3>

                    <div class="price">
                        ${Number(product.price).toFixed(2)} DT
                    </div>

                    <button
                        class="add-btn"
                        onclick="event.stopPropagation(); addToCart(${product.id})">
                        Ajouter au panier
                    </button>

                </div>

            </div>

        `;
    });
}


// --- DETAILS PRODUIT ---

function openProductDetails(id) {

    const product = products.find(p => p.id === id);

    if (!product) return;



    document.getElementById('detail-image').src = product.image;

    document.getElementById('detail-name').innerText = product.name;

    document.getElementById('detail-description').innerText =

        product.description || "Aucune description disponible.";

    document.getElementById('detail-taille').innerText =

        product.taille || "Non disponible";

    document.getElementById('detail-price').innerText =

        Number(product.price).toFixed(2);



    document.getElementById('product-modal').dataset.productId = product.id;

    document.getElementById('product-modal').style.display = 'flex';

}



function closeProductDetails() {

    document.getElementById('product-modal').style.display = 'none';

}



function addDetailToCart() {

    const id = Number(

        document.getElementById('product-modal').dataset.productId

    );



    if (!id) return;



    addToCart(id);

    closeProductDetails();

}



// --- GESTION PANIER ---

function toggleCart() {

    document.getElementById('cart-sidebar').classList.toggle('active');

}



function addToCart(id) {

    const item = products.find(p => p.id === id);

    const existing = cart.find(c => c.id === id);

    if (existing) existing.quantity += 1;

    else cart.push({ ...item, quantity: 1 });

    updateCart();

}



function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    updateCart();

}



function updateCart() {

    const cartItems = document.getElementById('cart-items');

    const cartCount = document.getElementById('cart-count');

    const cartSubtotal = document.getElementById('cart-subtotal');

    const cartDelivery = document.getElementById('cart-delivery');

    const cartTotal = document.getElementById('cart-total');



    cartItems.innerHTML = '';

    let subtotal = 0, count = 0;



    cart.forEach(item => {

        subtotal += item.price * item.quantity;

        count += item.quantity;

        cartItems.innerHTML += `

            <div class="cart-item">

                <div>

                    <h4>${item.name}</h4>

                    <small>${item.price} DT x ${item.quantity}</small>

                </div>

                <button onclick="removeFromCart(${item.id})" style="color:red; border:none; background:none; cursor:pointer;">

                    <i class="fas fa-trash"></i>

                </button>

            </div>

        `;

    });



    const finalTotal = cart.length > 0 ? subtotal + DELIVERY_FEE : 0;



    cartCount.innerText = count;

    cartSubtotal.innerText = subtotal.toFixed(2);

    cartDelivery.innerText = cart.length > 0 ? DELIVERY_FEE.toFixed(2) : "0.00";

    cartTotal.innerText = finalTotal.toFixed(2);

}



// --- MODAL COMMANDE ---

function openCheckoutModal() {

    if (cart.length === 0) {

        alert("Votre panier est vide !");

        return;

    }

    toggleCart();

    document.getElementById('checkout-modal').style.display = 'flex';

}



function closeCheckoutModal() {

    document.getElementById('checkout-modal').style.display = 'none';

}



// Validation w Envoi Direct lel Vendeur (WhatsApp)

document.getElementById('order-form').addEventListener('submit', function(e) {

    e.preventDefault();



    const prenom = document.getElementById('client-prenom').value;

    const nom = document.getElementById('client-nom').value;

    const email = document.getElementById('client-email').value;

    const tel = document.getElementById('client-tel').value;



    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let finalTotal = subtotal + DELIVERY_FEE;



    let itemsText = cart.map(i => `- ${i.name} (x${i.quantity}) : ${i.price * i.quantity} DT`).join('\n');



    const newOrder = {

        id: Date.now(),

        date: new Date().toLocaleString(),

        prenom, nom, email, tel,

        items: [...cart],

        total: finalTotal.toFixed(2)

    };



    orders.unshift(newOrder);

    saveData();



    let whatsappMessage = `*🛍️ NOUVELle COMMANDE !*%0A%0A` +

        `👤 *Client:* ${prenom} ${nom}%0A` +

        `📞 *Tél:* ${tel}%0A` +

        `📧 *Email:* ${email}%0A%0A` +

        `📦 *Articles:*%0A${encodeURIComponent(itemsText)}%0A%0A` +

        `🚚 *Livraison:* ${DELIVERY_FEE.toFixed(2)} DT%0A` +

        `💰 *Total Final:* *${finalTotal.toFixed(2)} DT*`;

    window.open(`https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${whatsappMessage}`, '_blank');



    alert(`Merci ${prenom} ! Votre commande a été transmise au vendeur.`);



    cart = [];

    updateCart();

    this.reset();

    closeCheckoutModal();

});



// --- ESPACE ADMIN ---

function openAdminLogin() {

    const pass = prompt("Entrez le mot de passe Admin (par défaut: admin123) :");

    if (pass === "admin123") {

        document.getElementById('store-view').style.display = 'none';

        document.getElementById('admin-view').style.display = 'block';

        renderAdmin();

    } else if (pass !== null) {

        alert("Mot de passe incorrect !");

    }

}



function showStore() {

    document.getElementById('admin-view').style.display = 'none';

    document.getElementById('store-view').style.display = 'block';

    renderStore();

}



function renderAdmin() {

    const adminProdList = document.getElementById('admin-products-list');

    adminProdList.innerHTML = '';

    products.forEach(p => {

        adminProdList.innerHTML += `

            <div class="admin-item-row">

                <div style="display:flex; align-items:center;">

                    <img src="${p.image}">

                    <div>

                        <strong>${p.name}</strong><br>

                        <small>${p.price} DT</small>

                    </div>

                </div>

                <div>

                    <button onclick="editProduct(${p.id})" style="background:#f4a261; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; margin-right:5px;">Modifier</button>

                    <button onclick="deleteProduct(${p.id})" style="background:#e63946; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Supprimer</button>

                </div>

            </div>

        `;

    });



    const adminOrdersList = document.getElementById('admin-orders-list');

    if (orders.length === 0) {

        adminOrdersList.innerHTML = '<p>Aucune commande pour le moment.</p>';

    } else {

        adminOrdersList.innerHTML = '';

        orders.forEach(o => {

            const itemsSummary = o.items.map(i => `${i.name} (x${i.quantity})`).join(', ');

            adminOrdersList.innerHTML += `

                <div class="order-box">

                    <strong>Client :</strong> ${o.prenom} ${o.nom} | <strong>Tél :</strong> ${o.tel} | <strong>Email :</strong> ${o.email}<br>

                    <strong>Produits :</strong> ${itemsSummary}<br>

                    <strong>Total (avec livraison 8dt) :</strong> <span style="color:#e63946; font-weight:bold;">${o.total} DT</span> <small style="color:#777;">(${o.date})</small>

                </div>

            `;

        });

    }

}



document.getElementById('product-form').addEventListener('submit', async function(e) {

    e.preventDefault();

    const id = document.getElementById('prod-id').value;

    const name = document.getElementById('prod-name').value;

    const price = parseFloat(
        document.getElementById('prod-price').value
    );

    const taille = document.getElementById('taille').value;

    const description =
        document.getElementById('description').value;

    const imageFiles =
        document.getElementById('prod-image').files;


    // Lire plusieurs images
    const readImages = files => {

        return Promise.all(

            Array.from(files).map(file => {

                return new Promise((resolve, reject) => {

                    const reader = new FileReader();

                    reader.onload = e =>
                        resolve(e.target.result);

                    reader.onerror = reject;

                    reader.readAsDataURL(file);

                });

            })

        );

    };


    let images = [];

    // Si nouvelles images choisies
    if (imageFiles.length > 0) {

        images = await readImages(imageFiles);

    }


    // MODIFICATION
    if (id) {

        const index = products.findIndex(
            p => p.id == id
        );

        products[index].name = name;
        products[index].price = price;
        products[index].taille = taille;
        products[index].description = description;


        // seulement si nouvelles images
        if (images.length > 0) {

            products[index].images = images;

            // ancienne compatibilité
            products[index].image = images[0];

        }

    }

    // NOUVEAU PRODUIT
    else {

        if (images.length === 0) {

            alert("Veuillez choisir au moins une image !");

            return;

        }


        products.push({

            id: Date.now(),

            name: name,

            price: price,

            taille: taille,

            description: description,

            images: images,

            image: images[0]

        });

    }


    saveData();

    resetForm();

    renderAdmin();

    renderStore();

});


function editProduct(id) {

    const p = products.find(
        prod => prod.id === id
    );

    if (!p) return;


    document.getElementById('prod-id').value = p.id;

    document.getElementById('prod-name').value = p.name;

    document.getElementById('prod-price').value = p.price;

    document.getElementById('taille').value =
        p.taille || '';

    document.getElementById('description').value =
        p.description || '';


    document.getElementById('form-title').innerText =
        "Modifier le Produit";

    document.getElementById('cancel-edit').style.display =
        "block";

}


function resetForm() {

    document.getElementById('product-form').reset();

    document.getElementById('prod-id').value = '';

    document.getElementById('form-title').innerText = "Ajouter un Produit";

    document.getElementById('cancel-edit').style.display = "none";

}



function deleteProduct(id) {

    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {

        products = products.filter(p => p.id !== id);

        saveData();

        renderAdmin();

        renderStore();

    }

}



renderStore();
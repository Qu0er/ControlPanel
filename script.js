let productsToBuy = [];

function openPopup() {
    fetch('/get_products')
        .then(response => response.json())
        .then(data => {
            let popupItems = document.getElementById("popup-items");
            popupItems.innerHTML = "";

            if (data.length === 0) {
                popupItems.innerHTML = "<p>Нет товаров</p>";
            } else {
                data.forEach(product => {
                    let item = document.createElement("div");
                    item.classList.add("product-item");
                    item.setAttribute("data-id", product.id);
                    item.innerHTML = `
                        <strong>${product.name}</strong><br>
                        <strong>Артикул - ${product.id}</strong><br><br>
                        <span class="product-count">${product.count} шт</span>, ${product.price} ₽
                        <button class="increase-btn" onclick="changeQuantity(${product.id}, 10)">+10 шт</button>
                        <button class="decrease-btn" onclick="changeQuantity(${product.id}, -10)">-10 шт</button>
                    `;
                    
                    
                    item.onclick = (event) => {
                        
                        if (event.target.tagName.toLowerCase() !== 'button') {
                            openProductDetails(product.id); 
                        }
                    };

                    popupItems.appendChild(item);

                    if (!productsToBuy.some(p => p.id === product.id)) {
                        productsToBuy.push({ id: product.id, quantity: product.count });
                    }
                });
            }

            document.getElementById("popup").classList.add("open");
        })
        .catch(error => console.error("Ошибка загрузки товаров:", error));
}


function openProductDetails(productId) {
    console.log("Открытие товара с ID:", productId); 

    fetch(`/get_product/${productId}`)
        .then(response => response.json())
        .then(product => {
            console.log("Данные о товаре:", product); 

            document.getElementById("product-title").innerText = product.name;
            document.getElementById("product-art").innerText = "Артикул: " + product.id;
            document.getElementById("product-description").innerText = product.description || "Нет описания";
            document.getElementById("product-price").innerText = product.price;

            let productImage = document.getElementById("product-image");
            productImage.src = `/static/images/${productId}.png`;
            productImage.onerror = () => { 
                pass;
            };

            document.getElementById("product-popup").classList.add("open");
        })
        .catch(error => console.error("Ошибка загрузки информации о товаре:", error));
}

function closePopup() {
    document.getElementById("popup").classList.remove("open");
    }
function closeProductDetails() {
    document.getElementById("product-popup").classList.remove("open");
}

function changeQuantity(productId, quantityChange) {
    let product = productsToBuy.find(p => p.id === productId);
    if (product) {
        product.quantity += quantityChange;

        let productElement = document.querySelector(`.product-item[data-id="${productId}"]`);
        if (productElement) {
            let countElement = productElement.querySelector(".product-count");
            if (countElement) {
                countElement.innerText = `${product.quantity} шт`;
            }
        }
    }
}

function buyProducts() {
    let validProducts = productsToBuy.filter(product => product.quantity > 0); 
    if (validProducts.length === 0) {
        alert("Вы не выбрали товары для покупки.");
        return;
    }

    const formattedProducts = validProducts.map(product => ({
        id: product.id,
        quantity: product.quantity
    }));

    fetch('/buy_products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: formattedProducts }) 
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Товары успешно куплены!");
            productsToBuy = []; 
            closePopup();
        } else {
            alert("Ошибка при покупке товаров.");
        }
    })
    .catch(error => {
        console.error("Ошибка при покупке товаров:", error);
    });
}



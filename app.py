from flask import Flask, render_template, jsonify, request

app = Flask(__name__)


products = [
    {"id": 1, "name": "АЛЛЮР 189-4", "description": "АЛЛЮР 189-4 лат. крест.ключ Замок врезной б/руч (30)", "price": 568, "count": 20},
    {"id": 2, "name": "АЛЛЮР 189-4A CP", "description": "Замок врезной б/руч (30) ", "price": 853, "count": 15},
    {"id": 3, "name": "АЛЛЮР 6040 PB", "description": "без ц/мех Замок врезной б/руч (30) ", "price": 380, "count": 15},
]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_products")
def get_products():
    return jsonify(products)

@app.route('/get_product/<int:product_id>')
def get_product(product_id):
    product = next((p for p in products if p["id"] == product_id), None)
    if product:
        return jsonify(product)
    return jsonify({"error": "Товар не найден"}), 404

@app.route('/buy_products', methods=['POST'])
def buy_products():
    data = request.get_json()
    purchased_products = data.get('products', [])
    purchased_items = []

    for product in purchased_products:
        product_id = product.get('id')
        quantity = product.get('quantity')
        
        matching_product = next((p for p in products if p['id'] == product_id), None)
        
        if matching_product:
            purchased_items.append({
                'name': matching_product['name'],
                'quantity': quantity,
                'price': matching_product['price'],
                'total_price': matching_product['price'] * quantity
            })
        else:
            return jsonify({'success': False, 'message': f'Товар с ID {product_id} не найден.'})

    print("Список купленных товаров:")
    for item in purchased_items:
        print(f"Название: {item['name']}, Количество: {item['quantity']}, Цена: {item['price']}, Общая стоимость: {item['total_price']}")

    return jsonify({'success': True, 'message': 'Товары успешно куплены!'})


if __name__ == "__main__":
    app.run(debug=True, host="192.168.3.25", port=8080)


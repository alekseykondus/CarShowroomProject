let cart = {}
let carName;
// = ["LAMBORGHINI SIAN", "TESLA ROADSTER", "RENAULT ALPHINE", "CHEVROLET CORVETTE", "MERCEDES AMG ONE", "BUGATTI DIVO", "HONDA NSX", "SUBARU BRZ", "AUDIi E-TRON GT", "KIA STINGER", "BMW M4", "BENTLEY BENTAYGA"];
let carPrice;
// = [3600000, 400000, 270000, 110000, 2700000, 5800000, 320000, 90000, 205000, 95000, 280000, 710000];

fetch('/getCarNamesFromDB', {
     method: 'GET',
})
     .then(result => result.text())
     .then(result => { carName = JSON.parse(result); });

fetch('/getCarPricesFromDB', {
     method: 'GET',
})
     .then(result => result.text())
     .then(result => { carPrice = JSON.parse(result); });

function CreateElement(nameElement, idElement, innerText, parentId) {
     let element = document.createElement(nameElement);
     element.id = idElement;
     element.innerText = innerText;
     if (parentId == "body")
          document.body.appendChild(element);
     else
          document.getElementById(parentId).appendChild(element);
     return element;
}

document.onclick = (event) => {
     if (event.target.classList.contains('add-car')) {
          console.log(event.target.id);
          addCar(event.target.id, carName[event.target.id - 1].name, "product-img" + event.target.id, carPrice[event.target.id - 1].price);
          alert("Товар доданий у кошик!");
     }
     else if (event.target.classList.contains('plus')) {
          console.log(event.target.id);
          plusFunction(event.target.id);
          saveData();
          changeRenderCart(event.target.id);
     }
     else if (event.target.classList.contains('minus')) {
          console.log(event.target.id);
          minusFunction(event.target.id);
          saveData();
          console.log(JSON.parse(localStorage.getItem('cart')) || []);
          changeRenderCart(event.target.id);
     }
}

/**
 * Handles the click event when the user submits the checkout form.
 * Retrieves user input and selected items from the form, then sends a POST request to save the order details to the server.
 * Clears the shopping cart, updates the UI, and displays a success message.
 *
 * @returns {boolean} - Returns true if the order submission is successful, otherwise false.
 */
function buttonCheckoutSubmitOnClickAndWriteOrderToDB() {
     //try {
          const fullNameEmployee = document.getElementById('form-empl-select').value;
          const name = document.getElementById('form-name-input').value;
          const surname = document.getElementById('form-surname-input').value;
          const patronymic = document.getElementById('form-patronymic-input').value;
          const passportID = document.getElementById('form-passportID-input').value;
          const tel = document.getElementById('form-tel-input').value;
               if (!name || !surname || !patronymic || !tel) {
                    alert('Будь ласка, заповніть усі обов\'язкова поля поля! ');
                    return false;
               }
          let carIDs = "";
          // let carIDs_Equipments = [];
          let carIDs_Equipments = new Map();

          let ids = Object.keys(cart);
          console.log("ids", ids);
          ids.forEach(element => {
               console.log("element", element);

               console.log("document.getElementById( + element).value", document.getElementById("carEquipment-select" + element));
               if (document.getElementById("carEquipment-select" + element)) {
                    carIDs_Equipments.set(element, document.getElementById("carEquipment-select" + element).value);

                    if (element == ids[ids.length - 1])
                         carIDs += element;
                    else
                         carIDs += element + ",";
               }
          });
          fetch('/writeOrderToDB', {
               method: 'POST',
               body: JSON.stringify({
                    "fullNameEmployee": fullNameEmployee,
                    "carIDs": carIDs,
                    "carIDs_Equipments": JSON.stringify(Object.fromEntries(carIDs_Equipments)),
                    "name": name,
                    "surname": surname,
                    "patronymic": patronymic,
                    "passportID": passportID,
                    "phoneNumber": tel,
                    "transactionAmount": calculateThePrice(),
               })
          })
               .then(res => res.text())
               .then(res => console.log(res));
          cart = {};
          saveData();
          cartIsEmpty();
          document.getElementById("cart-body").remove();
          //очищаем cart ///
          buttonCheckoutCloseOnClick();
          alert("Заказ успешно отравлен!");
          return true;
     //}
     /*catch (err) {
          alert(err);
          return false;
     }*/
}

/**
 * Handles the click event when the user closes the checkout modal.
 * Removes the modal container from the DOM.
 */
function buttonCheckoutCloseOnClick() {
     document.getElementById("div-Checkout").remove();
}

/**
 * Fetches a list of employees from the server and populates the employee selection dropdown in the checkout form.
 * Retrieves employee data using a GET request to the '/getEmployeesFromDB' endpoint.
 * Creates an option element for each employee in the dropdown.
 */
function addOptions() {
     fetch('/getEmployeesFromDB', {
          method: 'GET',
     })
          .then(res => res.text())
          .then(res => {
               let employeesTable = JSON.parse(res);
               console.log(employeesTable);
               for (let i = 0; i < employeesTable.length; i++)
                    CreateElement("option", "form-empl-option-" + i, employeesTable[i].fullName, "form-empl-select");
          });
}

/**
 * Handles the click event when the user initiates the checkout process.
 * Creates a modal for order details and user information input.
 * Displays options for selecting a delivery method (commented out).
 * Shows the total price of the items in the shopping cart.
 * Calls a function to populate the form with available employees for order processing.
 */
function buttonCheckoutOnClick() {
     CreateElement("div", "div-Checkout", "", "body").classList.add("checkout", "w-100", "h-100", "position-fixed", "d-flex",
          "flex-wrap", "justify-content-center");

     CreateElement("div", "div-Checkout-Background", "", "div-Checkout").classList.add("checkout-background", "w-100", "h-100", "position-absolute",
          "bg-secondary");
     CreateElement("div", "div-Checkout-item", "", "div-Checkout").classList.add("checkout-item", "d-block", "bg-white", "px-5", "mx-auto");

     CreateElement("div", "div-Checkout-close", "", "div-Checkout-item").classList.add("d-flex", "justify-content-end", "ml-5", "w-100");
     document.getElementById("div-Checkout-close").setAttribute('onclick', "buttonCheckoutCloseOnClick()");
     CreateElement("div", "div-close", "", "div-Checkout-close").classList.add("feedback-close-item", "bg-white");
     CreateElement("div", "close", "", "div-close").classList.add("close", "position-relative");

     CreateElement("h1", "div-Checkout-header", "Оформлення замовлення", "div-Checkout-item").classList.add("text-center", "font-weight-bolder", "mb-2");

     CreateElement("form", "form", "", "div-Checkout-item");

     CreateElement("div", "form-element-empl", "", "form").classList.add("mb-3");
     CreateElement("label", "form-empl-label", "Працівник *", "form-element-empl").classList.add("form-label");
     CreateElement("select", "form-empl-select", "", "form-element-empl").classList.add("form-control");
     addOptions();

     CreateElement("div", "form-element-name", "", "form").classList.add("mb-3");
     CreateElement("label", "form-name-label", "Ім'я *", "form-element-name").classList.add("form-label");
     CreateElement("input", "form-name-input", "", "form-element-name").classList.add("form-control");
     document.getElementById("form-name-input").setAttribute('type', "name");

     CreateElement("div", "form-element-surname", "", "form").classList.add("mb-3");
     CreateElement("label", "form-surname-label", "Прізвище *", "form-element-surname").classList.add("form-label");
     CreateElement("input", "form-surname-input", "", "form-element-surname").classList.add("form-control");
     document.getElementById("form-name-input").setAttribute('type', "name");

     CreateElement("div", "form-element-patronymic", "", "form").classList.add("mb-3");
     CreateElement("label", "form-patronymic-label", "По-батькові *", "form-element-patronymic").classList.add("form-label");
     CreateElement("input", "form-patronymic-input", "", "form-element-patronymic").classList.add("form-control");
     document.getElementById("form-patronymic-input").setAttribute('type', "name");

     CreateElement("div", "form-element-passportID", "", "form").classList.add("mb-3");
     CreateElement("label", "form-passportID-label", "Номер паспорта *", "form-element-passportID").classList.add("form-label");
     CreateElement("input", "form-passportID-input", "", "form-element-passportID").classList.add("form-control");
     document.getElementById("form-passportID-input").setAttribute('type', "name");

     CreateElement("div", "form-element-tel", "", "form").classList.add("mb-3");
     CreateElement("label", "form-tel-label", "Телефон *", "form-element-tel").classList.add("form-label");
     CreateElement("input", "form-tel-input", "", "form-element-tel").classList.add("form-control");
     document.getElementById("form-tel-input").setAttribute('type', "number");

     /*     CreateElement("div", "form-element-delivery", "", "form").classList.add("mb-3", "btn-group");
          CreateElement("label", "form-delivery-label", "Способ доставки *   ", "form-element-delivery").classList.add("form-label", "mr-3");
          CreateElement("input", "form-delivery-input-1", "", "form-element-delivery").classList.add("d-none", "btn-check");
          document.getElementById("form-delivery-input-1").setAttribute('type', "radio");
     
          CreateElement("label", "form-delivery-label-1", "Самовывоз", "form-element-delivery").classList.add("btn", "btn-outline-primary");
          document.getElementById("form-delivery-label-1").setAttribute('for', "form-delivery-input-1");
     
          CreateElement("input", "form-delivery-input-2", "", "form-element-delivery").classList.add("d-none", "btn-check");
          document.getElementById("form-delivery-input-2").setAttribute('type', "radio");
          CreateElement("label", "form-delivery-label-2", "Доставка домой", "form-element-delivery").classList.add("btn", "btn-outline-primary");
          document.getElementById("form-delivery-label-2").setAttribute('for', "form-delivery-input-2");*/

     CreateElement("div", "totalPrice", "Загальна ціна: " + calculateThePrice().toLocaleString() + " $", "div-Checkout-item").classList.add("h3", "mt-n3", "text-center");

     CreateElement("button", "form-button-submit", "Відправити", "div-Checkout-item").classList.add("btn", "btn-primary", "mx-auto", "w-100");
     document.getElementById("form-button-submit").setAttribute('type', "submit");
     document.getElementById("form-button-submit").setAttribute('onclick', "buttonCheckoutSubmitOnClickAndWriteOrderToDB()");
}

/**
 * Adds a car with the specified details to the shopping cart.
 * If the car with the given ID is not in the cart, it is added with an initial count of 1.
 * If the car is already in the cart, its count is incremented by one.
 *
 * @param {string} id - The unique identifier of the car.
 * @param {string} name - The name of the car.
 * @param {string} classImg - The CSS class for the car image.
 * @param {number} price - The price of the car.
 */
function addCar(id, name, classImg, price) {
     if (!cart[id]) {
          cart[id] = {
               "name": name,
               "classImg": classImg,
               "count": 0,
               "price": price,
          };
          plusFunction(id);
          saveData();
          console.log(JSON.parse(localStorage.getItem('cart')) || []);
     }
}

/**
 * Increases the count of the specified item in the shopping cart by one.
 *
 * @param {string} id - The unique identifier of the item to be incremented.
 */
const plusFunction = (id) => {
     cart[id]['count']++;
}

/**
 * Decreases the count of the specified item in the shopping cart by one.
 * If the count becomes zero, the item is removed from the cart.
 *
 * @param {string} id - The unique identifier of the item to be decremented.
 */
const minusFunction = (id) => {
     if (cart[id]['count'] - 1 == 0) {
          deleteFunction(id);
          return;
     }
     cart[id]['count']--;
}

/**
 * Deletes an item with the specified ID from the shopping cart.
 *
 * @param {string} id - The unique identifier of the item to be deleted.
 */
const deleteFunction = (id) => {
     cart = JSON.parse(localStorage.getItem('cart')) || [];
     delete cart[id];
     if (document.getElementById("cart-div") != undefined)
          document.getElementById("car" + id).remove();
}

/**
 * Checks if an object is empty (has no properties).
 *
 * @param {object} obj - The object to be checked for emptiness.
 * @returns {boolean} - Returns true if the object is empty, otherwise false.
 */
function isEmpty(obj) {
     for (var prop in obj) {
          if (prop != null)
               return false;
     }
     return true;
}
/**
 * Calculates the total price of items in the shopping cart.
 *
 * @returns {number} - The total price of items in the cart. Returns 0 if the cart is empty.
 */
const calculateThePrice = () => {
     let result = 0;
     cart = JSON.parse(localStorage.getItem('cart')) || [];
     if (isEmpty(cart))
          return result;
     for (var element in cart) {
          if (cart[element] != null)
               result += cart[element]['count'] * cart[element]["price"];
     }
     return result;
}
/**
 * Renders the contents of the shopping cart on the webpage, including item details, equipment options, and the total price.
 * If the cart container or header does not exist, the function returns early.
 * If the cart is empty, it displays an "empty cart" message.
 */
const renderCart = () => {
     if (document.getElementById("cart-div") == undefined)
          return;

     let price = calculateThePrice();
     if (document.getElementById("cart-header") == undefined) {
          cart = JSON.parse(localStorage.getItem('cart')) || [];
          console.log(cart);
          CreateElement("div", "cart-header", "", "cart-div").classList.add("row", "w-100", "ml-0");
          CreateElement("div", "id", "ID", "cart-header").classList.add("col-1", "text-center");
          CreateElement("div", "img", "Фото", "cart-header").classList.add("col-3", "text-center");
          CreateElement("div", "name", "Назва машини", "cart-header").classList.add("col-3", "text-center");
          CreateElement("div", "equipment", "Комплектація", "cart-header").classList.add("col-3", "text-center");
          CreateElement("div", "price", "Ціна", "cart-header").classList.add("col-1", "text-center");

          CreateElement("div", "cart-body", "", "cart-div").classList.add("row", "w-100", "ml-0");
          console.log("cart", cart);
          for (element in cart) {
               if (cart[element] != null) {
                    CreateElement("div", "car" + element, "", "cart-body").classList.add("row", "w-100", "ml-0", "py-2");
                    CreateElement("div", "carId" + element, element, "car" + element).classList.add("col-1", "text-center", "m-auto");
                    CreateElement("div", "carImg" + element, "", "car" + element).classList.add("col-3", "product-img", cart[element]["classImg"]);
                    CreateElement("div", "carName" + element, cart[element]["name"], "car" + element).classList.add("col-3", "h4", "text-center", "m-auto");
                    CreateElement("div", "carEquipment-div" + element, "", "car" + element).classList.add("col-3", "text-center", "m-auto");
                    CreateElement("select", "carEquipment-select" + element, "", "carEquipment-div" + element).classList.add("form-control");
                    CreateElement("option", "option1", "Повна (стандарт)", "carEquipment-select" + element);
                    CreateElement("option", "option2", "Повна на магнітній підвісці", "carEquipment-select" + element);
                    CreateElement("option", "option3", "Повна з автопілотом", "carEquipment-select" + element);
                    CreateElement("div", "carPrice" + element, cart[element]["price"].toLocaleString() + " $", "car" + element).classList.add("col-1", "text-center", "m-auto");
                    CreateElement("div", "carCount" + element, "", "car" + element).classList.add("col-1", "text-center", "m-auto");
                    CreateElement("button", element, "🗑️", "carCount" + element).classList.add("btn", "btn-secondary", "d-inline", "minus");
                    // CreateElement("div", "carCountNumber" + element, cart[element]["count"], "carCount" + element).classList.add("d-inline", "mx-2");
                    //CreateElement("button", element, "+", "carCount" + element).classList.add("btn", "btn-secondary", "d-inline", "plus");

               }
          }
          CreateElement("div", "totalPrice", "Загальна ціна: " + price.toLocaleString() + " $", "cart-div").classList.add("row", "ml-0", "h3", "mt-3", "mx-auto");
          CreateElement("button", "checkout", "Оформити замовлення", "cart-div").classList.add("btn", "btn-primary", "mx-auto");
          document.getElementById("checkout").setAttribute('onclick', "buttonCheckoutOnClick()");

          if (!price)
               cartIsEmpty();
     }
}
/**
 * Removes cart-related elements and displays a message indicating that the cart is empty.
 */
const cartIsEmpty = () => {
     document.getElementById("totalPrice").remove();
     document.getElementById("cart-header").remove();
     document.getElementById("checkout").remove();
     CreateElement("div", "empty-cart", "Кошик порожній", "cart-div").classList.add("row", "w-100", "mx-auto", "font-weight-bolder", "h2", "align-center");
}

/**
 * Updates the total price element based on the calculated price, or displays an empty cart message if the price is not available.
 */
const changeTotalPrice = () => {
     let price = calculateThePrice();
     if (price)
          document.getElementById("totalPrice").innerText = "Загальна ціна: " + price.toLocaleString() + " $";
     else
          cartIsEmpty();
}

/**
 * Updates the rendered cart by modifying the count of a specific item and refreshing the total price.
 *
 * @param {string} id - The unique identifier of the item in the cart.
 */
const changeRenderCart = (id) => {
     cart = JSON.parse(localStorage.getItem('cart')) || [];
     console.log(cart);
     if (document.getElementById("cart-div") == undefined)
          return;
     console.log(id);
     if (document.getElementById("car" + id))
          document.getElementById("carCountNumber" + id).innerText = cart[id]['count'];
     changeTotalPrice();
}

// Сохраняем данные в localStorage
/**
 * Saves the current cart data to localStorage.
 *
 * @returns {object} - The updated cart object.
 */
function saveData() {
     localStorage.setItem('cart', JSON.stringify(cart));
     return cart;
}

/**
 * Clears the cart data and saves the empty cart to localStorage.
 *
 * @returns {object} - The cleared cart object.
 */
function clearData() {
     cart = {};
     saveData();
     return cart;
}

cart = JSON.parse(localStorage.getItem('cart')) || [];
console.log(JSON.parse(localStorage.getItem('cart')) || []);
renderCart();

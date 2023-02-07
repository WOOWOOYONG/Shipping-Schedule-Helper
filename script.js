// json-server-url
const url = "https://try-rwrv.onrender.com/orders";
let orderData = [];

//取得訂單資料
const getOrderData = async () => {
  try {
    const response = await fetch(url);
    orderData = await response.json();
    console.log(orderData);
    orderList.innerHTML = "<tr>Loading...</tr>";
    //init
    setTimeout(() => {
      render(orderData);
      getTotalProducts(orderData);
    }, 500);
  } catch (err) {
    console.log(err);
  }
};

getOrderData();

const orderList = document.querySelector(".orderList");

// 渲染訂單資料
const render = (orderData) => {
  let str = "";
  orderData.forEach((item) => {
    str += `
    <tr>
    <td id="region${item.id}">${item.region}</td>
    <td id="clientName${item.id}">${item.clientName}</td>
    <td id="date${item.id}">${item.date}</td>
    <td id="product${item.id}">${item.product}</td>
    <td id="quantity${item.id}">${item.quantity}</td>
    <td id="description${item.id}">${item.description}</td>
    <td><button class="edit_btn" id="edit_btn${item.id}" data-id=${item.id}>編輯</button></td>
    <td><button class="cancel_btn" id="cancel_btn${item.id}" data-id=${item.id} style="display:none">取消</button></td>
    <td><button class="save_btn" id="save_btn${item.id}" data-id=${item.id} style="display:none">變更</button></td>
    <td data-id=${item.id} class="delete_btn"><i data-id=${item.id} class="bi bi-trash"></i></td>
  </tr>
    `;
  });
  orderList.innerHTML = str;
};

//新增訂單表格
const form = document.querySelector(".add_form");
const inputs = document.querySelectorAll(
  "input[type=text],input[type=date],input[type=number]"
);
const region = document.querySelector("#region");
const clientName = document.querySelector("#clientName");
const date = document.querySelector("#date");
const product = document.querySelector("#products");
const quantity = document.querySelector("#quantity");
const description = document.querySelector("#description");
const addBtn = document.querySelector(".add_btn");

//新增訂單資料;
const addOrderHandler = () => {
  if (clientName.value == "" || date.value == "" || quantity.value == "") {
    showErrors();
    return;
  } else {
    inputs.forEach((item) => {
      item.nextElementSibling.textContent = "";
    });
    const newOrder = {
      region: region.value,
      clientName: clientName.value.trim(),
      date: date.value,
      product: product.value,
      quantity: quantity.value,
      description: description.value.trim(),
    };
    addOrderData(newOrder);
    form.reset();
  }
};

const addOrderData = async (newOrder) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
    });
    if (res.ok) {
      console.log("新增成功");
    }
    getOrderData();
  } catch (err) {
    console.log(err);
  }
};

addBtn.addEventListener("click", addOrderHandler);

//刪除訂單資料
const deleteOrder = async (id) => {
  let msg = "確定要刪除?";
  if (confirm(msg)) {
    try {
      const res = await fetch(url + `/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        console.log("刪除成功");
      }
      getOrderData();
    } catch (err) {
      console.log(err);
    }
  }
  return;
};

const deleteOrderHandler = (e) => {
  if (e.target.getAttribute("class") == "bi bi-trash") {
    const orderId = e.target.getAttribute("data-id");
    deleteOrder(orderId);
  }
};

orderList.addEventListener("click", deleteOrderHandler);

//編輯訂單資料
const editOrder = (id) => {
  const region = document.getElementById(`region${id}`);
  const clientName = document.getElementById(`clientName${id}`);
  const date = document.getElementById(`date${id}`);
  const product = document.getElementById(`product${id}`);
  const quantity = document.getElementById(`quantity${id}`);
  const description = document.getElementById(`description${id}`);

  const regionData = region.textContent;
  const clientNameData = clientName.textContent;
  const dateData = date.textContent;
  const productData = product.textContent;
  const quantityData = quantity.textContent;
  const descriptionData = description.textContent;
  region.innerHTML = `<select id="regionInput${id}"> 
                         <option value="北區" 
                          ${
                            regionData === "北區" ? "selected" : ""
                          }>北區</option>
                         <option value="中區" 
                         ${
                           regionData === "中區" ? "selected" : ""
                         }>中區</option>
                         <option value="南區"
                         ${
                           regionData === "南區" ? "selected" : ""
                         }>南區</option>
                       </select>`;
  clientName.innerHTML = `<input type='text' id="clientNameInput${id}" value="${clientNameData}">`;
  date.innerHTML = `<input type='date' id="dateInput${id}" value="${dateData}">`;
  product.innerHTML = `<select  id="productInput${id}"> 
                          <option value="商品A"
                          ${productData === "商品A" ? "selected" : ""}
                          >商品A</option>
                          <option value="商品B"
                          ${productData === "商品B" ? "selected" : ""}
                          >商品B</option>
                          <option value="商品C"
                          ${productData === "商品C" ? "selected" : ""}
                          >商品C</option>
                        </select>`;
  quantity.innerHTML = `<input type='number' id="quantityInput${id}" value="${quantityData}">`;
  description.innerHTML = `<input type='text' id="descriptionInput${id}" value="${descriptionData}">`;
};

//取消編輯訂單動作
const cancelEdit = (id) => {
  const region = document.getElementById(`region${id}`);
  const clientName = document.getElementById(`clientName${id}`);
  const date = document.getElementById(`date${id}`);
  const product = document.getElementById(`product${id}`);
  const quantity = document.getElementById(`quantity${id}`);
  const description = document.getElementById(`description${id}`);

  region.textContent = orderData[id - 1].region;
  clientName.textContent = orderData[id - 1].clientName;
  date.textContent = orderData[id - 1].date;
  product.textContent = orderData[id - 1].product;
  quantity.textContent = orderData[id - 1].quantity;
  description.textContent = orderData[id - 1].description;
};

//儲存更改後的訂單資料
const saveOrder = (id) => {
  const regionValue = document.getElementById(`regionInput${id}`).value;
  const clientNameValue = document.getElementById(`clientNameInput${id}`).value;
  const dateValue = document.getElementById(`dateInput${id}`).value;
  const productValue = document.getElementById(`productInput${id}`).value;
  const quantityValue = document.getElementById(`quantityInput${id}`).value;
  const descriptionValue = document.getElementById(
    `descriptionInput${id}`
  ).value;
  const editedOrder = {
    region: regionValue,
    clientName: clientNameValue,
    date: dateValue,
    product: productValue,
    quantity: quantityValue,
    description: descriptionValue,
  };
  editOrderData(editedOrder, id);
};

const editOrderData = async (editedOrder, id) => {
  try {
    const res = await fetch(url + `/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedOrder),
    });
    if (res.ok) {
      console.log("修改成功");
    }
    getOrderData();
  } catch (err) {
    console.log(err);
  }
};

const editOrderHandler = (e) => {
  if (e.target.getAttribute("class") == "edit_btn") {
    e.target.style.display = "none";
    const orderId = e.target.getAttribute("data-id");
    const saveBtn = document.getElementById(`save_btn${orderId}`);
    const cancelBtn = document.getElementById(`cancel_btn${orderId}`);
    saveBtn.style.display = "block";
    cancelBtn.style.display = "block";
    editOrder(orderId);
  }
};

const cancelEditHandler = (e) => {
  if (e.target.getAttribute("class") == "cancel_btn") {
    e.target.style.display = "none";
    const orderId = e.target.getAttribute("data-id");
    const editBtn = document.getElementById(`edit_btn${orderId}`);
    const saveBtn = document.getElementById(`save_btn${orderId}`);
    console.log(editBtn);
    editBtn.style.display = "block";
    saveBtn.style.display = "none";
    cancelEdit(orderId);
  }
};

const saveOrderHandler = (e) => {
  if (e.target.getAttribute("class") == "save_btn") {
    e.target.style.display = "none";
    const orderId = e.target.getAttribute("data-id");
    const cancelBtn = document.getElementById(`cancel_btn${orderId}`);
    cancelBtn.style.display = "none";
    saveOrder(orderId);
  }
};

orderList.addEventListener("click", editOrderHandler);
orderList.addEventListener("click", cancelEditHandler);
orderList.addEventListener("click", saveOrderHandler);

// 依地區篩選
const filterByRegion = (region) => {
  const filteredData = orderData.filter((item) => {
    if (region === item.region) {
      return item;
    } else if (region === "全部地區") {
      return item;
    } else if (!region) {
      return item;
    }
  });
  render(filteredData);
};
const regionSelect = document.querySelector(".search_by_region");
regionSelect.addEventListener("change", () => {
  productSelect.value = "依品項搜尋";
  filterByRegion(regionSelect.value);
});

// 依品項篩選
const filterByProduct = (product) => {
  const filteredData = orderData.filter((item) => {
    if (product === item.product) {
      return item;
    } else if (product === "全部品項") {
      return item;
    } else if (!product) {
      return item;
    }
  });
  render(filteredData);
};

const productSelect = document.querySelector(".search_by_product");
productSelect.addEventListener("change", () => {
  regionSelect.value = "依地區搜尋";
  filterByProduct(productSelect.value);
});

// 依輸入案件名稱搜尋
const searchInput = document.querySelector(".search_input");
const searchBtn = document.querySelector(".search_btn");

const searchOrder = () => {
  if (searchInput.value.trim() === "") {
    alert("請先輸入內容");
    return;
  }
  const filteredData = orderData.filter((item) => {
    return item.clientName.match(searchInput.value.trim());
  });
  searchInput.value = "";
  render(filteredData);
};

searchBtn.addEventListener("click", () => {
  regionSelect.value = "依地區搜尋";
  productSelect.value = "依品項搜尋";
  searchOrder();
});

//顯示目前產品出貨總數
const totalArea = document.querySelector(".total_product");
const getTotalProducts = (orderData) => {
  let total = {
    productA: 0,
    productB: 0,
    productC: 0,
  };
  orderData.forEach((item) => {
    if (item.product === "商品A") {
      total.productA += Number(item.quantity);
    } else if (item.product === "商品B") {
      total.productB += Number(item.quantity);
    } else if (item.product === "商品C") {
      total.productC += Number(item.quantity);
    }
  });
  totalArea.innerHTML = `
    <p>預計出貨總數:</p>
    <ul>
    <li>商品A : ${total.productA}</li>
    <li>商品B : ${total.productB}</li>
    <li>商品C : ${total.productC}</li>
    </ul>
`;
};

//VALIDATE.JS 表單驗證
const constraints = {
  clientName: {
    presence: {
      message: "此為必填欄位",
    },
  },
  date: {
    presence: {
      message: "此為必填欄位",
    },
  },
  quantity: {
    presence: {
      message: "此為必填欄位",
    },
  },
};

const errors = validate(form, constraints, { fullMessages: false });
const newarr = Object.keys(errors);

function showErrors() {
  newarr.forEach((keys) => {
    document.querySelector(`.${keys}`).textContent = errors[keys];
  });
}

inputs.forEach((item) => {
  item.addEventListener("change", () => {
    if (item.value == "") {
      showErrors();
      return;
    } else {
      item.nextElementSibling.textContent = "";
    }
  });
});

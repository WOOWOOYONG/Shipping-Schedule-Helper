import { showErrors } from "./validate.js";
import {
  render,
  getTotalProducts,
  sortByShipping,
  sortByAdding,
  filterByRegion,
  filterByProduct,
  searchOrder,
} from "./renderData.js";

import { getProduct, getRegion, getSalesData } from "./chart.js";

// json-server-url
const url = "https://try-rwrv.onrender.com/orders";

let orderData = [];
const orderList = document.querySelector(".orderList");

//取得訂單資料
const getOrderData = async () => {
  try {
    orderList.innerHTML = `<strong class="d-block mt-5">Loading...</strong>`;
    const response = await fetch(url);
    orderData = await response.json();
    console.log(orderData);
    //預設依出貨日期分類
    const sortedData = [...orderData];
    sortedData.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    setTimeout(() => {
      render(sortedData);
      getTotalProducts(orderData);
    }, 500);
    getProduct(orderData);
    getRegion(orderData);
    getSalesData(orderData);
  } catch (err) {
    console.log(err);
  }
};

//init
getOrderData();

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
  if (clientName.value === "" || date.value === "" || quantity.value === "") {
    showErrors();
    return;
  } else {
    inputs.forEach((item) => {
      item.nextElementSibling.textContent = "";
    });
    const createDate = new Date();
    const newOrder = {
      region: region.value,
      clientName: clientName.value.trim(),
      date: date.value,
      createAt: createDate.toISOString().split("T")[0],
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
  if (e.target.getAttribute("class") === "bi bi-trash") {
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
      method: "PATCH",
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
  if (e.target.getAttribute("class") === "edit_btn") {
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
  if (e.target.getAttribute("class") === "cancel_btn") {
    e.target.style.display = "none";
    const orderId = e.target.getAttribute("data-id");
    const editBtn = document.getElementById(`edit_btn${orderId}`);
    const saveBtn = document.getElementById(`save_btn${orderId}`);
    editBtn.style.display = "block";
    saveBtn.style.display = "none";
    cancelEdit(orderId);
  }
};

const saveOrderHandler = (e) => {
  if (e.target.getAttribute("class") === "save_btn") {
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
const regionSelect = document.querySelector(".search_by_region");
regionSelect.addEventListener("change", () => {
  productSelect.value = "依品項搜尋";
  filterByRegion(regionSelect.value, orderData);
});

// 依品項篩選
const productSelect = document.querySelector(".search_by_product");
productSelect.addEventListener("change", () => {
  regionSelect.value = "依地區搜尋";
  filterByProduct(productSelect.value, orderData);
});

// 依輸入案件名稱搜尋
const searchBtn = document.querySelector(".search_btn");
searchBtn.addEventListener("click", () => {
  regionSelect.value = "依地區搜尋";
  productSelect.value = "依品項搜尋";
  searchOrder(orderData);
});

//依日期排序
const sortByShipBtn = document.querySelector(".sort_by_shipping");
const sortByAddBtn = document.querySelector(".sort_by_adding");
//依出貨日期排序
sortByShipBtn.addEventListener("click", () => {
  sortByShipping(orderData);
});

//依新增日期排序
sortByAddBtn.addEventListener("click", () => {
  sortByAdding(orderData);
});

//VALIDATE.JS 表單驗證
inputs.forEach((item) => {
  item.addEventListener("change", () => {
    item.value === ""
      ? showErrors()
      : (item.nextElementSibling.textContent = "");
  });
});

//控制新增表單顯示隱藏
const showFormBtn = document.querySelector(".show_form");
const hideFormBtn = document.querySelector(".hide_form");
const formArea = document.querySelector(".add_data");

showFormBtn.addEventListener("click", (e) => {
  e.target.style.display = "none";
  hideFormBtn.style.display = "block";
  formArea.classList.toggle("show_add_data");
});

hideFormBtn.addEventListener("click", (e) => {
  e.target.style.display = "none";
  showFormBtn.style.display = "block";
  formArea.classList.toggle("show_add_data");
});

//控制圖表顯示隱藏
const showChartBtn = document.querySelector(".show_chart");
const hideChartBtn = document.querySelector(".hide_chart");
const chartArea = document.querySelector(".chart");

showChartBtn.addEventListener("click", (e) => {
  e.target.style.display = "none";
  hideChartBtn.style.display = "block";
  chartArea.classList.toggle("show_chart_data");
});

hideChartBtn.addEventListener("click", (e) => {
  e.target.style.display = "none";
  showChartBtn.style.display = "block";
  chartArea.classList.toggle("show_chart_data");
});

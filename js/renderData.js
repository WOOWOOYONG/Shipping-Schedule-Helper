const orderList = document.querySelector(".orderList");

// 渲染訂單資料
const render = (orders) => {
  let str = "";
  orders.forEach((item) => {
    const {
      region,
      clientName,
      date,
      createAt,
      product,
      quantity,
      description,
      id,
    } = item;
    str += `
      <tr>
      <td id="region${id}">${region}</td>
      <td id="clientName${id}">${clientName}</td>
      <td id="date${id}">${date}</td>
      <td id="date${id}">${createAt}</td>
      <td id="product${id}">${product}</td>
      <td id="quantity${id}">${quantity}</td>
      <td id="description${id}">${description}</td>
      <td><button class="edit_btn" id="edit_btn${id}" data-id=${id}>編輯</button></td>
      <td><button class="cancel_btn" id="cancel_btn${id}" data-id=${id} style="display:none">取消</button></td>
      <td><button class="save_btn" id="save_btn${id}" data-id=${id} style="display:none">變更</button></td>
      <td data-id=${id} class="delete_btn"><i data-id=${id} class="bi bi-trash"></i></td>
    </tr>
      `;
  });
  orderList.innerHTML = str;
};

//顯示目前產品出貨總數
const totalArea = document.querySelector(".total_product");
const getTotalProducts = (orders) => {
  let total = {
    productA: 0,
    productB: 0,
    productC: 0,
  };
  orders.forEach((item) => {
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

//依出貨日期排序顯示
const sortByShipBtn = document.querySelector(".sort_by_shipping");
const sortByAddBtn = document.querySelector(".sort_by_adding");

const sortByShipping = (orders) => {
  sortByShipBtn.classList.add("sort_active");
  sortByAddBtn.classList.remove("sort_active");
  const sortedData = [...orders];
  sortedData.sort((a, b) => {
    //使用 new Date() 將字符串轉換為日期對象
    return new Date(a.date) - new Date(b.date);
  });
  render(sortedData);
};

//依新增日期排序顯示
const sortByAdding = (orders) => {
  sortByAddBtn.classList.add("sort_active");
  sortByShipBtn.classList.remove("sort_active");
  const sortedData = [...orders];
  sortedData.sort((a, b) => {
    return new Date(a.createAt) - new Date(b.createAt);
  });
  render(sortedData);
};

// 依地區篩選顯示
const filterByRegion = (region, orders) => {
  const filteredData = orders.filter((item) => {
    if (region === item.region) {
      return item;
    } else if (region === "全部地區") {
      return item;
    } else if (!region) {
      return item;
    }
  });
  filteredData.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  render(filteredData);
};

// 依品項篩選顯示
const filterByProduct = (product, orders) => {
  const filteredData = orders.filter((item) => {
    if (product === item.product) {
      return item;
    } else if (product === "全部品項") {
      return item;
    } else if (!product) {
      return item;
    }
  });
  filteredData.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  render(filteredData);
};

// 依輸入案件名稱搜尋
const searchInput = document.querySelector(".search_input");
const searchOrder = (orders) => {
  if (searchInput.value.trim() === "") {
    alert("請先輸入內容");
    return;
  }
  const filteredData = orders.filter((item) => {
    return item.clientName.match(searchInput.value.trim());
  });
  searchInput.value = "";
  render(filteredData);
};

export {
  render,
  getTotalProducts,
  sortByShipping,
  sortByAdding,
  filterByRegion,
  filterByProduct,
  searchOrder,
};

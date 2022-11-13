let data = [
  {
    id: 0,
    region: "北區",
    name: "台北101",
    date: "2022/11/13",
    product: "商品A",
    quantity: 5,
    description: "VIP客戶，請確實品檢",
  },
  {
    id: 1,
    region: "中區",
    name: "台中植物園",
    date: "2022/11/20",
    product: "商品B",
    quantity: 6,
    description: "數量可能會再變更",
  },
  {
    id: 2,
    region: "南區",
    name: "高雄巨蛋",
    date: "2022/12/10",
    product: "商品C",
    quantity: 3,
    description: "可能提前到12/3出貨",
  },
  {
    id: 3,
    region: "南區",
    name: "高雄流行音樂中心",
    date: "2022/12/15",
    product: "商品A",
    quantity: 2,
    description: "無",
  },
];

const orderList = document.querySelector(".orderList");
const regionSelect = document.querySelector(".search_select");

function render(location) {
  let str = "";

  //filter
  const filterData = data.filter((item) => {
    if (location === item.region) {
      return item;
    } else if (location === "全部地區") {
      return item;
    } else if (!location) {
      return item;
    }
  });
  filterData.forEach((item) => {
    str += `
    <tr>
    <td>${item.region}</td>
    <td>${item.name}</td>
    <td>${item.date}</td>
    <td>${item.product}</td>
    <td>${item.quantity}</td>
    <td>${item.description}</td>
  </tr>
    `;
  });
  orderList.innerHTML = str;
}

// init;
render();

//增加訂單資料
function addOrder() {
  const region = document.querySelector("#region");
  const name = document.querySelector("#name");
  const date = document.querySelector("#date");
  const product = document.querySelector("#products");
  const quantity = document.querySelector("#quantity");
  const description = document.querySelector("#description");

  if (name.value == "" || date.value == "" || quantity.value == "") {
    alert("請填寫正確資料");
    return;
  } else {
    data.push({
      id: Date.now(),
      region: region.value,
      name: name.value,
      date: date.value,
      product: product.value,
      quantity: quantity.value,
      description: description.value,
    });
    const form = document.querySelector(".add_form");
    form.reset();
    // 重新渲染畫面
    render();
  }
}

const addBtn = document.querySelector(".add_btn");
addBtn.addEventListener("click", addOrder);

// 篩選地區資料
regionSelect.addEventListener("change", () => {
  console.log(regionSelect.value);
  render(regionSelect.value);
});

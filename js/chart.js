let productDonutObj = {};
let productDonutArr = [];
let regionDonutObj = {};
let regionDonutArr = [];

//取得商品出貨比例
const getProduct = (data) => {
  data.forEach((item) => {
    productDonutObj[item.product] === undefined
      ? (productDonutObj[item.product] = Number(item.quantity))
      : (productDonutObj[item.product] += Number(item.quantity));
  });
  let products = Object.keys(productDonutObj);
  products.map((item) => {
    let arr = [];
    arr.push(item);
    arr.push(productDonutObj[item]);
    productDonutArr.push(arr);
  });
  renderC3product(productDonutArr);
};

const renderC3product = (data) => {
  var chart = c3.generate({
    bindto: "#productChart",
    size: {
      height: 400,
      width: 350,
    },
    data: {
      columns: data,
      type: "donut",
      onclick: function (d, i) {
        console.log("onclick", d, i);
      },
    },
    donut: {
      title: "商品出貨比例",
    },
    color: {
      pattern: ["#EBBE70", "#78ADD3", "#52796f"],
    },
  });
};

//取得地區出貨比例
const getRegion = (data) => {
  data.forEach((item) => {
    regionDonutObj[item.region] === undefined
      ? (regionDonutObj[item.region] = 1)
      : (regionDonutObj[item.region] += 1);
  });
  let regions = Object.keys(regionDonutObj);
  regions.map((item) => {
    let arr = [];
    arr.push(item);
    arr.push(regionDonutObj[item]);
    regionDonutArr.push(arr);
  });
  renderC3region(regionDonutArr);
};

const renderC3region = (data) => {
  var chart = c3.generate({
    bindto: "#regionChart",
    size: {
      height: 400,
      width: 350,
    },
    data: {
      columns: data,
      type: "donut",
      onclick: function (d, i) {
        console.log("onclick", d, i);
      },
    },
    donut: {
      title: "地區出貨比例",
    },
    color: {
      pattern: ["#656391", "#957FEF", "#AB92BF"],
    },
  });
};

//取得商品銷售狀況
const getSalesData = (data) => {
  let salesData = [];
  let salesInfo = {
    productaArr: ["商品A"],
    productbArr: ["商品B"],
    productcArr: ["商品C"],
    productaDate: ["x1"],
    productbDate: ["x2"],
    productcDate: ["x3"],
  };
  const sortedData = [...data].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  sortedData.forEach((item) => {
    const { product, date, quantity } = item;
    switch (product) {
      case "商品A":
        salesInfo.productaArr.push(Number(quantity));
        salesInfo.productaDate.push(date);
        break;
      case "商品B":
        salesInfo.productbArr.push(Number(quantity));
        salesInfo.productbDate.push(date);
        break;
      case "商品C":
        salesInfo.productcArr.push(Number(quantity));
        salesInfo.productcDate.push(date);
    }
  });
  salesData.push(
    salesInfo.productaDate,
    salesInfo.productbDate,
    salesInfo.productcDate,
    salesInfo.productaArr,
    salesInfo.productbArr,
    salesInfo.productcArr
  );
  renderC3sales(salesData);
};

const renderC3sales = (data) => {
  var chart = c3.generate({
    bindto: "#salesChart",
    size: {
      height: 400,
      width: 1800,
    },
    data: {
      xs: {
        商品A: "x1",
        商品B: "x2",
        商品C: "x3",
      },
      columns: data,
    },
    axis: {
      x: {
        type: "timeseries",
        tick: {
          format: "%Y-%m-%d",
          fit: true,
          rotate: 45,
          multiline: false,
        },
        max: "2023-06-30",
      },
      y: {
        max: 50,
      },
    },
  });
};

export { getProduct, getRegion, getSalesData };

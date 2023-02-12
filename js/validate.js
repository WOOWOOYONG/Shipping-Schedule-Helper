const form = document.querySelector(".add_form");
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
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      lessThanOrEqualTo: 50,
      message: "數量必須介於1和50之間",
    },
  },
};

const errors = validate(form, constraints, {
  fullMessages: false,
});
const newarr = Object.keys(errors);

function showErrors() {
  newarr.forEach((keys) => {
    document.querySelector(`.${keys}`).textContent = errors[keys];
  });
}

export { showErrors };

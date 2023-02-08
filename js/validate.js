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
  },
};

const errors = validate(form, constraints, { fullMessages: false });
const newarr = Object.keys(errors);

function showErrors() {
  newarr.forEach((keys) => {
    document.querySelector(`.${keys}`).textContent = errors[keys];
  });
}

export { showErrors };

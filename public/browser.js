console.log("FrontEnd JS ishga tushdi");

function itemTemplate(item) {
  return `
      <li class="list-group-item list-group-item-info d-flex align-items-center justify-content-between">
        <span class="item-text">${item.reja}</span>
        <div>
          <button class="edit-me btn btn-secondary btn-sm mr-1">Ozgartirish</button>
          <button class="delete-me btn btn-danger btn-sm">Ochirish</button>
        </div>
      </li>
    `;
}

let createField = document.getElementById("create-field");

document.getElementById("create-form").addEventListener("submit", function (e) {
  e.preventDefault();
  axios
    .post("/create-item", { reja: createField.value })
    .then((response) => {
      document
        .getElementById("item-list")
        .insertAdjacentHTML("beforeend", itemTemplate(response.data));
      createField.value = "";
      createField.focus();
    })
    .catch((err) => {
      console.log("Iltimos qytadan harakat qiling");
      // Handle error
    });
});
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-me")) {
    if (confirm("Siz rostdan ham o'chirmoqchimisiz?")) {
      const id = e.target.getAttribute("data-id");

      console.log("YUBORILAYOTGAN ID:", id);

      axios
        .post("/delete-item", { id: id })
        .then((response) => {
          console.log(response.data);
          e.target.parentElement.parentElement.remove();
        })
        .catch((err) => {
          console.log("ERROR:", err);
        });
    }
  }
});

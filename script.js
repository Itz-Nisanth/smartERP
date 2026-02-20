// SIDEBAR
const menuToggle = document.getElementById("menuToggle");
menuToggle.addEventListener("click", () => {
  document.body.classList.toggle("collapsed");
});

// CLOCK
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// THEME
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("i");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeIcon.classList.replace("fa-moon","fa-sun");
  } else {
    themeIcon.classList.replace("fa-sun","fa-moon");
  }
});

const ctx = document.getElementById("prodCostChart");

if (ctx) {
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Fabric", "Thread", "Buttons"],
      datasets: [{
        data: [25000, 8000, 5000],
        backgroundColor: [
          "#2c5edb",
          "#3a7bd5",
          "#7aa7ff"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}
const actualCtx = document.getElementById("actualCostChart");

if (actualCtx) {
  new Chart(actualCtx, {
    type: "bar",
    data: {
      labels: ["Planned", "Actual"],
      datasets: [{
        label: "Cost Comparison",
        data: [50000, 54500],
        backgroundColor: ["#3a7bd5", "#ff6a00"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}


const ct = document.getElementById("inventoryChart");

if (ct) {
  new Chart(ct, {
    type: "doughnut",
    data: {
      labels: ["Fabric", "Thread", "Buttons"],
      datasets: [{
        data: [30000, 750, 0],
        backgroundColor: [
          "#2c5edb",
          "#4e79ff",
          "#9bb6ff"
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}
function animateCounter(el, target) {
  let count = 0;
  let speed = target / 60;

  const update = () => {
    count += speed;
    if (count < target) {
      el.innerText = Math.floor(count).toLocaleString();
      requestAnimationFrame(update);
    } else {
      el.innerText = target.toLocaleString();
    }
  };

  update();
}
document.addEventListener("DOMContentLoaded", function () {

  const addBtn = document.getElementById("addItemBtn");
  const tableBody = document.getElementById("productionTableBody");

  const itemInput = document.querySelector("input[placeholder='Enter material name']");
  const qtyInput = document.querySelector("input[placeholder='Enter quantity']");
  const rateInput = document.querySelector("input[placeholder='Enter rate']");

  let productionItems = JSON.parse(localStorage.getItem("productionItems")) || [];

  // Render table on load
  renderProductionTable();

  addBtn.addEventListener("click", function () {

    const name = itemInput.value.trim();
    const qty = parseFloat(qtyInput.value);
    const rate = parseFloat(rateInput.value);

    if (!name || isNaN(qty) || isNaN(rate)) {
      alert("Please fill all fields properly");
      return;
    }

    const amount = qty * rate;

    const newItem = {
      id: Date.now(),
      name,
      qty,
      rate,
      amount
    };

    productionItems.push(newItem);

    localStorage.setItem("productionItems", JSON.stringify(productionItems));

    renderProductionTable();
    updateDashboardFromStorage();

    itemInput.value = "";
    qtyInput.value = "";
    rateInput.value = "";
  });

  function renderProductionTable() {

    tableBody.innerHTML = "";

    productionItems.forEach(item => {

      const row = `
        <tr>
          <td>${item.name}</td>
          <td>${item.qty}</td>
          <td>₹${item.rate}</td>
          <td>₹${item.amount.toLocaleString()}</td>
          <td>
            <i class="fa-solid fa-trash" onclick="deleteProductionItem(${item.id})"></i>
          </td>
        </tr>
      `;

      tableBody.innerHTML += row;
    });

    updateDashboardFromStorage();
  }

});
function deleteProductionItem(id) {

  let items = JSON.parse(localStorage.getItem("productionItems")) || [];

  items = items.filter(item => item.id !== id);

  localStorage.setItem("productionItems", JSON.stringify(items));

  location.reload();
}
function updateDashboardFromStorage() {

  const items = JSON.parse(localStorage.getItem("productionItems")) || [];

  let totalPlanned = 0;

  items.forEach(item => {
    totalPlanned += item.amount;
  });

  localStorage.setItem("totalPlannedCost", totalPlanned);

  // If dashboard page exists
  const plannedElement = document.querySelector(".total-planned-amount");

  if (plannedElement) {
    plannedElement.textContent = "₹" + totalPlanned.toLocaleString();
  }
}
document.addEventListener("DOMContentLoaded", function () {

  const totalPlanned = localStorage.getItem("totalPlannedCost") || 0;

  const plannedElement = document.querySelector(".total-planned-amount");

  if (plannedElement) {
    plannedElement.textContent = "₹" + Number(totalPlanned).toLocaleString();
  }

});
 let productionChart;

const STORAGE_KEY = "productionItems";

function getItems() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function addItem(name, qty, rate) {
  const items = getItems();

  const newItem = {
    id: Date.now(),
    name,
    qty: Number(qty),
    rate: Number(rate),
    amount: Number(qty) * Number(rate)
  };

  items.push(newItem);
  saveItems(items);

  renderProduction();
}
function renderProduction() {
  const items = getItems();
  const tableBody = document.querySelector("#productionTableBody");

  tableBody.innerHTML = "";

  let totalCost = 0;

  items.forEach(item => {
    totalCost += item.amount;

    tableBody.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>₹${item.rate}</td>
        <td>₹${item.amount.toLocaleString()}</td>
        <td>
          <i class="fa-solid fa-trash" onclick="deleteItem(${item.id})"></i>
        </td>
      </tr>
    `;
  });

  // ✅ Update Total Planned Cost
  document.getElementById("totalPlannedCost").innerText =
    "₹" + totalCost.toLocaleString();

  // ✅ Update Cards
  document.getElementById("totalMaterials").innerText = items.length;

  if (items.length > 0) {
    const highest = items.reduce((max, item) =>
      item.amount > max.amount ? item : max
    );
    document.getElementById("highestCostItem").innerText = highest.name;
  } else {
    document.getElementById("highestCostItem").innerText = "-";
  }

  const avgRate =
    items.length > 0
      ? items.reduce((sum, i) => sum + i.rate, 0) / items.length
      : 0;

  document.getElementById("avgRate").innerText =
    "₹" + Math.round(avgRate);

  // ✅ Budget Utilization
  const budget = 60000;
  const percent = budget > 0 ? (totalCost / budget) * 100 : 0;

 updateBudgetSection(totalCost);

  // ✅ Update Chart
  updateChart(items);
}
function deleteItem(id) {
  const items = getItems().filter(item => item.id !== id);
  saveItems(items);
  renderProduction();
}
let materialChart;

function updateChart(items) {
  const ctx = document.getElementById("materialChart").getContext("2d");

  const labels = items.map(i => i.name);
  const data = items.map(i => i.amount);

  if (materialChart) {
    materialChart.destroy();
  }

  materialChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          "#2c5edb",
          "#4c7df0",
          "#7fa4ff",
          "#1b3f9c",
          "#3b6ee6"
        ]
      }]
    },
    options: {
      cutout: "65%"
    }
  });
}
const addItemBtn = document.getElementById("addItemBtn");

if (addItemBtn) {
  addItemBtn.addEventListener("click", function () {

    const name = document.getElementById("itemName").value;
    const qty = document.getElementById("itemQty").value;
    const rate = document.getElementById("itemRate").value;

    if (!name || !qty || !rate) {
      alert("Fill all fields");
      return;
    }

    addItem(name, qty, rate);

    document.getElementById("itemName").value = "";
    document.getElementById("itemQty").value = "";
    document.getElementById("itemRate").value = "";
  });
}


document.addEventListener("DOMContentLoaded", function () {
  renderProduction();
});
function updateBudgetSection(totalCost) {

  const budget = 60000;

  const percent = Math.min((totalCost / budget) * 100, 100);
  const remaining = budget - totalCost;

  const bar = document.getElementById("budgetBar");

  bar.style.width = percent + "%";

  // Color Logic
  if (percent < 60) {
    bar.style.background = "#22c55e"; // green
  } else if (percent < 90) {
    bar.style.background = "#f59e0b"; // orange
  } else {
    bar.style.background = "#ef4444"; // red
  }

  document.getElementById("budgetText").innerText =
    `Budget: ₹${budget.toLocaleString()} | Planned: ₹${totalCost.toLocaleString()}`;

  document.getElementById("budgetPercent").innerText =
    percent.toFixed(1) + "% Used";

  document.getElementById("budgetRemaining").innerText =
    remaining >= 0
      ? `Remaining: ₹${remaining.toLocaleString()}`
      : `Over Budget: ₹${Math.abs(remaining).toLocaleString()}`;
}
function updateStockHealth() {

  const inventory = JSON.parse(localStorage.getItem("inventoryItems")) || [];

  let negative = 0;
  let low = 0;
  let totalValue = 0;

  const container = document.getElementById("stockBars");
  if (!container) return;

  container.innerHTML = "";

  inventory.forEach(item => {

    totalValue += item.qty * item.rate;

    if (item.qty < 0) negative++;
    if (item.qty > 0 && item.qty < 20) low++; // threshold

    const maxStock = 100;
const percent = Math.max(0, Math.min((item.qty / maxStock) * 100, 100));


    let color = "#22c55e"; // green

    if (item.qty < 0) color = "#ef4444";
    else if (item.qty < 20) color = "#f59e0b";

    container.innerHTML += `
      <div class="stock-bar">
        <label>
          <span>${item.name}</span>
          <span>${item.qty}</span>
        </label>
        <div class="bar">
          <div class="fill" style="width:${percent}%; background:${color};"></div>
        </div>
      </div>
    `;
  });

  document.getElementById("negativeStockCount").innerText = negative;
  document.getElementById("lowStockCount").innerText = low;
  document.getElementById("inventoryValue").innerText =
    "₹" + totalValue.toLocaleString();
}

function updateInventorySummary() {

  const materials = JSON.parse(localStorage.getItem("materials")) || [];

  let negative = 0;
  let low = 0;
  let totalValue = 0;

  materials.forEach(item => {

    totalValue += item.amount;

    if (item.qty < 0) {
      negative++;
    } else if (item.qty <= 50) {
      low++;
    }

  });

  document.getElementById("negativeStockCount").innerText = negative;
  document.getElementById("lowStockCount").innerText = low;
  document.getElementById("inventoryValue").innerText =
    "₹" + totalValue.toLocaleString();
}



function renderInventoryAlerts() {

  const table = document.getElementById("inventoryAlertTable");
  if (!table) return;

  table.innerHTML = "";

  const dummyData = [
    {
      name: "Fabric",
      currentStock: -8,
      minRequired: 50,
      status: "Negative",
      class: "status-critical",
      action: "Immediate Restock"
    },
    {
      name: "Thread",
      currentStock: 18,
      minRequired: 40,
      status: "Low",
      class: "status-warning",
      action: "Reorder Soon"
    },
    {
      name: "Buttons",
      currentStock: 120,
      minRequired: 50,
      status: "Healthy",
      class: "status-healthy",
      action: "No Action"
    }
  ];

  dummyData.forEach(item => {
    table.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.currentStock}</td>
        <td>${item.minRequired}</td>
        <td><span class="status-badge ${item.class}">${item.status}</span></td>
        <td>${item.action}</td>
      </tr>
    `;
  });

}

document.addEventListener("DOMContentLoaded", function () {
  renderInventoryAlerts();
  updateStockHealth();
});

document.addEventListener("DOMContentLoaded", function () {

  // Dashboard Only
  if (document.getElementById("inventoryAlertTable")) {
    renderInventoryAlerts();
    updateStockHealth();
  }

});
const costChartCanvas = document.getElementById("costChart");
if (costChartCanvas) {
  new Chart(costChartCanvas, {
    type: 'bar',
    data: {
      labels: ['Planned','Actual'],
      datasets: [{
        data: [50000,54500],
        backgroundColor: ['#2563eb','#ef4444'],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

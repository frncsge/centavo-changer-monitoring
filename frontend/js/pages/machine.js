const machineModal = document.getElementById("machineModal");

document
  .querySelector(".add-machine-btn")
  .addEventListener("click", () => {
    machineModal.classList.add("show");
  });

document
  .getElementById("closeMachineModal")
  .addEventListener("click", () => {
    machineModal.classList.remove("show");
  });

document
  .getElementById("cancelMachine")
  .addEventListener("click", () => {
    machineModal.classList.remove("show");
  });

window.addEventListener("click", (e) => {
  if (e.target === machineModal) {
    machineModal.classList.remove("show");
  }
});
document.getElementById("saveMachine").addEventListener("click", () => {
  const location = document.getElementById("machineLocation").value.trim();

  if (!location) {
    alert("Please enter a location.");
    return;
  }

  console.log({
    location
  });

  machineModal.classList.remove("show");
});
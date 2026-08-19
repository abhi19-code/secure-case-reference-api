const form = document.getElementById("lookup-form");
const referenceInput = document.getElementById("reference");
const referenceError = document.getElementById("reference-error");
const lookupButton = document.getElementById("lookup-button");
const loading = document.getElementById("loading");
const result = document.getElementById("result");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  clearMessages();

  const reference = referenceInput.value.trim();

  if (!reference) {
    showError("Case reference is required.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(
      `/api/cases/${encodeURIComponent(reference)}`
    );

    const data = await response.json();

    if (!response.ok) {
      showResult(data.message || "No data found");
      return;
    }

    showCase(data.data);

    console.log(
      "[Analytics] User interacted with Secure Case Reference Lookup API"
    );
  } catch (error) {
    showResult("Unable to connect to the server. Please try again.");
  } finally {
    setLoading(false);
  }
});

function showCase(caseData) {
  result.innerHTML = "";

  const card = document.createElement("div");
  card.className = "result-card";

  const heading = document.createElement("h2");
  heading.textContent = "Case Found";

  const reference = document.createElement("p");
  reference.textContent = `Reference: ${caseData.reference}`;

  const client = document.createElement("p");
  client.textContent = `Client: ${caseData.clientName}`;

  const status = document.createElement("p");
  status.textContent = `Status: ${caseData.status}`;

  card.appendChild(heading);
  card.appendChild(reference);
  card.appendChild(client);
  card.appendChild(status);

  result.appendChild(card);
}

function showResult(message) {
  result.innerHTML = "";

  const messageElement = document.createElement("div");
  messageElement.className = "no-data";
  messageElement.textContent = message;

  result.appendChild(messageElement);
}

function showError(message) {
  referenceError.textContent = message;
  referenceInput.classList.add("input-error");
  referenceInput.setAttribute("aria-invalid", "true");
  referenceInput.focus();
}

function clearMessages() {
  referenceError.textContent = "";
  referenceInput.classList.remove("input-error");
  referenceInput.removeAttribute("aria-invalid");
  result.innerHTML = "";
}

function setLoading(isLoading) {
  loading.classList.toggle("hidden", !isLoading);
  lookupButton.disabled = isLoading;
  referenceInput.disabled = isLoading;

  if (isLoading) {
    lookupButton.textContent = "Looking Up...";
  } else {
    lookupButton.textContent = "Look Up Case";
  }
}
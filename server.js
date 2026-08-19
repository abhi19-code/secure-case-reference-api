const express = require("express");
const xss = require("xss");

const app = express();
const PORT = 5000;

app.use(express.json());

const sanitizeText = (value) => {
  return xss(String(value).trim());
};

const logAnalytics = (action) => {
  console.log(
    `[Analytics] User interacted with Secure Case Reference Lookup API: ${action}`
  );
};

const cases = [
  {
    reference: "CASE-1001",
    clientName: "ABC Company",
    status: "Open"
  },
  {
    reference: "CASE-1002",
    clientName: "XYZ Limited",
    status: "Closed"
  },
  {
    reference: "CASE-1003",
    clientName: "Bright Solutions",
    status: "Open"
  }
];

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Secure Case Reference API is running"
  });
});

// GET all cases
app.get("/api/cases", (req, res) => {
  if (cases.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No data found",
      data: []
    });
  }

  res.json({
    success: true,
    data: cases
  });
});

// GET one case
app.get("/api/cases/:reference", (req, res) => {
  const caseReference = sanitizeText(req.params.reference);

  const foundCase = cases.find(
    (item) => item.reference === caseReference
  );

  if (!foundCase) {
    return res.status(404).json({
      success: false,
      message: "No data found"
    });
  }

  logAnalytics("Looked up a case");

  res.json({
    success: true,
    data: foundCase
  });
});

// POST a new case
app.post("/api/cases", (req, res) => {
  const { reference, clientName, status } = req.body;

  if (
    typeof reference !== "string" ||
    typeof clientName !== "string" ||
    typeof status !== "string" ||
    !reference.trim() ||
    !clientName.trim() ||
    !status.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Reference, client name and status are required"
    });
  }

  const cleanReference = sanitizeText(reference);
  const cleanClientName = sanitizeText(clientName);
  const cleanStatus = sanitizeText(status);

  const existingCase = cases.find(
    (item) => item.reference === cleanReference
  );

  if (existingCase) {
    return res.status(409).json({
      success: false,
      message: "Case reference already exists"
    });
  }

  const newCase = {
    reference: cleanReference,
    clientName: cleanClientName,
    status: cleanStatus
  };

  cases.push(newCase);

  logAnalytics("Created a case");

  res.status(201).json({
    success: true,
    data: newCase
  });
});

// PUT update a case
app.put("/api/cases/:reference", (req, res) => {
  const caseReference = sanitizeText(req.params.reference);
  const { clientName, status } = req.body;

  if (
    typeof clientName !== "string" ||
    typeof status !== "string" ||
    !clientName.trim() ||
    !status.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Client name and status are required"
    });
  }

  const caseIndex = cases.findIndex(
    (item) => item.reference === caseReference
  );

  if (caseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "No data found"
    });
  }

  cases[caseIndex].clientName = sanitizeText(clientName);
  cases[caseIndex].status = sanitizeText(status);

  logAnalytics("Updated a case");

  res.json({
    success: true,
    data: cases[caseIndex]
  });
});

// DELETE a case
app.delete("/api/cases/:reference", (req, res) => {
  const caseReference = sanitizeText(req.params.reference);

  const caseIndex = cases.findIndex(
    (item) => item.reference === caseReference
  );

  if (caseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "No data found"
    });
  }

  const deletedCase = cases.splice(caseIndex, 1);

  logAnalytics("Deleted a case");

  res.json({
    success: true,
    data: deletedCase[0]
  });
});

// Handle invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format"
    });
  }

  next(err);
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
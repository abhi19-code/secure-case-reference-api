const express = require("express");

const app = express();
const PORT = 5000;

app.use(express.json());

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

app.get("/", (req, res) => {
  res.json({
    message: "Secure Case Reference API is running"
  });
});

// GET all cases
app.get("/api/cases", (req, res) => {
  res.json({
    success: true,
    data: cases
  });
});

// GET one case
app.get("/api/cases/:reference", (req, res) => {
  const caseReference = req.params.reference;

  const foundCase = cases.find(
    (item) => item.reference === caseReference
  );

  if (!foundCase) {
    return res.status(404).json({
      success: false,
      message: "No data found"
    });
  }

  res.json({
    success: true,
    data: foundCase
  });
});

// POST a new case
app.post("/api/cases", (req, res) => {
  const { reference, clientName, status } = req.body;

  if (!reference || !clientName || !status) {
    return res.status(400).json({
      success: false,
      message: "Reference, client name and status are required"
    });
  }

  const existingCase = cases.find(
    (item) => item.reference === reference
  );

  if (existingCase) {
    return res.status(409).json({
      success: false,
      message: "Case reference already exists"
    });
  }

  const newCase = {
    reference,
    clientName,
    status
  };

  cases.push(newCase);

  res.status(201).json({
    success: true,
    data: newCase
  });
});

// PUT update a case
app.put("/api/cases/:reference", (req, res) => {
  const caseReference = req.params.reference;
  const { clientName, status } = req.body;

  if (!clientName || !status) {
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

  cases[caseIndex].clientName = clientName;
  cases[caseIndex].status = status;

  res.json({
    success: true,
    data: cases[caseIndex]
  });
});

// DELETE a case
app.delete("/api/cases/:reference", (req, res) => {
  const caseReference = req.params.reference;

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

  res.json({
    success: true,
    data: deletedCase[0]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/pincode/:pincode", async (req, res) => {
    const { pincode } = req.params;

    if (!/^\d{6}$/.test(pincode)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid 6-digit pincode."
        });
    }

    try {
        const response = await axios.get(
            `https://api.postalpincode.in/pincode/${pincode}`
        );

        const data = response.data;

        if (
            !data ||
            !data[0] ||
            data[0].Status !== "Success" ||
            !data[0].PostOffice
        ) {
            return res.status(404).json({
                success: false,
                message: "Pincode not found."
            });
        }

        const postOffices = data[0].PostOffice;

        const bangaloreOffices = postOffices.filter(
            (office) =>
                office.State === "Karnataka" &&
                (
                    office.District
                        .toLowerCase()
                        .includes("bangalore") ||
                    office.District
                        .toLowerCase()
                        .includes("bengaluru")
                )
        );

        if (bangaloreOffices.length === 0) {
            return res.status(404).json({
                success: false,
                message: "This pincode is not in Bangalore."
            });
        }

        res.json({
            success: true,
            pincode,
            offices: bangaloreOffices
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch pincode information."
        });
    }
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Bangalore Pincode Explorer API is running"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
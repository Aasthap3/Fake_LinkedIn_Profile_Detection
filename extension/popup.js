document.getElementById("analyzeBtn").addEventListener("click", async () => {

    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    chrome.tabs.sendMessage(tab.id, {action: "getProfileText"}, async (response) => {

        let profileText = response.text;

        let resultDiv = document.getElementById("result");
        resultDiv.innerText = "Analyzing...";

        try {

            let res = await fetch("http://localhost:5000/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: profileText
                })
            });

            let data = await res.json();

            resultDiv.innerText =
                "Prediction: " + data.prediction +
                "\nConfidence: " + data.confidence;

        } catch (error) {

            resultDiv.innerText = "API not running";

        }

    });

});
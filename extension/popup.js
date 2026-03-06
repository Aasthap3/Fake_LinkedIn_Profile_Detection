document.getElementById("analyzeBtn").addEventListener("click", async () => {

    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    chrome.tabs.sendMessage(tab.id, {action: "getProfileText"}, async (response) => {

        let profileText = response.text;

        let resultDiv = document.getElementById("result");
        let loadingDiv = document.getElementById("loading");
        let statusText = document.querySelector(".status-text");
        
        // Show loading, hide result
        resultDiv.classList.add("hidden");
        loadingDiv.classList.remove("hidden");
        statusText.textContent = "Analyzing...";

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
            
            // Hide loading, show result
            loadingDiv.classList.add("hidden");
            resultDiv.classList.remove("hidden");
            
            // Set result type class
            resultDiv.className = "result-container " + data.prediction.toLowerCase();
            
            // Set icon and label
            const resultIcon = resultDiv.querySelector(".result-icon");
            const resultLabel = resultDiv.querySelector(".result-label");
            
            if (data.prediction === "Fake") {
                resultIcon.innerHTML = "&#9888;";
                resultLabel.textContent = "Fake Profile";
                resultLabel.style.color = "#e74c3c";
            } else {
                resultIcon.innerHTML = "&#10004;";
                resultLabel.textContent = "Legitimate Profile";
                resultLabel.style.color = "#27ae60";
            }
            
            // Set confidence
            const confidenceValue = parseFloat(data.confidence);
            const confidenceFill = resultDiv.querySelector(".confidence-fill");
            const confidenceText = resultDiv.querySelector(".confidence-text");
            
            confidenceFill.style.width = confidenceValue + "%";
            confidenceText.textContent = "Confidence: " + data.confidence;
            
            statusText.textContent = "Ready";

        } catch (error) {

            loadingDiv.classList.add("hidden");
            resultDiv.classList.remove("hidden");
            resultDiv.className = "result-container";
            
            const resultIcon = resultDiv.querySelector(".result-icon");
            const resultLabel = resultDiv.querySelector(".result-label");
            
            resultIcon.innerHTML = "&#10006;";
            resultLabel.textContent = "Error";
            resultLabel.style.color = "#e74c3c";
            
            resultDiv.querySelector(".confidence-text").textContent = "API not running. Please start the Flask server.";
            resultDiv.querySelector(".confidence-bar").style.display = "none";
            resultDiv.querySelector(".result-footer").textContent = "Connection Failed";
            
            statusText.textContent = "Error";

        }

    });

});
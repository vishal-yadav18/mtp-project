function submitGenotype() {
    var genotypeInput = document.getElementById("genotypeInput").value;


    var validCharacters = /^[ATGCatgc]*$/;
    if (!validCharacters.test(genotypeInput)) {
      // alert("Invalid characters. Please use only A, T, G, C.");
      // return true;
      
      var messageParagraph = document.getElementById("message");
      if (messageParagraph) {
            messageParagraph.innerHTML = "Invalid characters. Please use only A, T, G, C.";
      }
      return;
    }

    // Validate input length
    if (genotypeInput.length !== 48) {
      // alert("Please enter exactly 48 characters.");
      // return true;

      var messageParagraph = document.getElementById("message");
      if (messageParagraph) {
            messageParagraph.innerHTML = "Please enter exactly 48 characters";
      }
      return;
  }

    // Map genotype to numbers
    var genoMap = {AA: 1, AT: 2, AG: 3, AC: 4, TT: 5, TG: 6, TC: 7, GG: 8, CG: 9, CC: 10,};

    // Convert genotype to numbers
    var numericGenotype = [];
    for (var i = 0; i < genotypeInput.length; i += 2) {
      var pair = genotypeInput.slice(i, i + 2).toUpperCase();
      numericGenotype.push(genoMap[pair]);
    }

    // Send the numeric genotype array to the backend
    fetch("/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ip: numericGenotype }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Check if the "preds" key exists
        if (data && data.preds) {
          var predictionResult = data.preds;
          for (var i = 0; i < 6; i++) {
              var paragraph = document.getElementById("t" + (i + 1));
              if (paragraph) {
                  paragraph.innerHTML = predictionResult[i] || "";
              }
          }
        } else {
          console.error(
            "Invalid response format. Missing 'preds' key."
          );

          var messageParagraph = document.getElementById("message");
          return messageParagraph.innerHTML = "Invalid DNA Sequence" || true;
        }
      })
      .catch((error) =>
        console.error("Error fetching predictions:", error)
      );

      return false;
  }

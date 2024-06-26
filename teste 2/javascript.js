if ("geolocation" in navigator) {
    console.log(
      "A ferramenta de Geolocalização esta valida no seu navegador"
    );

    navigator.geolocation.getCurrentPosition((position) => {
      try {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        console.log(latitude);
        console.log(longitude);

        //começo das funções assyncronas

        async function postData(callback) {
          let data = {
            latitude: `${latitude}`,
            longitude: `${longitude}`,
          };
          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          };

          let response = await fetch("/apiBanco", options);
          let informacao = await response.json();

          console.log(response);
          console.log(informacao);

          callback();
        }

        async function getData() {
          let response = await fetch("/apiBanco");
          let data = await response.json();
          console.log(data);
        }

        async function getWeather() {
          let response = await fetch(
            `/apiWeather/${latitude},${longitude}`
          );
          let dado = await response.json();
          console.log(dado);
          document.getElementById("p3Html").style.backgroundColor = "pink";
          document.getElementById(
            "p3Html"
          ).innerHTML = ` Você esta em: ${dado.finalData.weather.name}, sua latitude é: ${dado.finalData.weather.coord.lat}, e sua longitude: ${dado.finalData.weather.coord.lon}.<br><br> O tempo atualmente é: ${dado.finalData.weather.weather[0].main} e a temperatura é: ${dado.finalData.weather.main.temp} F°.<br><br> O indíce de qualidade do ar é: ${dado.finalData.air.list[0].main.aqi},  e a quantidade de carbono no ar é: ${dado.finalData.air.list[0].components.co}.`;
        }

        postData(getData);
        getWeather();
      } catch (error) {
        console.log("alguma coisa deu errado" + error);
      }
    }); //final da funcão parametro de geolocalização
  } else {
    alert("Não é possivel usar a geolocalização :( ");
  }
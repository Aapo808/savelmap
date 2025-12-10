import React from "react";

const steps = [
  {
    title: "Valitse sävelaji",
    body:
      "Valitse ensin pohjasävel asteikolle, jonka haluat soittaa. Tämä määrittää kaikki merkityt sävelet kaulalla."
  },
  {
    title: "Valitse asteikko",
    body:
      "Avaa asteikko-valikko ja poimi haluamasi asteikko. Voit vaihtaa asteikkoa lennosta ja nähdä eron heti kaulassa."
  },
  {
    title: "Soita asteikkoa",
    body:
      "Klikkaa säveliä tai soita instrumentilla. 12. nauhan jälkeen säveljärjestys toistuu, joten kaulan logiikka pysyy samana kaikkialla."
  }
];

export default function Manuaali() {
  return (
    <details id="ohjeet" className="manual">
      <summary>Käyttöohjeet</summary> 

      <div className="manual__content">
        <div className="manual__intro">
          <p>
            Kitaran kaula kulkee vasemmalta oikealle E–A–D–G–B–E. Avoimet sävelet
            löytyvät 0-positiosta ja toistuvat jokaisen 12. nauhan välein.
          </p>
        </div>

        <ol className="manual__steps">
          {steps.map((step, idx) => (
            <li key={step.title}>
              <h3>{`${idx + 1}. ${step.title}`}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}
